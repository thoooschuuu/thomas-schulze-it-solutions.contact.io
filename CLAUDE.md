# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **zero-dependency static GitHub Pages site** for Thomas Schulze IT Solutions. No framework, no build system, no bundler — every file is served directly to the browser as-is.

**Live URL:** `https://thomas-schulze-it-solutions.de`

---

## Commands

### Serve locally

```bash
# From the repository root
python3 -m http.server 3000
# → open http://localhost:3000
```

### Run tests

```bash
cd tests
npm install                                  # first time only
npx playwright install --with-deps chromium  # first time only

npx playwright test                          # run all tests
npx playwright test e2e/projects.spec.js     # run a single spec
npx playwright test --headed                 # with visible browser
```

Tests run against the locally served site (`python3 -m http.server`). The Playwright config starts this server automatically.

### CI

`.github/workflows/tests.yml` runs the full Playwright suite on every PR to `main`.

---

## Architecture

### Zero dependencies (AD-1)

The site itself has **no npm packages** — `tests/package.json` and `tests/node_modules/` are test-only and never loaded by the browser. Never add a frontend framework, build tool, or bundler.

### Two JS files, strict load order (AD-3)

1. **`js/i18n.js`** — loads first; provides `window.i18n` with `t()`, `setLanguage()`, and `data-i18n*` rendering; also holds all project data (`projectsData.en` / `projectsData.de`).
2. **`js/main.js`** — loads second; consumes `window.i18n`; handles theme toggle, active nav link, hamburger menu, and contact form.

Both are plain `<script>` tags at the end of `<body>`. **Never add `defer`/`async`, swap order, or add a third JS file** — extend the existing files instead.

- Guard every DOM query with `if (element)` — both scripts run on every page.
- All `localStorage` keys use the `ts_` prefix: `ts_theme`, `ts_lang`. Any new persisted value must follow this.
- Use IIFEs for self-contained features; simple top-level `const` declarations are fine for module-level variables.

### Flash-free theme detection (AD-5)

Each page's `<head>` contains a tiny synchronous inline `<script>` that reads `localStorage` and sets `data-theme` on `<html>` *before* the stylesheet loads. Never move it to an external file. Valid values: `"dark"` (default), `"light"`.

### i18n (AD-6)

All translations live in `js/i18n.js`. Default language is `de`. Every user-visible string must have a `data-i18n`, `data-i18n-html`, or `data-i18n-placeholder` attribute and matching keys in **both** `en` and `de` objects.

**Exception:** `impressum.html` and `datenschutz.html` are intentionally German-only legal documents — do not add `data-i18n` attributes to their content.

### Projects rendered from JS data (AD-7)

`projects.html` contains only an empty `<div id="projectsGrid">`. Never add `<article class="project-card">` directly to the HTML. To add/edit a project, edit both `projectsData.en` and `projectsData.de` in `js/i18n.js`. Each project needs the same UUID `id` in both arrays. Projects are auto-sorted by `startDate` descending.

### Single shared stylesheet (AD-2)

All CSS lives in `css/style.css`. Never create page-specific stylesheets. Always use CSS custom properties from `:root`; never hard-code colour hex values. Add new component styles in a new labelled section **before** `/* ===== Responsive ===== */`. Breakpoints: `768px` and `480px`.

### SEO (AD-12)

All six pages carry canonical, OG tags, and `og:locale=de_DE`. **`<title>`, `<meta name="description">`, `og:title`, and `og:description` must be in German only** — even with the DE/EN runtime toggle, search engines index static HTML. `index.html` has a JSON-LD Person schema; update it when contact details change. `sitemap.xml` lists all six pages; update it when pages are added/removed.

### No external fonts (AD-4)

Arimo is self-hosted in `fonts/*.woff2`. Never add a `<link>` to Google Fonts or any external font CDN (GDPR requirement).

### Inline SVG icons (AD-10)

UI icons are inline `<svg>` with `currentColor`. Never introduce an icon font. Decorative SVGs get `aria-hidden="true"`; interactive ones get `aria-label`.

---

## Manual sync required (no templating)

`<nav>` and `<footer>` blocks are duplicated across all seven HTML files (`index.html`, `about.html`, `projects.html`, `contact.html`, `impressum.html`, `datenschutz.html`, `404.html`). When adding a nav link, page, or footer entry, update **all seven files** manually. `sitemap.xml` must also be updated when pages are added/removed.

---

## Testing rules

Always add or update tests when making changes:

| Change | Test to add/update |
|--------|--------------------|
| New JS behaviour / `window.i18n` feature | `tests/unit/i18n.spec.js` or `tests/unit/main.spec.js` |
| New `localStorage` key | Add to `tests/e2e/datenschutz.spec.js` permitted set **and** update `datenschutz.html` |
| New page or UI component | `tests/e2e/navigation.spec.js` + dedicated `tests/e2e/*.spec.js` |
| New third-party resource | Update `tests/e2e/datenschutz.spec.js` compliance guards + `datenschutz.html` |
| SEO / page rename | Update `sitemap.xml`, canonical/OG tags, and assertions in `tests/e2e/navigation.spec.js` |

The `tests/e2e/datenschutz.spec.js` compliance guardrails enforce: no cookies, only `ts_theme`/`ts_lang` in `localStorage`, no external font CDN, no tracking scripts. Never skip or delete a failing test.

---

## Hooks (`.claude/settings.json`)

One hook fires automatically before `git commit`:

1. **PreToolUse** — `bash scripts/check-html-sync.sh` runs before the commit. **Blocks** if nav or footer links are out of sync across the 7 HTML pages.

Tests are run manually (see "Run tests" above) or via CI on every PR.

---

## Custom slash commands (`.claude/commands/`)

| Command | What it does |
|---------|-------------|
| `/add-page` | Interactive wizard: creates a new HTML page, updates all 6 existing files with nav links, adds i18n keys, sitemap entry, and tests |
| `/add-project` | Interactive wizard: prompts for project details in groups, adds both EN and DE entries to `projectsData` in `js/i18n.js`, handles `domainIcons` |

---

## Agent patterns for cross-cutting changes

When a change touches multiple independent files (new page, new nav link, SEO update), use **parallel agents** to avoid missing a file:

- **Agent 1:** Update all HTML files with nav/footer changes
- **Agent 2:** Update `sitemap.xml` and SEO tags
- **Agent 3:** Write/update the corresponding Playwright tests

This mitigates the biggest risk in this repo: forgetting to update one of the 7 manually-synced HTML files. The pre-commit HTML sync hook provides a safety net.
