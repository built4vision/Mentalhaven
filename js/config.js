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

  // Sales-page hero player only plays this window of the file above (in
  // seconds), then loops back to the start — a public preview, not the
  // whole song. The full track only lives behind the purchase, at
  // fullSongDownloadSrc below. Set previewEndSeconds to null to disable
  // and play the full file (e.g. once a dedicated short preview file is
  // used for audioSrc instead).
  previewStartSeconds: 0,
  previewEndSeconds: 30,

  // Second preview, further into the song (a likely chorus/hook window
  // rather than the intro again), shown after the story section. Same
  // loop-back behavior as the hero preview. Spot-check this once per song —
  // most tracks put a strong hook somewhere around here, but confirm it
  // actually lands well before launch.
  secondPreviewStartSeconds: 60,
  secondPreviewEndSeconds: 90,

  cityState: "Newark, Delaware",
  address: "1450 Capital Trail, Newark, Delaware 19711",

  builtByName: "Built4Vision",
  builtByUrl: "https://built4vision.com",
  builtByUrlText: "built4vision.com",

  // EDIT: replace with the real inbox this business should reach.
  contactEmail: "info@built4vision.com",
  contactEmailHref: "mailto:info@built4vision.com",

  packagePrice: "$197",
  songPrice: "$49",

  // EDIT: replace "#" with a real checkout link, or add more providers as
  // needed (e.g. paypal: "..."). Leaving a value as "#" renders it as a
  // disabled "(add link)" placeholder.
  paymentLinks: {
    package: {
      stripe: "https://buy.stripe.com/eVq3cv5HR30jgWd6lQ4sE00",
    },
    song: {
      stripe: "https://buy.stripe.com/14AfZhdajeJ1cFXh0u4sE01",
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
