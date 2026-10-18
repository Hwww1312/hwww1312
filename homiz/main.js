(() => {
  const { gsap, ScrollTrigger } = window;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  const CDN = "https://d2ol7oe51mr4n9.cloudfront.net/user_3IyOjJ3Lfp02XcM3tonjT7cwP1k/";
  const PRODUCTS = {
    "hoodie-burgundy": {
      name: "Feel Blessed Zip Hoodie — Burgundy", badge: "New — Drop 001",
      a: "assets/products/blessed-burgundy.webp", b: "assets/products/fearless-burgundy.webp",
      desc: "Heavyweight fleece in an acid mineral wash. Distressed Feel Blessed script split by a two-way silver zip, Fear Less across the back, “i'm busy” on the hood and three puff stars down each sleeve. Cropped, boxy fit.",
    },
    "hoodie-black": {
      name: "Feel Blessed Zip Hoodie — Washed Black", badge: "New — Drop 001",
      a: "assets/products/blessed-black.webp", b: "assets/products/fearless-black.webp",
      desc: "The washed-black colourway with thorned white script front and back, a solid black lined hood and bright white puff stars. Cropped, boxy fit.",
    },
    "pant-burgundy": {
      name: "Fear Less Trackpant — Burgundy", badge: "Coming soon",
      a: CDN + "c409c4cf-a60a-468f-a1c0-46028b6f78ee.webp", b: CDN + "2bcf24b3-a74f-439b-bdde-3aa49be29611.webp",
      desc: "Wide-leg acid-wash fleece trackpant to match the hoodie. Twin white side stripes, white drawcords, Fear Less script on the thigh and BLESSED in rhinestones across the back.",
    },
    "pant-black": {
      name: "Fear Less Trackpant — Washed Black", badge: "Coming soon",
      a: CDN + "c796e89e-3b6b-44be-87d8-496e56b2d1e3.webp", b: CDN + "62c9b947-8713-4e4a-8f14-9049e17622a2.webp",
      desc: "The washed-black trackpant. Wide leg, twin white side stripes, Fear Less script on the thigh and BLESSED in rhinestones across the back.",
    },
  };

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.07, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.stop();
  }
  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  const headerOffset = () => -($("#header").offsetHeight || 0);
  function goTo(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === "top" ? 0 : headerOffset(), duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length < 2 || a.hasAttribute("data-quick")) return;
    e.preventDefault();
    closeAll();
    goTo(href);
  }));

  /* ---------------- announcement bar ---------------- */
  const msgs = $$("#annMsgs p");
  let msgIdx = 0;
  function showMsg(next) {
    const cur = msgs[msgIdx];
    msgIdx = (next + msgs.length) % msgs.length;
    cur.classList.remove("is-on");
    cur.classList.add("is-out");
    setTimeout(() => cur.classList.remove("is-out"), 900);
    msgs[msgIdx].classList.add("is-on");
  }
  let annTimer = setInterval(() => showMsg(msgIdx + 1), 4800);
  const annManual = (d) => { clearInterval(annTimer); showMsg(msgIdx + d); annTimer = setInterval(() => showMsg(msgIdx + 1), 4800); };
  $("#annPrev").addEventListener("click", () => annManual(-1));
  $("#annNext").addEventListener("click", () => annManual(1));

  /* ---------------- header: condense, hide on the way down ---------------- */
  const header = $("#header");
  let lastY = 0;
  function onScrollHeader(y) {
    header.classList.toggle("is-scrolled", y > 40);
    const drawerOpen = document.body.classList.contains("is-locked");
    if (!drawerOpen) header.classList.toggle("is-hidden", y > 500 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove("is-hidden");
    lastY = y;
  }
  if (lenis) lenis.on("scroll", (l) => onScrollHeader(l.scroll));
  else addEventListener("scroll", () => onScrollHeader(scrollY), { passive: true });

  /* ---------------- hero slideshow ---------------- */
  const slides = $$(".hero__slide");
  const dots = $$(".hero__dot");
  let slideIdx = 0;
  let slideTimer = null;
  function setSlide(i) {
    slideIdx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-on", k === slideIdx));
    dots.forEach((d, k) => {
      d.classList.remove("is-on");
      d.setAttribute("aria-selected", String(k === slideIdx));
      if (k === slideIdx) { void d.offsetWidth; d.classList.add("is-on"); }
    });
    clearTimeout(slideTimer);
    if (!reduceMotion) slideTimer = setTimeout(() => setSlide(slideIdx + 1), 7000);
  }
  dots.forEach((d, k) => d.addEventListener("click", () => setSlide(k)));

  /* ---------------- word-by-word reveals ---------------- */
  function splitWords(el, hot = []) {
    const out = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { out.push(w); return; }
          out.push(`<span class="w${hot.includes(w) ? " hot" : ""}">${w}</span>`);
        });
      } else {
        out.push(node.textContent.split(/\s+/).filter(Boolean).map((w) => `<span class="w ${node.className}">${w}</span>`).join(" "));
      }
    });
    el.innerHTML = out.join("");
    return $$(".w", el);
  }
  const introWords = splitWords($("#introText"));
  const maniWords = splitWords($("#manifestoText"), ["homies.", "Melbourne.", "next", "gen."]);

  /* ---------------- image reveals ---------------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -12% 0px" });

  /* ---------------- product cards ---------------- */
  $$(".card__media").forEach((m) => m.addEventListener("pointermove", (e) => {
    const r = m.getBoundingClientRect();
    m.style.setProperty("--lx", `${e.clientX - r.left}px`);
    m.style.setProperty("--ly", `${e.clientY - r.top}px`);
  }));
  const wish = new Set(store.get("homiz-wish", []));
  const wishCount = $("#wishCount");
  function syncWish() {
    wishCount.textContent = wish.size;
    $$(".card").forEach((c) => $(".card__wish", c).setAttribute("aria-pressed", String(wish.has(c.dataset.product))));
  }
  $$(".card__wish").forEach((b) => b.addEventListener("click", () => {
    const id = b.closest(".card").dataset.product;
    wish.has(id) ? wish.delete(id) : wish.add(id);
    store.set("homiz-wish", [...wish]);
    syncWish();
    if (!reduceMotion && gsap) gsap.fromTo(b, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: "back.out(3)" });
  }));
  syncWish();
  $("#wishBtn").addEventListener("click", () => goTo("#shop"));

  /* ---------------- drawers ---------------- */
  const scrim = $("#scrim");
  const drawer = $("#drawer");
  const menu = $("#menu");
  const bag = $("#bag");
  const shop = window.HomizShop || { enabled: false, onChange() {}, product() {} };
  let currentProduct = null;

  function openBag() {
    bag.classList.add("is-on");
    bag.setAttribute("aria-hidden", "false");
    lock(true);
    $("#bagClose").focus({ preventScroll: true });
  }
  $("#bagBtn").addEventListener("click", openBag);
  $("#bagClose").addEventListener("click", () => closeAll());
  $("#bagShop").addEventListener("click", () => { closeAll(); goTo("#shop"); });

  const thumb = (url) => { try { const u = new URL(url); u.searchParams.set("width", "200"); return u.href; } catch { return url; } };
  // Re-render prices, bag count and bag lines whenever the Shopify state changes.
  shop.onChange((s) => {
    $$(".card").forEach((card) => {
      const p = shop.product(card.dataset.product);
      if (!p) return;
      const sizes = new Set(p.variants.map((v) => v.price.amount));
      $(".card__price", card).textContent = p.available ? `${sizes.size > 1 ? "From " : ""}${shop.money(p.price)}` : "Sold out";
    });
    const cart = s.cart;
    $("#bagCount").textContent = cart?.totalQuantity || 0;
    $("#bagTitleCount").textContent = cart?.totalQuantity || 0;
    const lines = cart?.lines.nodes || [];
    $("#bagEmpty").hidden = lines.length > 0;
    $("#bagEmpty p").textContent = shop.enabled ? "Your bag is empty." : "The shop opens at the drop. Join the Homiz Club for first access.";
    $("#bagFoot").hidden = lines.length === 0;
    $("#bagLines").innerHTML = lines.map((l) => {
      const m = l.merchandise;
      return `<li class="bag-line" data-line="${l.id}">
        ${m.image ? `<img src="${thumb(m.image.url)}" alt="${m.image.altText || m.product.title}" />` : `<span class="bag-line__ph"></span>`}
        <div><p class="bag-line__name">${m.product.title}</p><p class="bag-line__meta">${m.title}</p>
          <div class="qty" role="group" aria-label="Quantity">
            <button data-q="${l.quantity - 1}" aria-label="One fewer">−</button><span>${l.quantity}</span><button data-q="${l.quantity + 1}" aria-label="One more">+</button>
          </div></div>
        <p class="bag-line__price">${shop.money({ amount: Number(m.price.amount) * l.quantity, currencyCode: m.price.currencyCode })}</p>
      </li>`;
    }).join("");
    if (cart) {
      $("#bagSubtotal").textContent = shop.money(cart.cost.subtotalAmount);
      $("#bagCheckout").href = cart.checkoutUrl;
    }
    $("#bagError").textContent = s.error;
    bag.classList.toggle("is-busy", s.busy);
    if (currentProduct) renderSizes(currentProduct);
  });
  $("#bagLines").addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (b && !shop.state.busy) shop.setQuantity(b.closest("[data-line]").dataset.line, Number(b.dataset.q));
  });

  // Quick-view sizes come from Shopify variants when the shop is connected.
  function renderSizes(id) {
    const p = shop.product(id);
    const wrap = $("#qvSizes");
    const picked = $('#qvSizes .size[aria-pressed="true"]')?.textContent;
    const sizes = p ? p.variants : ["XS", "S", "M", "L", "XL"].map((size) => ({ size, available: true }));
    wrap.innerHTML = sizes.map((v) => `<button class="size" aria-pressed="${v.size === picked}" ${v.available ? "" : "disabled"} data-variant="${v.id || ""}">${v.size}</button>`).join("");
    const live = shop.enabled && p;
    $("#qvNotify").textContent = live ? (p.available ? "Add to bag" : "Sold out") : "Notify me at drop";
    $("#qvNotify").disabled = Boolean(live && !p.available) || shop.state.busy;
    $("#qvPrice").textContent = live ? shop.money(p.price) : "Price at drop";
  }
  function lock(on) {
    document.body.classList.toggle("is-locked", on);
    scrim.classList.toggle("is-on", on);
    if (lenis) on ? lenis.stop() : lenis.start();
  }
  function openQuick(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    currentProduct = id;
    $("#qvA").src = p.a; $("#qvA").alt = `${p.name}, front`;
    $("#qvB").src = p.b; $("#qvB").alt = `${p.name}, back`;
    $("#qvName").textContent = p.name;
    $("#qvBadge").textContent = p.badge;
    $("#qvDesc").textContent = p.desc;
    $("#qvNote").textContent = "";
    $("#qvSizes").innerHTML = "";
    renderSizes(id);
    drawer.classList.add("is-on");
    drawer.setAttribute("aria-hidden", "false");
    lock(true);
    $("#drawerClose").focus({ preventScroll: true });
  }
  function closeAll() {
    [drawer, menu, bag].forEach((d) => { d.classList.remove("is-on"); d.setAttribute("aria-hidden", "true"); });
    currentProduct = null;
    closeLightbox();
    lock(false);
  }
  $$("[data-quick]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    openQuick(el.closest(".card").dataset.product);
  }));
  $("#qvSizes").addEventListener("click", (e) => {
    const s = e.target.closest(".size");
    if (!s || s.disabled) return;
    $$("#qvSizes .size").forEach((o) => o.setAttribute("aria-pressed", String(o === s)));
    $("#qvNote").textContent = "";
  });
  $("#qvNotify").addEventListener("click", async () => {
    const size = $('#qvSizes .size[aria-pressed="true"]');
    if (!size) { $("#qvNote").textContent = "Pick a size first."; return; }
    if (shop.enabled && size.dataset.variant) {
      await shop.add(size.dataset.variant);
      if (shop.state.error) { $("#qvNote").textContent = shop.state.error; return; }
      closeAll();
      openBag();
      return;
    }
    const list = store.get("homiz-notify", []);
    list.push(`${currentProduct}:${size.textContent}`);
    store.set("homiz-notify", list);
    $("#qvNote").textContent = `Noted: size ${size.textContent}. Join the Homiz Club below to get the drop alert.`;
  });
  $("#drawerClose").addEventListener("click", closeAll);
  scrim.addEventListener("click", closeAll);
  $("#menuBtn").addEventListener("click", () => { menu.classList.add("is-on"); menu.setAttribute("aria-hidden", "false"); lock(true); });
  $("#menuClose").addEventListener("click", closeAll);
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  /* ---------------- lightbox ---------------- */
  const lightbox = $("#lightbox");
  function closeLightbox() { lightbox.classList.remove("is-on"); lightbox.setAttribute("aria-hidden", "true"); }
  $$(".shot").forEach((s) => s.addEventListener("click", () => {
    $("#lightboxImg").src = s.dataset.full;
    $("#lightboxImg").alt = $("img", s).alt;
    lightbox.classList.add("is-on");
    lightbox.setAttribute("aria-hidden", "false");
    lock(true);
  }));
  lightbox.addEventListener("click", closeAll);

  /* ---------------- two faces ---------------- */
  const faces = $("#faces");
  const flip = $("#flip");
  const sideLabel = $("#sideLabel");
  const face = { scroll: 0, drag: 0, tiltX: 0, tiltY: 0, shown: 0 };
  $$(".swatch").forEach((b) => b.addEventListener("click", () => {
    $$(".swatch").forEach((s) => s.setAttribute("aria-pressed", String(s === b)));
    faces.classList.toggle("is-black", b.dataset.colour === "black");
    if (gsap && !reduceMotion) gsap.fromTo(face, { drag: face.drag + 360 }, { drag: face.drag, duration: 1.6, ease: "expo.out" });
  }));
  let dragging = false, dragX = 0, dragStart = 0;
  flip.addEventListener("pointerdown", (e) => { dragging = true; dragX = e.clientX; dragStart = face.drag; flip.setPointerCapture(e.pointerId); });
  flip.addEventListener("pointermove", (e) => {
    const r = flip.getBoundingClientRect();
    face.tiltX = ((e.clientY - r.top) / r.height - 0.5) * -10;
    face.tiltY = ((e.clientX - r.left) / r.width - 0.5) * 14;
    if (dragging) face.drag = dragStart + (e.clientX - dragX) * 0.5;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    // settle on the nearest face so the print never rests edge-on
    const total = face.scroll + face.drag;
    const snapped = Math.round(total / 180) * 180;
    if (gsap) gsap.to(face, { drag: snapped - face.scroll, duration: 1.2, ease: "expo.out" });
  };
  flip.addEventListener("pointerup", endDrag);
  flip.addEventListener("pointercancel", endDrag);
  flip.addEventListener("pointerleave", () => { face.tiltX = 0; face.tiltY = 0; });

  /* ---------------- scroll-driven scenes ---------------- */
  function setupScroll() {
    if (!gsap || !ScrollTrigger) return;
    const ease = "none";

    // Hero: the campaign drifts and the copy lifts away as you leave it.
    gsap.to(".hero__media", { yPercent: 12, ease, scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.2 } });
    gsap.to(".hero__copy", { y: -80, opacity: 0, ease, scrollTrigger: { trigger: "#hero", start: "30% top", end: "bottom top", scrub: 1.2 } });

    // Intro words light up one by one.
    ScrollTrigger.create({
      trigger: ".intro", start: "top 75%", end: "bottom 45%", scrub: 1,
      onUpdate: (st) => { const n = Math.round(st.progress * introWords.length); introWords.forEach((w, i) => w.classList.toggle("on", i < n)); },
    });

    // Story: vertical scroll becomes a slow horizontal pan.
    const track = $("#storyTrack");
    const panelImgs = $$(".panel__media img", track);
    gsap.to(track, {
      x: () => -(track.scrollWidth - innerWidth), ease,
      scrollTrigger: {
        trigger: "#story", start: "top top", end: "bottom bottom", scrub: 1.4, invalidateOnRefresh: true,
        onUpdate: (st) => {
          $("#storyProgress").style.transform = `scaleX(${st.progress})`;
          panelImgs.forEach((img) => {
            const r = img.parentElement.getBoundingClientRect();
            const c = (r.left + r.width / 2) / innerWidth - 0.5;
            img.style.transform = `translate3d(${c * -50}px, 0, 0)`;
          });
        },
      },
    });

    // Two faces: the hoodie turns from front to back across the pinned section.
    ScrollTrigger.create({
      trigger: "#faces", start: "top top", end: "bottom bottom", scrub: 1.4,
      onUpdate: (st) => { face.scroll = smooth(0.18, 0.82, st.progress) * 180; },
    });

    // Lookbook drift.
    $$(".shot img[data-speed]").forEach((img) => {
      const s = parseFloat(img.dataset.speed);
      gsap.fromTo(img, { yPercent: -s * 50 }, { yPercent: s * 50, ease, scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1.2 } });
    });

    // Manifesto.
    gsap.fromTo(".manifesto__bg", { yPercent: -6, scale: 1.05 }, { yPercent: 6, scale: 1, ease, scrollTrigger: { trigger: "#manifesto", start: "top bottom", end: "bottom top", scrub: 1.2 } });
    ScrollTrigger.create({
      trigger: "#manifesto", start: "top top", end: "bottom bottom", scrub: 1,
      onUpdate: (st) => { const n = Math.round(smooth(0.05, 0.9, st.progress) * maniWords.length); maniWords.forEach((w, i) => w.classList.toggle("on", i < n)); },
    });

    // Club title rises in.
    gsap.from(".club__title", { yPercent: 30, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: "#club", start: "top 75%" } });
  }

  // Per-frame: ease the flip card towards its target so every change glides.
  function tickFaces() {
    const target = face.scroll + face.drag;
    face.shown += (target - face.shown) * 0.08;
    const tilt = `rotateX(${face.tiltX.toFixed(2)}deg)`;
    flip.style.transform = `${tilt} rotateY(${(face.shown + face.tiltY).toFixed(2)}deg)`;
    const isBack = Math.cos((face.shown * Math.PI) / 180) < 0;
    if (faces.classList.contains("is-back") !== isBack) {
      faces.classList.toggle("is-back", isBack);
      sideLabel.textContent = isBack ? "Back" : "Front";
    }
  }

  /* ---------------- club form ---------------- */
  const config = window.HOMIZ_CONFIG || {};
  const klaviyo = config.klaviyo || {};
  $("#clubForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("#clubEmail");
    const msg = $("#clubMsg");
    if (!input.value || !input.checkValidity()) { msg.textContent = "Check that email address and try again."; input.focus(); return; }
    if (!$("#clubConsent").checked) { msg.textContent = "Tick the box to agree to emails from Homiz."; return; }
    if (!klaviyo.companyId || !klaviyo.listId) {
      msg.textContent = "Sign-ups open soon. Follow us on Instagram for the drop date.";
      return;
    }
    msg.textContent = "Signing you up…";
    try {
      const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(klaviyo.companyId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
        body: JSON.stringify({ data: { type: "subscription", attributes: {
          custom_source: "Homiz website",
          profile: { data: { type: "profile", attributes: { email: input.value, subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } } } } },
        }, relationships: { list: { data: { type: "list", id: klaviyo.listId } } } } }),
      });
      if (!res.ok) throw new Error(String(res.status));
      msg.textContent = "You're in. Watch your inbox for Drop 001.";
      input.value = "";
    } catch {
      msg.textContent = "That didn't go through. Try again in a moment.";
    }
  });

  // Contact details and socials come from config.js; unset ones are hidden.
  const contact = config.contact || {};
  $$("[data-contact]").forEach((el) => {
    const key = el.dataset.contact;
    const value = contact[key];
    if (!value) { (el.closest("li") || el).hidden = true; return; }
    if (key === "email") { el.textContent = value; el.href = `mailto:${value}`; } else el.href = value;
  });

  /* ---------------- boot ---------------- */
  function boot() {
    const loader = $("#loader");
    const bar = $("#loaderBar");
    const heroImg = $(".hero__slide.is-on img");
    const ready = Promise.race([
      Promise.all([
        heroImg.complete ? Promise.resolve() : new Promise((r) => { heroImg.onload = r; heroImg.onerror = r; }),
        document.fonts ? document.fonts.ready : Promise.resolve(),
      ]),
      new Promise((r) => setTimeout(r, 4000)), // never trap anyone behind the loader
    ]);
    const finish = () => {
      loader.remove();
      lenis?.start();
      setSlide(0);
      $$(".reveal-img").forEach((el) => io.observe(el));
      setupScroll();
      if (gsap) gsap.ticker.add(tickFaces); else setInterval(tickFaces, 16);
    };
    if (!gsap || reduceMotion) { ready.then(finish); return; }
    gsap.to(bar, { scaleX: 0.7, duration: 1.2, ease: "power2.out" });
    ready.then(() => {
      gsap.timeline()
        .to(bar, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
        .to(loader, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" })
        .add(finish, "-=0.3")
        .from("#heroTitle .line > span", { yPercent: 110, duration: 1.6, ease: "expo.out", stagger: 0.12 }, "-=0.2")
        .from(".hero__copy .label, .hero__copy .btn", { y: 20, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1 }, "<0.2");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
