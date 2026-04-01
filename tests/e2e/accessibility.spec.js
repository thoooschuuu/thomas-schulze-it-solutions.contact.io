// @ts-check
/**
 * Accessibility tests – skip-to-main-content link (issue #34).
 *
 * Verifies that every page exposes a visible skip link as the first focusable
 * element, and that the target anchor (#main-content) exists on <main>.
 */
const { test, expect } = require('@playwright/test');

const ALL_PAGES = [
  '/index.html',
  '/about.html',
  '/projects.html',
  '/contact.html',
  '/impressum.html',
  '/datenschutz.html',
  '/404.html',
];

test.describe('Skip-to-main-content link', () => {
  for (const path of ALL_PAGES) {
    test(`${path} – skip link present and href correct`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const skipLink = page.locator('.skip-link');
      await expect(skipLink).toBeAttached();
      await expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    test(`${path} – skip link is first focusable element`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      await page.keyboard.press('Tab');
      const focusedHref = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.getAttribute('href') : null;
      });
      expect(focusedHref).toBe('#main-content');
    });

    test(`${path} – skip link hidden before focus, visible after`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const skipLink = page.locator('.skip-link');

      // Before focus: element is above the viewport (top: -100%)
      await expect(skipLink).not.toBeInViewport();

      // After Tab: link receives focus and scrolls into view (top: 0)
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeInViewport();
    });

    test(`${path} – main has id="main-content"`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.locator('main#main-content')).toBeAttached();
    });

    test(`${path} – activating skip link moves focus to main`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      await page.keyboard.press('Tab');
      await expect(page.locator('.skip-link')).toBeFocused();
      await page.keyboard.press('Enter');

      const focusedId = await page.evaluate(() => document.activeElement?.id ?? null);
      expect(focusedId).toBe('main-content');
    });
  }
});
