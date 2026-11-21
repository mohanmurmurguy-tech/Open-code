/**
 * Main JavaScript for Techno Valley College Website
 * Handles navigation, animations, forms, and Three.js initialization
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollAnimations();
  initContactForm();
  initAdmissionForm();
  initFilterButtons();
  initThreeJS();
  initBackToTop();
});

/* -------------------------------------------------
   Navbar: scroll effect, mobile toggle, active link
   ------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
    } else {
      navbar.style.boxShadow = "none";
    }

    // Highlight active section
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}` || link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
}

/* -------------------------------------------------
   Scroll Animations (Intersection Observer)
   ------------------------------------------------- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll(
    ".course-card, .facility-card, .program-card, .stat-card, .about-text, .about-image, .step, .eligibility-list li, .gallery-item, .info-item, .form-card"
  );

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
  });

  // Add animated class styles via JS
  const style = document.createElement("style");
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/* -------------------------------------------------
   Contact Form
   ------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      btn.innerText = "Message Sent!";
      btn.style.background = "#059669";
      form.reset();
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
        btn.disabled = false;
      }, 2000);
    }, 1500);
  });
}

/* -------------------------------------------------
   Admission Form
   ------------------------------------------------- */
function initAdmissionForm() {
  const form = document.querySelector(".admission-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Applying...";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = "Application Submitted!";
      btn.style.background = "#059669";
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
        btn.disabled = false;
      }, 2000);
    }, 1500);
  });
}

/* -------------------------------------------------
   Course Filter Buttons
   ------------------------------------------------- */
function initFilterButtons() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const courseCards = document.querySelectorAll(".course-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      // Filter cards
      courseCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 100);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

/* -------------------------------------------------
   Back to Top Button
   ------------------------------------------------- */
function initBackToTop() {
  const btn = document.createElement("button");
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  btn.className = "btn-primary";
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 900;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow-lg);
  `;
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.style.opacity = "1";
      btn.style.visibility = "visible";
    } else {
      btn.style.opacity = "0";
      btn.style.visibility = "hidden";
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -------------------------------------------------
   Three.js 3D Hero
   ------------------------------------------------- */
function initThreeJS() {
  if (typeof THREE === "undefined") {
    // Load Three.js from CDN if not already loaded
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js";
    script.onload = () => {
      window.THREE = THREE;
      if (typeof window.init3D === "function") {
        window.init3D();
      }
    };
    document.head.appendChild(script);
  } else if (typeof window.init3D === "function") {
    window.init3D();
  }
}
