import { defineConfig, devices } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:5000';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  /**
   * Browser Execution Matrix:
   * By default, the automated test suite executes on Chromium-based browser engines:
   * 1. 'chromium': Desktop Chrome profile, utilizing CHROME_BIN if specified or the system
   *    Chromium-based Microsoft Edge engine (channel: 'msedge').
   * 2. 'msedge': Native Microsoft Edge browser profile (channel: 'msedge').
   *
   * Multi-engine execution (Firefox / WebKit) is opt-in via ALL_BROWSERS=true and requires
   * installing standalone Playwright engine binaries via `npx playwright install firefox webkit`.
   * The primary automated test suite runs strictly on Chromium and Microsoft Edge engines.
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : { channel: 'msedge' }),
      },
    },
    {
      name: 'msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    ...(process.env.ALL_BROWSERS ? [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ] : []),
  ],
  metadata: {
    apiUrl: API_URL,
    frontendUrl: BASE_URL,
    author: 'Sandy Yoga Prakasa Holley',
    github: 'https://github.com/Sandy-YP-Holley',
    role: 'QA Engineer',
  },
});
