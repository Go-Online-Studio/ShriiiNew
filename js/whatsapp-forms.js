/* ================================================
   WHATSAPP-FORMS.JS — Shared Form Handler
   Handles: #homeContactForm (index.html)
            #contactForm (contact.html)
   ================================================ */

(function () {
  'use strict';

  var WA_PHONE = '916354710794';
  var isMobile = false;

  /* ── Device Detection ── */
  function checkMobileStatus() {
    var ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    isMobile = ua || window.innerWidth <= 768;
  }

  /* ── Debounce ── */
  function debounce(fn, wait) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, wait); };
  }

  /* ── WhatsApp URL builder ── */
  function waUrl(message) {
    checkMobileStatus();
    var base = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    return base + '?phone=' + WA_PHONE + '&text=' + encodeURIComponent(message);
  }

  /* ── Re-check device on resize ── */
  window.addEventListener('resize', debounce(checkMobileStatus, 300));
  checkMobileStatus();

  /* ─────────────────────────────────────────
     TOAST
  ───────────────────────────────────────── */
  function injectToast() {
    if (document.getElementById('waFormToast')) return;
    var el = document.createElement('div');
    el.id = 'waFormToast';
    el.innerHTML = [
      '<iconify-icon icon="mdi:whatsapp"></iconify-icon>',
      '<div>',
      '  <div class="waf-toast-title">Redirecting to WhatsApp</div>',
      '  <div class="waf-toast-msg">Your message has been prepared.</div>',
      '</div>'
    ].join('');
    el.style.cssText = [
      'position:fixed;top:1.5rem;right:1.5rem;z-index:9999',
      'background:#fff;border-radius:16px;padding:1.1rem 1.5rem',
      'display:flex;align-items:center;gap:.8rem;max-width:360px',
      'box-shadow:0 20px 60px rgba(0,0,0,.12);border-left:4px solid #25d366',
      'transform:translateX(130%);transition:transform .4s ease'
    ].join(';');
    el.querySelector('iconify-icon').style.cssText = 'font-size:1.8rem;color:#25d366';
    el.querySelector('.waf-toast-title').style.cssText = 'font-weight:700;font-size:.95rem';
    el.querySelector('.waf-toast-msg').style.cssText = 'font-size:.82rem;color:#6b5f8a';
    document.body.appendChild(el);
  }

  function showToast() {
    var t = document.getElementById('waFormToast');
    if (!t) return;
    t.style.transform = 'translateX(0)';
    setTimeout(function () { t.style.transform = 'translateX(130%)'; }, 4000);
  }

  /* ─────────────────────────────────────────
     FIELD VALIDATION HELPERS
  ───────────────────────────────────────── */
  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function markField(id, ok) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('is-invalid', !ok);
    el.classList.toggle('is-valid', ok);

    // Show/hide hint beneath field
    var hint = el.parentElement.querySelector('.wa-invalid-hint');
    if (hint) hint.style.display = ok ? 'none' : 'block';
  }

  function clearForm(formEl) {
    formEl.reset();
    formEl.querySelectorAll('.is-invalid,.is-valid').forEach(function (el) {
      el.classList.remove('is-invalid', 'is-valid');
    });
  }

  /* ─────────────────────────────────────────
     INJECT VALIDATION HINT SPANS
  ───────────────────────────────────────── */
  function injectHint(inputId, msg) {
    var el = document.getElementById(inputId);
    if (!el || el.parentElement.querySelector('.wa-invalid-hint')) return;
    var span = document.createElement('div');
    span.className = 'wa-invalid-hint';
    span.textContent = msg;
    span.style.cssText = 'font-size:.78rem;color:#dc3545;margin-top:.25rem;display:none;padding-left:.2rem';
    el.parentElement.appendChild(span);
  }

  /* ─────────────────────────────────────────
     UPGRADE SUBMIT BUTTON → WhatsApp style
  ───────────────────────────────────────── */
  function upgradeSubmitBtn(btn) {
    if (!btn || btn.dataset.waUpgraded) return;
    btn.dataset.waUpgraded = '1';
    btn.innerHTML = '<iconify-icon icon="mdi:whatsapp" style="font-size:1.2rem;vertical-align:middle;margin-right:.4rem"></iconify-icon> Send via WhatsApp';
    btn.style.cssText = [
      'background:#25d366;color:#fff;border:none',
      'border-radius:50px;padding:.75rem 1.8rem',
      'font-weight:700;font-size:1rem;width:100%',
      'display:flex;align-items:center;justify-content:center;gap:.4rem',
      'transition:all .3s;cursor:pointer'
    ].join(';');
    btn.addEventListener('mouseover', function () {
      this.style.background = '#1da851';
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 12px 32px rgba(37,211,102,.35)';
    });
    btn.addEventListener('mouseout', function () {
      this.style.background = '#25d366';
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  }

  /* ─────────────────────────────────────────
     HOME CONTACT FORM  (#homeContactForm)
  ───────────────────────────────────────── */
  function initHomeForm() {
    var form = document.getElementById('homeContactForm');
    if (!form) return;

    // Add IDs to inputs (they lacked them)
    var inputs = form.querySelectorAll('input, select, textarea');
    var idMap = ['hcf-name', 'hcf-email', 'hcf-phone', 'hcf-service', 'hcf-message'];
    inputs.forEach(function (el, i) { if (idMap[i]) el.id = idMap[i]; });

    // Inject validation hints
    injectHint('hcf-name',    'Please enter your full name.');
    injectHint('hcf-email',   'Please enter a valid email address.');
    injectHint('hcf-phone',   'Please enter a valid phone number.');

    // Upgrade submit button
    upgradeSubmitBtn(form.querySelector('[type="submit"]'));

    // Inline validation feedback on blur
    ['hcf-name','hcf-email','hcf-phone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('blur', function () { validateHomeForm(); });
    });

    function validateHomeForm() {
      var name  = getVal('hcf-name');
      var email = getVal('hcf-email');
      var phone = getVal('hcf-phone');
      var nOk = name.length >= 2;
      var eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var pOk = /^[0-9+\s\-]{7,15}$/.test(phone);
      markField('hcf-name',  nOk);
      markField('hcf-email', eOk);
      markField('hcf-phone', pOk);
      return nOk && eOk && pOk;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateHomeForm()) return;

      var name    = getVal('hcf-name');
      var email   = getVal('hcf-email');
      var phone   = getVal('hcf-phone');
      var service = getVal('hcf-service') || 'Not specified';
      var message = getVal('hcf-message') || '';

      var lines = [
        '🚀 *New Inquiry — Shriii Tracking Solution*',
        '',
        '*Name:* ' + name,
        '*Phone:* ' + phone,
        '*Email:* ' + email,
        '*Service:* ' + service,
      ];
      if (message) lines.push('', '*Message:*', message);
      lines.push('', '_Sent via shriiitrackingsolution.in_');

      showToast();
      clearForm(form);
      setTimeout(function () { window.open(waUrl(lines.join('\n')), '_blank'); }, 600);
    });
  }

  /* ─────────────────────────────────────────
     CONTACT PAGE FORM  (#contactForm)
  ───────────────────────────────────────── */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    // Add IDs
    var allInputs = form.querySelectorAll('input, select, textarea');
    var idMap2 = ['cf-name', 'cf-email', 'cf-phone', 'cf-service', 'cf-budget', 'cf-source', 'cf-message'];
    allInputs.forEach(function (el, i) { if (idMap2[i]) el.id = idMap2[i]; });

    // Inject hints
    injectHint('cf-name',    'Please enter your full name.');
    injectHint('cf-email',   'Please enter a valid email address.');
    injectHint('cf-phone',   'Please enter a valid phone number.');
    injectHint('cf-service', 'Please select a service.');

    // Upgrade button
    upgradeSubmitBtn(form.querySelector('[type="submit"]'));

    // Inline validation on blur
    ['cf-name','cf-email','cf-phone','cf-service'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('blur', function () { validateContactForm(); });
    });

    function validateContactForm() {
      var name    = getVal('cf-name');
      var email   = getVal('cf-email');
      var phone   = getVal('cf-phone');
      var service = getVal('cf-service');
      var nOk = name.length >= 2;
      var eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var pOk = /^[0-9+\s\-]{7,15}$/.test(phone);
      var sOk = service !== '' && service !== 'Select a service';
      markField('cf-name',    nOk);
      markField('cf-email',   eOk);
      markField('cf-phone',   pOk);
      markField('cf-service', sOk);
      return nOk && eOk && pOk && sOk;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateContactForm()) return;

      var name    = getVal('cf-name');
      var email   = getVal('cf-email');
      var phone   = getVal('cf-phone');
      var service = getVal('cf-service') || 'Not specified';
      var budget  = getVal('cf-budget') || 'Not specified';
      var source  = getVal('cf-source') || 'Not specified';
      var message = getVal('cf-message') || '';

      var lines = [
        '📩 *Contact Form — Shriii Tracking Solution*',
        '',
        '*Name:* ' + name,
        '*Phone:* ' + phone,
        '*Email:* ' + email,
        '*Service:* ' + service,
        '*Budget:* ' + budget,
        '*Source:* ' + source,
      ];
      if (message) lines.push('', '*Project Details:*', message);
      lines.push('', '_Sent via shriiitrackingsolution.in/contact_');

      showToast();
      clearForm(form);
      setTimeout(function () { window.open(waUrl(lines.join('\n')), '_blank'); }, 600);
    });
  }

  /* ─────────────────────────────────────────
     BOOTSTRAP form-control invalid style patch
  ───────────────────────────────────────── */
  (function injectFormStyles() {
    if (document.getElementById('waf-styles')) return;
    var s = document.createElement('style');
    s.id = 'waf-styles';
    s.textContent = [
      '.form-control.is-invalid,.form-select.is-invalid{border-color:#dc3545!important;box-shadow:0 0 0 3px rgba(220,53,69,.12)!important}',
      '.form-control.is-valid,.form-select.is-valid{border-color:#25d366!important;box-shadow:0 0 0 3px rgba(37,211,102,.12)!important}',
      '.form-control.is-invalid:focus,.form-select.is-invalid:focus{border-color:#dc3545!important}',
      '.form-control.is-valid:focus,.form-select.is-valid:focus{border-color:#25d366!important}',
      /* Hide Bootstrap's native feedback icons, use our own hints */
      '.form-control.is-invalid,.form-select.is-invalid{background-image:none}',
      '.form-control.is-valid,.form-select.is-valid{background-image:none}'
    ].join('');
    document.head.appendChild(s);
  })();

  /* ─────────────────────────────────────────
     BOOT
  ───────────────────────────────────────── */
  function boot() {
    injectToast();
    initHomeForm();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
