/* =========================================================================
   RANK AND REACH HUB — MAIN JAVASCRIPT
   Plain vanilla JS, no libraries/frameworks. Loaded on every page.
   Sections:
   1. Mobile menu toggle
   2. Sticky header shadow on scroll
   3. Back-to-top button
   4. Scroll-reveal animations (IntersectionObserver)
   5. FAQ accordion
   6. Contact form (front-end only demo handling)
   7. Newsletter form (front-end only demo handling)
   8. Live chat placeholder toggle
   9. Portfolio filter (only runs if filter buttons exist on the page)
   10. Active nav link highlighting
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------------------------------
     1. MOBILE MENU TOGGLE
     Toggles the .mobile-menu panel and updates aria-expanded for
     screen-reader users.
  ----------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    /* Close the mobile menu when a link inside it is clicked */
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -----------------------------------------------------------------
     2. STICKY HEADER SHADOW ON SCROLL
     Adds a slightly darker background once the page has scrolled,
     purely a visual polish effect.
  ----------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.style.background = "rgba(5, 7, 15, 0.92)";
    } else {
      header.style.background = "rgba(5, 7, 15, 0.7)";
    }
  }
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* -----------------------------------------------------------------
     3. BACK TO TOP BUTTON
     Shows the button after scrolling down 400px, scrolls smoothly
     back to the top when clicked.
  ----------------------------------------------------------------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 400) {
          backToTop.classList.add("visible");
        } else {
          backToTop.classList.remove("visible");
        }
      },
      { passive: true }
    );

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -----------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     Any element with the class "reveal" will fade/slide into view
     the first time it enters the viewport.
  ----------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* Fallback: if IntersectionObserver isn't supported, just show everything */
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* -----------------------------------------------------------------
     5. FAQ ACCORDION
     Clicking a question expands its answer and collapses the others
     within the same FAQ list.
  ----------------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      /* Close every other item in the same accordion group */
      var group = item.closest(".faq-list");
      if (group) {
        group.querySelectorAll(".faq-item.open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".faq-answer").style.maxHeight = null;
            openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          }
        });
      }

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
        question.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* -----------------------------------------------------------------
     6. CONTACT FORM (front-end only demo handling)
     Prevents the default page reload, does a very light validation,
     then shows a success message. Replace this with a real form
     submission (e.g. fetch() to your backend or a form service like
     Formspree) when you're ready to go live.
  ----------------------------------------------------------------- */
  var contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var successBox = document.querySelector("#contact-success");

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      var formData = new FormData(contactForm);
      var encoded = new URLSearchParams(formData).toString();

      // Netlify Forms: submit the encoded form data to "/" so Netlify's
      // build-time form detection (data-netlify="true" on the <form>)
      // picks up and stores the submission.
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encoded
      })
        .then(function () {
          if (successBox) {
            successBox.classList.add("visible");
            successBox.textContent = "Thanks! Your message has been received — we'll reply within 24 hours.";
          }
          contactForm.reset();
        })
        .catch(function () {
          if (successBox) {
            successBox.classList.add("visible");
            successBox.textContent = "Something went wrong sending your message. Please email razaworkspro@gmail.com directly or try again.";
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  }

  /* -----------------------------------------------------------------
     7. NEWSLETTER FORM (front-end only demo handling)
     Same idea as the contact form: swap in your real email provider
     (Mailchimp, ConvertKit, etc.) API call later.
  ----------------------------------------------------------------- */
  document.querySelectorAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (note) {
        note.textContent = "You're subscribed! Watch your inbox for SEO tips.";
        note.style.color = "#34d399";
      }
      form.reset();
    });
  });

  /* -----------------------------------------------------------------
     8. LIVE CHAT PLACEHOLDER TOGGLE
     This is a placeholder panel only — connect a real provider like
     Tawk.to, Crisp, or Intercom later by replacing this block with
     their embed script.
  ----------------------------------------------------------------- */
  var chatBtn = document.querySelector(".chat-btn");
  var chatPanel = document.querySelector(".chat-panel");
  var chatClose = document.querySelector(".chat-panel-close");

  if (chatBtn && chatPanel) {
    chatBtn.addEventListener("click", function () {
      chatPanel.classList.toggle("open");
    });
  }
  if (chatClose && chatPanel) {
    chatClose.addEventListener("click", function () {
      chatPanel.classList.remove("open");
    });
  }

  /* -----------------------------------------------------------------
     9. PORTFOLIO FILTER
     Only runs on the Portfolio page, where .filter-btn and
     .portfolio-item elements exist.
  ----------------------------------------------------------------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var filter = btn.getAttribute("data-filter");
        portfolioItems.forEach(function (item) {
          var category = item.getAttribute("data-category");
          if (filter === "all" || filter === category) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  /* -----------------------------------------------------------------
     10. ACTIVE NAV LINK HIGHLIGHTING
     Compares the current page filename against each nav link's href
     and marks the matching one as active — helps users (and search
     engines reading rendered markup) understand where they are.
  ----------------------------------------------------------------- */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* -----------------------------------------------------------------
     11. SAMPLE SEO DASHBOARD — animated count-up numbers
     Purely a display animation for the illustrative example figures
     shown in the hero dashboard (clearly labeled on-page as sample
     data) — it does not fetch or represent real client results.
  ----------------------------------------------------------------- */
  var dashboard = document.querySelector("#seo-dashboard");
  if (dashboard) {
    var countEls = dashboard.querySelectorAll(".count-up");
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var formatCount = function (value, format) {
      if (format === "k") {
        return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
      }
      return Math.round(value).toLocaleString("en-US");
    };

    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var format = el.getAttribute("data-format");

      if (prefersReducedMotion) {
        el.textContent = prefix + formatCount(target, format) + suffix;
        return;
      }

      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = prefix + formatCount(target * eased, format) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var dashboardObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              countEls.forEach(animateCount);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      dashboardObserver.observe(dashboard);
    } else {
      countEls.forEach(animateCount);
    }
  }

});
