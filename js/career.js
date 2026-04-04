/* ================================================
   CAREER.JS — Career Page Logic
   WhatsApp Application Form + UI Interactivity
   ================================================ */

(function () {
  'use strict';

  // ── Device Detection ──
  var isMobile = false;

  function checkMobileStatus() {
    var userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var widthMobile = window.innerWidth <= 768;
    isMobile = userAgentMobile || widthMobile;
  }

  // ── Debounce utility ──
  function debounce(fn, wait) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }

  // ── Build WhatsApp URL ──
  function buildWhatsAppUrl(phone, message) {
    checkMobileStatus();
    var base = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    return base + '?phone=' + phone + '&text=' + encodeURIComponent(message);
  }

  // ── Set CTA WhatsApp button URL ──
  function setCTAWhatsappLink() {
    var ctaBtn = document.getElementById('ctaWhatsappBtn');
    if (!ctaBtn) return;
    var msg = "Hi! I'm interested in joining the Shriii Tracking Solution team. I didn't see a specific role matching my profile but I'd love to discuss opportunities.";
    ctaBtn.href = buildWhatsAppUrl('916354710794', msg);
  }

  // Run on load + on resize (debounced)
  setCTAWhatsappLink();
  window.addEventListener('resize', debounce(function () {
    setCTAWhatsappLink();
    // Also refresh any open modal link freshness
  }, 300));

  // ── Floating Label: Auto-detect has-value ──
  function initFloatingLabels() {
    document.querySelectorAll('.float-input, .float-textarea').forEach(function (input) {
      function syncClass() {
        var fg = input.closest('.floating-group');
        if (!fg) return;
        if (input.value.trim() !== '') {
          fg.classList.add('has-value');
        } else {
          fg.classList.remove('has-value');
        }
      }
      input.addEventListener('input', syncClass);
      input.addEventListener('blur', syncClass);
      syncClass(); // initialize
    });
  }
  initFloatingLabels();

  // ── Open Apply Modal ──
  window.openApplyModal = function (btn) {
    var position = btn.getAttribute('data-position') || '';
    var positionInput = document.getElementById('appPosition');
    var positionChip = document.getElementById('modalPositionChip');

    if (positionInput) {
      positionInput.value = position;
      var fg = positionInput.closest('.floating-group');
      if (fg) fg.classList.add('has-value');
    }
    if (positionChip) positionChip.textContent = position;

    var modalEl = document.getElementById('applyModal');
    if (!modalEl) return;
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    // Reset validation state on open
    clearValidation();
  };

  // ── Form Validation ──
  function clearValidation() {
    document.querySelectorAll('.float-input, .float-textarea').forEach(function (el) {
      el.classList.remove('is-invalid', 'is-valid');
    });
  }

  function validateField(input, condition) {
    if (condition) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  function validateForm() {
    var name = document.getElementById('appName');
    var phone = document.getElementById('appPhone');
    var email = document.getElementById('appEmail');

    var nameOk = validateField(name, name.value.trim().length >= 2);
    var phoneOk = validateField(phone, /^[0-9+\s\-]{7,15}$/.test(phone.value.trim()));
    var emailOk = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));

    return nameOk && phoneOk && emailOk;
  }

  // Real-time inline validation
  ['appName', 'appPhone', 'appEmail'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', function () {
      validateForm(); // re-validate all so invalid classes stay accurate
    });
  });

  // ── Show Toast ──
  function showToast() {
    var toast = document.getElementById('careerToast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  // ── Form Submit → WhatsApp ──
  var form = document.getElementById('applicationForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Gather data
      var name = document.getElementById('appName').value.trim();
      var phone = document.getElementById('appPhone').value.trim();
      var email = document.getElementById('appEmail').value.trim();
      var position = document.getElementById('appPosition').value.trim();
      var exp = document.getElementById('appExp').value.trim();
      var portfolio = document.getElementById('appPortfolio').value.trim();
      var message = document.getElementById('appMessage').value.trim();

      // Build message
      var lines = [
        '🙏 *New Job Application — Shriii Tracking Solution*',
        '',
        '*Position:* ' + (position || 'Open Application'),
        '*Name:* ' + name,
        '*Phone:* ' + phone,
        '*Email:* ' + email,
      ];
      if (exp) lines.push('*Experience:* ' + exp);
      if (portfolio) lines.push('*Portfolio/LinkedIn:* ' + portfolio);
      if (message) lines.push('', '*Cover Letter:*', message);
      lines.push('', '_Sent via shriiitrackingsolution.in Career Page_');

      var waUrl = buildWhatsAppUrl('916354710794', lines.join('\n'));

      // Close modal
      var modalEl = document.getElementById('applyModal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      // Reset form
      form.reset();
      clearValidation();
      document.querySelectorAll('.floating-group').forEach(function (fg) {
        if (fg.id !== 'fg-position') fg.classList.remove('has-value');
      });

      // Show toast and redirect
      showToast();
      setTimeout(function () {
        window.open(waUrl, '_blank');
      }, 600);
    });
  }

})();
