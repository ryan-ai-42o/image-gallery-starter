/* Age gate — runs inline before body content, but also here for deferred binding */
(function () {
  var gate = document.getElementById('age-gate');
  if (!gate) return;

  var confirmed = false;
  try { confirmed = !!sessionStorage.getItem('sta_age_ok'); } catch (e) {}
  if (confirmed) { gate.hidden = true; return; }

  gate.hidden = false;
  document.body.style.overflow = 'hidden';

  var btnConfirm = document.getElementById('ag-confirm');
  var btnLeave   = document.getElementById('ag-leave');

  if (btnConfirm) btnConfirm.focus();

  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      try { sessionStorage.setItem('sta_age_ok', '1'); } catch (e) {}
      gate.hidden = true;
      document.body.style.overflow = '';
    });
  }

  if (btnLeave) {
    btnLeave.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

  /* Focus trap */
  gate.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { window.location.href = 'https://www.google.com'; return; }
    if (e.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(gate.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])'));
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

document.addEventListener('DOMContentLoaded', function () {

  /* Nav toggle */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* Contact form — mailto */
  var form = document.getElementById('contact-form');
  if (form) {
    var CONTACT_EMAIL = 'sacredtribalalliance@gmail.com';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = (document.getElementById('name')    || {}).value || '';
      var email = (document.getElementById('email')   || {}).value || '';
      var msg   = (document.getElementById('message') || {}).value || '';
      name = name.trim(); email = email.trim(); msg = msg.trim();
      if (!name || !email || !msg) return;
      var subject = encodeURIComponent('Inquiry from ' + name);
      var body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      var status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Your mail app should open with this message prefilled. If it does not, you can write directly to ' + CONTACT_EMAIL + '.';
        status.classList.add('visible');
      }
    });
  }

});
