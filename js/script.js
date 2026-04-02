/* ================================================
   SCRIPT.JS — Shared Utilities
   Loaded on ALL pages after critical.js
   ================================================ */

(function () {
  'use strict';

  // ── 1 & 2. AOS & Counter Initialization ──
  function easeOutQuad(t) { return t * (2 - t); }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = Math.floor(easeOutQuad(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  function initAnimations() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ once: true, duration: 800, offset: 60, easing: 'ease-out-cubic' });
      setTimeout(function () { AOS.refresh(); }, 200);
    }
    document.querySelectorAll('.stat-counter').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // Start animations only after preloader is successfully dismissed
  if (document.body.classList.contains('loaded')) {
    initAnimations();
  } else {
    document.addEventListener('loaderDismissed', initAnimations);
  }

  // ── 3. Debounced Resize ──
  function debounce(fn, wait) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }

  window.addEventListener('resize', debounce(function () {
    if (typeof AOS !== 'undefined') AOS.refresh();
  }, 250));

  // ── 4. Back to Top ──
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      backBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 5. Custom Cursor (desktop only) ──
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        if (!cursor.classList.contains('active')) cursor.classList.add('active');
      });

      document.addEventListener('mouseover', function (e) {
        if (e.target.closest('a, button, .btn, input, select, textarea, label')) {
          cursor.classList.add('hovered');
        }
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest('a, button, .btn, input, select, textarea, label')) {
          cursor.classList.remove('hovered');
        }
      });
    }
  }

  // ── 6. WhatsApp Link ──
  function setWhatsAppLinks() {
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
    var base = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    var url = base + '?phone=916354710794&text=Hi%2C%20I%27m%20interested%20in%20your%20services.';
    document.querySelectorAll('.whatsapp-link').forEach(function (el) {
      el.setAttribute('href', url);
    });
  }
  setWhatsAppLinks();
  window.addEventListener('resize', debounce(setWhatsAppLinks, 300));

  // ── 7. Swiper Init (testimonials) ──
  if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-next', prevEl: '.swiper-prev' },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

})();
