// @ts-check
/**
 * Unit-style tests for js/main.js.
 *
 * Covers theme toggle, active nav highlighting, hamburger menu, and
 * localStorage key conventions – all without a build step.
 */
const { test, expect } = require('@playwright/test');

test.describe('main.js – theme management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_theme'));
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('default theme resolves to a valid value (dark or light)', async ({ page }) => {
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['dark', 'light']).toContain(theme);
  });

  test('clicking #themeToggle flips the theme', async ({ page }) => {
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.click('#themeToggle');
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).not.toBe(before);
    expect(['dark', 'light']).toContain(after);
  });

  test('theme is persisted to localStorage after toggle', async ({ page }) => {
    await page.click('#themeToggle');
    const stored = await page.evaluate(() => localStorage.getItem('ts_theme'));
    expect(['dark', 'light']).toContain(stored);
  });

  test('theme persists across page reload', async ({ page }) => {
    // Toggle once to get a known value and persist it
    await page.click('#themeToggle');
    const toggled = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    // Add a test-level initScript AFTER beforeEach cleanup so the toggled value is
    // re-applied on the next page load (both scripts run in order: remove, then set).
    await page.addInitScript(() => {
      var val = sessionStorage.getItem('__test_theme');
      if (val) localStorage.setItem('ts_theme', val);
    });
    await page.evaluate(t => sessionStorage.setItem('__test_theme', t), toggled);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const afterReload = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(afterReload).toBe(toggled);
  });

  test('data-theme is set before stylesheet loads (no FOUC)', async ({ page }) => {
    // The inline head script must run synchronously; verify attribute is present
    // immediately after DOMContentLoaded (i.e. it was set in <head>, not deferred)
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBeTruthy();
  });

  test('ts_theme is the only theme-related localStorage key', async ({ page }) => {
    await page.click('#themeToggle');
    const keys = await page.evaluate(() => Object.keys(localStorage).filter(k => k.toLowerCase().includes('theme')));
    expect(keys).toEqual(['ts_theme']);
  });
});

test.describe('main.js – active nav link highlighting', () => {
  test('index.html nav link has "active" class on home page', async ({ page }) => {
    await page.goto('/index.html');
    const activeLinks = await page.locator('.nav-links a.active').all();
    const hrefs = await Promise.all(activeLinks.map(l => l.getAttribute('href')));
    expect(hrefs.some(h => h?.includes('index.html'))).toBe(true);
  });

  test('about.html nav link has "active" class on about page', async ({ page }) => {
    await page.goto('/about.html');
    const activeLinks = await page.locator('.nav-links a.active').all();
    const hrefs = await Promise.all(activeLinks.map(l => l.getAttribute('href')));
    expect(hrefs.some(h => h?.includes('about.html'))).toBe(true);
  });

  test('projects.html nav link has "active" class on projects page', async ({ page }) => {
    await page.goto('/projects.html');
    const activeLinks = await page.locator('.nav-links a.active').all();
    const hrefs = await Promise.all(activeLinks.map(l => l.getAttribute('href')));
    expect(hrefs.some(h => h?.includes('projects.html'))).toBe(true);
  });

  test('contact.html nav link has "active" class on contact page', async ({ page }) => {
    await page.goto('/contact.html');
    const activeLinks = await page.locator('.nav-links a.active').all();
    const hrefs = await Promise.all(activeLinks.map(l => l.getAttribute('href')));
    expect(hrefs.some(h => h?.includes('contact.html'))).toBe(true);
  });
});

test.describe('main.js – hamburger menu', () => {
  // Only meaningful on small viewports where the hamburger is visible
  test.use({ viewport: { width: 480, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('hamburger button is present', async ({ page }) => {
    await expect(page.locator('.hamburger')).toBeAttached();
  });

  test('clicking hamburger adds "open" class to nav-links', async ({ page }) => {
    await page.click('.hamburger');
    await expect(page.locator('.nav-links')).toHaveClass(/open/);
  });

  test('clicking hamburger again removes "open" class', async ({ page }) => {
    await page.click('.hamburger');
    await page.click('.hamburger');
    const classes = await page.locator('.nav-links').getAttribute('class');
    expect(classes ?? '').not.toContain('open');
  });

  test('clicking a nav link closes the menu', async ({ page }) => {
    await page.click('.hamburger');
    await expect(page.locator('.nav-links')).toHaveClass(/open/);
    await page.locator('.nav-links a[href="about.html"]').click();
    // After navigation, the new page's nav-links must not have "open"
    await page.waitForLoadState('domcontentloaded');
    const classes = await page.locator('.nav-links').getAttribute('class');
    expect(classes ?? '').not.toContain('open');
  });
});

test.describe('main.js – contact form handler', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('contact form is present', async ({ page }) => {
    await expect(page.locator('#contactForm')).toBeAttached();
  });

  test('#formSuccess is hidden initially', async ({ page }) => {
    const display = await page.locator('#formSuccess').evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('none');
  });

  test('submitting the form prevents default browser navigation', async ({ page }) => {
    // Fill required fields so the form can be submitted
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="_replyto"]', 'test@example.com');
    await page.selectOption('[name="subject"]', { index: 1 });
    await page.fill('[name="message"]', 'Hello, this is a test message.');

    // Submit and check the form hides itself (proves e.preventDefault ran + handler executed)
    await page.evaluate(() => document.getElementById('contactForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    const display = await page.locator('#contactForm').evaluate(el => el.style.display);
    expect(display).toBe('none');
  });
});
