// Shopify Storefront API: live prices and sizes, a persistent bag, and
// Shopify-hosted checkout. Without config it stays dormant and the site keeps
// its "Notify me" flow.
(() => {
  const cfg = (window.HOMIZ_CONFIG || {}).shopify || {};
  const enabled = Boolean(cfg.domain && cfg.storefrontToken);
  const endpoint = `https://${cfg.domain}/api/${cfg.apiVersion || "2025-07"}/graphql.json`;
  const CART_KEY = "homiz-cart-id";

  const listeners = new Set();
  const state = { products: {}, cart: null, busy: false, error: "" };
  const emit = () => listeners.forEach((fn) => fn(state));

  const money = ({ amount, currencyCode }) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: currencyCode, minimumFractionDigits: Number(amount) % 1 ? 2 : 0 }).format(Number(amount));

  async function gql(query, variables = {}) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": cfg.storefrontToken },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`Shopify answered ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  }

  const CART = `id checkoutUrl totalQuantity
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 50) { nodes { id quantity
      merchandise { ... on ProductVariant { id title price { amount currencyCode }
        image { url altText } product { title handle } } } } }`;

  function userError(payload) {
    const err = payload?.userErrors?.[0];
    if (err) throw new Error(err.message);
    return payload.cart;
  }
  const store = {
    get: () => { try { return localStorage.getItem(CART_KEY); } catch { return null; } },
    set: (v) => { try { v ? localStorage.setItem(CART_KEY, v) : localStorage.removeItem(CART_KEY); } catch { /* storage unavailable */ } },
  };

  async function loadProducts() {
    const entries = Object.entries(cfg.products || {});
    if (!entries.length) return;
    // One request: alias each product by its site id.
    const fields = entries.map(([id, handle], i) => `p${i}: product(handle: ${JSON.stringify(handle)}) {
      title availableForSale
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 30) { nodes { id availableForSale price { amount currencyCode } selectedOptions { name value } } } }`).join("\n");
    const data = await gql(`query Products { ${fields} }`);
    entries.forEach(([id], i) => {
      const p = data[`p${i}`];
      if (!p) { console.warn(`[homiz] No Shopify product with handle "${cfg.products[id]}"`); return; }
      state.products[id] = {
        title: p.title,
        available: p.availableForSale,
        price: p.priceRange.minVariantPrice,
        variants: p.variants.nodes.map((v) => ({
          id: v.id,
          available: v.availableForSale,
          price: v.price,
          size: (v.selectedOptions.find((o) => /size/i.test(o.name)) || v.selectedOptions[0] || { value: "One size" }).value,
        })),
      };
    });
  }

  async function loadCart() {
    const id = store.get();
    if (!id) return;
    const data = await gql(`query Cart($id: ID!) { cart(id: $id) { ${CART} } }`, { id });
    if (data.cart) state.cart = data.cart;
    else store.set(null); // cart expired or already checked out
  }

  async function mutate(run) {
    state.busy = true; state.error = ""; emit();
    try {
      state.cart = await run();
      store.set(state.cart?.id);
    } catch (e) {
      state.error = e.message || "Something went wrong. Try again.";
    } finally {
      state.busy = false; emit();
    }
  }

  const api = {
    enabled,
    state,
    money,
    onChange(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); },
    product: (id) => state.products[id],
    add(variantId, quantity = 1) {
      return mutate(async () => {
        const lines = [{ merchandiseId: variantId, quantity }];
        if (state.cart) {
          const d = await gql(`mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART} } userErrors { message } } }`, { cartId: state.cart.id, lines });
          return userError(d.cartLinesAdd);
        }
        const d = await gql(`mutation Create($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { ${CART} } userErrors { message } } }`, { lines });
        return userError(d.cartCreate);
      });
    },
    setQuantity(lineId, quantity) {
      return mutate(async () => {
        if (quantity <= 0) {
          const d = await gql(`mutation Remove($cartId: ID!, $ids: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $ids) { cart { ${CART} } userErrors { message } } }`, { cartId: state.cart.id, ids: [lineId] });
          return userError(d.cartLinesRemove);
        }
        const d = await gql(`mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART} } userErrors { message } } }`, { cartId: state.cart.id, lines: [{ id: lineId, quantity }] });
        return userError(d.cartLinesUpdate);
      });
    },
    ready: enabled
      ? Promise.allSettled([loadProducts(), loadCart()]).then((r) => {
          const failed = r.find((x) => x.status === "rejected");
          if (failed) { state.error = "The shop couldn't load. Refresh to try again."; console.error("[homiz]", failed.reason); }
          emit();
        })
      : Promise.resolve(),
  };
  window.HomizShop = api;
})();
