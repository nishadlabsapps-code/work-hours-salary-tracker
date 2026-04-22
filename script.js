const currentPage = document.body.dataset.page;
const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".nav-toggle");
const navMenuLinks = document.querySelectorAll(".nav-menu a");
const navLinks = document.querySelectorAll(".nav-menu a[data-nav]");
const revealItems = document.querySelectorAll(".reveal");

navLinks.forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add("is-active");
  }
});

navMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navbar || !navToggle) {
      return;
    }

    navbar.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

if (navToggle && navbar) {
  navToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 820 && navbar && navToggle) {
    navbar.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll(".ripple-link").forEach((element) => {
  element.addEventListener("click", (event) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    element.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

const previewImages = Array.from(document.querySelectorAll("[data-preview-image]"));
const previewControls = Array.from(document.querySelectorAll("[data-preview-control]"));
let previewIndex = 0;
let previewTimer = null;

function setPreviewSlide(index) {
  if (!previewImages.length) {
    return;
  }

  previewIndex = index;

  previewImages.forEach((image, imageIndex) => {
    image.classList.toggle("is-active", imageIndex === index);
  });

  previewControls.forEach((control) => {
    control.classList.toggle("is-active", Number(control.dataset.previewControl) === index);
  });
}

function startPreviewSlider() {
  if (previewImages.length < 2) {
    return;
  }

  previewTimer = window.setInterval(() => {
    const nextIndex = (previewIndex + 1) % previewImages.length;
    setPreviewSlide(nextIndex);
  }, 3200);
}

function resetPreviewSlider() {
  if (previewTimer) {
    window.clearInterval(previewTimer);
  }

  startPreviewSlider();
}

previewControls.forEach((control) => {
  control.addEventListener("click", () => {
    setPreviewSlide(Number(control.dataset.previewControl));
    resetPreviewSlider();
  });
});

if (previewImages.length) {
  setPreviewSlide(0);
  startPreviewSlider();
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryTriggers = document.querySelectorAll("[data-lightbox-image]");

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

if (lightbox && lightboxImage && lightboxCaption) {
  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const imageSrc = trigger.dataset.lightboxImage;
      const imageTitle = trigger.dataset.lightboxTitle || "";

      lightboxImage.src = imageSrc;
      lightboxImage.alt = imageTitle;
      lightboxCaption.textContent = imageTitle;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    });
  });

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener("click", closeLightbox);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}
