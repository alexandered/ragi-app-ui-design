/* RAGI prototype helpers (no dependencies, works from file://).
   1. <i data-i="star"></i> becomes an inline Lucide icon (needs icons.js first).
   2. RAGI.setTextScale(1 | 1.3) applies the PRD's 130 % font-scaling check.
   3. Any [data-toggle-text] button flips the text scale. */
(function () {
  "use strict";
  var R = (window.RAGI = window.RAGI || {});

  R.icons = function (root) {
    (root || document).querySelectorAll("i[data-i]").forEach(function (el) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "icon " + (el.getAttribute("class") || ""));
      svg.setAttribute("aria-hidden", "true");
      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#i-" + el.getAttribute("data-i"));
      svg.appendChild(use);
      el.replaceWith(svg);
    });
  };

  R.setTextScale = function (s) {
    document.documentElement.style.setProperty("--ts", String(s));
    document.querySelectorAll("[data-toggle-text]").forEach(function (b) {
      b.setAttribute("aria-pressed", s > 1 ? "true" : "false");
    });
    try { sessionStorage.setItem("ragi-ts", String(s)); } catch (e) {}
  };

  document.addEventListener("DOMContentLoaded", function () {
    R.icons();
    var saved = 1;
    try { saved = Number(sessionStorage.getItem("ragi-ts")) || 1; } catch (e) {}
    R.setTextScale(saved);
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-toggle-text]");
      if (b) R.setTextScale(document.documentElement.style.getPropertyValue("--ts") === "1.3" ? 1 : 1.3);
    });
  });
})();
