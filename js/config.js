/* ==========================================================================
   RAZORS EDGE × BUILT4VISION — "New Place, Same Edge"
   Single source of truth for editable values, shared by every page on this
   site (index.html, thank-you/index.html). Update this object only — the
   rest of the scripts read from it and populate the page.
   ========================================================================== */
const CONFIG = {
  businessName: "Razors Edge",
  songTitle: "New Place, Same Edge",

  // Swap the file at this path (or change the path) to update the anthem.
  audioSrc: "audio/razors-edge-anthem.mp3",

  cityState: "Newark, Delaware",
  address: "1450 Capital Trail, Newark, Delaware 19711",

  builtByName: "Built4Vision",
  builtByUrl: "https://built4vision.net",
  builtByUrlText: "built4vision.net",

  // EDIT: replace with the real inbox this business should reach.
  contactEmail: "info@built4vision.com",
  contactEmailHref: "mailto:info@built4vision.com",

  packagePrice: "$197",
  songPrice: "$49",

  // EDIT: replace "#" with real checkout links once accounts are set up.
  // Leaving a value as "#" renders it as a disabled "(add link)" placeholder.
  paymentLinks: {
    package: {
      stripe: "#",
      paypal: "#",
    },
    song: {
      stripe: "#",
      paypal: "#",
    },
  },

  // EDIT: 1200x630 image used for social share previews (also set in <head> meta tags).
  socialPreviewImage: "images/social-preview.jpg",

  // EDIT: swap in the real logo once supplied (falls back to text wordmark if missing).
  logoImage: "images/logo.svg",

  // ------------------------------------------------------------------------
  // POST-PURCHASE DELIVERABLE (thank-you page)
  // Point Stripe's Payment Link "after payment" redirect at thank-you/index.html.
  // The file is checked for existence at load time — if it's not there yet,
  // the thank-you page shows a "still being prepared" note instead of a
  // broken download link.
  // ------------------------------------------------------------------------
  fullSongDownloadSrc: "audio/razors-edge-anthem.mp3",
};

/* ==========================================================================
   POPULATE CONFIG-DRIVEN TEXT / LINKS
   Shared by every page — reads [data-config], [data-config-href], and
   [data-config-src] attributes and fills them from CONFIG above.
   ========================================================================== */
function applyConfig() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (Object.prototype.hasOwnProperty.call(CONFIG, key) && typeof CONFIG[key] === "string") {
      el.textContent = CONFIG[key];
    }
  });

  document.querySelectorAll("[data-config-href]").forEach((el) => {
    const key = el.dataset.configHref;
    if (Object.prototype.hasOwnProperty.call(CONFIG, key)) {
      el.setAttribute("href", CONFIG[key]);
    }
  });

  document.querySelectorAll("[data-config-src]").forEach((el) => {
    const key = el.dataset.configSrc;
    if (Object.prototype.hasOwnProperty.call(CONFIG, key)) {
      el.setAttribute("src", CONFIG[key]);
    }
  });

  document.title = document.title.replace(/Razors Edge/g, CONFIG.businessName);
}

/* ==========================================================================
   ENTRANCE ANIMATIONS
   Shared by every page — fades in [data-animate] elements as they scroll
   into view, or immediately if the visitor prefers reduced motion.
   ========================================================================== */
function initAnimations() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll("[data-animate]");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}
