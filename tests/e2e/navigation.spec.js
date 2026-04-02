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
    await expect(page).toHaveTitle(/Softwarearchitekt.*\.NET-Freelancer/);
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

  for (const { path } of pages) {
    test(`${path} has twitter:card set to summary_large_image`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      expect(content).toBe('summary_large_image');
    });

    test(`${path} has twitter:title meta tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[name="twitter:title"]').getAttribute('content');
      expect(content).toBeTruthy();
    });

    test(`${path} has twitter:description meta tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[name="twitter:description"]').getAttribute('content');
      expect(content).toBeTruthy();
    });

    test(`${path} has twitter:image meta tag`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const content = await page.locator('meta[name="twitter:image"]').getAttribute('content');
      expect(content).toContain('social-preview.png');
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

  test('about.html has JSON-LD ProfilePage structured data', async ({ page }) => {
    await page.goto('/about.html');
    await page.waitForLoadState('domcontentloaded');
    const ldJson = await page.evaluate(() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      return el ? JSON.parse(el.textContent) : null;
    });
    expect(ldJson).not.toBeNull();
    expect(ldJson['@type']).toBe('ProfilePage');
    expect(ldJson.mainEntity['@type']).toBe('Person');
    expect(ldJson.mainEntity.name).toBe('Thomas Schulze');
  });

  test('contact.html has JSON-LD ContactPage structured data', async ({ page }) => {
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');
    const ldJson = await page.evaluate(() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      return el ? JSON.parse(el.textContent) : null;
    });
    expect(ldJson).not.toBeNull();
    expect(ldJson['@type']).toBe('ContactPage');
    expect(ldJson.mainEntity['@type']).toBe('Organization');
    expect(ldJson.mainEntity.name).toBe('Thomas Schulze IT Solutions');
  });

  test('projects.html has JSON-LD CollectionPage structured data', async ({ page }) => {
    await page.goto('/projects.html');
    await page.waitForLoadState('domcontentloaded');
    const ldJson = await page.evaluate(() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      return el ? JSON.parse(el.textContent) : null;
    });
    expect(ldJson).not.toBeNull();
    expect(ldJson['@type']).toBe('CollectionPage');
    expect(ldJson.mainEntity['@type']).toBe('ItemList');
    expect(ldJson.mainEntity.itemListElement.length).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Custom 404 page', () => {
  test('404.html loads without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/404.html');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveTitle(/Thomas Schulze/);
    expect(errors).toHaveLength(0);
  });

  test('404.html has nav, main, and footer', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('nav.navbar')).toBeAttached();
    await expect(page.locator('main')).toBeAttached();
    await expect(page.locator('footer')).toBeAttached();
  });

  test('404.html has a link back to home', async ({ page }) => {
    await page.goto('/404.html');
    const homeLink = page.locator('main a[href="index.html"]');
    await expect(homeLink).toBeAttached();
    await expect(homeLink).toBeVisible();
  });

  test('404.html shows translated content in German by default', async ({ page }) => {
    await page.goto('/404.html');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-i18n="notfound.title"]')).toHaveText('Seite nicht gefunden');
  });

  test('404.html switches to English on EN button click', async ({ page }) => {
    await page.goto('/404.html');
    await page.waitForLoadState('domcontentloaded');
    await page.click('.lang-btn[data-lang="en"]');
    await expect(page.locator('[data-i18n="notfound.title"]')).toHaveText('Page not found');
  });

  test('404.html has theme and lang controls', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('#themeToggle')).toBeAttached();
    await expect(page.locator('.lang-btn[data-lang="de"]')).toBeAttached();
    await expect(page.locator('.lang-btn[data-lang="en"]')).toBeAttached();
  });

  test('404.html navbar brand uses relative href (not absolute URL)', async ({ page }) => {
    await page.goto('/404.html');
    const href = await page.locator('.navbar-brand').getAttribute('href');
    expect(href).toBe('index.html');
  });

  test('404.html navbar brand navigates to index.html', async ({ page }) => {
    await page.goto('/404.html');
    await page.click('.navbar-brand');
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('404.html has noindex, nofollow robots directive', async ({ page }) => {
    await page.goto('/404.html');
    await page.waitForLoadState('domcontentloaded');
    const content = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(content).toBe('noindex, nofollow');
  });
});

test.describe('hreflang tags', () => {
  // Pages with i18n toggles (DE/EN) should expose both `de` and `x-default` hreflang links
  const i18nPages = pages.filter(p =>
    p.path === '/index.html' ||
    p.path === '/about.html' ||
    p.path === '/projects.html' ||
    p.path === '/contact.html'
  );

  for (const { path, canonical } of i18nPages) {
    test(`${path} has hreflang="de" pointing to canonical URL`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const href = await page.locator('link[rel="alternate"][hreflang="de"]').getAttribute('href');
      expect(href).toBe(canonical);
    });

    test(`${path} has hreflang="x-default" pointing to canonical URL`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const href = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href');
      expect(href).toBe(canonical);
    });
  }

  // German-only legal pages should only expose `de` hreflang (no `x-default`)
  const legalPages = pages.filter(p =>
    p.path === '/impressum.html' ||
    p.path === '/datenschutz.html'
  );

  for (const { path, canonical } of legalPages) {
    test(`${path} has hreflang="de" pointing to canonical URL`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const href = await page.locator('link[rel="alternate"][hreflang="de"]').getAttribute('href');
      expect(href).toBe(canonical);
    });

    test(`${path} does NOT have hreflang="x-default"`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const count = await page.locator('link[rel="alternate"][hreflang="x-default"]').count();
      expect(count).toBe(0);
    });
  }
});

test.describe('SEO crawl files', () => {
  test('robots.txt is served and disallows dev/tooling paths', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('Disallow: /tests/');
    expect(body).toContain('Disallow: /scripts/');
    expect(body).toContain('Disallow: /CLAUDE.md');
  });

  test('robots.txt references the sitemap URL', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('Sitemap: https://thomas-schulze-it-solutions.de/sitemap.xml');
  });

  test('sitemap.xml is served and lists all six pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    const expectedUrls = [
      'https://thomas-schulze-it-solutions.de/',
      'https://thomas-schulze-it-solutions.de/about.html',
      'https://thomas-schulze-it-solutions.de/projects.html',
      'https://thomas-schulze-it-solutions.de/contact.html',
      'https://thomas-schulze-it-solutions.de/impressum.html',
      'https://thomas-schulze-it-solutions.de/datenschutz.html',
    ];
    for (const url of expectedUrls) {
      expect(body).toContain(url);
    }
  });
});
