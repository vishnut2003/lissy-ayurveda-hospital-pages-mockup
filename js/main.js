/* =========================================================
   LAHPC — Home page interactions
   ========================================================= */
(function () {
  "use strict";

  const WHATSAPP_NUMBER = "919037555036"; // +91 9037 555 036

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navBackdrop = document.getElementById("navBackdrop");
  const toTop = document.getElementById("toTop");
  // Active state is set per page in the HTML (nav links point to separate pages).

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  function closeNav() {
    nav.classList.remove("is-open");
    navBackdrop.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openNav() {
    nav.classList.add("is-open");
    navBackdrop.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  navToggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? closeNav() : openNav();
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav();
  });

  navBackdrop.addEventListener("click", closeNav);

  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("is-open") &&
      !nav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });

  /* ---------- Header shadow, back-to-top, active link ---------- */
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 10);
    toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Appointment form → WhatsApp ---------- */
  const form = document.getElementById("appointmentForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("is-error");

      const data = Object.fromEntries(new FormData(form).entries());
      let valid = true;

      ["name", "phone"].forEach((field) => {
        const input = form.elements[field];
        const ok = input.value.trim() !== "" && input.checkValidity();
        input.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        status.textContent = "Please enter your name and a valid phone number.";
        status.classList.add("is-error");
        return;
      }

      const lines = [
        "Hello LAHPC, I would like to book an appointment.",
        "",
        "Name: " + data.name.trim(),
        "Phone: " + data.phone.trim(),
      ];
      if (data.date) lines.push("Preferred date: " + data.date);
      if (data.treatment) lines.push("Treatment / concern: " + data.treatment);
      if (data.message && data.message.trim()) lines.push("Message: " + data.message.trim());

      const url =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));

      window.open(url, "_blank", "noopener");
      status.textContent = "Opening WhatsApp with your request. We will call you back shortly.";
      form.reset();
    });

    form.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("is-invalid"));
    });
  }
})();
