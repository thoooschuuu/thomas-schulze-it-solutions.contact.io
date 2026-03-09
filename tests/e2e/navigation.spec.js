// @ts-check
/**
 * Navigation smoke tests.
 *
 * Verifies that every page loads without errors, that titles are present,
 * and that in-site navigation links work correctly.
 */
const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/index.html',       title: /Thomas Schulze/, canonical: 'https://thomas-schulze-it-solutions.de/' },
  { path: '/about.html',       title: /Thomas Schulze/, canonical: 'https://thomas-schulze-it-solutions.de/about.html' },
  { path: '/projects.html',    title: /Thomas Schulze/, canonical: 'https://thomas-schulze-it-solutions.de/projects.html' },
  { path: '/contact.html',     title: /Thomas Schulze/, canonical: 'https://thomas-schulze-it-solutions.de/contact.html' },
  { path: '/impressum.html',   title: /Thomas Schulze/, canonical: 'https://thomas-schulze-it-solutions.de/impressum.html' },
  { path: '/datenschutz.html', title: /Thomas Schulze/, canonical: 'https://thomas-schulze-it-solutions.de/datenschutz.html' },
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
  /**
   * On mobile viewports (≤768 px) the nav links are hidden behind the
   * hamburger menu.  Open it first so the links become visible before
   * attempting to click them.
   */
  async function openNavIfMobile(page) {
    const hamburger = page.locator('.hamburger');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.locator('.nav-links')).toHaveClass(/open/);
    }
  }

  test('clicking "About" from home navigates to about.html', async ({ page }) => {
    await page.goto('/index.html');
    await openNavIfMobile(page);
    await page.click('.nav-links a[href="about.html"]');
    await expect(page).toHaveURL(/about\.html/);
  });

  test('clicking "Projects" from home navigates to projects.html', async ({ page }) => {
    await page.goto('/index.html');
    await openNavIfMobile(page);
    await page.click('.nav-links a[href="projects.html"]');
    await expect(page).toHaveURL(/projects\.html/);
  });

  test('clicking "Contact" from home navigates to contact.html', async ({ page }) => {
    await page.goto('/index.html');
    await openNavIfMobile(page);
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

  test('index.html hero section shows the full logo', async ({ page }) => {
    await page.goto('/index.html');
    const heroLogo = page.locator('.hero-logo');
    await expect(heroLogo).toBeAttached();
    await expect(heroLogo).toBeVisible();
    await expect(heroLogo).toHaveAttribute('src', 'img/logo.svg');

    const isLoaded = await heroLogo.evaluate(img =>
      img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0
    );
    await expect(isLoaded).toBeTruthy();
  });
});

test.describe('SEO meta tags', () => {
  for (const { path, canonical } of pages) {
    test(`${path} has a canonical link tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const href = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(href).toBe(canonical);
    });

    test(`${path} has og:url meta tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(content).toBe(canonical);
    });

    test(`${path} has og:site_name meta tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[property="og:site_name"]').getAttribute('content');
      expect(content).toBe('Thomas Schulze IT Solutions');
    });
  }

  test('index.html has updated title for SEO', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Software Architect.*\.NET Freelancer/);
  });

  test('index.html has og:type=website', async ({ page }) => {
    await page.goto('/index.html');
    const content = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(content).toBe('website');
  });

  for (const { path } of pages) {
    test(`${path} has og:image meta tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(content).toContain('social-preview.png');
    });
  }

  for (const { path } of pages) {
    test(`${path} has og:locale set to de_DE`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[property="og:locale"]').getAttribute('content');
      expect(content).toBe('de_DE');
    });
  }

  test('index.html has JSON-LD Person structured data', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
    const ldJson = await page.evaluate(() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      return el ? JSON.parse(el.textContent) : null;
    });
    expect(ldJson).not.toBeNull();
    expect(ldJson['@type']).toBe('Person');
    expect(ldJson['name']).toBe('Thomas Schulze');
    expect(ldJson['url']).toBe('https://thomas-schulze-it-solutions.de/');
  });
});
