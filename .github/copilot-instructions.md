# Copilot Instructions – thomas-schulze-it-solutions.contact.io

This file is the authoritative reference for any AI coding agent working on this repository.
Read it fully before making any changes.

---

## What this repository is

A **zero-dependency static GitHub Pages website** for Thomas Schulze, a freelance software
engineer based in Germany. There is no framework, no build system, and no package manager.
Every file you see is exactly what the browser receives.

**Live site:** `https://thoooschuuu.github.io/thomas-schulze-it-solutions.contact.io/`

---

## Repository map

```
thomas-schulze-it-solutions.contact.io/
├── index.html        # Landing / hero page
├── about.html        # About me (bio, skills, stats, services)
├── projects.html     # Project portfolio cards
├── contact.html      # Contact details + mailto: form
├── impressum.html    # Legal notice (Impressum) – German-only (legal requirement)
├── datenschutz.html  # Privacy policy (Datenschutzerklärung) – German-only (legal document)
├── css/
│   └── style.css     # One shared stylesheet – dark/light theme, CSS variables, responsive
├── fonts/
│   └── arimo-*.woff2 # Self-hosted Arimo font files
├── img/
│   ├── logo.svg      # Full logo
│   └── logo-icon.svg # Icon-only logo (navbar + favicon)
├── js/
│   ├── i18n.js       # DE/EN translations + project data rendering
│   └── main.js       # Theme toggle, nav highlight, hamburger, contact form
├── tests/
│   ├── playwright.config.js   # Playwright config (webServer: python3 -m http.server)
│   ├── package.json           # Playwright devDependency (tests only, not the site)
│   ├── unit/
│   │   ├── i18n.spec.js       # Unit-style tests for window.i18n API
│   │   └── main.spec.js       # Unit-style tests for theme, nav, hamburger, form
│   └── e2e/
│       ├── navigation.spec.js # Page-load smoke tests + nav/footer links
│       ├── theme.spec.js      # Theme toggle and persistence
│       ├── language.spec.js   # DE/EN switcher and persistence
│       ├── projects.spec.js   # Project card rendering and accordion
│       ├── contact.spec.js    # Contact form fields and mailto handler
│       └── datenschutz.spec.js# Privacy-policy compliance guardrails
├── .github/
│   ├── copilot-instructions.md  # ← you are here (agent guide)
│   └── workflows/
│       └── tests.yml          # CI: runs Playwright on every PR to main
└── README.md         # Developer guide (local setup, testing, deployment, design tokens)
```

---

## Architecture decisions

Each decision below carries agent-actionable rules. Before making changes, identify which decisions apply and follow their rules.

### AD-1: Zero-dependency static site

**Decision:** No framework, build tool, npm packages, or bundler of any kind.  
**Rationale:** GitHub Pages serves static files directly; zero configuration deployment; no maintenance burden from dependencies.  
**Agent rules:**
- ❌ Never run `npm init`, `npm install`, or introduce a package manager.
- ❌ Never add a frontend framework (React, Vue, Next.js, etc.) to this site.
- ❌ Never add a build step, Webpack/Vite/esbuild config, or similar tool.
- ✅ Use native browser APIs only: ES2015+ (`const`/`let`, arrow functions, `fetch`, `FormData`, template literals, destructuring). All modern evergreen browsers (Chrome, Firefox, Edge, Safari) are supported targets.

### AD-2: Single shared stylesheet

**Decision:** One `css/style.css` shared by all pages; no page-specific stylesheets.  
**Rationale:** All pages share one theme; CSS custom properties avoid duplication; single cache entry for all pages.  
**Agent rules:**
- ❌ Never create a separate stylesheet for a single page.
- ✅ Add new component styles in a new labelled section inside `css/style.css` **before** the `/* ===== Responsive ===== */` section.
- ✅ Always use CSS custom property tokens from `:root`; never hard-code colour hex values in HTML or CSS.

### AD-3: Two JS files with strict load order

**Decision:** `js/i18n.js` loads first (exposes `window.i18n`), then `js/main.js` (consumes it). Both files are loaded as plain `<script>` tags at the end of `<body>`.  
**Rationale:** i18n must initialise before interactive scripts so translations are applied before the page is interactive; `main.js` uses `window.i18n.t()` for the form error message.  
**Agent rules:**
- ❌ Never swap the script order or add `defer`/`async` to either `<script>` tag.
- ❌ Never add a third JS file — extend the existing files instead.
- ✅ Both scripts wrap standalone, self-contained blocks in IIFEs `(function () { ... })()` to keep their internals out of the global scope. New self-contained features should use an IIFE. Simple one-off variable declarations that are referenced throughout the file (like `hamburger`, `navLinks`, `contactForm` in `main.js`) may remain at the top level as `const`.
- ✅ Guard every DOM query with `if (element)` — both scripts run on every page, most elements only exist on one page.
- ✅ When `main.js` needs a translated string, use `(window.i18n && window.i18n.t('key')) || 'fallback'`.
- ✅ All app-specific `localStorage` keys use the `ts_` prefix: `ts_theme`, `ts_lang`. Any new persisted value must follow this convention.

### AD-4: Self-hosted Arimo font

**Decision:** The Arimo typeface is served from `fonts/*.woff2`; no Google Fonts or CDN reference.  
**Rationale:** Eliminates a third-party network request; GDPR-friendly (no data sent to Google); fonts are always available even offline.  
**Agent rules:**
- ❌ Never add a `<link>` to Google Fonts or any external font CDN.
- ✅ The `--font` token provides a graceful fallback stack: `'Arimo', 'Segoe UI', system-ui, -apple-system, sans-serif`.
- ✅ If new font weights or styles are needed, add the `.woff2` file to `fonts/` and a matching `@font-face` block at the top of `css/style.css` in the `/* ===== Arimo Font ===== */` section.

### AD-5: Flash-free theme detection via inline `<head>` script

**Decision:** Each page's `<head>` contains a tiny synchronous inline `<script>` that reads `localStorage` and sets `data-theme` on `<html>` *before* the stylesheet loads. `js/main.js` only wires the click handler.  
**Rationale:** A stylesheet cannot read `localStorage`. Moving detection to an external script would require `defer`/`async`, which lets the stylesheet render first with the wrong theme and then flash to the correct one.  
**Agent rules:**
- ❌ Never move the inline snippet to an external file or add `defer`/`async` to it.
- ❌ Never remove or duplicate the inline snippet — one per page, identical across all six pages.
- ✅ Valid `data-theme` values are exactly `"dark"` (default) and `"light"`. No other values are valid.
- ✅ The `localStorage` key is `ts_theme`. Do not rename it.

### AD-6: i18n in JS; German is the default language; `<html lang>` is dynamic

**Decision:** All translations live in a JS object inside `i18n.js`. The default language is `de`. When the language changes, `i18n.js` also updates `document.documentElement.setAttribute('lang', lang)` at runtime.  
**Rationale:** No server-side rendering available; translations embedded in JS avoid a network request; the `lang` attribute must stay in sync with the active language for accessibility tools.  
**Agent rules:**
- ✅ Every user-visible string must have a `data-i18n`, `data-i18n-html`, or `data-i18n-placeholder` attribute and a matching key in **both** `en` and `de` translation objects in `i18n.js`.
- ❌ Never hard-code English-only text in HTML markup.
- ❌ Never set `<html lang="">` to a fixed value other than `de` in a new page — i18n.js overwrites it at runtime based on the user's preference.
- ✅ The `localStorage` key is `ts_lang`. Valid values are `"de"` and `"en"` only; anything else is normalised to `"de"`.
- **Exception – legal pages:** `impressum.html` and `datenschutz.html` are intentionally German-only. These are legal documents required under German law (TMG, DSGVO) and are conventionally authored in German. They do not use `data-i18n` attributes and their content must not be machine-translated. The footer links to these pages are translated via `footer.impressum` / `footer.datenschutz` keys.

### AD-7: Projects rendered dynamically from JS data objects (not HTML)

**Decision:** Project data is stored as JS objects (`projectsData.en` / `projectsData.de`) inside `i18n.js`. `projects.html` contains only an empty `<div id="projectsGrid">` container. The renderer builds the card HTML at runtime.  
**Rationale:** Projects need translated content; storing data in JS avoids duplicating the card HTML structure for each language; sorting by date is trivial in JS.  
**Agent rules:**
- ❌ Never add a `<article class="project-card">` directly to `projects.html`.
- ✅ To add or edit a project, edit **both** `projectsData.en` and `projectsData.de` arrays in `js/i18n.js`.
- ✅ Each project must have the same `id` (a UUID v4) in both language arrays so they can be correlated.
- ✅ Projects are automatically sorted by `startDate` descending (most recent first). Do not manually order the arrays.
- ✅ See the **Project data schema** subsection in the JavaScript conventions section below for the full field reference.

### AD-8: mailto: contact form (no backend)

**Decision:** The contact form collects fields and builds a `mailto:` URL that opens the user's system email client with a pre-filled message. There is no server-side component and no third-party form service.  
**Rationale:** Zero dependencies, no API keys, no monthly cost, GDPR-friendly — the message goes directly from the user's own email client to the inbox.  
**Agent rules:**
- ❌ Never remove `e.preventDefault()` from the form submit handler in `main.js` — it is still required to prevent the browser's native form navigation before the mailto URL is built.
- ✅ To change the delivery email address, update the `mailto:` address in the `mailtoUrl` string inside the submit handler in `js/main.js`, and update the matching `mailto:` addresses in `contact.html` (the form `action="mailto:…"` and the contact mail link) so the fallback path stays consistent.
- ✅ To replace the mailto: approach with a backend endpoint (e.g. Azure Logic App, AWS API Gateway + SES, or a PHP script), replace the `window.location.href = mailtoUrl` block with a `fetch()` call and restore `formSuccess` / error handling accordingly. Update the `action` attribute on `<form>` in `contact.html` as well.

### AD-9: WCAG AA colour contrast enforced in light mode

**Decision:** The amber accent `#ffc250` has only ~1.5:1 contrast on light backgrounds — inaccessible. Light mode overrides `--accent`, `--primary`, and their variants to a darker amber (`#8a5c00`) that achieves ≥5.2:1 on the page background and ≥5.8:1 on card backgrounds (WCAG AA requires ≥4.5:1 for normal text).  
**Rationale:** Accessibility is non-negotiable. The colour palette must be readable in both themes.  
**Agent rules:**
- ❌ Never change `--accent`, `--primary`, or their `-dark`/`-darker` variants in `:root` without also verifying the corresponding overrides in `html[data-theme="light"]` meet WCAG AA (≥4.5:1 for text, ≥3:1 for UI components).
- ✅ Use a contrast checker (e.g., [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)) before committing new colour values.
- ✅ Update the WCAG comment in `css/style.css` near the light-mode overrides if you change the values.

### AD-10: Inline SVG icons; external SVG logo

**Decision:** All UI icons are inline `<svg>` elements using `currentColor`. The logo (`img/logo-icon.svg`, `img/logo.svg`) is an external SVG referenced via `<img>` and `<link rel="icon">`.  
**Rationale:** Inline SVGs eliminate an icon-font request, stay crisp at any resolution, and inherit theme colours automatically. The logo is external so the browser can cache it and reference it as a favicon.  
**Agent rules:**
- ❌ Never introduce an icon font (Font Awesome, Material Icons, Bootstrap Icons, etc.).
- ✅ New icons should be inline `<svg>` using `stroke="currentColor"` or `fill="currentColor"`.
- ✅ Add `aria-hidden="true"` to every purely decorative SVG.
- ✅ Add a descriptive `title` attribute or `aria-label` to interactive SVG icons.

### AD-11: Playwright regression test suite in `tests/`

**Decision:** A Playwright test suite lives in `tests/`. It runs against a locally served copy of the static site (`python3 -m http.server`) and never touches the deployed GitHub Pages site. Tests are run on every pull request to `main` via `.github/workflows/tests.yml`.  
**Rationale:** Provides a fast, automated regression check for both humans and coding agents. Compliance guardrails in `tests/e2e/datenschutz.spec.js` catch accidental introduction of cookies, external CDNs, or tracking scripts that would invalidate the privacy policy claims in `datenschutz.html`. Node.js and Playwright are confined to the `tests/` directory and are not loaded by the site.  
**Agent rules:**
- ✅ **Always add or update tests when making any change to the site.** See the mapping table in the [Testing](#testing) section below.
- ✅ Run tests locally before opening a PR: `cd tests && npx playwright test`.
- ✅ When adding a new JS behaviour (new event handler, new `window.i18n` API feature, new `localStorage` key), add a test to the relevant `tests/unit/` spec.
- ✅ When adding a new page or UI component with interactive behaviour, add page-load coverage to `tests/e2e/navigation.spec.js` and a dedicated `tests/e2e/*.spec.js` for the interaction.
- ✅ When adding a new `localStorage` key, add it to the `permitted` set in the datenschutz compliance test **and** update `datenschutz.html` to document the new key.
- ✅ When adding any new third-party resource (font, script, CDN), update the compliance tests in `tests/e2e/datenschutz.spec.js` and update `datenschutz.html` to reflect the change before merging.
- ❌ Never skip or delete a failing test to make a PR pass — fix the underlying issue instead.
- ❌ Never add `node_modules/`, `playwright-report/`, or `test-results/` to version control (they are in `.gitignore`).

---

## CSS conventions

### Custom properties (design tokens)

**Always** use the tokens defined in `:root` in `css/style.css` instead of hard-coded values:

```css
/* ✅ correct */
color: var(--accent);
border-radius: var(--radius);
transition: color var(--transition);

/* ❌ wrong */
color: #00d4ff;
border-radius: 12px;
```

| Token | Hex / value | When to use |
|-------|-------------|-------------|
| `--primary` | `#ffc250` | CTA buttons, interactive links (amber/gold) |
| `--primary-dark` | `#e6a832` | Button hover states |
| `--primary-darker` | `#c48a10` | Button active / deep hover states |
| `--secondary` | `#6c757d` | Secondary UI elements |
| `--accent` | `#ffc250` | Highlights, dots, section labels |
| `--accent-light` | `#ffd580` | Lighter accent variant |
| `--dark` | `#1a1710` | Page background (dark mode) |
| `--darker` | `#100e08` | Navbar, alternate sections |
| `--light` | `#f8f9fa` | Page background (light mode) |
| `--card-bg` | `#1e1b10` | Card backgrounds |
| `--white` | `#ffffff` | H1/H2 headings |
| `--text` | `#e0e0e0` | Body text |
| `--text-muted` | `#9e9e9e` | Secondary / helper text |
| `--border` | `rgba(255,194,80,0.12)` | Subtle dividers and card borders |
| `--font` | `'Arimo', 'Segoe UI', system-ui, …` | Font stack |
| `--radius` | `12px` | Cards, buttons |
| `--shadow` | `0 4px 24px rgba(0,0,0,0.5)` | Hover / lifted shadows |
| `--transition` | `0.3s ease` | All `transition:` declarations |
| `--navbar-bg` | `rgba(16,14,8,0.92)` | Navbar background (theme-sensitive) |
| `--dot-color` | `rgba(255,255,255,0.04)` | Background dot grid (dark mode) |
| `--surface-subtle` | `rgba(255,255,255,0.06)` | Subtle surface tint |
| `--surface-faint` | `rgba(255,255,255,0.04)` | Faint surface tint |
| `--outline-border` | `rgba(255,255,255,0.25)` | Outline button border |
| `--outline-border-hover` | `rgba(255,255,255,0.5)` | Outline button border on hover |
| `--outline-bg-hover` | `rgba(255,255,255,0.08)` | Outline button fill on hover |

> **Light mode:** `html[data-theme="light"]` overrides the theme-sensitive tokens. Never hard-code dark-mode colours in component rules – always use the tokens.

### Responsive breakpoints

The stylesheet has two breakpoints. Add media query overrides at the bottom of the
`/* ===== Responsive ===== */` section in `css/style.css`:

```css
@media (max-width: 768px) { /* tablet / mobile */ }
@media (max-width: 480px) { /* small mobile */ }
```

### CSS structure (section order)

```
0.  Arimo Font (locally hosted)
1.  CSS Reset & Base
2.  Navigation
3.  Page Container
4.  Hero / Landing
5.  Buttons
6.  Tech Stack Chips
7.  Section Styles
8.  About Page
9.  Projects Page
10. Contact Page
11. Contact Form
12. Language Toggle
13. Theme Toggle
14. Footer
15. Impressum Page
16. Light Mode
17. Responsive
```

Add new component styles in a new labelled section **before** the Responsive section.

---

## HTML conventions

### Shared boilerplate per page

Every page follows this skeleton exactly. Copy it when creating a new page:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title – Thomas Schulze IT Solutions</title>
  <meta name="description" content="Page-specific description." />
  <link rel="icon" type="image/svg+xml" href="img/logo-icon.svg" />
  <script>
    (function () {
      var t = localStorage.getItem('ts_theme');
      if (!t) { t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <nav class="navbar">
    <a href="index.html" class="navbar-brand"><img src="img/logo-icon.svg" alt="Thomas Schulze IT Solutions" /></a>
    <ul class="nav-links">
      <li><a href="index.html" data-i18n="nav.home">Home</a></li>
      <li><a href="about.html" data-i18n="nav.about">About</a></li>
      <li><a href="projects.html" data-i18n="nav.projects">Projects</a></li>
      <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
    </ul>
    <button class="hamburger" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main class="page">
    <!-- page content here -->
  </main>

  <footer>
    <p>&copy; 2024 Thomas Schulze IT Solutions &middot; <a href="contact.html" data-i18n="footer.contact">Contact</a> &middot; <a href="impressum.html" data-i18n="footer.impressum">Impressum</a> &middot; <a href="datenschutz.html" data-i18n="footer.datenschutz">Datenschutz</a></p>
    <div class="footer-controls">
      <div class="lang-toggle" aria-label="Language switcher">
        <button class="lang-btn" data-lang="de">DE</button>
        <span class="lang-toggle-sep">|</span>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
      <button class="theme-btn" id="themeToggle" aria-label="Switch colour theme">
        <svg class="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg class="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  </footer>

  <script src="js/i18n.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### Navigation – keep all six files in sync

There is **no templating**. When you add or rename a navigation item you must update the
`<ul class="nav-links">` block identically in **all six** HTML files:
`index.html`, `about.html`, `projects.html`, `contact.html`, `impressum.html`, `datenschutz.html`.
You must also add the corresponding translation key to both `en` and `de` in `js/i18n.js`.

### Section pattern

Content sections use this consistent structure:

```html
<div class="section">                          <!-- max-width: 1100px, centred -->
  <div class="section-header">
    <span class="section-label">Label</span>   <!-- small caps accent label -->
    <h1 class="section-title">Heading</h1>
    <p class="section-desc">Short description.</p>
  </div>
  <!-- grid / card content here -->
</div>
```

### Card pattern (projects page)

> ⚠️ **Do not hand-author project cards in `projects.html`.** All cards are generated at runtime by `renderProjects()` in `js/i18n.js`. To add or edit a project, see the **Project data schema and workflow** section below.

The actual rendered card HTML structure (useful when writing CSS for `.project-card`) is:

```html
<article class="project-card is-open" id="pc-{uuid}">

  <!-- Always-visible header — acts as the accordion toggle -->
  <div class="project-card-header"
       id="ph-{uuid}"
       role="button"
       tabindex="0"
       aria-expanded="true"
       aria-controls="pb-{uuid}">
    <div class="project-card-header-info">
      <div class="project-meta">
        <div class="project-domain-row">
          <span class="project-icon-sm" aria-hidden="true">📻</span>
          <span class="project-domain-label">Broadcasting (Radio)</span>
        </div>
        <span class="project-period">Nov 2010 – Jan 2013</span>
      </div>
      <h2 class="project-title">Job Title</h2>
    </div>
    <!-- Chevron SVG: rotates 180° and turns amber when card has .is-open -->
    <svg class="project-toggle-icon" …></svg>
  </div>

  <!-- Collapsible body — animated via max-height transition -->
  <div class="project-card-body"
       id="pb-{uuid}"
       role="region"
       aria-labelledby="ph-{uuid}">
    <p class="project-section-label">Project Description</p>
    <div class="project-desc"><!-- trusted HTML from description field --></div>
    <p class="project-section-label">My Role</p>
    <div class="project-role"><!-- trusted HTML from role field --></div>
    <p class="project-section-label">Technologies</p>
    <div class="project-tags">
      <span class="tag">C#</span>
      <span class="tag">.NET</span>
    </div>
  </div>

</article>
```

**Accordion behaviour (implemented in `renderProjects()`):**
- `.project-card-body` starts with `max-height: 0; overflow: hidden` in CSS; JS sets an explicit `max-height` in pixels during the open/close transition.
- Once a card finishes opening (`transitionend`), the inline `max-height` is cleared so the body reflows naturally on viewport resize. A CSS rule (`.project-card.is-open .project-card-body { max-height: none }`) prevents re-collapse.
- The close path re-pins the current height inline, forces a synchronous reflow, then sets `max-height: 0` to trigger the collapse animation.
- The most-recent card (`is-open` + `aria-expanded="true"`) is auto-opened on every render (including language switch).

---

## JavaScript conventions

Two scripts are loaded by every page – `js/i18n.js` first, then `js/main.js`. Both are plain vanilla JavaScript targeting **modern evergreen browsers** (ES6+). They use `const`, `FormData`, and function expressions. No transpiler, no bundler, and no module system.

### IIFE pattern for scope isolation

Both files wrap standalone code blocks in immediately-invoked function expressions (IIFEs) to keep their internals out of the global scope:

```js
// ✅ correct – internals are isolated
(function () {
  var privateVar = 'only visible inside this IIFE';
  // ...
})();

// ❌ wrong – pollutes window.*
var privateVar = 'now a global';
```

`main.js` also uses plain `const` at the top level for a few variables (e.g., `hamburger`, `navLinks`, `contactForm`) that are referenced across multiple event listeners in the file. This is acceptable for file-scoped variables. New **self-contained** features (a complete logical block with its own variables) should use an IIFE.

### localStorage key prefix

All app-specific `localStorage` keys use the **`ts_`** prefix to avoid collisions:

| Key | Set by | Values |
|-----|--------|--------|
| `ts_theme` | inline head script + `main.js` | `"dark"` (default) \| `"light"` |
| `ts_lang` | `i18n.js` | `"de"` (default) \| `"en"` |

Any new feature that persists state must use a `ts_` prefixed key.

### Guard every DOM query

Both scripts are loaded on every page. Use `if (element)` guards before calling methods:

```js
// ✅ correct – safe on pages without the element
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', …);
}

// ❌ wrong – throws on pages without the element
document.getElementById('contactForm').addEventListener('submit', …);
```

### Theme toggle

`main.js` wires the `#themeToggle` button. An inline `<script>` in each page's `<head>` runs before the stylesheet to set `data-theme` on `<html>` from `localStorage` (key `ts_theme`), preventing a flash of the wrong theme. `main.js` only wires the click handler – it reads the attribute already set by that inline snippet.

```js
// Inline snippet in <head> (must stay self-contained):
var t = localStorage.getItem('ts_theme');
if (!t) { t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
document.documentElement.setAttribute('data-theme', t);
```

### i18n (language toggle)

`js/i18n.js` exposes `window.i18n`. It:
- Reads the preferred language from `localStorage` (key `ts_lang`), defaulting to `'de'`.
- Applies translations by scanning the DOM for three attribute types (see table below).
- Dynamically renders the projects grid on `projects.html` from embedded project data.
- Wires the `.lang-btn` buttons in the footer.
- Updates `document.documentElement.setAttribute('lang', lang)` on every language switch.

**Translation attributes:**

| Attribute | Sets | Use for |
|-----------|------|---------|
| `data-i18n="key"` | `element.textContent` | Plain text content (safe default) |
| `data-i18n-html="key"` | `element.innerHTML` | Rich HTML content (lists, inline tags) |
| `data-i18n-placeholder="key"` | `element.placeholder` | `<input>` and `<textarea>` placeholder text |

When adding user-visible text, choose the correct attribute type and add the key to **both** `en` and `de` in `js/i18n.js`.

**`window.i18n` public API:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `t` | `t(key: string): string` | Returns the translation for `key` in the current language, or `key` itself if not found. Used by `main.js` to localise email body labels in the contact form mailto handler. |
| `setLanguage` | `setLanguage(lang: 'en' \| 'de'): void` | Switches language, persists to `localStorage`, and re-applies all translations. |

### Project data schema and workflow

Projects are stored as JS objects inside `js/i18n.js` — not as HTML in `projects.html`. The renderer sorts them by `startDate` descending.

**Project object schema:**

```js
{
  id:             'uuid-v4-string',   // Stable ID – must match across en and de arrays
  title:          'string',           // Job title / project title (text-only, HTML-escaped)
  description:    '<p>HTML…</p>',     // Project description (trusted HTML: <p>, <ul>, <li>, <br>)
  role:           '<ul>…</ul>',       // Agent's role (trusted HTML: <ul>, <li>, <p>)
  customerDomain: 'string',           // Industry/domain label (text-only, HTML-escaped; drives icon)
  startDate:      'YYYY-MM-DD',       // ISO 8601 date string (UTC); must be a complete date
  endDate:        'YYYY-MM-DD',       // ISO 8601 date string (UTC); must be a complete date
  technologies:   ['string', …]       // Array of technology names (text-only, HTML-escaped)
}
```

> **Ongoing projects:** There is no `null`/`undefined` support for `endDate` — the date formatter requires a complete `YYYY-MM-DD` string. For an ongoing engagement, use the last day of the current month as a placeholder (e.g., `"2025-12-31"`). Update `endDate` when the project concludes.

**HTML trust model – important for security:**

| Field | Insertion method | Agent rule |
|-------|-----------------|------------|
| `description` | `innerHTML` (trusted) | May contain `<p>`, `<ul>`, `<li>`, `<br>` — no user-supplied content, no `<script>` |
| `role` | `innerHTML` (trusted) | Same as `description` |
| `title` | `escapeHtml()` → text | Plain text only — no HTML tags |
| `customerDomain` | `escapeHtml()` → text | Plain text only |
| `technologies[]` | `escapeHtml()` → text | Plain text only — each entry is one technology name |

**`domainIcons` mapping:**

The `getIcon(domain)` function maps `customerDomain` strings to emoji icons. If the domain string is not in the map, the fallback icon `💼` is used. When adding a project with a new customer domain, add an entry to the `domainIcons` object in `js/i18n.js`:

```js
var domainIcons = {
  'Broadcasting (Radio)': '📻',
  'Broadcasting':         '📺',
  // … add new entries here (both EN and DE domain strings if they differ)
};
```

**How to add a new project (step by step):**

1. Generate a UUID v4 for the `id`. Options: `crypto.randomUUID()` in a modern browser console, or an online generator such as [uuidgenerator.net](https://www.uuidgenerator.net/).
2. Add the project object to `projectsData.en` in `js/i18n.js`.
3. Add the **same project** (translated) to `projectsData.de` with the **identical `id`**.
4. If `customerDomain` is new, add it to `domainIcons` in both EN and DE variants if the label differs.
5. Verify locally with `python3 -m http.server 3000` that the card renders correctly in both languages and both themes.

### Contact form submission

The form uses the **mailto: client-side** pattern — no backend required:

```js
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();               // prevent native form navigation
  // … collect field values …
  var mailtoUrl = 'mailto:info@thomas-schulze-it-solutions.de'
    + '?subject=' + encodeURIComponent(subject)
    + '&body='    + encodeURIComponent(body);
  window.location.href = mailtoUrl; // open system email client
  contactForm.style.display = 'none';
  if (formSuccess) { formSuccess.style.display = 'block'; }
});
```

Do **not** remove `e.preventDefault()` – it prevents the browser's native form submission
so the mailto URL can be built and the success panel can be shown.

To switch to a backend endpoint (Azure Logic App, AWS API Gateway + SES, Strato PHP, etc.)
replace the `window.location.href = mailtoUrl` block with a `fetch()` call and restore the
`formSuccess` / error-button pattern. See the comment in `js/main.js` for guidance.

---

## Testing

The Playwright suite in `tests/` is the project's regression safety net. Run it after every change.

### How to run tests

```bash
# From the tests/ directory
cd tests
npm install                                    # first time only
npx playwright install --with-deps chromium    # first time only

npx playwright test                            # run all tests (headless)
npx playwright test --headed                   # run with a visible browser
npx playwright test e2e/projects.spec.js       # run a single spec
```

The web server (`python3 -m http.server 3000`) is started automatically by Playwright's `webServer` config and stopped when the test run ends. No manual startup is needed.

### Test file reference

| Spec file | What it covers |
|-----------|----------------|
| `unit/i18n.spec.js` | `window.i18n.t()`, `setLanguage()`, all `data-i18n*` attribute types, `localStorage` persistence and invalid-value fallback |
| `unit/main.spec.js` | Theme toggle, `ts_theme` persistence, active nav link per page, hamburger menu open/close, contact form `e.preventDefault()` |
| `e2e/navigation.spec.js` | All 6 pages load without JS errors; nav and footer links; every page has `<nav>`, `<main>`, `<footer>`, theme/lang buttons |
| `e2e/theme.spec.js` | `data-theme` set before DOMContentLoaded; toggle flips theme; persists across navigation and reload |
| `e2e/language.spec.js` | DE/EN buttons update text, `<html lang>`, `active` class; choice persists across navigation and reload |
| `e2e/projects.spec.js` | Cards rendered from JS data; first card auto-opens; accordion click/keyboard; DE/EN labels |
| `e2e/contact.spec.js` | All form fields present; form hides on submit (proves `e.preventDefault()` ran); no external POST |
| `e2e/datenschutz.spec.js` | **Compliance guardrails:** no cookies, only `ts_theme`/`ts_lang` in localStorage, no Google Fonts CDN, no tracking scripts, no external POST on form submit |

### When to add or update tests

**Every code change to the site must be accompanied by a test update.** Use the table below to find the right spec:

| Type of change | Test file(s) to update |
|----------------|------------------------|
| New JS behaviour in `main.js` (event handler, localStorage key, DOM interaction) | `tests/unit/main.spec.js` |
| New or changed `window.i18n` feature | `tests/unit/i18n.spec.js` |
| New page added | `tests/e2e/navigation.spec.js` (page load + structure) + dedicated `e2e/*.spec.js` for interactive behaviour |
| New UI component with interaction | Dedicated `tests/e2e/*.spec.js` |
| Contact form mechanism changed | `tests/e2e/contact.spec.js` |
| New `localStorage` key added | `tests/unit/main.spec.js` or `tests/unit/i18n.spec.js` + `tests/e2e/datenschutz.spec.js` (add key to `permitted` set) + update `datenschutz.html` |
| New third-party resource (font, CDN, script) | `tests/e2e/datenschutz.spec.js` (update compliance checks) + update `datenschutz.html` |
| Project card rendering or accordion changed | `tests/e2e/projects.spec.js` |

### Compliance guardrails

`tests/e2e/datenschutz.spec.js` acts as a living test of the privacy policy. If any of its tests fail after your change, **do not skip the test** — either:

1. Revert the change that broke the compliance promise, or
2. Update `datenschutz.html` to honestly document the new behaviour, and update the test to reflect the new (accurate) policy.

---

## Contact form details

| Attribute | Value |
|-----------|-------|
| Mechanism | `mailto:` URL built client-side; opens the system email client |
| Delivery address | `info@thomas-schulze-it-solutions.de` (hardcoded in `js/main.js`) |
| Email field name | `_replyto` (value is included in the mailto body) |
| Success element | `#formSuccess` (hidden `<div>`, shown after `window.location.href` is set) |

To change the delivery email: update the `mailto:` address in the `mailtoUrl` string in `js/main.js`, and keep `contact.html` in sync (form `action="mailto:…"` and the visible contact mail link).

---

## What to change and where

| Goal | File(s) to edit |
|------|----------------|
| Update personal bio or stats | `about.html` |
| Add / edit a project card | `js/i18n.js` (project data array) + `tests/e2e/projects.spec.js` if rendering logic changes |
| Update contact email / social links | `about.html`, `contact.html` |
| Change colours or typography | `css/style.css` – `:root` tokens |
| Add a new UI component | `css/style.css` (new labelled section), then use in the relevant HTML + `tests/e2e/` |
| Change form behaviour | `js/main.js` – contact form handler + `tests/e2e/contact.spec.js` |
| Add a new page | New `.html` file + add nav link in all six existing HTML files + add translation keys in `js/i18n.js` + `tests/e2e/navigation.spec.js` |
| Change the contact delivery email | `js/main.js` – update the `mailto:` address in `mailtoUrl` |
| Switch to a backend form service | Update `js/main.js` (replace mailto block with `fetch()`) and `action` on `<form>` in `contact.html` + `tests/e2e/contact.spec.js` + `datenschutz.html` |
| Update hero headline or chips | `index.html` + translation keys in `js/i18n.js` |
| Add or update a translation string | `js/i18n.js` – both `en` and `de` objects |
| Change the theme colour palette | `css/style.css` – `:root` tokens and `html[data-theme="light"]` overrides |
| Replace or update the logo | `img/logo.svg` and/or `img/logo-icon.svg` |
| Update the Impressum | `impressum.html` |
| Update the Privacy Policy | `datenschutz.html` |
| Add a new `localStorage` key | The JS file that sets the key + `tests/unit/` spec + `tests/e2e/datenschutz.spec.js` (`permitted` set) + `datenschutz.html` |
| Add any third-party resource | The HTML/CSS/JS file + `tests/e2e/datenschutz.spec.js` (compliance checks) + `datenschutz.html` |

---

## Do's and Don'ts

### ✅ Do

- Run `python3 -m http.server 3000` and open `http://localhost:3000` to preview changes.
- Use CSS custom property tokens for all colour and spacing values.
- Keep the `<nav>`, `<footer>`, and `<script>` tags identical across all HTML files.
- Validate HTML after edits: `python3 -c "from html.parser import HTMLParser; …"` or any online validator.
- Add `rel="noopener"` to every `target="_blank"` link (security best practice).
- Keep `js/main.js` and `js/i18n.js` ES6+ (modern browsers). Use `const`/`let` and `FormData` freely. Do **not** add a transpiler or bundler.
- Add `data-i18n` / `data-i18n-html` / `data-i18n-placeholder` attributes to every user-visible string and provide both `en` and `de` translations in `js/i18n.js`.
- Wrap new self-contained JS blocks in IIFEs `(function () { ... })()` to avoid global scope pollution.
- Use the `ts_` prefix for any new `localStorage` key.
- Verify WCAG AA contrast ratios when changing any colour token (≥4.5:1 for text, ≥3:1 for UI).
- Give every new project entry identical `id` values in both `projectsData.en` and `projectsData.de`.
- Document significant architectural changes in this file (`.github/copilot-instructions.md`).
- **After every code change, check whether `.github/copilot-instructions.md` and `README.md` need to be updated** to reflect the change. If either file contains information that is now out of date, update it in the same commit.
- **Add or update tests for every change to the site** – see the [Testing](#testing) section and the "What to change and where" table for which spec files to update.
- Run `cd tests && npx playwright test` locally before opening a PR.

### ❌ Don't

- **Don't introduce a framework, bundler, or npm dependency.** The site has zero build steps by design.
- **Don't add a separate stylesheet per page.** One shared `css/style.css` keeps the theme consistent.
- **Don't hard-code colour hex values in HTML or CSS** – use the custom properties.
- **Don't use `document.write()`** or other intrusive DOM patterns.
- **Don't commit `node_modules/`, `.DS_Store`, or editor config files** (add them to `.gitignore` if needed).
- **Don't remove `e.preventDefault()` from the contact form handler** — it is required to prevent native form submission before the mailto URL is built and the success panel is shown.
- **Don't add user-visible text without a translation key** in both `en` and `de` in `js/i18n.js`.
- **Don't add project cards directly to `projects.html`** – all cards are rendered from `projectsData` in `js/i18n.js`.
- **Don't move or modify the inline theme-detection `<script>` in `<head>`** – it must run synchronously before the stylesheet.
- **Don't change accent/primary colour tokens** without verifying WCAG AA contrast in light mode.
- **Don't skip or delete a failing test to make a PR pass** – fix the underlying issue. If a compliance test fails, either revert the change or update `datenschutz.html` and the test to reflect the new (accurate) policy.
- **Don't merge a PR without running the Playwright test suite** – CI runs tests automatically, but run them locally first to catch issues early.

---

## Local development

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

No build step, no install step needed for the site itself. See `README.md` for Node.js and VS Code alternatives.

To run the test suite locally:

```bash
cd tests
npm install                                   # first time only
npx playwright install --with-deps chromium   # first time only
npx playwright test
```
