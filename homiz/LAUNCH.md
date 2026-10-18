# Homiz launch checklist

Work top to bottom. When everything is done, run
`node homiz/tools/prelaunch-check.mjs`. It tests your Shopify connection and lists
anything still unfilled.

Fees and thresholds below are as of 2026. Check the linked government sites for
current figures before you pay anything.

## 1. Set up the business (Australia)

- [ ] **Get an ABN.** It's free at abr.gov.au. As a sole trader it takes about 15 minutes.
- [ ] **Register "Homiz" as a business name** with ASIC (asic.gov.au). You need an
      ABN first. It's a small fee for 1 or 3 years.
- [ ] **Check and protect the name.** Search "Homiz" on IP Australia's trade mark
      search. Consider filing in class 25 (clothing) and class 35 (retail). A
      business name registration does *not* give you trade mark rights.
- [ ] **GST:** you must register once your turnover reaches $75,000 a year. You can
      register earlier. If you do, set Shopify to show prices including GST
      (step 3).
- [ ] **Open a separate business bank account** for Shopify payouts.
- [ ] **Register the domain.** `homiz.com.au` needs an ABN. Also grab `homiz.com`
      if it's free, plus the matching Instagram and TikTok handles.
- [ ] **Insurance:** get a quote for public and product liability, which matters
      if you do pop-ups or markets.

## 2. Get the product ready

- [ ] **Measure finished samples** and fill in the size guide in `help.html`
      (chest, length and sleeve for the hoodie; waist, inseam and leg opening for
      the trackpant).
- [ ] **Confirm fabric composition and weight**, and fill in the Care section.
- [ ] **Care labels are mandatory on clothing sold in Australia** (the care labelling
      information standard). Make sure your manufacturer sews them in.
- [ ] **Photography.** The trackpant images on the site are AI renders made from your
      lookbook. Replace them with real photos of the finished product before
      selling, so the listing matches exactly what customers receive (the
      Australian Consumer Law prohibits misleading representations). The campaign
      and lookbook shots are also AI-generated, so swap or re-shoot them when you can.
- [ ] **Decide prices,** including whether shipping is free over a threshold.

## 3. Set up Shopify

- [ ] **Create the store** at shopify.com (Basic plan is enough to start). Set the
      store currency to AUD and the timezone to Melbourne.
- [ ] **Payments:** turn on Shopify Payments. Afterpay and PayPal are worth adding
      for an Australian streetwear audience.
- [ ] **Taxes:** if you're GST-registered, tick "All prices include tax" and add your ABN.
- [ ] **Shipping:** set up rates matching the table in `help.html`. Australia Post is
      built in, and Shopify Shipping can buy labels.
- [ ] **Create the four products** with these exact handles (Products → product →
      *Search engine listing* → URL handle). Each needs a **Size** option
      (XS–XL), inventory, weight, photos and description:
  - `feel-blessed-zip-hoodie-burgundy`
  - `feel-blessed-zip-hoodie-washed-black`
  - `fear-less-trackpant-burgundy`
  - `fear-less-trackpant-washed-black`
- [ ] **Policies:** paste the shipping, returns, privacy and terms text from
      `help.html` into Settings → Policies, so checkout shows them too.
- [ ] **Branding:** in Settings → Checkout, add the logo and the brand colours
      (ink `#1c1c1c`, burgundy `#7a2a32`).
- [ ] **Get the Storefront key:** install the **Headless** sales channel, create a
      storefront, and copy the *public access token*. Then make sure all four
      products are available on the Headless channel.

## 4. Connect the site

- [ ] **Fill in `homiz/config.js`:** the Shopify domain (`yourstore.myshopify.com`),
      the Storefront token, contact email, Instagram and TikTok.
- [ ] **Klaviyo** (free up to 250 contacts): create an account, connect it to
      Shopify, create a list called "Homiz Club", then paste the public API key
      and list ID into `config.js`. Turn on a welcome email.
- [ ] **Email rules:** the sign-up form already asks for consent. Every marketing
      email must identify Homiz and include an unsubscribe link (the Spam Act;
      Klaviyo handles this).
- [ ] **Fill in every highlighted (yellow) item in `help.html`,** including your ABN
      and launch date.
- [ ] **Run `node homiz/tools/prelaunch-check.mjs`** until it reports "All required
      items are done".

## 5. Host it

The site is plain files with no build step, so any static host works.

- **Recommended:** Cloudflare Pages or Netlify (both free). Upload the `homiz/`
  folder, then connect `homiz.com.au`. Both include HTTPS.
- **Higgsfield:** the site is already deployed at homiz-nextgen.higgsfield.app,
  but it's private. Making it public there also lists it on their community feed.

Then:

- [ ] Update the `canonical` links in `index.html` and `help.html` if your domain
      isn't `homiz.com.au`.
- [ ] Move the campaign images into `assets/` and point the page at them, so the
      site doesn't depend on Higgsfield's CDN.

## 6. Test before you announce

- [ ] **Place a real test order** on your phone and on a laptop: add to bag, change
      quantity, check out, receive the confirmation email, then refund it in Shopify.
- [ ] **Try a sold-out size:** set one variant to 0 stock and check it shows as
      struck through.
- [ ] **Sign up to Homiz Club** with your own email and check it lands in Klaviyo.
- [ ] **Open the site on an older phone** and on slow mobile data.
- [ ] **Share a link** in Messages or WhatsApp and check the preview card shows the
      studio image.

## 7. Launch

- [ ] Announce the drop date on Instagram and TikTok and point everyone to Homiz Club.
- [ ] Email the list 24 hours before the drop, and again when it's live.
- [ ] After launch, watch Shopify → Analytics, reply to every DM and email within
      a day, and restock the sizes that sell out.
