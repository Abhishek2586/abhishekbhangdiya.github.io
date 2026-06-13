/* ====================================================================
   abhishek.dev — interaction layer
   Organised as small, independent init functions so each feature can
   fail gracefully without breaking the rest of the page.
   ==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initScrollProgress();
  initActiveNav();
  initNavToggle();
  initReveal();
  initCounters();
  initCycleText();
  initSkillBars();
  initFilters();
  initTilt();
  initMagnetic();
  initCursorGlow();
  initTimelineMarkers();
  initContactForm();
  initHeroCanvas();
  initFooterYear();
});

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isCoarsePointer = () =>
  window.matchMedia("(pointer: coarse)").matches;

/* ----------------------------------------------------------------
   PRELOADER — typed "boot sequence"
   ---------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const log = document.getElementById("boot-log");
  if (!preloader || !log) return;

  document.body.classList.add("no-scroll");

  const finish = () => {
    preloader.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    setTimeout(() => preloader.remove(), 650);
  };

  if (prefersReducedMotion()) {
    finish();
    return;
  }

  const lines = [
    "$ initializing abhishek.dev",
    "$ loading profile.yaml ......... ok",
    "$ connecting github.com/Abhishek2586 ... ok",
    "$ calibrating signal processors . ok",
    "$ ready."
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let output = "";

  function typeStep() {
    if (lineIndex >= lines.length) {
      log.innerHTML = output + '<span class="caret"></span>';
      setTimeout(finish, 400);
      return;
    }
    const line = lines[lineIndex];
    if (charIndex <= line.length) {
      log.innerHTML = output + line.slice(0, charIndex) + '<span class="caret"></span>';
      charIndex++;
      setTimeout(typeStep, 14);
    } else {
      output += line + "\n";
      lineIndex++;
      charIndex = 0;
      setTimeout(typeStep, 140);
    }
  }

  typeStep();
  // Safety net: never block the page for more than ~4s.
  setTimeout(finish, 4000);
}

/* ----------------------------------------------------------------
   SCROLL PROGRESS — fills the hairline under the nav
   ---------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress-bar");
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(Math.max(pct, 0), 100)}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ----------------------------------------------------------------
   ACTIVE NAV LINK — highlights the section in view
   ---------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll("main section[id], section.hero[id]");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const linkByTarget = {};
  links.forEach((link) => {
    linkByTarget[link.dataset.nav] = link;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => link.classList.remove("active"));
          const active = linkByTarget[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ----------------------------------------------------------------
   MOBILE NAV TOGGLE
   ---------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ----------------------------------------------------------------
   SCROLL REVEAL — staggered fade/slide-in for .reveal elements
   ---------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

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

  items.forEach((item) => observer.observe(item));
}

/* ----------------------------------------------------------------
   ANIMATED COUNTERS — vitals grid numbers count up on view
   ---------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll(".vital-value");
  if (!counters.length) return;

  if (prefersReducedMotion()) {
    counters.forEach((el) => {
      el.textContent = el.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((c) => observer.observe(c));
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(tick);
}

/* ----------------------------------------------------------------
   HERO CYCLING TAGLINE
   ---------------------------------------------------------------- */
function initCycleText() {
  const el = document.getElementById("cycle-text");
  if (!el) return;

  const phrases = [
    "validated medication data.",
    "early cancer-risk heatmaps.",
    "actionable cloud-cost insights.",
    "real-time vitals alerts.",
    "clear signal."
  ];

  if (prefersReducedMotion()) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1900);
        return;
      }
      setTimeout(tick, 45);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 25);
    }
  }

  tick();
}

/* ----------------------------------------------------------------
   SKILL BARS — animate width + percentage readout on view
   ---------------------------------------------------------------- */
function initSkillBars() {
  const skills = document.querySelectorAll(".skill");
  if (!skills.length) return;

  if (prefersReducedMotion()) {
    skills.forEach((skill) => {
      const fill = skill.querySelector(".skill-bar span");
      const pct = skill.querySelector(".skill-pct");
      if (fill) fill.style.width = `${fill.dataset.level}%`;
      if (pct) pct.textContent = `${pct.dataset.pct}%`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const skill = entry.target;
        const fill = skill.querySelector(".skill-bar span");
        const pct = skill.querySelector(".skill-pct");
        if (fill) fill.style.width = `${fill.dataset.level}%`;
        if (pct) animatePercent(pct, parseInt(pct.dataset.pct, 10));
        observer.unobserve(skill);
      });
    },
    { threshold: 0.3 }
  );

  skills.forEach((skill) => observer.observe(skill));
}

function animatePercent(el, target) {
  const duration = 1000;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = `${Math.floor(progress * target)}%`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${target}%`;
    }
  }

  requestAnimationFrame(tick);
}

/* ----------------------------------------------------------------
   PROJECT FILTERS
   ---------------------------------------------------------------- */
function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });
}

/* ----------------------------------------------------------------
   3D TILT — subtle perspective tilt on cards (desktop only)
   ---------------------------------------------------------------- */
function initTilt() {
  if (isCoarsePointer() || prefersReducedMotion()) return;

  const cards = document.querySelectorAll(".project-card, .focus-card, .vital-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ----------------------------------------------------------------
   MAGNETIC BUTTONS — buttons drift slightly toward the cursor
   ---------------------------------------------------------------- */
function initMagnetic() {
  if (isCoarsePointer() || prefersReducedMotion()) return;

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/* ----------------------------------------------------------------
   CURSOR GLOW — soft signal-colored light follows the cursor
   ---------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || isCoarsePointer() || prefersReducedMotion()) return;

  window.addEventListener("mousemove", (e) => {
    glow.classList.add("active");
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  document.addEventListener("mouseleave", () => glow.classList.remove("active"));
}

/* ----------------------------------------------------------------
   TIMELINE MARKERS — ping when a journey milestone scrolls into view
   ---------------------------------------------------------------- */
function initTimelineMarkers() {
  const markers = document.querySelectorAll(".timeline-marker:not(.timeline-marker-active)");
  if (!markers.length) return;

  if (prefersReducedMotion()) {
    markers.forEach((m) => m.classList.add("in-view"));
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
    { threshold: 0.6 }
  );

  markers.forEach((m) => observer.observe(m));
}

/* ----------------------------------------------------------------
   CONTACT FORM — opens a pre-filled mailto (no backend needed)
   ---------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      if (note) {
        note.textContent = "Fill in every field so the email arrives complete.";
        note.classList.remove("success");
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:abhishekbhangdiya@gmail.com?subject=${subject}&body=${body}`;

    if (note) {
      note.textContent = "Opening your email client with this message pre-filled...";
      note.classList.add("success");
    }
  });
}

/* ----------------------------------------------------------------
   HERO CANVAS — ambient animated signal/ECG traces
   ---------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduceMotion = prefersReducedMotion();
  const signalColor =
    getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || "#3df2a0";

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  function traceWave(yBase, amp, speed, lineWidth, alpha, spikeSpacing, t) {
    ctx.beginPath();
    ctx.strokeStyle = signalColor;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;

    const step = 6;
    for (let x = 0; x <= width; x += step) {
      const phase = x * 0.018 + t * speed;
      let y = Math.sin(phase) * amp * 0.18;

      const spikePos = (x + t * speed * 60) % spikeSpacing;
      if (spikePos < 16) {
        const s = Math.sin((spikePos / 16) * Math.PI);
        y -= s * amp;
      }

      const py = yBase + y;
      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  let t = 0;

  function frame() {
    ctx.clearRect(0, 0, width, height);
    traceWave(height * 0.28, 46, 1, 1.6, 0.45, 340, t);
    traceWave(height * 0.55, 28, 0.65, 1.1, 0.22, 460, t);
    traceWave(height * 0.8, 18, 1.35, 1, 0.13, 260, t);

    if (!reduceMotion) {
      t += 1;
      requestAnimationFrame(frame);
    }
  }

  frame();
}

/* ----------------------------------------------------------------
   FOOTER YEAR
   ---------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
