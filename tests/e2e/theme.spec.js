// @ts-check
/**
 * Theme toggle UI tests.
 *
 * Verifies the dark/light theme toggle behaviour on all pages:
 * - The inline head script sets data-theme before the page is interactive.
 * - The toggle button flips the theme.
 * - The preference persists across navigation.
 */
const { test, expect } = require('@playwright/test');

test.describe('Theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test with no stored preference so the behaviour is predictable
    await page.addInitScript(() => localStorage.removeItem('ts_theme'));
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('data-theme attribute is set on <html> before DOMContentLoaded', async ({ page }) => {
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['dark', 'light']).toContain(theme);
  });

  test('clicking the theme toggle changes data-theme', async ({ page }) => {
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.click('#themeToggle');
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).not.toBe(before);
  });

  test('clicking twice returns to original theme', async ({ page }) => {
    const original = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.click('#themeToggle');
    await page.click('#themeToggle');
    const restored = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(restored).toBe(original);
  });

  test('theme choice persists after navigating to another page', async ({ page }) => {
    // Switch to a known theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('ts_theme', 'light');
    });
    await page.goto('/about.html');
    await page.waitForLoadState('domcontentloaded');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('stored "light" theme is applied on page load', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ts_theme', 'light'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('stored "dark" theme is applied on page load', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ts_theme', 'dark'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });
});
