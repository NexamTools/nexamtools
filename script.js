/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ========== THEME TOGGLE ========== */
  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");

      if (document.body.classList.contains("light")) {
        document.documentElement.style.setProperty("--bg", "#f7f7fb");
        document.documentElement.style.setProperty("--hero1", "#f7f7fb");
        document.documentElement.style.setProperty("--hero2", "#e9eef9");
        document.documentElement.style.setProperty("--text", "#111827");
        document.documentElement.style.setProperty("--card", "#ffffff");
      } else {
        ["--bg","--hero1","--hero2","--text","--card"].forEach(v =>
          document.documentElement.style.removeProperty(v)
        );
      }
    });
  }

  /* ========== ACTIVE MENU ========== */
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  /* ========== FADE-IN ANIMATION ========== */
  const faders = document.querySelectorAll(".fade-in");

  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  faders.forEach(el => fadeObserver.observe(el));

  /* ========== ABOUT SLIDESHOW INIT ========== */
  initSlideshow();
});


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

function toggleMenu() {
  const nav = document.getElementById("navMenu");
  nav.classList.toggle("open");
}

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navMenu").classList.remove("open");
  });
});



/* =====================================================
   ABOUT PAGE SLIDESHOW
===================================================== */
let slides, dotsContainer, captionBox;
let currentSlide = 0;
let slideInterval;

function initSlideshow() {
  slides = document.querySelectorAll(".slide");
  dotsContainer = document.getElementById("slideDots");
  captionBox = document.getElementById("slideCaption");

  if (!slides.length || !dotsContainer) return;

  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
    dotsContainer.appendChild(dot);
  });

  showSlide(currentSlide);
  startSlide();
  enableSwipe();
}

function showSlide(index) {
  slides.forEach(s => s.classList.remove("active"));
  slides[index].classList.add("active");

  [...dotsContainer.children].forEach(d => d.classList.remove("active"));
  dotsContainer.children[index].classList.add("active");

  if (captionBox && slides[index].dataset.caption) {
    captionBox.textContent = slides[index].dataset.caption;
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startSlide() {
  slideInterval = setInterval(nextSlide, 3500);
}

function pauseSlide() {
  clearInterval(slideInterval);
}

function resumeSlide() {
  startSlide();
}

/* Swipe support */
function enableSwipe() {
  const slideshow = document.getElementById("aboutSlideshow");
  if (!slideshow) return;

  let startX = 0;

  slideshow.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slideshow.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  });
}


const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        showToast("Message sent successfully!");
        form.reset();
        grecaptcha.reset();
      } else {
        showToast("Something went wrong. Try again.");
      }
    })
    .catch(() => {
      showToast("Network error. Please try later.");
    });
  });
}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}


function openTool(el) {

  // If clicked element is an image/card, find the heading <a>
  if (el.tagName !== "A") {
    el = el.closest(".product-block").querySelector(".tool-heading a");
  }

  const title = el.dataset.title;
  const desc = el.dataset.desc;
  const specs = el.dataset.specs.split("|");

  // Get image from the same product block
  const section = el.closest(".product-block");
  const img = section.querySelector(".tool-card img");

  document.getElementById("toolTitle").innerText = title;
  document.getElementById("toolDesc").innerText = desc;
  document.getElementById("toolImage").src = img ? img.src : "";

  document.getElementById("toolSpecs").innerHTML =
    specs.map(item => `<li>${item.trim()}</li>`).join("");

  document.querySelector(".whatsapp-btn").href =
    `https://wa.me/919500121457?text=Hello%20Nexam%20Tools,%20I%20need%20quotation%20for%20${encodeURIComponent(title)}`;

  document.getElementById("toolModal").style.display = "flex";
}

function closeTool() {
  document.getElementById("toolModal").style.display = "none";
}

/* Close modal on outside click */
window.onclick = function (e) {
  const modal = document.getElementById("toolModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }

  // Close modal on ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const modal = document.getElementById("toolModal");
    if (modal.style.display === "flex") {
      modal.style.display = "none";
    }
  }
})

};



