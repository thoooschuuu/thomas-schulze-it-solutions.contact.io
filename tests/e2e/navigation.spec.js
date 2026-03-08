// @ts-check
/**
 * Navigation smoke tests.
 *
 * Verifies that every page loads without errors, that titles are present,
 * and that in-site navigation links work correctly.
 */
const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/index.html',       title: /Thomas Schulze/ },
  { path: '/about.html',       title: /Thomas Schulze/ },
  { path: '/projects.html',    title: /Thomas Schulze/ },
  { path: '/contact.html',     title: /Thomas Schulze/ },
  { path: '/impressum.html',   title: /Thomas Schulze/ },
  { path: '/datenschutz.html', title: /Thomas Schulze/ },
];

test.describe('All pages load without errors', () => {
  for (const { path, title } of pages) {
    test(`${path} loads with correct title`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveTitle(title);
      expect(errors).toHaveLength(0);
    });
  }
});

test.describe('Navigation links', () => {
  test('clicking "About" from home navigates to about.html', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('.nav-links a[href="about.html"]');
    await expect(page).toHaveURL(/about\.html/);
  });

  test('clicking "Projects" from home navigates to projects.html', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('.nav-links a[href="projects.html"]');
    await expect(page).toHaveURL(/projects\.html/);
  });

  test('clicking "Contact" from home navigates to contact.html', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('.nav-links a[href="contact.html"]');
    await expect(page).toHaveURL(/contact\.html/);
  });

  test('logo brand link navigates to index.html', async ({ page }) => {
    await page.goto('/about.html');
    await page.click('.navbar-brand');
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('footer Impressum link works', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('footer a[href="impressum.html"]');
    await expect(page).toHaveURL(/impressum\.html/);
  });

  test('footer Datenschutz link works', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('footer a[href="datenschutz.html"]');
    await expect(page).toHaveURL(/datenschutz\.html/);
  });
});

test.describe('Page structure', () => {
  for (const { path } of pages) {
    test(`${path} has a <nav>, <main>, and <footer>`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('nav.navbar')).toBeAttached();
      await expect(page.locator('main')).toBeAttached();
      await expect(page.locator('footer')).toBeAttached();
    });
  }

  for (const { path } of pages) {
    test(`${path} has theme toggle and lang buttons in footer`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#themeToggle')).toBeAttached();
      await expect(page.locator('.lang-btn[data-lang="de"]')).toBeAttached();
      await expect(page.locator('.lang-btn[data-lang="en"]')).toBeAttached();
    });
  }
});
