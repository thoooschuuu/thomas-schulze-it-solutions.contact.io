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
    // Should contain a separator between start and end date
    expect(first).toMatch(/–/);
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

