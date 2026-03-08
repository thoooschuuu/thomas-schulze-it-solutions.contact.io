# Copilot Instructions – thomas-schulze-it-solutions.contact.io

> **Full reference:** See [`AGENTS.md`](../AGENTS.md) for the complete authoritative guide.
> The rules below are a condensed, action-oriented summary for quick reference.

---

## What this repository is

A **zero-dependency static GitHub Pages website** for Thomas Schulze, a freelance software
engineer based in Germany. No framework, no build system, no package manager.
Every file is served directly by GitHub Pages.

**Live site:** `https://thoooschuuu.github.io/thomas-schulze-it-solutions.contact.io/`

---

## Repository structure

```
├── index.html        # Landing / hero page
├── about.html        # About me (bio, skills, stats, services)
├── projects.html     # Project portfolio cards (rendered from JS data)
├── contact.html      # Contact details + mailto: form
├── impressum.html    # Legal notice (Impressum)
├── css/style.css     # One shared stylesheet – dark/light theme, CSS variables, responsive
├── fonts/            # Self-hosted Arimo font files (.woff2)
├── img/              # logo.svg, logo-icon.svg
├── js/i18n.js        # DE/EN translations + project data rendering (loads first)
└── js/main.js        # Theme toggle, nav highlight, hamburger, contact form (loads second)
```

---

## Critical rules (read before making any change)

### ❌ Never do these

- Run `npm init`, `npm install`, or introduce any package manager or build tool.
- Add a frontend framework (React, Vue, Next.js, etc.).
- Create a separate stylesheet for a single page — one `css/style.css` for all pages.
- Hard-code colour hex values in HTML or CSS — use CSS custom properties from `:root`.
- Add a `<link>` to Google Fonts or any external font CDN.
- Move the inline theme-detection `<script>` in `<head>` to an external file.
- Swap the `<script>` load order or add `defer`/`async` to `js/i18n.js` or `js/main.js`.
- Add a third JS file — extend the existing two files instead.
- Add `<article class="project-card">` directly in `projects.html`.
- Hard-code English-only text in translatable UI HTML — for navigation, footer, shared UI components, and the main content pages (`index.html`, `about.html`, `projects.html`, `contact.html`), every user-visible string must have `data-i18n` and translations in both `en` and `de`. Legal/long-form static content like `impressum.html` is exempt.
- Introduce an icon font (Font Awesome, Material Icons, etc.).
- Remove `e.preventDefault()` from the contact form submit handler in `main.js` — it is still required to prevent native form submission before the mailto URL is built.
- Change `--accent`/`--primary` colour tokens without verifying WCAG AA contrast (≥4.5:1 for text).

### ✅ Always do these

- Use CSS custom property tokens (e.g. `var(--accent)`, `var(--radius)`) for all colours and spacing.
- Guard every DOM query with `if (element)` — both scripts run on every page.
- Wrap new self-contained JS blocks in IIFEs `(function () { ... })()`.
- Prefix all `localStorage` keys with `ts_`: `ts_theme`, `ts_lang`.
- Add both `en` and `de` translations to `js/i18n.js` for every user-visible string.
- Keep `<nav>`, `<footer>`, and `<script>` tags identical across **all five** HTML files.
- Add `rel="noopener"` to every `target="_blank"` link.
- Add `aria-hidden="true"` to purely decorative SVGs; add `aria-label` to interactive ones.
- When adding/editing a project: update **both** `projectsData.en` and `projectsData.de` in `js/i18n.js` with matching UUID v4 `id` values.
- **After every code change, check whether `AGENTS.md`, `README.md`, and `.github/copilot-instructions.md` need updating** to reflect the change. Update any out-of-date content in the same commit.

---

## Key architecture decisions (summary)

| # | Decision | Rule |
|---|----------|------|
| AD-1 | Zero-dependency static site | Native browser APIs only (ES6+) |
| AD-2 | Single shared stylesheet | New styles go in `css/style.css` before `/* ===== Responsive ===== */` |
| AD-3 | Two JS files, strict load order | `i18n.js` first, `main.js` second — no swap, no `defer`/`async` |
| AD-4 | Self-hosted Arimo font | No Google Fonts; add new weights as `.woff2` in `fonts/` |
| AD-5 | Flash-free theme via inline `<head>` script | One inline snippet per page, never move it |
| AD-6 | i18n in JS, German default | All strings need `data-i18n` + both `en`/`de` translations |
| AD-7 | Projects rendered from JS data | Edit `projectsData.en` and `projectsData.de` in `js/i18n.js` only |
| AD-8 | mailto: contact form (no backend) | Change delivery email in `js/main.js` (`mailtoUrl`); keep `e.preventDefault()` |
| AD-9 | WCAG AA contrast in light mode | Verify contrast with WebAIM checker before changing accent/primary tokens |
| AD-10 | Inline SVG icons | Use `stroke="currentColor"` / `fill="currentColor"`; no icon fonts |

---

## Translation attributes

| Attribute | Sets | Use for |
|-----------|------|---------|
| `data-i18n="key"` | `element.textContent` | Plain text |
| `data-i18n-html="key"` | `element.innerHTML` | Rich HTML (lists, inline tags) |
| `data-i18n-placeholder="key"` | `element.placeholder` | Input / textarea placeholders |

---

## Project data schema (edit in `js/i18n.js`)

```js
{
  id:             'uuid-v4-string',   // must match across en and de arrays
  title:          'string',           // plain text only
  description:    '<p>HTML…</p>',     // trusted HTML (<p>, <ul>, <li>, <br>)
  role:           '<ul>…</ul>',       // trusted HTML
  customerDomain: 'string',           // plain text; drives icon via domainIcons map
  startDate:      'YYYY-MM-DD',
  endDate:        'YYYY-MM-DD',       // use last day of current month for ongoing
  technologies:   ['string', …]       // plain text array
}
```

---

## Local development

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

No build step, no install step needed.
