// ============== NAV TOGGLE (MOBILE) ==============
const navToggle = document.getElementById("nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinksContainer.classList.toggle("open");
});

// Close menu when clicking a link (mobile)
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navLinksContainer.classList.remove("open");
  });
});

// ============== ACTIVE NAV LINK ON SCROLL ==============
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveNav() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 90;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
}

window.addEventListener("scroll", setActiveNav);

// ============== INTERSECTION OBSERVER: REVEAL ANIMATIONS ==============
const revealElements = document.querySelectorAll(".reveal");

const observerOptions = {
  threshold: 0.2,
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Animate skill bars when skills section comes into view
      if (entry.target.classList.contains("skills-group")) {
        const bars = entry.target.querySelectorAll(".skill-bar span");
        bars.forEach((bar) => {
          const level = bar.getAttribute("data-level");
          bar.style.width = level + "%";
        });
      }
    }
  });
}, observerOptions);

revealElements.forEach((el) => revealObserver.observe(el));

// ============== UPDATE FOOTER YEAR ==============
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
