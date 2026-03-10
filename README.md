# Thomas Schulze IT Solutions

Personal portfolio and contact site for **Thomas Schulze – IT Solutions**, published via [GitHub Pages](https://pages.github.com/) with a custom domain.

**Live URL:** <https://thomas-schulze-it-solutions.de>

---

## Table of Contents

- [Project overview](#project-overview)
- [Repository structure](#repository-structure)
- [Local development](#local-development)
- [Making changes](#making-changes)
  - [Page content](#page-content)
  - [Styles](#styles)
  - [JavaScript](#javascript)
  - [Contact form](#contact-form)
- [Testing](#testing)
- [Deployment](#deployment)
- [Design tokens reference](#design-tokens-reference)

---

## Project overview

A zero-dependency, framework-free static website consisting of six pages:

| Page | File | Purpose |
|------|------|---------|
| Landing | `index.html` | Hero section, value-proposition cards, tech-stack chips |
| About | `about.html` | Bio, skills grid, experience stats, service list |
| Projects | `projects.html` | Project cards with tags and GitHub links |
| Contact | `contact.html` | Contact info + mailto: contact form |
| Impressum | `impressum.html` | Legal notice (required by German law) |
| Datenschutz | `datenschutz.html` | Privacy policy / Datenschutzerklärung (required by DSGVO) |

All pages share a single stylesheet (`css/style.css`) and two scripts (`js/i18n.js` and `js/main.js`).  
The site supports **German and English** (language switcher in the footer) and a **dark / light colour theme** (theme toggle in the footer).

---

## Repository structure

```
thoooschuuu.github.io/
├── index.html        # Landing / hero page
├── about.html        # About me page
├── projects.html     # Projects / portfolio page
├── contact.html      # Contact info + form
├── impressum.html    # Legal notice (Impressum)
├── datenschutz.html  # Privacy policy (Datenschutzerklärung)
├── 404.html          # Custom GitHub Pages 404 error page (noindex; links back to home)
├── robots.txt        # Crawl directives (allows all except /tests/; references sitemap)
├── sitemap.xml       # XML sitemap listing all 6 pages
├── css/
│   └── style.css     # Single shared stylesheet (dark/light theme, responsive)
├── fonts/
│   └── arimo-*.woff2 # Self-hosted Arimo font files
├── img/
│   ├── logo.svg      # Full logo
│   ├── logo-icon.svg # Icon-only logo (used in navbar and as favicon)
│   └── social-preview.png # 1200×630 px Open Graph / social sharing preview image
├── js/
│   ├── i18n.js       # Translations (DE/EN) + project data rendering
│   └── main.js       # Vanilla JS: theme toggle, nav highlight, hamburger, contact form
├── tests/
│   ├── playwright.config.js   # Playwright configuration (serves site via python3 -m http.server)
│   ├── package.json           # Playwright devDependency (tests only, not the site)
│   ├── unit/
│   │   ├── i18n.spec.js       # Unit-style tests for window.i18n API and translations
│   │   └── main.spec.js       # Unit-style tests for theme toggle, nav, hamburger, form
│   └── e2e/
│       ├── navigation.spec.js # All pages load; nav/footer links work
│       ├── theme.spec.js      # Theme toggle and persistence
│       ├── language.spec.js   # DE/EN switcher and persistence
│       ├── projects.spec.js   # Project card rendering and accordion interaction
│       ├── contact.spec.js    # Contact form fields and mailto handler
│       └── datenschutz.spec.js# Privacy-policy compliance guardrails
├── .github/
│   ├── copilot-instructions.md  # Agent guide (architecture decisions, conventions, rules)
│   └── workflows/
│       └── tests.yml          # CI: runs Playwright tests on every PR to main
└── README.md         # This file
```

---

## Local development

### Prerequisites

All you need is a way to serve static files locally. Any of the following work:

- **Python 3** (usually pre-installed on macOS/Linux)
- **Node.js** `npx serve`
- **VS Code** with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension

### Option 1 – Python (recommended, no install needed)

```bash
# From the repository root
python3 -m http.server 3000
```

Open <http://localhost:3000> in your browser.

### Option 2 – Node.js / npx

```bash
npx serve .
```

Open the URL shown in the terminal (usually <http://localhost:3000>).

### Option 3 – VS Code Live Server

1. Install the **Live Server** extension.
2. Right-click `index.html` → **Open with Live Server**.
3. The browser opens and automatically reloads on every save.

> **Why not just open the HTML file directly?**
> Opening `file://` URLs in a browser works for basic inspection, but some browsers' security policies may restrict `mailto:` links and `localStorage` access behind a proper HTTP server.

---

## Making changes

### Page content

Each page is a self-contained HTML file. Navigation, `<head>`, and `<footer>` must be kept in sync across all six files manually – there is no templating engine.

**Checklist when adding or renaming a page:**

1. Add an `<li><a href="newpage.html" data-i18n="nav.key">Label</a></li>` entry to the `<ul class="nav-links">` block in **all six** existing HTML files.
2. Create the new HTML file, copying the `<nav>` and `<footer>` blocks verbatim from an existing page.
3. Include `<link rel="stylesheet" href="css/style.css" />`, `<script src="js/i18n.js"></script>`, and `<script src="js/main.js"></script>`.
4. Add the new nav translation key to both the `en` and `de` objects in `js/i18n.js`.

### Styles

All CSS lives in `css/style.css`. It is structured in clearly labelled sections:

```
/* ===== Arimo Font (locally hosted) ===== */
/* ===== CSS Reset & Base ===== */
/* ===== Navigation ===== */
/* ===== Hero / Landing ===== */
/* ===== Buttons ===== */
/* ===== About Page ===== */
/* ===== Projects Page ===== */
/* ===== Contact Page ===== */
/* ===== Contact Form ===== */
/* ===== Language Toggle ===== */
/* ===== Theme Toggle ===== */
/* ===== Footer ===== */
/* ===== Impressum Page ===== */
/* ===== Light Mode ===== */
/* ===== Responsive ===== */
```

- Use the CSS custom properties defined in `:root` instead of hard-coded colours. See [Design tokens reference](#design-tokens-reference) below.
- The responsive breakpoints are `768px` and `480px` – add new media query rules at the bottom of the `/* ===== Responsive ===== */` section.

### JavaScript

Two scripts are loaded by every page (in order):

1. **`js/i18n.js`** – loads first; provides DE/EN translations and dynamically renders the projects grid from embedded project data. Exposes `window.i18n` for use by `main.js`.
2. **`js/main.js`** – runs second; handles:
   - **Theme toggle** – reads/writes `data-theme` on `<html>` and persists the choice to `localStorage` (`ts_theme`).
   - **Active nav link** – marks the `<a>` matching the current filename with the class `active`.
   - **Hamburger menu** – toggles `.open` on `.nav-links` and animates the three `<span>` bars into an ✕.
   - **Contact form** – intercepts `submit`, builds a pre-filled `mailto:` URL from the form fields, opens the system email client, and shows `#formSuccess`.

Both files use ES6+ syntax (for example, `const` and `FormData`) and target modern evergreen browsers.
No transpiler or bundler is used – the scripts are loaded directly via `<script>` tags.

### Contact form

The form in `contact.html` uses a **client-side mailto: approach** — no backend or external service required. When the user submits the form, `js/main.js` collects the field values, builds a pre-filled `mailto:` URL, and navigates to it so the system email client opens with the message ready to send.

- To change the delivery email address: update the `mailto:` address in all of the following places so they stay in sync: the `mailtoUrl` string inside the submit handler in `js/main.js`, the `action="mailto:..."` attribute on the `<form>` in `contact.html` (for the non-JS fallback), and the visible contact email link in `contact.html`.
- To switch to a backend service (Azure Logic App, AWS API Gateway + SES, a PHP endpoint, etc.), replace the `window.location.href = mailtoUrl` block in `js/main.js` with a `fetch()` call to that endpoint, update the `action` attribute on `<form>` in `contact.html`, and restore the `formSuccess` / error-button pattern.

### SEO

The site includes a complete static SEO layer. All assets are committed to the repository root and served directly by GitHub Pages — no build step or plugin is required.

#### Head metadata (all 6 pages)

Every page's `<head>` contains:

| Tag | Purpose |
|-----|---------|
| `<link rel="canonical">` | Canonical URL for this page (absolute `https://thomas-schulze-it-solutions.de/…`) |
| `<meta name="description">` | Page description in **German** |
| `<meta property="og:type">` | Always `website` |
| `<meta property="og:url">` | Same absolute URL as canonical |
| `<meta property="og:title">` | Page title in **German** |
| `<meta property="og:description">` | Same as meta description |
| `<meta property="og:site_name">` | `Thomas Schulze IT Solutions` |
| `<meta property="og:locale">` | Always `de_DE` |
| `<meta property="og:image">` | `https://thomas-schulze-it-solutions.de/img/social-preview.png` |

> **Language rule:** `<title>`, description, and OG preview text are all German-only. Even though the site has a DE/EN language toggle at runtime, search engines index the static HTML — so head metadata must be authored in the primary (German) language.

#### JSON-LD structured data (`index.html` only)

`index.html` includes a `<script type="application/ld+json">` Person schema in `<head>`. Update it when the job title or contact details change.

#### `robots.txt`

```
User-agent: *
Allow: /
Disallow: /tests/

Sitemap: https://thomas-schulze-it-solutions.de/sitemap.xml
```

- `/tests/` is disallowed so crawlers do not index the Playwright test configs and spec files (which are committed to the repo and therefore publicly accessible on GitHub Pages).
- Do **not** remove the `Disallow: /tests/` line.

#### `sitemap.xml`

Lists all six pages (`index.html`, `about.html`, `projects.html`, `contact.html`, `impressum.html`, `datenschutz.html`) with their canonical URLs, change frequencies, and priorities. Update `sitemap.xml` whenever a page is added or removed.

#### Social preview image

`img/social-preview.png` is a 1200×630 px image in the site's dark amber theme. It is used as the OpenGraph `og:image` on every page and displayed when the site is shared on social platforms (LinkedIn, Twitter/X, WhatsApp, etc.). Replace it if the brand or tagline changes significantly.

---

## Testing

The site has a **Playwright** test suite in the `tests/` directory. Tests run against a locally served copy of the site (`python3 -m http.server`) and **never** touch the deployed GitHub Pages site.

### Prerequisites

Node.js ≥ 18 is required to install and run Playwright.

### Install and run

```bash
# From the tests/ directory
cd tests
npm install                              # install Playwright (first time only)
npx playwright install --with-deps chromium  # download Chromium (first time only)

# Run all tests
npx playwright test

# Run with a visible browser window
npx playwright test --headed

# Run a single spec file
npx playwright test e2e/projects.spec.js
```

### Test structure

| File | What it covers |
|------|----------------|
| `unit/i18n.spec.js` | `window.i18n` API: `t()`, `setLanguage()`, all three `data-i18n*` attributes, `localStorage` persistence |
| `unit/main.spec.js` | Theme toggle, active nav link per page, hamburger menu, contact form `e.preventDefault()` |
| `e2e/navigation.spec.js` | All 6 pages load without JS errors; nav and footer links; required structural elements; canonical URL, OG tags, and SEO title per page |
| `e2e/theme.spec.js` | Theme toggle flips `data-theme`, persists across navigation and reload |
| `e2e/language.spec.js` | DE/EN switcher updates text, `<html lang>`, `active` class, `localStorage` |
| `e2e/projects.spec.js` | Project cards render from JS data; accordion expand/collapse (click + keyboard); DE/EN labels |
| `e2e/contact.spec.js` | Form fields present; mailto handler (form hides on submit, no external POST) |
| `e2e/datenschutz.spec.js` | **Compliance guardrails** – fail if privacy promises are broken: no cookies, only `ts_theme`/`ts_lang` in `localStorage`, no Google Fonts CDN, no tracking scripts |

### CI

The workflow `.github/workflows/tests.yml` runs all tests automatically on every pull request targeting `main`. A Playwright HTML report is uploaded as a GitHub Actions artifact (14-day retention) and can be downloaded from the Actions tab if a run fails.

### When to add or update tests

**Always** add or update tests when you make a change to the site:

- **New JS behaviour** (new event handler, new `window.i18n` feature, new `localStorage` key) → add a case to the relevant `tests/unit/` spec.
- **New page or new UI component** → add a test to `tests/e2e/navigation.spec.js` and a dedicated `e2e/*.spec.js` if the component has interactive behaviour.
- **Change to the contact form mechanism** (e.g. switching from mailto: to a backend) → update `tests/e2e/contact.spec.js`.
- **Any change that affects the claims in `datenschutz.html`** (e.g. adding a new `localStorage` key, loading a third-party font, integrating analytics) → update `tests/e2e/datenschutz.spec.js` first, confirm the test fails with your intended change, then update the privacy policy text and make the test pass again.
- **SEO changes** (new page, renamed page, updated title) → update `sitemap.xml`, the page `<head>` canonical/OG tags, and the relevant assertions in `tests/e2e/navigation.spec.js`.

---

## Deployment

Deployment is fully automatic via **GitHub Pages**:

1. Push changes to the branch configured as the GitHub Pages source (typically `main`).
2. GitHub Pages rebuilds and publishes the site within ~1 minute.
3. The live URL is `https://thomas-schulze-it-solutions.de`.

> **Note:** The `tests.yml` CI workflow runs the Playwright test suite on pull requests but is separate from the GitHub Pages deployment. Deploying the site does not trigger tests, and test failures do not block deployment — tests are a PR-gate only.

---

## Design tokens reference

All colours, spacing, and timing values are defined as CSS custom properties on `:root` in `css/style.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#ffc250` | Button backgrounds, links (amber/gold) |
| `--primary-dark` | `#e6a832` | Button hover states |
| `--primary-darker` | `#c48a10` | Button active / deep hover states |
| `--secondary` | `#6c757d` | Secondary UI elements |
| `--accent` | `#ffc250` | Highlight colour, skill dots, section labels |
| `--accent-light` | `#ffd580` | Lighter accent variant |
| `--dark` | `#1a1710` | Page background (dark mode) |
| `--darker` | `#100e08` | Navbar, alternate section background |
| `--light` | `#f8f9fa` | Page background (light mode) |
| `--card-bg` | `#1e1b10` | Card backgrounds |
| `--white` | `#ffffff` | Headings, important text |
| `--text` | `#e0e0e0` | Body text |
| `--text-muted` | `#9e9e9e` | Secondary / helper text |
| `--border` | `rgba(255,194,80,0.12)` | Subtle borders |
| `--font` | `'Arimo', 'Segoe UI', system-ui, …` | Font stack (Arimo loaded from `fonts/`) |
| `--radius` | `12px` | Border radius for cards and buttons |
| `--shadow` | `0 4px 24px rgba(0,0,0,0.5)` | Card / hover shadows |
| `--transition` | `0.3s ease` | All CSS transitions |
| `--navbar-bg` | `rgba(16,14,8,0.92)` | Navbar background (theme-sensitive) |
| `--dot-color` | `rgba(255,255,255,0.04)` | Background dot pattern (dark mode) |
| `--surface-subtle` | `rgba(255,255,255,0.06)` | Subtle surface colour |
| `--surface-faint` | `rgba(255,255,255,0.04)` | Faint surface colour |
| `--outline-border` | `rgba(255,255,255,0.25)` | Outline button border |
| `--outline-border-hover` | `rgba(255,255,255,0.5)` | Outline button border on hover |
| `--outline-bg-hover` | `rgba(255,255,255,0.08)` | Outline button fill on hover |

> **Light mode:** `html[data-theme="light"]` overrides the theme-sensitive surface tokens. Do not hard-code dark-mode values in component CSS – always use the tokens.
