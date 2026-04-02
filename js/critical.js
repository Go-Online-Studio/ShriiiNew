/* ================================================
   CRITICAL.JS — Navbar + Footer Injection
   Loaded FIRST on every page
   ================================================ */

(function () {
  'use strict';

  // ── Preloader Dismissal ──
  function removePreloader() {
    if (document.body.classList.contains('loaded')) return;
    document.body.classList.add('loaded');
    document.dispatchEvent(new CustomEvent('loaderDismissed'));
    
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.remove(), 600);
    }
  }

  if (document.readyState === 'complete') {
    removePreloader();
  } else {
    window.addEventListener('load', removePreloader);
    // Fallback if load event fails to fire
    setTimeout(removePreloader, 4000);
  }

  // ── Base Path Detection ──
  function getBasePath() {
    const path = window.location.pathname;
    const segments = path.replace(/\/[^/]*$/, '').split('/').filter(Boolean);
    // For local file:// protocol or root-level pages
    if (window.location.protocol === 'file:') {
      const htmlFile = path.split('/').pop();
      // If file is in services/subfolder/ → need ../../
      // Check by looking at the path structure
      const pathLower = path.toLowerCase();
      if (pathLower.includes('/services/')) return '../../';
      return './';
    }
    // For server
    const depth = path.replace(/\/[^/]*\.html?$/i, '').replace(/\/$/, '').split('/').filter(Boolean).length;
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  const BASE = getBasePath();

  // ── Navbar Injection ──
  const navbarEl = document.getElementById('mainNavbar');
  if (navbarEl) {
    navbarEl.innerHTML = `
      <div class="container">
        <a class="navbar-brand" href="${BASE}index.html">
          <img src="${BASE}images/BrandLogo.webp" alt="Shriii Tracking Solution">
        </a>

        <button class="navbar-toggler border-0 d-lg-none" type="button"
                data-bs-toggle="offcanvas" data-bs-target="#mobileNav"
                aria-controls="mobileNav" aria-label="Toggle navigation">
          <iconify-icon icon="mdi:menu" style="font-size:1.6rem;color:var(--primary)"></iconify-icon>
        </button>

        <div class="collapse navbar-collapse d-none d-lg-flex justify-content-end align-items-center" id="desktopNav">
          <ul class="navbar-nav align-items-center gap-1">
            <li class="nav-item">
              <a class="nav-link" href="${BASE}index.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${BASE}about.html">About</a>
            </li>

            <!-- Mega Dropdown — Services -->
            <li class="nav-item dropdown mega-dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">Services</a>
              <div class="mega-menu dropdown-menu">
                <div class="mega-menu-col">
                  <h6><iconify-icon icon="mdi:monitor-code"></iconify-icon> Web Development</h6>
                  <a href="${BASE}services/web-development/wordpress-development.html">WordPress Development</a>
                  <a href="${BASE}services/web-development/custom-web-development.html">Custom Web Development</a>
                  <a href="${BASE}services/web-development/ecommerce-development.html">E-Commerce Development</a>
                  <a href="${BASE}services/web-development/landing-page-design.html">Landing Page Design</a>
                </div>
                <div class="mega-menu-col">
                  <h6><iconify-icon icon="mdi:magnify"></iconify-icon> SEO Services</h6>
                  <a href="${BASE}services/seo/local-seo.html">Local SEO</a>
                  <a href="${BASE}services/seo/on-page-seo.html">On-Page SEO</a>
                  <a href="${BASE}services/seo/off-page-seo.html">Off-Page SEO</a>
                  <a href="${BASE}services/seo/technical-seo.html">Technical SEO</a>
                </div>
                <div class="mega-menu-col">
                  <h6><iconify-icon icon="mdi:google-maps"></iconify-icon> GMB Services</h6>
                  <a href="${BASE}services/gmb-services/gmb-setup-optimization.html">GMB Setup &amp; Optimization</a>
                  <a href="${BASE}services/gmb-services/gmb-management.html">GMB Management</a>
                  <a href="${BASE}services/gmb-services/gmb-review-management.html">Review Management</a>
                </div>
                <div class="mega-menu-col">
                  <h6><iconify-icon icon="mdi:palette"></iconify-icon> Graphic Design</h6>
                  <a href="${BASE}services/graphic-design/logo-design.html">Logo Design</a>
                  <a href="${BASE}services/graphic-design/branding-identity.html">Branding &amp; Identity</a>
                  <a href="${BASE}services/graphic-design/social-media-design.html">Social Media Design</a>
                  <a href="${BASE}services/graphic-design/print-design.html">Print Design</a>
                </div>
              </div>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="${BASE}career.html">Career</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${BASE}contact.html">Contact</a>
            </li>
            <li class="nav-item ms-2">
              <a class="btn btn-primary-custom" href="${BASE}contact.html">Get Free Audit →</a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  // ── Mobile Offcanvas Injection ──
  const mobileNavEl = document.getElementById('mobileNav');
  if (mobileNavEl) {
    mobileNavEl.innerHTML = `
      <div class="offcanvas-header">
        <a class="navbar-brand" href="${BASE}index.html">
          <img src="${BASE}images/BrandLogo.webp" alt="Shriii Tracking Solution" style="height:36px;width:auto;">
        </a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column">
        <ul class="navbar-nav flex-grow-1">
          <li class="nav-item"><a class="nav-link" href="${BASE}index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="${BASE}about.html">About</a></li>
          <li class="nav-item">
            <div class="accordion" id="mobileServicesAcc">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button"
                          data-bs-toggle="collapse" data-bs-target="#mobServices">Services</button>
                </h2>
                <div id="mobServices" class="accordion-collapse collapse" data-bs-parent="#mobileServicesAcc">
                  <div class="accordion-body">
                    <strong class="d-block mb-1" style="color:var(--primary);font-size:0.85rem;">Web Development</strong>
                    <a href="${BASE}services/web-development/wordpress-development.html">WordPress Development</a>
                    <a href="${BASE}services/web-development/custom-web-development.html">Custom Web Development</a>
                    <a href="${BASE}services/web-development/ecommerce-development.html">E-Commerce Development</a>
                    <a href="${BASE}services/web-development/landing-page-design.html">Landing Page Design</a>

                    <strong class="d-block mt-2 mb-1" style="color:var(--primary);font-size:0.85rem;">SEO Services</strong>
                    <a href="${BASE}services/seo/local-seo.html">Local SEO</a>
                    <a href="${BASE}services/seo/on-page-seo.html">On-Page SEO</a>
                    <a href="${BASE}services/seo/off-page-seo.html">Off-Page SEO</a>
                    <a href="${BASE}services/seo/technical-seo.html">Technical SEO</a>

                    <strong class="d-block mt-2 mb-1" style="color:var(--primary);font-size:0.85rem;">GMB Services</strong>
                    <a href="${BASE}services/gmb-services/gmb-setup-optimization.html">GMB Setup &amp; Optimization</a>
                    <a href="${BASE}services/gmb-services/gmb-management.html">GMB Management</a>
                    <a href="${BASE}services/gmb-services/gmb-review-management.html">Review Management</a>

                    <strong class="d-block mt-2 mb-1" style="color:var(--primary);font-size:0.85rem;">Graphic Design</strong>
                    <a href="${BASE}services/graphic-design/logo-design.html">Logo Design</a>
                    <a href="${BASE}services/graphic-design/branding-identity.html">Branding &amp; Identity</a>
                    <a href="${BASE}services/graphic-design/social-media-design.html">Social Media Design</a>
                    <a href="${BASE}services/graphic-design/print-design.html">Print Design</a>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item"><a class="nav-link" href="${BASE}career.html">Career</a></li>
          <li class="nav-item"><a class="nav-link" href="${BASE}contact.html">Contact</a></li>
        </ul>
        <a class="btn btn-primary-main w-100 mt-3" href="${BASE}contact.html">Get Free Audit →</a>
      </div>
    `;
  }

  // ── Footer Injection ──
  const footerEl = document.getElementById('footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="footer-brand">
              <img src="${BASE}images/BrandLogoWhite.webp" alt="Shriii Tracking Solution">
            </div>
            <p class="footer-tagline">Empowering local businesses to thrive online.</p>
            <div class="footer-social">
              <a href="#" aria-label="Facebook"><iconify-icon icon="mdi:facebook"></iconify-icon></a>
              <a href="#" aria-label="Instagram"><iconify-icon icon="mdi:instagram"></iconify-icon></a>
              <a href="#" aria-label="LinkedIn"><iconify-icon icon="mdi:linkedin"></iconify-icon></a>
              <a href="#" aria-label="YouTube"><iconify-icon icon="mdi:youtube"></iconify-icon></a>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 widthControl1">
            <h5>Quick Links</h5>
            <ul class="footer-links">
              <li><a href="${BASE}index.html">Home</a></li>
              <li><a href="${BASE}about.html">About Us</a></li>
              <li><a href="${BASE}career.html">Career</a></li>
              <li><a href="${BASE}contact.html">Contact Us</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6 widthControl2">
            <h5>Our Services</h5>
            <ul class="footer-links">
              <li><a href="${BASE}services/web-development/wordpress-development.html">WordPress Development</a></li>
              <li><a href="${BASE}services/seo/local-seo.html">Local SEO</a></li>
              <li><a href="${BASE}services/gmb-services/gmb-setup-optimization.html">GMB Setup &amp; Optimization</a></li>
              <li><a href="${BASE}services/graphic-design/logo-design.html">Logo Design</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6">
            <h5>Locate Us</h5>
            <p style="margin-bottom:0.5rem;">
              <iconify-icon icon="mdi:phone-outline" style="color:var(--accent-bright)"></iconify-icon>
              <a href="tel:+916354710794">+91 63547 10794</a>
            </p>
            <p style="margin-bottom:0.5rem;">
              <iconify-icon icon="mdi:phone-outline" style="color:var(--accent-bright)"></iconify-icon>
              <a href="tel:+917990909711">+91 79909 09711</a>
            </p>
            <p style="margin-bottom:0.5rem;">
              <iconify-icon icon="mdi:email-outline" style="color:var(--accent-bright)"></iconify-icon>
              <a href="mailto:contact@shriiitrackingsolutions.com">contact@shriiitrackingsolutions.com</a>
            </p>
            <p style="margin-bottom:0.5rem;">
              <iconify-icon icon="mdi:map-marker-outline" style="color:var(--accent-bright)"></iconify-icon>
              <a href="https://maps.app.goo.gl/YourLink" target="_blank">TF-A1-22, Akshar Pavilion Mall, Near Priya Cinema, Vasna Bhyali Main Road, Vadodara, 391410</a>
            </p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        Copyright © <span id="ftYear"></span> All Rights Reserved by Shriii Tracking Solution.
      </div>
    `;
    const ftY = document.getElementById('ftYear');
    if (ftY) ftY.textContent = new Date().getFullYear();
  }

  // ── Active Link Detection ──
  function setActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link, .mega-menu a, .offcanvas .nav-link, .offcanvas .accordion-body a').forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href') || '';
      var linkFile = href.split('/').pop();
      if (linkFile === current) {
        link.classList.add('active');
        var parentToggle = link.closest('.mega-dropdown');
        if (parentToggle) {
          var toggle = parentToggle.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }
  setActiveLink();

  // ── Navbar Scroll Behavior ──
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('mainNavbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 18);
  }, { passive: true });

  // trigger once on load
  if (window.scrollY > 18) {
    var nav = document.getElementById('mainNavbar');
    if (nav) nav.classList.add('scrolled');
  }

  // ── Smooth Scroll (anchor links) ──
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === '#') { e.preventDefault(); return; }
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      var navH = document.getElementById('mainNavbar') ? document.getElementById('mainNavbar').offsetHeight : 70;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
      // Close offcanvas if open
      var offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileNav'));
      if (offcanvas) offcanvas.hide();
    }
  });

})();
