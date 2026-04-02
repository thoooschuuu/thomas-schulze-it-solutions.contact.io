# Add a new project to the portfolio

You are adding a new project to the portfolio page. Projects are stored as JS data objects in `js/i18n.js` — never as HTML in `projects.html`.

## Gather input interactively

Ask the user for each field one group at a time. Use this sequence:

**Group 1 — Identity:**
- Project/job title (English)
- Project/job title (German)
- Customer/employer name (same in both languages)
- Customer domain/industry (English, e.g., "Broadcasting (Radio)")
- Customer domain/industry (German, if different from English)

**Group 2 — Description:**
- Project description (English) — can include `<p>`, `<ul>`, `<li>`, `<br>` tags
- Project description (German)

**Group 3 — Role:**
- Your role in the project (English) — can include `<p>`, `<ul>`, `<li>`, `<br>` tags
- Your role in the project (German)

**Group 4 — Meta:**
- Technologies used (comma-separated, e.g., "C#, .NET, Azure, Docker")
- Start date (YYYY-MM-DD)
- End date (YYYY-MM-DD) — or leave empty if ongoing

## Steps (after gathering all input)

### 1. Generate a UUID v4

Run one of these to get a random UUID:

```bash
# macOS / Linux
uuidgen | tr '[:upper:]' '[:lower:]'

# Or via Node.js
node -e "console.log(crypto.randomUUID())"
```

Both language entries must share the same `id`.

### 2. Check domainIcons

Read `js/i18n.js` and check the `domainIcons` object. If the customer domain is not already mapped, add an entry with an appropriate emoji. If the EN and DE domain labels differ, add both.

### 3. Add to `projectsData.en`

Add the project object to the `projectsData.en` array in `js/i18n.js`:

```js
{
  id: '{{UUID}}',
  title: '{{TITLE_EN}}',
  description: '{{DESCRIPTION_EN}}',
  role: '{{ROLE_EN}}',
  customerDomain: '{{DOMAIN_EN}}',
  customerName: '{{CUSTOMER}}',
  startDate: '{{START}}',
  endDate: '{{END}}',        // omit this line entirely if ongoing
  technologies: [{{TECHS}}]
}
```

### 4. Add to `projectsData.de`

Add the matching object to `projectsData.de` with the **identical `id`**.

### 5. Security rules for field content

| Field | Insertion method | Rule |
|-------|-----------------|------|
| `description` | `innerHTML` (trusted) | May contain `<p>`, `<ul>`, `<li>`, `<br>` — never `<script>` or event handlers |
| `role` | `innerHTML` (trusted) | Same as description |
| `title` | `escapeHtml()` → text | Plain text only |
| `customerDomain` | `escapeHtml()` → text | Plain text only |
| `customerName` | `escapeHtml()` → text | Plain text only |
| `technologies[]` | `escapeHtml()` → text | Plain text only per entry |

### 6. Run tests

```bash
cd tests && npx playwright test e2e/projects.spec.js
```

### 7. Verify

Remind the user to check the projects page in both languages and both themes. The new project should appear sorted by start date (most recent first). If it is the most recent project, it will be auto-expanded.
