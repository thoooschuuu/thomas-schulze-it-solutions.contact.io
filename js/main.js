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

// Contact form submission handler (uses Formspree AJAX endpoint)
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(contactForm);
    fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
      } else {
        contactForm.querySelector('[type="submit"]').textContent =
          (window.i18n && window.i18n.t('contact.form.error')) || 'Failed – please try again';
      }
    }).catch(function () {
      contactForm.querySelector('[type="submit"]').textContent =
        (window.i18n && window.i18n.t('contact.form.error')) || 'Failed – please try again';
    });
  });
}
