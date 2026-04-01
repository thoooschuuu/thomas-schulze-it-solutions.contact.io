// @ts-check
/**
 * Font loading tests.
 *
 * Verifies that:
 * - No failed font requests occur on any page.
 * - Arimo is truly loaded (via Font Loading API), not just listed in the CSS stack.
 * - The four retained .woff2 files are served (HTTP 200).
 * - The four removed latin-ext .woff2 files return 404 (regression guard).
 */
const { test, expect } = require('@playwright/test');

const PAGES = [
  '/index.html',
  '/projects.html',
  '/contact.html',
  '/about.html',
  '/impressum.html',
  '/datenschutz.html',
];

const KEPT_FONTS = [
  '/fonts/arimo-latin-400-normal.woff2',
  '/fonts/arimo-latin-400-italic.woff2',
  '/fonts/arimo-latin-700-normal.woff2',
  '/fonts/arimo-latin-700-italic.woff2',
];

const REMOVED_FONTS = [
  '/fonts/arimo-latin-ext-400-normal.woff2',
  '/fonts/arimo-latin-ext-400-italic.woff2',
  '/fonts/arimo-latin-ext-700-normal.woff2',
  '/fonts/arimo-latin-ext-700-italic.woff2',
];

test.describe('Font loading – no failed requests', () => {
  for (const path of PAGES) {
    test(`${path} loads without failed font requests`, async ({ page }) => {
      const failedFontsNetwork = [];
      const failedFontsHttp = [];
      const requestedFonts = [];

      page.on('request', req => {
        const url = new URL(req.url());
        if (url.pathname.endsWith('.woff2')) requestedFonts.push(url.pathname);
      });

      page.on('requestfailed', req => {
        if (req.url().includes('.woff2')) failedFontsNetwork.push(req.url());
      });

      page.on('response', response => {
        const url = response.url();
        if (url.includes('.woff2') && response.status() >= 400) {
          failedFontsHttp.push(`${url} -> ${response.status()}`);
        }
      });

      await page.goto(path);
      await page.waitForLoadState('networkidle');

      expect(failedFontsNetwork, `Network-failed font requests on ${path}`).toHaveLength(0);
      expect(failedFontsHttp, `HTTP error font responses on ${path}`).toHaveLength(0);

      for (const removedFont of REMOVED_FONTS) {
        expect(
          requestedFonts,
          `Removed font ${removedFont} should not be requested on ${path}`
        ).not.toContain(removedFont);
      }
    });
  }
});

test.describe('Font rendering – Arimo is active', () => {
  test('body text uses Arimo, not a system-font fallback', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    const isArimoLoaded = await page.evaluate(async () => {
      if (!('fonts' in document) || typeof document.fonts.check !== 'function') {
        return false;
      }
      await document.fonts.ready;
      return document.fonts.check('16px "Arimo"');
    });

    expect(isArimoLoaded).toBe(true);
  });
});

test.describe('Retained font files are served', () => {
  for (const font of KEPT_FONTS) {
    test(`${font} returns HTTP 200`, async ({ request }) => {
      const response = await request.get(font);
      expect(response.status()).toBe(200);
    });
  }
});

test.describe('Removed latin-ext font files are not served', () => {
  for (const font of REMOVED_FONTS) {
    test(`${font} returns HTTP 404`, async ({ request }) => {
      const response = await request.get(font);
      expect(response.status()).toBe(404);
    });
  }
});
