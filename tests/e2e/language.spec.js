// @ts-check
/**
 * Language toggle UI tests.
 *
 * Verifies the DE/EN language switcher:
 * - Default language is German.
 * - Clicking the EN button switches translations.
 * - The <html lang> attribute is updated.
 * - The preference is persisted across page loads.
 */
const { test, expect } = require('@playwright/test');

test.describe('Language toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('default language is German', async ({ page }) => {
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('de');
  });

  test('German nav label is "Projekte" by default', async ({ page }) => {
    const text = await page.locator('[data-i18n="nav.projects"]').first().textContent();
    expect(text?.trim()).toBe('Projekte');
  });

  test('clicking EN button switches UI to English', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="en"]').first().click();
    const text = await page.locator('[data-i18n="nav.projects"]').first().textContent();
    expect(text?.trim()).toBe('Projects');
  });

  test('clicking EN button updates <html lang> to "en"', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="en"]').first().click();
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });

  test('clicking DE button after EN switches back to German', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="en"]').first().click();
    await page.locator('.lang-btn[data-lang="de"]').first().click();
    const text = await page.locator('[data-i18n="nav.projects"]').first().textContent();
    expect(text?.trim()).toBe('Projekte');
  });

  test('selected language persists in localStorage', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="en"]').first().click();
    const stored = await page.evaluate(() => localStorage.getItem('ts_lang'));
    expect(stored).toBe('en');
  });

  test('English preference is restored on next page load', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ts_lang', 'en'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });

  test('English preference persists when navigating to another page', async ({ page }) => {
    // Add a test-level initScript AFTER the beforeEach cleanup script so it sets 'en'
    // on every page load (both initScripts run in registration order: remove, then set).
    await page.addInitScript(() => localStorage.setItem('ts_lang', 'en'));
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
    await page.goto('/about.html');
    await page.waitForLoadState('domcontentloaded');
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });

  test('DE lang button gets "active" class when DE is active', async ({ page }) => {
    await expect(page.locator('.lang-btn[data-lang="de"]').first()).toHaveClass(/active/);
  });

  test('EN lang button gets "active" class when EN is selected', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="en"]').first().click();
    await expect(page.locator('.lang-btn[data-lang="en"]').first()).toHaveClass(/active/);
    const deBtn = page.locator('.lang-btn[data-lang="de"]').first();
    const deClasses = await deBtn.getAttribute('class');
    expect(deClasses ?? '').not.toContain('active');
  });
});
