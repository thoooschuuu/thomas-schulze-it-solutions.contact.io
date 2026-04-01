// @ts-check
/**
 * Contact page tests.
 *
 * Verifies the contact form elements are present, labels translate correctly,
 * and the mailto: handler is wired (form hides on submit).
 */
const { test, expect } = require('@playwright/test');

test.describe('Contact page – structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('contact form is present', async ({ page }) => {
    await expect(page.locator('#contactForm')).toBeAttached();
  });

  test('name input is present', async ({ page }) => {
    await expect(page.locator('[name="name"]')).toBeAttached();
  });

  test('email input is present', async ({ page }) => {
    await expect(page.locator('[name="_replyto"]')).toBeAttached();
  });

  test('subject select is present', async ({ page }) => {
    await expect(page.locator('[name="subject"]')).toBeAttached();
  });

  test('message textarea is present', async ({ page }) => {
    await expect(page.locator('[name="message"]')).toBeAttached();
  });

  test('submit button is present', async ({ page }) => {
    await expect(page.locator('#contactForm button[type="submit"]')).toBeAttached();
  });

  test('#formSuccess is hidden initially', async ({ page }) => {
    const display = await page.locator('#formSuccess').evaluate(
      el => getComputedStyle(el).display
    );
    expect(display).toBe('none');
  });

  test('subject dropdown has translated options in German', async ({ page }) => {
    const options = await page.locator('[name="subject"] option').all();
    const texts = await Promise.all(options.map(o => o.textContent()));
    const hasGerman = texts.some(t => t?.includes('Projektanfrage') || t?.includes('Thema auswählen'));
    expect(hasGerman).toBe(true);
  });

  test('subject dropdown options switch to English', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    const options = await page.locator('[name="subject"] option').all();
    const texts = await Promise.all(options.map(o => o.textContent()));
    const hasEnglish = texts.some(t => t?.includes('Project Inquiry') || t?.includes('Select a topic'));
    expect(hasEnglish).toBe(true);
  });
});

test.describe('Contact form – label accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('name label is present and associated with input', async ({ page }) => {
    await expect(page.getByLabel('Name').first()).toBeAttached();
  });

  test('email label is present and associated with input', async ({ page }) => {
    await expect(page.getByLabel('E-Mail')).toBeAttached();
  });

  test('subject label is present and associated with select', async ({ page }) => {
    await expect(page.getByLabel('Betreff')).toBeAttached();
  });

  test('message label is present and associated with textarea', async ({ page }) => {
    await expect(page.getByLabel('Nachricht')).toBeAttached();
  });

  test('labels translate to English', async ({ page }) => {
    await page.evaluate(() => window.i18n.setLanguage('en'));
    await expect(page.getByLabel('Email')).toBeAttached();
    await expect(page.getByLabel('Subject')).toBeAttached();
    await expect(page.getByLabel('Message')).toBeAttached();
  });
});

test.describe('Contact page – form submit handler', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('ts_lang'));
    await page.goto('/contact.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('form hides after submit (proves e.preventDefault() and handler run)', async ({ page }) => {
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="_replyto"]', 'test@example.com');
    await page.selectOption('[name="subject"]', { index: 1 });
    await page.fill('[name="message"]', 'Hello, this is a regression test.');

    await page.evaluate(() => {
      document.getElementById('contactForm').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    const display = await page.locator('#contactForm').evaluate(el => el.style.display);
    expect(display).toBe('none');
  });

  test('contact page has a visible email link', async ({ page }) => {
    const mailLinks = page.locator('a[href^="mailto:"]');
    await expect(mailLinks.first()).toBeVisible();
  });
});
