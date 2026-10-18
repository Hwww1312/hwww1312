#!/usr/bin/env node
// Pre-launch check for the Homiz site. Run from the repo root:
//   node homiz/tools/prelaunch-check.mjs
// It reads config.js, tests the Shopify connection and products, and lists
// every fill-in still left in the pages. Exit code 1 means "not ready yet".
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(root, f), "utf8");
const problems = [];
const warnings = [];
const ok = [];

// ---- config.js ----
const sandbox = { window: {} };
vm.runInNewContext(read("config.js"), sandbox);
const cfg = sandbox.window.HOMIZ_CONFIG || {};
const shopify = cfg.shopify || {};
const need = (value, label) => (value ? ok.push(label) : problems.push(`config.js: ${label} is empty`));
need(shopify.domain, "Shopify domain");
need(shopify.storefrontToken, "Shopify Storefront token");
need(cfg.klaviyo?.companyId, "Klaviyo public API key");
need(cfg.klaviyo?.listId, "Klaviyo list ID");
need(cfg.contact?.email, "contact email");
need(cfg.contact?.instagram, "Instagram link");
if (!cfg.contact?.tiktok) warnings.push("config.js: no TikTok link (the footer hides it)");

// ---- Shopify connection ----
if (shopify.domain && shopify.storefrontToken) {
  const endpoint = `https://${shopify.domain}/api/${shopify.apiVersion || "2025-07"}/graphql.json`;
  const gql = async (query) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": shopify.storefrontToken },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  };
  try {
    const { shop } = await gql("{ shop { name paymentSettings { currencyCode } } }");
    ok.push(`Shopify connected: ${shop.name} (${shop.paymentSettings.currencyCode})`);
    if (shop.paymentSettings.currencyCode !== "AUD") warnings.push(`Shopify store currency is ${shop.paymentSettings.currencyCode}, not AUD`);
    for (const [id, handle] of Object.entries(shopify.products || {})) {
      const { product: p } = await gql(`{ product(handle: ${JSON.stringify(handle)}) { title availableForSale options { name values } variants(first: 30) { nodes { availableForSale } } } }`);
      if (!p) { problems.push(`Shopify: no product with handle "${handle}" (site product ${id}). Check the handle, and that the product is published to the Headless channel.`); continue; }
      if (!p.options.some((o) => /size/i.test(o.name))) warnings.push(`Shopify: "${p.title}" has no Size option`);
      const inStock = p.variants.nodes.filter((v) => v.availableForSale).length;
      if (!inStock) warnings.push(`Shopify: "${p.title}" has no sizes in stock (shows as Sold out)`);
      else ok.push(`Shopify product ready: ${p.title} (${inStock} sizes in stock)`);
    }
  } catch (e) {
    problems.push(`Shopify: couldn't connect (${e.message}). Check the domain and Storefront token.`);
  }
}

// ---- page fill-ins ----
for (const page of ["help.html", "index.html"]) {
  const html = read(page);
  const todos = [...html.matchAll(/<mark class="todo">([\s\S]*?)<\/mark>/g)].map((m) => m[1].replace(/\s+/g, " ").trim());
  if (todos.length) problems.push(`${page}: ${todos.length} highlighted fill-ins left, e.g. ${[...new Set(todos)].slice(0, 6).map((t) => `"${t}"`).join(", ")}`);
  const canon = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (canon) warnings.push(`${page}: canonical URL is ${canon}. Change it if your domain is different.`);
}

// ---- report ----
const section = (title, items, mark) => items.length && console.log(`\n${title}\n${items.map((i) => `  ${mark} ${i}`).join("\n")}`);
section("Ready", ok, "✓");
section("Check", warnings, "!");
section("Not ready", problems, "✗");
console.log(problems.length ? `\n${problems.length} thing(s) to finish before launch.` : "\nAll required items are done. Do a test order, then launch.");
process.exitCode = problems.length ? 1 : 0;
