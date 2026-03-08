// @ts-check
/**
 * Datenschutz (Privacy Policy) page tests.
 *
 * These tests verify that the factual claims in datenschutz.html remain true:
 * - The page loads and is in German.
 * - No third-party analytics, tracking, or CDN resources are loaded.
 * - No cookies are set (only localStorage is used, and only ts_theme / ts_lang).
 * - The two expected localStorage keys are the only ones used.
 * - The contact form uses the mailto: mechanism (no server submission).
 * - Self-hosted fonts are served from /fonts/ (no Google Fonts CDN).
 *
 * If any of these tests fail after making changes, the datenschutz.html content
 * must be reviewed and updated accordingly.
 */
const { test, expect } = require('@playwright/test');

test.describe('Datenschutz page – content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datenschutz.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page title contains "Datenschutz"', async ({ page }) => {
    await expect(page).toHaveTitle(/Datenschutz/);
  });

  test('page is served in German', async ({ page }) => {
    // Legal pages are intentionally German-only
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('de');
  });

  test('section 1 (Verantwortlicher) is present', async ({ page }) => {
    await expect(page.locator('text=Verantwortlicher')).toBeVisible();
  });

  test('section 3 (localStorage) is present', async ({ page }) => {
    await expect(page.locator('text=Lokale Speicherung')).toBeVisible();
  });

  test('ts_theme key is mentioned in the privacy policy', async ({ page }) => {
    const content = await page.locator('.impressum-content').textContent();
    expect(content).toContain('ts_theme');
  });

  test('ts_lang key is mentioned in the privacy policy', async ({ page }) => {
    const content = await page.locator('.impressum-content').textContent();
    expect(content).toContain('ts_lang');
  });

  test('section 4 (Kontaktformular / mailto) is present', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Kontaktformular/ })).toBeVisible();
  });

  test('section 5 (no analytics/tracking) is present', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Keine Analyse/ })).toBeVisible();
  });

  test('section 6 (self-hosted fonts) is present', async ({ page }) => {
    await expect(page.locator('text=Selbst gehostete Schriftarten')).toBeVisible();
  });
});

test.describe('Datenschutz – technical compliance (claims must stay true)', () => {
  test('no cookies are set on any page', async ({ page, context }) => {
    const pagePaths = ['/', '/index.html', '/about.html', '/projects.html', '/contact.html'];
    for (const path of pagePaths) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
    }
    const cookies = await context.cookies();
    expect(cookies).toHaveLength(0);
  });

  test('only ts_theme and ts_lang are stored in localStorage after full site visit', async ({ page }) => {
    // Visit all pages as a typical user would
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    const pagePaths = ['/index.html', '/about.html', '/projects.html', '/contact.html', '/impressum.html', '/datenschutz.html'];
    for (const path of pagePaths) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
    }

    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    // Only ts_theme and/or ts_lang are permitted
    const permitted = new Set(['ts_theme', 'ts_lang']);
    const unexpected = storageKeys.filter(k => !permitted.has(k));
    expect(unexpected).toHaveLength(0);
  });

  test('no requests to Google Fonts or other external font CDNs', async ({ page }) => {
    const blockedHostnames = new Set([
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'use.typekit.net',
      'fast.fonts.net',
    ]);
    const externalFontRequests = [];
    page.on('request', req => {
      try {
        const { hostname } = new URL(req.url());
        if (blockedHostnames.has(hostname)) {
          externalFontRequests.push(req.url());
        }
      } catch (_) { /* ignore unparseable URLs */ }
    });

    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    expect(externalFontRequests).toHaveLength(0);
  });

  test('fonts are loaded from /fonts/ (self-hosted)', async ({ page }) => {
    const fontRequests = [];
    page.on('request', req => {
      if (req.resourceType() === 'font') {
        fontRequests.push(req.url());
      }
    });

    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    // All font requests must be served from localhost (the self-hosted server)
    for (const url of fontRequests) {
      expect(url).toMatch(/localhost/);
    }
  });

  test('no third-party analytics or tracking scripts are loaded', async ({ page }) => {
    const trackingRequests = [];
    const trackingHostnames = new Set([
      'google-analytics.com',
      'www.google-analytics.com',
      'googletagmanager.com',
      'www.googletagmanager.com',
      'analytics.twitter.com',
      'hotjar.com',
      'static.hotjar.com',
      'segment.com',
      'api.segment.io',
      'mixpanel.com',
      'api.mixpanel.com',
      'clarity.ms',
    ]);
    // facebook.com/tr is a pixel path on facebook.com, not a separate hostname – check both
    const trackingPathPatterns = [/^\/tr\b/];

    page.on('request', req => {
      try {
        const parsed = new URL(req.url());
        if (
          trackingHostnames.has(parsed.hostname) ||
          parsed.hostname.endsWith('.matomo.cloud') ||
          (parsed.hostname === 'facebook.com' && trackingPathPatterns.some(p => p.test(parsed.pathname)))
        ) {
          trackingRequests.push(req.url());
        }
      } catch (_) { /* ignore unparseable URLs */ }
    });

    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    expect(trackingRequests).toHaveLength(0);
  });

  test('contact form uses mailto: (no network request to external server on submit)', async ({ page }) => {
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');

    const externalFormRequests = [];
    page.on('request', req => {
      const url = req.url();
      // Flag any POST or form-related request to a non-localhost URL
      if (!url.startsWith('http://localhost') && req.method() === 'POST') {
        externalFormRequests.push(url);
      }
    });

    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="_replyto"]', 'test@example.com');
    await page.selectOption('[name="subject"]', { index: 1 });
    await page.fill('[name="message"]', 'Regression test.');
    await page.evaluate(() => {
      document.getElementById('contactForm').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    // No external POST requests should have been made
    expect(externalFormRequests).toHaveLength(0);
  });
});
