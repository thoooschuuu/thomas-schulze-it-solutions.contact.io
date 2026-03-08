// Theme management: reads localStorage, falls back to system preference, defaults to dark.
// NOTE: The same detection logic lives as a tiny inline <script> in every page's <head>
// (before the stylesheet link) to set data-theme instantly and prevent a flash of the
// wrong theme. That inline snippet must remain self-contained (it cannot load external JS).
// Here we only wire the toggle button; we read the attribute already set by that snippet
// rather than re-running the detection.
(function () {
  var THEME_KEY = 'ts_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
})();

// Highlight active nav link based on current page
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// Mobile hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('is-open');
    if (hamburger.classList.contains('is-open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('is-open');
      hamburger.querySelectorAll('span').forEach(function (s) {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

// Contact form submission handler
// Collects form values and opens the system email client with a pre-filled message.
// To switch to a backend endpoint (Azure Logic App, AWS API Gateway + SES, or a
// Strato PHP script), replace the mailto: block below with a fetch() call to that
// endpoint and restore the formSuccess / error handling accordingly.
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl    = contactForm.querySelector('[name="name"]');
    var emailEl   = contactForm.querySelector('[name="_replyto"]');
    var subjectEl = contactForm.querySelector('[name="subject"]');
    var messageEl = contactForm.querySelector('[name="message"]');

    var name    = nameEl    ? nameEl.value.trim()    : '';
    var email   = emailEl   ? emailEl.value.trim()   : '';
    var subject = subjectEl ? subjectEl.value.trim() : '';
    var message = messageEl ? messageEl.value.trim() : '';

    var body = ((window.i18n && window.i18n.t('contact.form.name.label')) || 'Name') + ': ' + name
             + '\n' + ((window.i18n && window.i18n.t('contact.form.email.label')) || 'E-Mail') + ': ' + email
             + '\n\n' + message;
    var mailtoUrl = 'mailto:info@thomas-schulze-it-solutions.de'
      + '?subject=' + encodeURIComponent(subject || (window.i18n && window.i18n.t('contact.form.subject.default')) || 'Kontaktanfrage')
      + '&body='    + encodeURIComponent(body);

    window.location.href = mailtoUrl;

    contactForm.style.display = 'none';
    if (formSuccess) {
      formSuccess.style.display = 'block';
    }
  });
}
