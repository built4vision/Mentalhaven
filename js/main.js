/* ==========================================================================
   RAZORS EDGE × BUILT4VISION — "New Place, Same Edge"
   Single source of truth for editable values. Update this object only —
   the rest of the script reads from it and populates the page.
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
  contactEmail: "hello@built4vision.net",
  contactEmailHref: "mailto:hello@built4vision.net",

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
};

/* ==========================================================================
   POPULATE CONFIG-DRIVEN TEXT / LINKS
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
   PAYMENT LINK PLACEHOLDERS
   Renders a disabled placeholder chip when a link is unset ("#"),
   or a live link once a real URL is added to CONFIG.paymentLinks.
   ========================================================================== */
function renderPaymentPlaceholders() {
  document.querySelectorAll("[data-pay]").forEach((container) => {
    const offerKey = container.dataset.pay;
    const links = CONFIG.paymentLinks[offerKey];
    if (!links) return;

    Object.entries(links).forEach(([provider, url]) => {
      const label = provider.charAt(0).toUpperCase() + provider.slice(1);
      const isLive = url && url !== "#";
      const el = document.createElement(isLive ? "a" : "span");
      el.textContent = isLive ? label : `${label} (add link)`;
      if (isLive) {
        el.href = url;
        el.rel = "noopener";
      }
      container.appendChild(el);
    });
  });
}

/* ==========================================================================
   AUDIO PLAYER
   ========================================================================== */
function initPlayer() {
  const audio = document.getElementById("anthem-audio");
  const playToggle = document.getElementById("play-toggle");
  const restartBtn = document.getElementById("restart-btn");
  const seek = document.getElementById("seek");
  const volume = document.getElementById("volume");
  const timeElapsed = document.getElementById("time-elapsed");
  const timeTotal = document.getElementById("time-total");
  const fallback = document.getElementById("player-fallback");
  const waveBase = document.getElementById("wave-base");
  const waveProgress = document.getElementById("wave-progress");

  const iconPlay = playToggle.querySelector(".icon--play");
  const iconPause = playToggle.querySelector(".icon--pause");

  const SEEK_MAX = Number(seek.max);
  let duration = 0;
  let seeking = false;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }

  // Deterministic pseudo-random bar heights for a stylized waveform look
  // (this is a decorative visualization, not an analysis of the actual audio).
  function buildWaveform() {
    const barCount = 56;
    let seedVal = 42;
    const rand = () => {
      seedVal = (seedVal * 9301 + 49297) % 233280;
      return seedVal / 233280;
    };

    [waveBase, waveProgress].forEach((layer) => {
      layer.innerHTML = "";
    });

    for (let i = 0; i < barCount; i++) {
      const height = 22 + Math.round(rand() * 78);
      const barBase = document.createElement("span");
      barBase.style.height = `${height}%`;
      waveBase.appendChild(barBase);

      const barProgress = document.createElement("span");
      barProgress.style.height = `${height}%`;
      waveProgress.appendChild(barProgress);
    }
  }

  function setProgress(fraction) {
    const pct = Math.max(0, Math.min(1, fraction)) * 100;
    waveProgress.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }

  function setPlayingUI(isPlaying) {
    iconPlay.hidden = isPlaying;
    iconPause.hidden = !isPlaying;
    playToggle.setAttribute("aria-label", isPlaying ? "Pause the anthem" : "Play the anthem");
  }

  function play() {
    audio.play().catch(() => {
      /* Playback can be blocked until a user gesture; the click itself is the gesture. */
    });
  }

  buildWaveform();

  playToggle.addEventListener("click", () => {
    if (audio.paused) {
      play();
    } else {
      audio.pause();
    }
  });

  document.querySelectorAll("[data-play-again]").forEach((btn) => {
    btn.addEventListener("click", () => play());
  });

  restartBtn.addEventListener("click", () => {
    audio.currentTime = 0;
    setProgress(0);
    seek.value = 0;
    timeElapsed.textContent = formatTime(0);
  });

  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));

  audio.addEventListener("loadedmetadata", () => {
    duration = audio.duration || 0;
    timeTotal.textContent = formatTime(duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (seeking) return;
    timeElapsed.textContent = formatTime(audio.currentTime);
    if (duration > 0) {
      const fraction = audio.currentTime / duration;
      seek.value = String(Math.round(fraction * SEEK_MAX));
      setProgress(fraction);
    }
  });

  audio.addEventListener("ended", () => {
    setProgress(0);
    seek.value = 0;
  });

  audio.addEventListener("error", () => {
    fallback.hidden = false;
    playToggle.disabled = true;
    document.querySelectorAll("[data-play-again]").forEach((btn) => {
      btn.disabled = true;
    });
  });

  seek.addEventListener("input", () => {
    seeking = true;
    const fraction = Number(seek.value) / SEEK_MAX;
    setProgress(fraction);
    timeElapsed.textContent = formatTime(fraction * duration);
  });

  seek.addEventListener("change", () => {
    if (duration > 0) {
      audio.currentTime = (Number(seek.value) / SEEK_MAX) * duration;
    }
    seeking = false;
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
  });
  audio.volume = Number(volume.value);
}

/* ==========================================================================
   CONTACT PANEL
   ========================================================================== */
function initContactPanel() {
  const panel = document.getElementById("contact-panel");
  const form = document.getElementById("contact-form");
  const success = document.getElementById("contact-success");
  const offerSelect = document.getElementById("cf-offer");
  let lastFocused = null;

  function openPanel(offerKey) {
    lastFocused = document.activeElement;
    if (offerKey) offerSelect.value = offerKey;
    form.hidden = false;
    success.hidden = true;
    panel.hidden = false;
    document.body.style.overflow = "hidden";
    const firstField = document.getElementById("cf-name");
    if (firstField) firstField.focus();
  }

  function closePanel() {
    panel.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  document.querySelectorAll("[data-offer]").forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.dataset.offer));
  });

  document.querySelectorAll("[data-close-panel]").forEach((el) => {
    el.addEventListener("click", closePanel);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closePanel();
  });

  // Placeholder submit handler — wire form.dataset.formEndpoint up to a real
  // form service (Formspree, Netlify Forms, etc.) to receive submissions.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.hidden = true;
    success.hidden = false;
  });
}

/* ==========================================================================
   ENTRANCE ANIMATIONS
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

/* ==========================================================================
   SCROLL CUES
   ========================================================================== */
function initScrollCues() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-scroll-to]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = document.querySelector(el.dataset.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      }
    });
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  renderPaymentPlaceholders();
  initPlayer();
  initContactPanel();
  initAnimations();
  initScrollCues();
});
