// ── Border marks around the opón, drawn rather than decorated. ──
// (Original logic from the client's file, unchanged.)
(function drawTrayMarks() {
  var g = document.getElementById("hmarks");
  if (!g) return;
  var n = 48,
    cx = 200,
    cy = 200,
    r1 = 150,
    r2 = 139;
  var out = "";
  for (var i = 0; i < n; i++) {
    var a = i * ((2 * Math.PI) / n) - Math.PI / 2;
    var inner = i % 3 === 0 ? 131 : r2;
    out +=
      '<path d="M' +
      (cx + Math.cos(a) * r1).toFixed(1) +
      " " +
      (cy + Math.sin(a) * r1).toFixed(1) +
      " L" +
      (cx + Math.cos(a) * inner).toFixed(1) +
      " " +
      (cy + Math.sin(a) * inner).toFixed(1) +
      '" opacity="' +
      (i % 3 === 0 ? "1" : ".5") +
      '"/>';
  }
  g.innerHTML = out;
})();

// ── Header gains a shadow once the page has scrolled past the hero ──
(function headerScrollState() {
  var header = document.querySelector("header");
  if (!header) return;
  var onScroll = function () {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ── Scroll-reveal for sections and cards ──
// Progressive enhancement: elements are only ever hidden by JS adding
// the .reveal class, and anything already on screen at load is shown
// immediately (no flash), so a failed script never hides content.
(function scrollReveal() {
  var targets = document.querySelectorAll(
    [
      "#story .story > *",
      "#how .flow .fcard",
      "#how .routes > div",
      "#path .twin > div",
      "#membership .memWhy > *",
      "#membership .tier",
      "#house .house > div",
      "#testimony .tst figure",
      "#contact .cgrid > div",
    ].join(",")
  );
  if (!targets.length) return;

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var groups = {};
  targets.forEach(function (el) {
    var parentKey =
      el.parentElement && el.parentElement.className
        ? el.parentElement.className
        : "default";
    groups[parentKey] = groups[parentKey] || 0;
    var indexInGroup = groups[parentKey]++;
    el.classList.add("reveal");
    if (!reduceMotion) {
      el.style.setProperty(
        "--reveal-delay",
        Math.min(indexInGroup * 0.08, 0.4) + "s"
      );
    }
  });

  var revealNow = function (el) {
    el.classList.add("in-view");
  };

  // Anything already visible on load shows right away, no animation wait.
  var vh = window.innerHeight;
  var toObserve = [];
  targets.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.92) {
      revealNow(el);
    } else {
      toObserve.push(el);
    }
  });

  if (!("IntersectionObserver" in window)) {
    toObserve.forEach(revealNow);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  toObserve.forEach(function (el) {
    observer.observe(el);
  });
})();

// ── Back-to-top control ──
(function backToTop() {
  var btn = document.createElement("button");
  btn.className = "toTop";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  document.body.appendChild(btn);

  var onScroll = function () {
    if (window.scrollY > 640) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  });
})();
