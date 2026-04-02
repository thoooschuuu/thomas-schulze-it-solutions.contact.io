// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for the Thomas Schulze IT Solutions static site tests.
 *
 * The webServer serves the site from the repository root using Python's built-in
 * HTTP server so no build step is needed. Tests run against that local server
 * and do NOT touch the deployed GitHub Pages site.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'line',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Serve the static site from the repository root (parent of this tests/ dir). */
  webServer: {
    command: 'python3 -m http.server 3000',
    cwd: '..',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'ignore',
  },
});
