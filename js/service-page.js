/* ================================================
   SERVICE-PAGE.JS — Dynamic Service Page Renderer
   Only loaded on service inner pages
   ================================================ */

(function () {
  'use strict';

  // ── Step 1: Detect current page identity ──
  var currentSlug = window.location.pathname.split('/').pop();
  var pathParts = window.location.pathname.split('/');
  var currentFolder = pathParts[pathParts.length - 2] || '';

  // ── Step 2: Base path ──
  function getBasePath() {
    if (window.location.protocol === 'file:') {
      var p = window.location.pathname.toLowerCase();
      if (p.includes('/services/')) return '../../';
      return './';
    }
    var depth = window.location.pathname.replace(/\/[^/]*\.html?$/i, '').replace(/\/$/, '').split('/').filter(Boolean).length;
    return depth > 0 ? '../'.repeat(depth) : './';
  }
  var BASE = getBasePath();

  // ── Step 3: Fetch JSON ──
  fetch(BASE + 'data/services.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var category = data.categories.find(function (c) { return c.folder === currentFolder; });
      if (!category) return;
      var service = category.services.find(function (s) { return s.slug === currentSlug; });
      if (!service) return;
      renderServicePage(service, category, data, BASE);
    })
    .catch(function (err) { console.error('Service page load error:', err); });

  // ── Step 4: Render ──
  function renderServicePage(service, category, allData, BASE) {

    // Page title
    document.title = service.title + ' | Shriii Tracking Solution';
    var metaDesc = document.getElementById('sp-meta-desc');
    if (metaDesc) metaDesc.setAttribute('content', service.tagline + ' — ' + service.overview.substring(0, 140));

    // ── Hero ──
    var heroEl = document.getElementById('sp-hero');
    if (heroEl) {
      heroEl.innerHTML = '<div class="container"><div class="row align-items-center"><div class="col-lg-8" data-aos="fade-up">' +
        '<h1>' + service.title + '</h1>' +
        '<p class="tagline" data-aos="fade-up" data-aos-delay="100">' + service.tagline + '</p>' +
        '</div></div></div>';
    }

    // ── Breadcrumb ──
    var bcEl = document.getElementById('sp-breadcrumb');
    if (bcEl) {
      bcEl.innerHTML = '<div class="container"><ul class="breadcrumb-custom">' +
        '<li><a href="' + BASE + 'index.html">Home</a></li>' +
        '<li><iconify-icon icon="mdi:chevron-right"></iconify-icon></li>' +
        '<li>' + category.label + '</li>' +
        '<li><iconify-icon icon="mdi:chevron-right"></iconify-icon></li>' +
        '<li class="current">' + service.title + '</li>' +
        '</ul></div>';
    }

    // ── Overview ──
    var ovEl = document.getElementById('sp-overview');
    if (ovEl) {
      var highlights = '';
      if (service.features && service.features.length >= 3) {
        highlights = '<ul class="overview-highlights">';
        for (var i = 0; i < 3; i++) {
          highlights += '<li><iconify-icon icon="mdi:check-circle"></iconify-icon> ' + service.features[i].title + '</li>';
        }
        highlights += '</ul>';
      }
      ovEl.innerHTML = '<div class="container"><div class="row align-items-center g-5">' +
        '<div class="col-lg-6" data-aos="fade-right"><h2 class="mb-3">Overview</h2><p style="color:var(--text-muted)">' + service.overview + '</p>' + highlights + '</div>' +
        '<div class="col-lg-6" data-aos="fade-left"><div class="overview-decoration"></div></div>' +
        '</div></div>';
    }

    // ── Features ──
    var ftEl = document.getElementById('sp-features');
    if (ftEl && service.features) {
      var cards = '';
      service.features.forEach(function (f, idx) {
        cards += '<div class="feature-card depthParrent" data-aos="fade-up" data-aos-delay="' + (idx % 3 * 100) + '">' +
          '<div class="icon-box"><iconify-icon icon="' + f.icon + '"></iconify-icon></div>' +
          '<h4>' + f.title + '</h4><p>' + f.desc + '</p> <div class="overlayDepth"></div> </div>';
      });
      ftEl.innerHTML = '<div class="container"><div class="section-heading text-center" data-aos="fade-up"><h2>What\'s Included</h2><p>Everything you need for top-tier results.</p></div>' +
        '<div class="features-grid">' + cards + '</div></div>';
    }

    // ── Process ──
    var prEl = document.getElementById('sp-process');
    if (prEl && service.process) {
      var steps = '';
      service.process.forEach(function (p, idx) {
        steps += '<div class="process-step" data-aos="fade-up" data-aos-delay="' + (idx * 150) + '">' +
          '<div class="step-badge">' + p.step + '</div>'+
          '<h4>' + p.title + '</h4><p>' + p.desc + '</p></div>';
      });
      prEl.innerHTML = '<div class="container"><div class="section-heading text-center" data-aos="fade-up"><h2>How We Do It</h2><p>Our proven 4-step process for success.</p></div>' +
        '<div class="process-timeline">' + steps + '</div></div>';
      prEl.style.background = 'rgba(176,122,255,0.03)';
    }

    // ── Benefits ──
    var bnEl = document.getElementById('sp-benefits');
    if (bnEl && service.benefits) {
      var bCards = '';
      service.benefits.forEach(function (b, idx) {
        bCards += '<div class="col-md-4" data-aos="fade-up" data-aos-delay="' + (idx * 100) + '">' +
          '<div class="benefit-card depthParrent"><iconify-icon icon="' + b.icon + '" style="font-size:1.8rem; margin-left:auto; margin-right:auto; display:inline-block"></iconify-icon>' +
          '<h4>' + b.title + '</h4><p>' + b.desc + '</p> <div class="overlayDepth"></div> </div></div>';
      });
      bnEl.innerHTML = '<div class="container"><div class="section-heading text-center" data-aos="fade-up"><h2>Why Choose Us For This</h2><p>Competitive advantages that set us apart.</p></div>' +
        '<div class="row g-4">' + bCards + '</div></div>';
    }

    // ── FAQ ──
    var faqEl = document.getElementById('sp-faq');
    if (faqEl && service.faqs) {
      var items = '';
      service.faqs.forEach(function (faq, idx) {
        var id = 'spFaq' + idx;
        items += '<div class="accordion-item"><h2 class="accordion-header">' +
          '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' + id + '">' + faq.q + '</button></h2>' +
          '<div id="' + id + '" class="accordion-collapse collapse" data-bs-parent="#spFaqAcc">' +
          '<div class="accordion-body">' + faq.a + '</div></div></div>';
      });
      faqEl.innerHTML = '<div class="container"><div class="section-heading text-center" data-aos="fade-up"><h2>Common Questions</h2><p>Find answers to frequently asked questions.</p></div>' +
        '<div class="accordion faq-accordion" id="spFaqAcc">' + items + '</div></div>';
    }

    // ── Related Services ──
    var relEl = document.getElementById('sp-related');
    if (relEl && service.relatedServiceIds && service.relatedServiceIds.length) {
      var relCards = '';
      service.relatedServiceIds.forEach(function (rid) {
        // Search all categories
        allData.categories.forEach(function (cat) {
          var found = cat.services.find(function (s) { return s.id === rid; });
          if (found) {
            var desc = found.overview ? found.overview.split('.')[0] + '.' : '';
            relCards += '<div class="col-md-4" data-aos="fade-up">' +
              '<div class="related-card depthParrent"><span class="cat-chip">' + cat.label + '</span>' +
              '<h4>' + found.title + '</h4><p>' + desc + '</p>' +
              '<a class="learn-link" href="' + BASE + 'services/' + cat.folder + '/' + found.slug + '">Learn More →</a>' +
              '<div class="overlayDepth"></div> </div></div>';
          }
        });
      });
      if (relCards) {
        relEl.innerHTML = '<div class="container"><div class="section-heading text-center" data-aos="fade-up"><h2>You May Also Like</h2><p>Explore related services.</p></div>' +
          '<div class="row g-4">' + relCards + '</div></div>';
      }
    }

    // Refresh AOS for injected content
    if (typeof AOS !== 'undefined') {
      setTimeout(function () { AOS.refresh(); }, 100);
    }
  }

})();
