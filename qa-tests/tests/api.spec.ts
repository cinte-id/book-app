import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:5000';

test.describe('Backend API Test Suite - Book Tracker', () => {
  const createdBookIds: number[] = [];

  test.afterEach(async ({ request }) => {
    while (createdBookIds.length > 0) {
      const id = createdBookIds.pop();
      if (id) {
        await request.delete(`${API_URL}/api/books/${id}`);
      }
    }
  });

  test('TC-API-001: Health check endpoint returns CORS confirmation', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/test`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('message', 'CORS is working!');
  });

  test('TC-API-002: GET /api/books returns book collection with valid schema', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/books`);
    expect(response.status()).toBe(200);

    const books = await response.json();
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);

    const firstBook = books[0];
    expect(firstBook).toHaveProperty('id');
    expect(firstBook).toHaveProperty('title');
    expect(firstBook).toHaveProperty('author');
    expect(firstBook).toHaveProperty('rating');
    expect(firstBook).toHaveProperty('pages');
    expect(firstBook).toHaveProperty('genre');
    expect(firstBook).toHaveProperty('status');
  });

  test('TC-API-003: POST /api/books creates a valid book record', async ({ request }) => {
    const uniqueTitle = `Automated QA Book - ${Date.now()}`;
    const payload = {
      title: uniqueTitle,
      author: 'Sandy Yoga Prakasa Holley',
      cover: 'https://covers.openlibrary.org/b/id/12749894-L.jpg',
      rating: 4.5,
      pages: 350,
      genre: 'Quality Engineering',
      status: 'want-to-read',
    };

    const response = await request.post(`${API_URL}/api/books`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.id).toBeDefined();
    expect(created.title).toBe(uniqueTitle);
    expect(created.author).toBe(payload.author);
    expect(created.rating).toBe(payload.rating);
    expect(created.pages).toBe(payload.pages);
    expect(created.genre).toBe(payload.genre);
    expect(created.status).toBe(payload.status);

    createdBookIds.push(created.id);
  });

  test('TC-API-004: PUT /api/books/<id> updates book fields and status', async ({ request }) => {
    const uniqueTitle = `Update Target Book - ${Date.now()}`;
    const createRes = await request.post(`${API_URL}/api/books`, {
      data: {
        title: uniqueTitle,
        author: 'Sandy Yoga Prakasa Holley',
        rating: 3.0,
        pages: 200,
        genre: 'Technical',
        status: 'want-to-read',
      },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    createdBookIds.push(created.id);

    const updatePayload = {
      title: `${uniqueTitle} (Updated)`,
      author: 'Sandy Yoga Prakasa Holley',
      rating: 4.8,
      pages: 250,
      genre: 'Technical Reference',
      status: 'reading',
    };

    const updateRes = await request.put(`${API_URL}/api/books/${created.id}`, {
      data: updatePayload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.id).toBe(created.id);
    expect(updated.status).toBe('reading');
    expect(updated.rating).toBe(4.8);
    expect(updated.pages).toBe(250);
  });

  test('TC-API-005: DELETE /api/books/<id> removes record successfully', async ({ request }) => {
    const createRes = await request.post(`${API_URL}/api/books`, {
      data: {
        title: `Deletion Candidate - ${Date.now()}`,
        author: 'Temporary Author',
        rating: 1.0,
        pages: 100,
        genre: 'Temporary',
        status: 'want-to-read',
      },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();

    const deleteRes = await request.delete(`${API_URL}/api/books/${created.id}`);
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.id).toBe(created.id);

    const listRes = await request.get(`${API_URL}/api/books`);
    const books = await listRes.json();
    const found = books.find((b: { id: number }) => b.id === created.id);
    expect(found).toBeUndefined();
  });

  test('TC-API-006: PUT /api/books/<id> with non-existent ID returns 404', async ({ request }) => {
    const response = await request.put(`${API_URL}/api/books/999999`, {
      data: { title: 'Ghost Book' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Book not found');
  });

  test('TC-API-007: DELETE /api/books/<id> with non-existent ID returns 404', async ({ request }) => {
    const response = await request.delete(`${API_URL}/api/books/999999`);
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toHaveProperty('error', 'Book not found');
  });
});
