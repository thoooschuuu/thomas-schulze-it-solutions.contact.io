# Add a new page to the site

You are adding a new page to a zero-dependency static GitHub Pages site. There is no templating engine — nav, footer, and head must be manually synced across all HTML files.

## Gather input

Ask the user for:
1. **Page filename** (e.g., `services.html`)
2. **German page title** for `<title>` (e.g., `Leistungen – Thomas Schulze IT Solutions`)
3. **German meta description** for `<meta name="description">`
4. **Nav link i18n key** (e.g., `nav.services`)
5. **Nav link labels** — German and English (e.g., `Leistungen` / `Services`)
6. **Brief description of the page's purpose and content**

## Steps (execute in order)

### 1. Create the new HTML file

Use this exact skeleton. Replace placeholders:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{GERMAN_TITLE}}</title>
  <meta name="description" content="{{GERMAN_DESCRIPTION}}" />
  <link rel="canonical" href="https://thomas-schulze-it-solutions.de/{{FILENAME}}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://thomas-schulze-it-solutions.de/{{FILENAME}}" />
  <meta property="og:title" content="{{GERMAN_TITLE}}" />
  <meta property="og:description" content="{{GERMAN_DESCRIPTION}}" />
  <meta property="og:site_name" content="Thomas Schulze IT Solutions" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:image" content="https://thomas-schulze-it-solutions.de/img/social-preview.png" />
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

  <!-- Navigation — must match all other HTML files -->
  <nav class="navbar">
    <!-- Copy the EXACT nav block from index.html, including any existing nav links -->
  </nav>

  <main class="page">
    <!-- Page content using the section pattern:
    <div class="section">
      <div class="section-header">
        <span class="section-label" data-i18n="...">Label</span>
        <h1 class="section-title" data-i18n="...">Heading</h1>
        <p class="section-desc" data-i18n="...">Description</p>
      </div>
    </div>
    -->
  </main>

  <!-- Footer — must match all other HTML files -->
  <footer>
    <!-- Copy the EXACT footer block from index.html -->
  </footer>

  <script src="js/i18n.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**Critical:** Copy the `<nav>` and `<footer>` blocks verbatim from the current `index.html` (read it first). Do not type them from memory — they may have changed.

### 2. Add nav link to ALL existing HTML files

Add a `<li><a href="{{FILENAME}}" data-i18n="{{NAV_KEY}}">{{GERMAN_LABEL}}</a></li>` entry to the `<ul class="nav-links">` block in **every** existing HTML file:
- `index.html`
- `about.html`
- `projects.html`
- `contact.html`
- `impressum.html`
- `datenschutz.html`
- `404.html`

Also add it to the new page itself.

### 3. Add i18n translation keys

In `js/i18n.js`, add keys to **both** `en` and `de` objects:
- `{{NAV_KEY}}` — nav link text
- Any page-specific content keys using `data-i18n` attributes

### 4. Update `sitemap.xml`

Add a `<url>` entry:
```xml
<url>
  <loc>https://thomas-schulze-it-solutions.de/{{FILENAME}}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

### 5. Add tests

1. In `tests/e2e/navigation.spec.js`, add the new page to the page-load smoke tests and verify canonical URL + OG tags.
2. If the page has interactive behaviour, create a dedicated `tests/e2e/{{PAGE_NAME}}.spec.js`.

### 6. Run the HTML sync checker and tests

```bash
bash scripts/check-html-sync.sh
cd tests && npx playwright test
```

### 7. Verify in browser

Remind the user to check both themes (dark/light) and both languages (DE/EN).
