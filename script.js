// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  populateContent();
  initEnvelope();
  initNavbar();
  initScrollReveal();
  initParticles();
  initGallery();
  initLightbox();
  initRSVP();
});

// ============================================================
// POPULATE CONTENT FROM CONFIG
// ============================================================

function populateContent() {
  const { baby, event, hosts, contact, rsvp, gallery } = CONFIG;

  // Nav
  setText("nav-baby-name", baby.name);

  // Hero
  setText("hero-baby-name", baby.name);
  setText("hero-tagline", baby.tagline);
  setText("hero-dob", `Born ${baby.dateOfBirth}`);

  // Invitation card
  const heroPhotoUrl = gallery.previewMode
    ? gallery.previewHero
    : gallery.bucketUrl + "/" + gallery.prefix + gallery.heroPhoto;
  const invitationPhoto = document.getElementById("invitation-photo");
  if (invitationPhoto) {
    invitationPhoto.src = heroPhotoUrl;
    invitationPhoto.alt = baby.name + " photo";
    invitationPhoto.onerror = function () {
      this.parentElement.style.display = "none";
    };
  }

  setText("card-family", hosts.family);
  setText("card-baby-name", baby.name);
  setText("card-event-title", event.title);
  setText("card-event-date", event.date);
  setText("card-event-time", event.time);
  setText("card-venue-name", event.venue);
  setText("card-venue-address", event.address);
  setText("card-dress-code", event.dressCode);

  // Family message
  setText("family-message", hosts.message);
  setText("message-signed", "— " + hosts.parents);

  // Event details
  setText("detail-date", event.date);
  setText("detail-time", event.time);
  setText("detail-venue", event.venue);
  setText("detail-address", event.address);
  setText("detail-dresscode", event.dressCode);

  const mapsLink = document.getElementById("detail-maps-link");
  if (mapsLink) mapsLink.href = event.googleMapsUrl;

  const mapIframe = document.getElementById("map-iframe");
  if (mapIframe && event.googleMapsEmbed) {
    mapIframe.src = event.googleMapsEmbed;
  }

  // RSVP
  if (rsvp.deadline) {
    setText("rsvp-deadline", `Please respond by ${rsvp.deadline}`);
  }

  // Contact
  const phoneLink = document.getElementById("contact-phone");
  if (phoneLink) phoneLink.href = `tel:${contact.phone}`;
  setText("contact-phone-text", contact.phone);

  const emailLink = document.getElementById("contact-email");
  if (emailLink) emailLink.href = `mailto:${contact.email}`;
  setText("contact-email-text", contact.email);

  const whatsappLink = document.getElementById("contact-whatsapp");
  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`;
  }

  // Footer
  setText("footer-baby-name", baby.name);
  setText("footer-family", hosts.family);

  // Page title
  document.title = `You're Invited — Welcome ${baby.name}`;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ============================================================
// ENVELOPE ANIMATION
// ============================================================

function initEnvelope() {
  const overlay = document.getElementById("envelope-overlay");
  const envelope = overlay.querySelector(".envelope");
  const seal = document.getElementById("envelope-seal");

  // Set baby name on the letter
  const envName = document.getElementById("env-baby-name");
  if (envName) envName.textContent = CONFIG.baby.name;

  // Spawn background sparkles
  createEnvSparkles();

  // Only the seal triggers the animation
  seal.addEventListener("click", (e) => {
    e.stopPropagation();
    if (envelope.classList.contains("stage-seal")) return;

    // Capture current hover position for smooth settle
    const rect = envelope.getBoundingClientRect();
    const sceneRect = envelope.parentElement.getBoundingClientRect();
    const currentY = rect.top - sceneRect.top;
    envelope.style.setProperty("--hover-y", `${currentY - rect.height / 2}px`);

    // Stage 1: Seal cracks and dissolves (0ms)
    envelope.classList.add("stage-seal");
    overlay.querySelector(".envelope-hint").style.transition = "opacity 0.4s ease";
    overlay.querySelector(".envelope-hint").style.opacity = "0";

    // Stage 2: Flap opens in 3D (after seal finishes — 600ms)
    setTimeout(() => {
      envelope.classList.add("stage-flap");
    }, 600);

    // Stage 3: Letter floats up with staggered text (after flap settles — 1600ms)
    setTimeout(() => {
      envelope.classList.add("stage-letter");
    }, 1500);

    // Stage 4: Confetti burst (when baby name is fully visible — 2500ms)
    setTimeout(() => {
      launchConfetti();
    }, 2500);

    // Stage 5: Warm the background from dark to cream (3800ms)
    setTimeout(() => {
      overlay.classList.add("stage-warmup");
    }, 3800);

    // Stage 6: Drift envelope up and fade (4200ms)
    setTimeout(() => {
      envelope.parentElement.classList.add("stage-exit");
    }, 4300);

    // Stage 7: Remove overlay, reveal site (5400ms)
    setTimeout(() => {
      overlay.classList.add("opened");
      document.body.style.overflow = "";

      // Stagger hero elements in
      setTimeout(() => {
        document.querySelectorAll(".hero .fade-in").forEach((el, i) => {
          setTimeout(() => el.classList.add("visible"), i * 120);
        });
      }, 300);
    }, 5500);
  });

  document.body.style.overflow = "hidden";
}

// Background sparkles on the dark envelope overlay
function createEnvSparkles() {
  const container = document.getElementById("env-sparkles");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "env-sparkle";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.width = 1 + Math.random() * 3 + "px";
    s.style.height = s.style.width;
    s.style.animationDuration = 2 + Math.random() * 4 + "s";
    s.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(s);
  }
}

// Gold confetti burst using canvas
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = [
    "#d4a843", "#b8860b", "#e8c55a", "#f0d878",
    "#c9982a", "#a67c0b", "#fff0c0", "#7c9a6e",
    "#ffffff", "#f5e6d8"
  ];

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Create particles bursting from center
  for (let i = 0; i < 120; i++) {
    const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.5;
    const speed = 3 + Math.random() * 8;
    const size = 3 + Math.random() * 6;
    const isCircle = Math.random() > 0.5;

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: size,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.08 + Math.random() * 0.04,
      friction: 0.98,
      opacity: 1,
      isCircle: isCircle,
      width: size,
      height: size * (0.4 + Math.random() * 0.6),
    });
  }

  let frame = 0;
  const maxFrames = 180;

  function animate() {
    if (frame >= maxFrames) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.rotation += p.rotSpeed;

      if (frame > maxFrames * 0.6) {
        p.opacity -= 0.03;
      }

      if (p.opacity <= 0) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.isCircle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      }

      ctx.restore();
    });

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================
// NAVBAR
// ============================================================

function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    navbar.classList.toggle("scrolled", current > 60);
    lastScroll = current;
  });

  // Mobile toggle
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  // Close mobile menu on link click
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
    });
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal, .fade-in").forEach((el) => {
    // Don't observe hero fade-ins (they're triggered by envelope)
    if (!el.closest(".hero")) {
      observer.observe(el);
    }
  });
}

// ============================================================
// PARTICLES (subtle floating sparkles)
// ============================================================

function initParticles() {
  const container = document.getElementById("particles");
  const name = CONFIG.baby.name;
  const count = 15;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = name;
    particle.style.left = Math.random() * 90 + "%";
    particle.style.animationDuration = 12 + Math.random() * 16 + "s";
    particle.style.animationDelay = Math.random() * 14 + "s";
    particle.style.fontSize = 10 + Math.random() * 14 + "px";
    // Slight random rotation for a natural feel
    const rotation = -25 + Math.random() * 50;
    particle.style.setProperty("--rotation", rotation + "deg");
    container.appendChild(particle);
  }
}

// ============================================================
// PHOTO GALLERY (loads from S3)
// ============================================================

function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const { gallery } = CONFIG;

  if (gallery.previewMode) {
    renderPreviewPhotos(gallery.previewPhotos, grid);
  } else if (gallery.listFromS3) {
    loadPhotosFromS3(gallery, grid);
  } else {
    renderPhotos(gallery.photos, gallery, grid);
  }
}

async function loadPhotosFromS3(gallery, grid) {
  try {
    // List objects from S3 bucket using the REST API (requires ListBucket permission)
    const listUrl = `${gallery.bucketUrl}?list-type=2&prefix=${encodeURIComponent(gallery.prefix)}`;
    const response = await fetch(listUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const keys = xml.querySelectorAll("Contents > Key");

    const photos = [];
    keys.forEach((key) => {
      const filename = key.textContent;
      const ext = filename.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
        // Extract just the filename from the full key
        const name = filename.replace(gallery.prefix, "");
        if (name && name !== gallery.heroPhoto) {
          photos.push(name);
        }
      }
    });

    renderPhotos(photos, gallery, grid);
  } catch (error) {
    console.warn("Could not list S3 bucket. Falling back to manual photo list.", error);
    renderPhotos(gallery.photos, gallery, grid);
  }
}

function renderPreviewPhotos(urls, grid) {
  grid.innerHTML = "";

  urls.forEach((url, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item loading reveal";
    item.setAttribute("data-index", index);
    item.setAttribute("data-src", url);

    const img = document.createElement("img");
    img.alt = `Gallery photo ${index + 1}`;
    img.loading = "lazy";
    img.onload = () => item.classList.remove("loading");
    img.onerror = () => item.remove();
    img.src = url;

    const zoom = document.createElement("div");
    zoom.className = "gallery-zoom";
    zoom.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>`;

    item.appendChild(img);
    item.appendChild(zoom);
    grid.appendChild(item);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function renderPhotos(photos, gallery, grid) {
  grid.innerHTML = "";

  photos.forEach((photo, index) => {
    const url = `${gallery.bucketUrl}/${gallery.prefix}${photo}`;

    const item = document.createElement("div");
    item.className = "gallery-item loading reveal";
    item.setAttribute("data-index", index);
    item.setAttribute("data-src", url);

    const img = document.createElement("img");
    img.alt = `Gallery photo ${index + 1}`;
    img.loading = "lazy";

    img.onload = () => {
      item.classList.remove("loading");
    };

    img.onerror = () => {
      item.remove();
    };

    img.src = url;

    const zoom = document.createElement("div");
    zoom.className = "gallery-zoom";
    zoom.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>`;

    item.appendChild(img);
    item.appendChild(zoom);
    grid.appendChild(item);
  });

  // Re-observe new elements for scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ============================================================
// LIGHTBOX
// ============================================================

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCurrent = document.getElementById("lightbox-current");
  const lightboxTotal = document.getElementById("lightbox-total");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;
  let photos = [];

  function getPhotos() {
    return Array.from(document.querySelectorAll(".gallery-item[data-src]"));
  }

  function openLightbox(index) {
    photos = getPhotos();
    if (photos.length === 0) return;

    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const src = photos[currentIndex].getAttribute("data-src");
    lightboxImg.src = src;
    lightboxCurrent.textContent = currentIndex + 1;
    lightboxTotal.textContent = photos.length;
  }

  function nextPhoto() {
    currentIndex = (currentIndex + 1) % photos.length;
    updateLightbox();
  }

  function prevPhoto() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateLightbox();
  }

  // Event delegation for gallery items
  document.getElementById("gallery-grid").addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item) {
      const index = parseInt(item.getAttribute("data-index"), 10);
      openLightbox(index);
    }
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", prevPhoto);
  nextBtn.addEventListener("click", nextPhoto);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector(".lightbox-content")) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prevPhoto() : nextPhoto();
    }
  });
}

// ============================================================
// RSVP FORM
// ============================================================

function initRSVP() {
  const form = document.getElementById("rsvp-form");
  const successEl = document.getElementById("rsvp-success");
  const errorEl = document.getElementById("rsvp-error");
  const validationEl = document.getElementById("rsvp-validation");
  const validationMsg = document.getElementById("rsvp-validation-msg");
  const { rsvp } = CONFIG;

  if (!rsvp.enabled) {
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".rsvp-submit");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    const missing = [];
    if (!data.name) missing.push("Full Name");
    if (!data.phone) missing.push("Phone");
    if (!data.attending) missing.push("Will you be attending?");
    if (!data.adultGuests) missing.push("Number of Adults");

    if (missing.length > 0) {
      highlightInvalid(form);
      validationMsg.textContent =
        "Please fill in the following required field" +
        (missing.length > 1 ? "s" : "") +
        ": " +
        missing.join(", ") + ".";
      validationEl.hidden = false;
      validationEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    validationEl.hidden = true;

    // Show loading
    btnText.hidden = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;
    successEl.hidden = true;
    errorEl.hidden = true;
    validationEl.hidden = true;

    try {
      let submitted = false;

      // Option 1: Google Apps Script Web App (via JSONP — no CORS issues)
      if (rsvp.appsScriptUrl && !submitted) {
        const params = new URLSearchParams({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          adultGuests: data.adultGuests || "",
          kidsGuests: data.kidsGuests || "0",
          attending: data.attending === "yes" ? "Joyfully Accept" : "Regretfully Decline",
          message: data.message || "",
          callback: "__rsvpCallback",
        });
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          const timeout = setTimeout(() => { script.remove(); reject(new Error("Timeout")); }, 8000);
          window.__rsvpCallback = function (resp) {
            clearTimeout(timeout);
            script.remove();
            delete window.__rsvpCallback;
            resolve(resp);
          };
          script.src = rsvp.appsScriptUrl + "?" + params.toString();
          script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error("Script load failed")); };
          document.head.appendChild(script);
        });
        submitted = true;
      }

      // Option 2: API endpoint
      if (rsvp.apiEndpoint && !submitted) {
        const response = await fetch(rsvp.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("API error");
        submitted = true;
      }

      // Option 3: Formspree
      if (rsvp.formspreeId && !submitted) {
        const response = await fetch(`https://formspree.io/f/${rsvp.formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Formspree error");
        submitted = true;
      }

      // Fallback: store locally
      if (!submitted) {
        console.log("RSVP Data (no backend configured):", data);
        const stored = JSON.parse(localStorage.getItem("rsvp_submissions") || "[]");
        stored.push({ ...data, timestamp: new Date().toISOString() });
        localStorage.setItem("rsvp_submissions", JSON.stringify(stored));
      }

      // Show success
      successEl.hidden = false;
      form.reset();
    } catch (error) {
      console.error("RSVP submission error:", error);
      errorEl.hidden = false;
    } finally {
      btnText.hidden = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
    }
  });
}


function highlightInvalid(form) {
  const validationEl = document.getElementById("rsvp-validation");
  form.querySelectorAll("[required]").forEach((field) => {
    const isEmpty = field.type === "radio"
      ? !form.querySelector(`[name="${field.name}"]:checked`)
      : !field.value;
    if (isEmpty) {
      field.style.borderColor = "#b43c3c";
      field.addEventListener(
        "input",
        () => {
          field.style.borderColor = "";
          const anyStillInvalid = Array.from(form.querySelectorAll("[required]")).some((f) =>
            f.type === "radio"
              ? !form.querySelector(`[name="${f.name}"]:checked`)
              : !f.value
          );
          if (!anyStillInvalid) validationEl.hidden = true;
        },
        { once: true }
      );
    }
  });
}
