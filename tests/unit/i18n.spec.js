// @ts-check
/**
 * Unit-style tests for js/i18n.js.
 *
 * These tests load actual pages and call window.i18n via page.evaluate(),
 * verifying the public API and translation logic without mocking the DOM.
 */
const { test, expect } = require('@playwright/test');

test.describe('i18n – window.i18n API', () => {
  test.beforeEach(async ({ page }) => {
    // Clear stored language preference so tests start from the default (de)
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/index.html');
  });

  test('window.i18n is exposed on all pages', async ({ page }) => {
    const hasI18n = await page.evaluate(() => typeof window.i18n === 'object' && window.i18n !== null);
    expect(hasI18n).toBe(true);
  });

  test('window.i18n exposes t() and setLanguage()', async ({ page }) => {
    const api = await page.evaluate(() => ({
      hasT: typeof window.i18n.t === 'function',
      hasSetLanguage: typeof window.i18n.setLanguage === 'function',
    }));
    expect(api.hasT).toBe(true);
    expect(api.hasSetLanguage).toBe(true);
  });

  test('default language is German (de)', async ({ page }) => {
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('de');
  });

  test('t() returns German translation for a known key', async ({ page }) => {
    const value = await page.evaluate(() => window.i18n.t('nav.home'));
    expect(value).toBe('Start');
  });

  test('t() returns the key itself for an unknown key', async ({ page }) => {
    const value = await page.evaluate(() => window.i18n.t('this.key.does.not.exist'));
    expect(value).toBe('this.key.does.not.exist');
  });

  test('setLanguage("en") switches to English', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });

  test('t() returns English translation after setLanguage("en")', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const value = await page.evaluate(() => window.i18n.t('nav.home'));
    expect(value).toBe('Home');
  });

  test('setLanguage("de") switches back to German', async ({ page }) => {
    await page.evaluate(() => {
      window.i18n.setLanguage('en');
      window.i18n.setLanguage('de');
    });
    const value = await page.evaluate(() => window.i18n.t('nav.projects'));
    expect(value).toBe('Projekte');
  });

  test('setLanguage() persists language to localStorage', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const stored = await page.evaluate(() => localStorage.getItem('ts_lang'));
    expect(stored).toBe('en');
  });

  test('language preference is restored from localStorage on reload', async ({ page }) => {
    // Add a test-level initScript AFTER beforeEach cleanup so 'en' is set before each load.
    await page.addInitScript(() => localStorage.setItem('ts_lang', 'en'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });

  test('invalid localStorage value for ts_lang falls back to de', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ts_lang', 'fr'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('de');
  });
});

test.describe('i18n – data-i18n attribute translation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('ts_lang');
    });
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('nav links are translated to German by default', async ({ page }) => {
    const navHome = await page.locator('[data-i18n="nav.home"]').first().textContent();
    expect(navHome?.trim()).toBe('Start');
  });

  test('nav links are translated to English after switching', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const navHome = await page.locator('[data-i18n="nav.home"]').first().textContent();
    expect(navHome?.trim()).toBe('Home');
  });

  test('data-i18n-html attribute renders HTML content (hero title)', async ({ page }) => {
    // The hero title uses data-i18n-html and contains a <span class="highlight">
    const heroTitle = page.locator('[data-i18n-html="index.hero.title"]');
    await expect(heroTitle.locator('span.highlight')).toBeVisible();
  });

  test('data-i18n-placeholder sets input placeholder', async ({ page }) => {
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');
    const namePlaceholder = await page.locator('[data-i18n-placeholder="contact.form.name.placeholder"]').getAttribute('placeholder');
    expect(namePlaceholder).toBe('Ihr Name');
  });

  test('active lang button is highlighted for current language', async ({ page }) => {
    // Default is DE → DE button should have "active" class
    const deBtn = page.locator('.lang-btn[data-lang="de"]').first();
    await expect(deBtn).toHaveClass(/active/);

    // After switching to EN → EN button should have "active" class
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const enBtn = page.locator('.lang-btn[data-lang="en"]').first();
    await expect(enBtn).toHaveClass(/active/);
  });
});
