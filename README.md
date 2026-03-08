# thomas-schulze-it-solutions.contact.io

Personal portfolio and contact site for **Thomas Schulze – IT Solutions**, published as a [GitHub Pages](https://pages.github.com/) static site.

**Live URL:** `https://thoooschuuu.github.io/thomas-schulze-it-solutions.contact.io/`

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
- [Deployment](#deployment)
- [Design tokens reference](#design-tokens-reference)

---

## Project overview

A zero-dependency, framework-free static website consisting of five pages:

| Page | File | Purpose |
|------|------|---------|
| Landing | `index.html` | Hero section, value-proposition cards, tech-stack chips |
| About | `about.html` | Bio, skills grid, experience stats, service list |
| Projects | `projects.html` | Project cards with tags and GitHub links |
| Contact | `contact.html` | Contact info + mailto: contact form |
| Impressum | `impressum.html` | Legal notice (required by German law) |

All pages share a single stylesheet (`css/style.css`) and two scripts (`js/i18n.js` and `js/main.js`).  
The site supports **German and English** (language switcher in the footer) and a **dark / light colour theme** (theme toggle in the footer).

---

## Repository structure

```
thomas-schulze-it-solutions.contact.io/
├── index.html        # Landing / hero page
├── about.html        # About me page
├── projects.html     # Projects / portfolio page
├── contact.html      # Contact info + form
├── impressum.html    # Legal notice (Impressum)
├── css/
│   └── style.css     # Single shared stylesheet (dark/light theme, responsive)
├── fonts/
│   └── arimo-*.woff2 # Self-hosted Arimo font files
├── img/
│   ├── logo.svg      # Full logo
│   └── logo-icon.svg # Icon-only logo (used in navbar and as favicon)
├── js/
│   ├── i18n.js       # Translations (DE/EN) + project data rendering
│   └── main.js       # Vanilla JS: theme toggle, nav highlight, hamburger, contact form
├── .github/
│   └── copilot-instructions.md  # Agent guide (architecture decisions, conventions, rules)
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

Each page is a self-contained HTML file. Navigation, `<head>`, and `<footer>` must be kept in sync across all five files manually – there is no templating engine.

**Checklist when adding or renaming a page:**

1. Add an `<li><a href="newpage.html" data-i18n="nav.key">Label</a></li>` entry to the `<ul class="nav-links">` block in **all five** existing HTML files.
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

---

## Deployment

Deployment is fully automatic via **GitHub Pages**:

1. Push changes to the branch configured as the GitHub Pages source (typically `main`).
2. GitHub Pages rebuilds and publishes the site within ~1 minute.
3. The live URL is `https://thoooschuuu.github.io/thomas-schulze-it-solutions.contact.io/`.

There is no build step, no CI pipeline, and no compilation required.

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
