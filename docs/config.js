// Homiz store settings. Fill these in before launch — see LAUNCH.md, step 4.
// Everything here is safe to publish: the Storefront token is a public,
// read-and-cart-only key (it can't see orders or change products).
window.HOMIZ_CONFIG = {
  shopify: {
    // Your store's myshopify domain, e.g. "homiz.myshopify.com" (no https://).
    domain: "",
    // Storefront API access token from the Headless channel (or a custom app).
    storefrontToken: "",
    apiVersion: "2025-07",
    // Site product → Shopify product handle (the last part of the product URL
    // in Shopify admin). Each product needs a "Size" option.
    products: {
      "hoodie-burgundy": "feel-blessed-zip-hoodie-burgundy",
      "hoodie-black": "feel-blessed-zip-hoodie-washed-black",
      "pant-burgundy": "fear-less-trackpant-burgundy",
      "pant-black": "fear-less-trackpant-washed-black",
    },
  },

  // Homiz Club sign-ups go to a Klaviyo list (free up to 250 contacts and it
  // plugs into Shopify). Leave empty to keep the form in "coming soon" mode.
  klaviyo: {
    companyId: "", // Klaviyo → Settings → API keys → Public API key (6 characters)
    listId: "",    // Klaviyo → Lists → your list → the ID in the URL
  },

  contact: {
    email: "",     // shown on the Help page and footer, e.g. "hello@homiz.com.au"
    instagram: "", // full URL, e.g. "https://instagram.com/homiz"
    tiktok: "",    // full URL, e.g. "https://www.tiktok.com/@homiz"
  },
};
