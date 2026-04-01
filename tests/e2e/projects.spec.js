// @ts-check
/**
 * Projects page tests.
 *
 * Verifies that project cards are rendered dynamically from JS data,
 * that they display in both languages, and that the accordion interaction works.
 */
const { test, expect } = require('@playwright/test');

test.describe('Projects page – card rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/projects.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('#projectsGrid container exists', async ({ page }) => {
    await expect(page.locator('#projectsGrid')).toBeAttached();
  });

  test('at least one project card is rendered', async ({ page }) => {
    const cards = page.locator('.project-card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('each project card has a title', async ({ page }) => {
    const titles = await page.locator('.project-title').all();
    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      const text = await title.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('each project card has a date period', async ({ page }) => {
    const periods = page.locator('.project-period');
    const count = await periods.count();
    expect(count).toBeGreaterThan(0);
    const first = await periods.first().textContent();
    // Should contain a separator between start and end date (or "present" label)
    expect(first).toMatch(/–/);
  });

  test('ongoing project (no endDate) shows "heute" in German', async ({ page }) => {
    // Locate the known ongoing project by its stable title (language-independent)
    const platformCard = page.locator('.project-card').filter({ hasText: 'Senior Software Engineer – Platform Team' });
    await expect(platformCard).toHaveCount(1);
    const periodText = await platformCard.locator('.project-period').textContent();
    expect(periodText).toContain('heute');
  });

  test('ongoing project shows "present" in English', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const platformCard = page.locator('.project-card').filter({ hasText: 'Senior Software Engineer – Platform Team' });
    await expect(platformCard).toHaveCount(1);
    const periodText = await platformCard.locator('.project-period').textContent();
    expect(periodText).toContain('present');
  });

  test('each project card shows a customer name', async ({ page }) => {
    const cards = page.locator('.project-card');
    const customerNames = page.locator('.project-customer-name');
    const cardCount = await cards.count();
    const nameCount = await customerNames.count();
    // Every card must have exactly one customer name element
    expect(nameCount).toBe(cardCount);
    // Every customer name element must be non-empty
    for (const el of await customerNames.all()) {
      const text = await el.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('known customer names appear on the projects page', async ({ page }) => {
    const pageText = await page.locator('#projectsGrid').textContent();
    // Verify a representative sample of the expected customer names
    expect(pageText).toContain('SoftwareONE AG');
    expect(pageText).toContain('CID GmbH');
    expect(pageText).toContain('Drefa MSG');
    expect(pageText).toContain('Groß, Weber & Partner');
  });

  test('projects are sorted most-recent first (multiple cards exist)', async ({ page }) => {
    const count = await page.locator('.project-card').count();
    expect(count).toBeGreaterThan(1);
  });
});

test.describe('Projects page – accordion interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/projects.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('project card headers are present and have role="button"', async ({ page }) => {
    const header = page.locator('.project-card-header').first();
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute('role', 'button');
  });

  test('first (most recent) card is open by default', async ({ page }) => {
    // renderProjects() auto-opens the most recent card to give quick access to content
    const firstHeader = page.locator('.project-card-header').first();
    await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.project-card').first()).toHaveClass(/is-open/);
  });

  test('subsequent cards are collapsed by default', async ({ page }) => {
    // All cards except the first should start closed
    const secondHeader = page.locator('.project-card-header').nth(1);
    await expect(secondHeader).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking a collapsed card header expands it', async ({ page }) => {
    // The second card starts collapsed – click it to open
    const secondCard = page.locator('.project-card').nth(1);
    const secondHeader = secondCard.locator('.project-card-header');
    await secondHeader.click();
    await expect(secondHeader).toHaveAttribute('aria-expanded', 'true');
    await expect(secondCard).toHaveClass(/is-open/);
  });

  test('clicking an open card header collapses it', async ({ page }) => {
    // The first card is already open – click to close
    const firstCard = page.locator('.project-card').first();
    const firstHeader = firstCard.locator('.project-card-header');
    await expect(firstCard).toHaveClass(/is-open/);
    await firstHeader.click();
    const classes = await firstCard.getAttribute('class');
    expect(classes ?? '').not.toContain('is-open');
    await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
  });

  test('card body reveals project description and tech tags when open', async ({ page }) => {
    // First card is already open – its tech tags should be visible
    await expect(page.locator('.project-card').first().locator('.tag').first()).toBeVisible();
  });

  test('card body shows German section labels by default (first card open)', async ({ page }) => {
    const firstCard = page.locator('.project-card').first();
    const labels = await firstCard.locator('.project-section-label').all();
    const texts = await Promise.all(labels.map(l => l.textContent()));
    const hasGerman = texts.some(t =>
      t?.includes('Projektbeschreibung') || t?.includes('Meine Rolle') || t?.includes('Technologien')
    );
    expect(hasGerman).toBe(true);
  });

  test('card body section labels switch to English when language is changed', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const firstCard = page.locator('.project-card').first();
    const labels = await firstCard.locator('.project-section-label').all();
    const texts = await Promise.all(labels.map(l => l.textContent()));
    const hasEnglish = texts.some(t =>
      t?.includes('Project Description') || t?.includes('My Role') || t?.includes('Technologies')
    );
    expect(hasEnglish).toBe(true);
  });

  test('keyboard Enter key toggles a collapsed card', async ({ page }) => {
    const secondCard = page.locator('.project-card').nth(1);
    const secondHeader = secondCard.locator('.project-card-header');
    await secondHeader.focus();
    await secondHeader.press('Enter');
    await expect(secondHeader).toHaveAttribute('aria-expanded', 'true');
  });

  test('keyboard Space key toggles a collapsed card', async ({ page }) => {
    const secondCard = page.locator('.project-card').nth(1);
    const secondHeader = secondCard.locator('.project-card-header');
    await secondHeader.focus();
    await secondHeader.press(' ');
    await expect(secondHeader).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Projects page – technology filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/projects.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('#projectsFilter container is present', async ({ page }) => {
    await expect(page.locator('#projectsFilter')).toBeAttached();
  });

  test('"Alle" button is rendered and is-active by default', async ({ page }) => {
    const allBtn = page.locator('.filter-btn[data-filter="*"]');
    await expect(allBtn).toBeVisible();
    await expect(allBtn).toHaveClass(/is-active/);
  });

  test('filter buttons are rendered for each technology', async ({ page }) => {
    const count = await page.locator('.filter-btn').count();
    expect(count).toBeGreaterThan(1);
  });

  test('clicking a technology filter hides non-matching cards', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    await expect(csharpBtn).toBeVisible();
    await csharpBtn.click();

    const visibleCount = await page.locator('.project-card:not(.is-hidden)').count();
    const hiddenCount = await page.locator('.project-card.is-hidden').count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(hiddenCount).toBeGreaterThan(0);
  });

  test('active filter button gets is-active class; All loses it', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    const allBtn = page.locator('.filter-btn[data-filter="*"]');
    await csharpBtn.click();
    await expect(csharpBtn).toHaveClass(/is-active/);
    const allClass = await allBtn.getAttribute('class');
    expect(allClass ?? '').not.toContain('is-active');
  });

  test('clicking the active filter again resets to All (toggle off)', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    await csharpBtn.click();
    await csharpBtn.click();
    const allBtn = page.locator('.filter-btn[data-filter="*"]');
    await expect(allBtn).toHaveClass(/is-active/);
    const hiddenCount = await page.locator('.project-card.is-hidden').count();
    expect(hiddenCount).toBe(0);
  });

  test('"All" button resets filter and shows all cards', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    await csharpBtn.click();
    const allBtn = page.locator('.filter-btn[data-filter="*"]');
    await allBtn.click();
    await expect(allBtn).toHaveClass(/is-active/);
    const hiddenCount = await page.locator('.project-card.is-hidden').count();
    expect(hiddenCount).toBe(0);
  });

  test('"Alle" shown in DE, "All" shown in EN', async ({ page }) => {
    const allBtnDe = page.locator('.filter-btn[data-filter="*"]');
    await expect(allBtnDe).toHaveText('Alle');
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const allBtnEn = page.locator('.filter-btn[data-filter="*"]');
    await expect(allBtnEn).toHaveText('All');
  });

  test('filter stays active after language switch', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    await csharpBtn.click();
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const csharpBtnEn = page.locator('.filter-btn[data-filter="C#"]');
    await expect(csharpBtnEn).toHaveClass(/is-active/);
  });

  test('filter button is keyboard-accessible via Enter key', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    await csharpBtn.focus();
    await csharpBtn.press('Enter');
    await expect(csharpBtn).toHaveClass(/is-active/);
    const hiddenCount = await page.locator('.project-card.is-hidden').count();
    expect(hiddenCount).toBeGreaterThan(0);
  });

  test('filter button is keyboard-accessible via Space key', async ({ page }) => {
    const csharpBtn = page.locator('.filter-btn[data-filter="C#"]');
    await csharpBtn.focus();
    await csharpBtn.press(' ');
    await expect(csharpBtn).toHaveClass(/is-active/);
  });
});

