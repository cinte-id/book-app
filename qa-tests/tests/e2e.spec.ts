import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5000';

test.describe('Browse Library E2E Browser Suite', () => {
  let testBookId: number | null = null;

  test.beforeEach(async ({ request, page }) => {
    // Seed isolated test record into backend so E2E test has predictable state
    const res = await request.post(`${API_URL}/api/books`, {
      data: {
        title: `E2E Specimen Book - ${Date.now()}`,
        author: 'Sandy Yoga Prakasa Holley',
        cover: 'https://covers.openlibrary.org/b/id/12749894-L.jpg',
        rating: 4.9,
        pages: 310,
        genre: 'QA Testing',
        status: 'want-to-read',
      },
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok()) {
      const created = await res.json();
      testBookId = created.id;
    }

    // Navigate to base URL and open Library -> Browse section
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Library' }).click();
    await page.getByRole('button', { name: 'Browse' }).click();
    await expect(page.getByRole('heading', { name: 'Browse Library' })).toBeVisible();
  });

  test.afterEach(async ({ request }) => {
    // Clean up created record from volatile backend
    if (testBookId) {
      await request.delete(`${API_URL}/api/books/${testBookId}`);
      testBookId = null;
    }
  });

  test('TC-E2E-001: Browse Library loads and displays books from backend', async ({ page }) => {
    await expect(page.locator('text=/\\d+ books? found/')).toBeVisible();
    await expect(page.locator('text=The Great Gatsby')).toBeVisible();
  });

  test('TC-E2E-002: Search input filters books dynamically by title and author', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search books or authors...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Gatsby');
    await expect(page.locator('text=The Great Gatsby')).toBeVisible();
    await expect(page.locator('text=1984')).not.toBeVisible();

    await searchInput.clear();
    await searchInput.fill('George Orwell');
    await expect(page.locator('text=1984')).toBeVisible();
    await expect(page.locator('text=The Great Gatsby')).not.toBeVisible();
  });

  test('TC-E2E-003: Genre filter button updates visible book collection', async ({ page }) => {
    const classicBtn = page.getByRole('button', { name: 'Classic', exact: true });
    if (await classicBtn.isVisible()) {
      await classicBtn.click();
      await expect(page.locator('text=The Great Gatsby')).toBeVisible();
    }

    const allBtn = page.getByRole('button', { name: 'All Genres', exact: true });
    await allBtn.click();
    await expect(page.locator('text=/\\d+ books? found/')).toBeVisible();
  });

  test('TC-E2E-004: Status interaction on want-to-read book triggers PUT request', async ({ page }) => {
    // Locate the specimen book created in beforeEach
    const searchInput = page.getByPlaceholder('Search books or authors...');
    await searchInput.fill('E2E Specimen');

    await expect(page.locator('text=E2E Specimen Book')).toBeVisible();
    const plusBtn = page.locator('.relative').filter({ hasText: 'E2E Specimen Book' }).locator('button');
    await expect(plusBtn).toBeVisible();

    // Intercept PUT request to verify network call to backend
    const [putRequest] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('/api/books/') && req.method() === 'PUT'),
      plusBtn.click(),
    ]);

    expect(putRequest.url()).toContain(String(testBookId));
  });
});
