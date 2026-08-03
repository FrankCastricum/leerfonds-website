// ============ Leerfonds.nl — shared script ============

document.addEventListener("DOMContentLoaded", function () {
  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded);
    });
    // Close menu when a link is clicked (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  // ---- Highlight active nav link (scroll-spy for one-page site) ----
  var navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  var sections = Array.prototype.slice
    .call(navLinks)
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ---- Set footer year ----
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Toon "Zo ja, welke financieringsbronnen" alleen als "Ja" is gekozen ----
  var financieringJa = document.getElementById("financiering-ja");
  var financieringNee = document.getElementById("financiering-nee");
  var welkeFinancieringGroup = document.getElementById("welke-financiering-group");
  var welkeFinancieringField = document.getElementById("welke-financiering");

  if (financieringJa && financieringNee && welkeFinancieringGroup && welkeFinancieringField) {
    var toggleWelkeFinanciering = function () {
      if (financieringJa.checked) {
        welkeFinancieringGroup.style.display = "";
        welkeFinancieringField.required = true;
      } else {
        welkeFinancieringGroup.style.display = "none";
        welkeFinancieringField.required = false;
        welkeFinancieringField.value = "";
      }
    };
    financieringJa.addEventListener("change", toggleWelkeFinanciering);
    financieringNee.addEventListener("change", toggleWelkeFinanciering);
  }

  // ---- Subsidie-aanvraag form handling (FormSubmit AJAX) ----
  var form = document.getElementById("subsidy-form");
  if (form) {
    var statusBox = document.getElementById("form-status");
    var submitBtn = form.querySelector("button[type=submit]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic native validation first
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Versturen...";
      statusBox.className = "form-status";
      statusBox.textContent = "";

      var formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            statusBox.classList.add("success");
            statusBox.textContent =
              "Bedankt! Uw aanvraag is verstuurd. We nemen binnen 4 tot 6 weken contact met u op.";
            form.reset();
          } else {
            throw new Error("Verzenden mislukt");
          }
        })
        .catch(function () {
          statusBox.classList.add("error");
          statusBox.textContent =
            "Er ging iets mis bij het versturen. Probeer het opnieuw of mail naar info@leerfonds.nl.";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Aanvraag indienen";
        });
    });
  }

  // ---- Contact form handling (FormSubmit AJAX) ----
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var cStatus = document.getElementById("contact-form-status");
    var cBtn = contactForm.querySelector("button[type=submit]");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      cBtn.disabled = true;
      cBtn.textContent = "Versturen...";
      cStatus.className = "form-status";
      cStatus.textContent = "";

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            cStatus.classList.add("success");
            cStatus.textContent = "Bedankt voor uw bericht! We reageren zo snel mogelijk.";
            contactForm.reset();
          } else {
            throw new Error("Verzenden mislukt");
          }
        })
        .catch(function () {
          cStatus.classList.add("error");
          cStatus.textContent =
            "Er ging iets mis bij het versturen. Probeer het opnieuw of mail naar info@leerfonds.nl.";
        })
        .finally(function () {
          cBtn.disabled = false;
          cBtn.textContent = "Verstuur bericht";
        });
    });
  }
});
