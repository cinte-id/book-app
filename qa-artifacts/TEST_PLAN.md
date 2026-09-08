# Test Plan: Book Tracker Application

**Author:** Sandy Yoga Prakasa Holley  
**Role:** QA Engineer  
**GitHub Profile:** [https://github.com/Sandy-YP-Holley](https://github.com/Sandy-YP-Holley)  
**Document Version:** 1.0.0  
**Date:** September 8, 2026  
**Status:** Approved  

---

## 1. Executive Summary

This Test Plan defines the testing strategy, test scenarios, execution criteria, and quality governance for the Book Tracker application. The target system comprises a Flask REST API backend and a Vite React TypeScript frontend. The scope addresses API validation, frontend UI integration restricted to the "Browse Library" module, security resilience, edge cases, accessibility (WCAG 2.1 AA), and performance benchmarks.

---

## 2. Scope of Testing

### 2.1 In-Scope Components
- **Backend REST API Endpoints:**
  - `GET /api/test` (Health check and CORS headers verification)
  - `GET /api/books` (Retrieve book catalog)
  - `POST /api/books` (Add book entity)
  - `PUT /api/books/<id>` (Update book entity details and reading status)
  - `DELETE /api/books/<id>` (Remove book entity)
- **Frontend Integration Module:**
  - "Browse Library" view (`/` under Library > Browse)
  - Search filtering by book title and author
  - Genre classification filter controls
  - Dynamic status mutation (`want-to-read`)
- **Non-Functional Testing:**
  - Security payload resilience (XSS injection, SQL injection syntax tolerance, boundary string lengths)
  - Concurrency and API response time benchmarks
  - WCAG 2.1 AA accessibility audit of the Browse Library interface

### 2.2 Out-of-Scope Components
- Third-party external cover image hosting services (OpenLibrary CDN availability)
- Unintegrated mock views (Home, Discover, Reading, and Profile tabs using local static dummy data)
- Production infrastructure deployment pipelines

---

## 3. Test Environments

| Environment Identifier | Layer | Host / Base URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Local Development (Default)** | Backend API | `http://localhost:5000` | Local API test execution and unit verification |
| **Local Development (Default)** | Frontend UI | `http://localhost:5173` | Local browser automation and E2E validation |
| **Local Development (Secondary)**| Backend API | `http://127.0.0.1:5001` | Alternative local runtime port configuration |
| **Local Development (Secondary)**| Frontend UI | `http://localhost:8080` | Alternative Vite server port configuration |
| **Live Environment** | Full Stack | `https://book-app.cinte.id/` | Staging/Production release verification |

---

## 4. Test Strategy and Methodology

### 4.1 Testing Levels
1. **API Level (Component & Integration):** Direct HTTP request execution against endpoints via Playwright API test client (`@playwright/test`) and Python benchmark harnesses to validate payload contracts, status codes, headers, and persistence behavior.
2. **End-to-End (E2E) Browser Testing:** User flow automation on Chromium, Microsoft Edge, Firefox, and WebKit to validate component rendering, reactive state management, asynchronous data retrieval, and user interactions.
3. **Security Testing:** Robustness testing against unvalidated inputs, script injection strings, oversized strings, and malformed JSON bodies.
4. **Performance Testing:** Quantitative profiling of single-request latency percentiles (p50, p90, p95, p99) and concurrent request throughput (RPS).
5. **Accessibility Testing:** Manual and automated audits following WCAG 2.1 Level AA criteria.

### 4.2 State Management and Test Isolation
The Flask backend relies entirely on an in-memory Python list (`books = [...]`). To prevent test cross-contamination:
- Test cases operating on mutable state must generate unique entities with timestamps.
- Post-test teardown hooks (`afterEach` / `afterAll`) must issue `DELETE` requests for any created records.
- Tests must operate independently of initial database sequence assumptions.

---

## 5. Test Scenarios Matrix

### 5.1 API Positive Scenarios

| Test Case ID | Test Objective | Method & Endpoint | Input Data / Preconditions | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-API-001** | Verify API health and CORS configuration | `GET /api/test` | None | HTTP 200, response body contains `{"message": "CORS is working!"}`, CORS headers present |
| **TC-API-002** | Retrieve full book catalog | `GET /api/books` | Baseline data in backend | HTTP 200, JSON array of books containing fields: `id`, `title`, `author`, `rating`, `pages`, `genre`, `status` |
| **TC-API-003** | Create new book with valid payload | `POST /api/books` | Complete JSON object with title, author, cover, rating (4.5), pages (350), genre, status (`want-to-read`) | HTTP 201, returned entity matches input values and assigns integer ID |
| **TC-API-004** | Update book reading status | `PUT /api/books/<id>` | Existing book ID, payload `{"status": "reading"}` | HTTP 200, book entity returned with updated `status: "reading"` |
| **TC-API-005** | Update multiple book attributes | `PUT /api/books/<id>` | Existing book ID, payload `{"title": "New Title", "rating": 4.8, "pages": 400}` | HTTP 200, book entity returned with modified fields updated and unaffected fields preserved |
| **TC-API-006** | Complete reading cycle transition | `PUT /api/books/<id>` | Existing book ID, sequential updates: `want-to-read` -> `reading` -> `read` | HTTP 200 on each transition, status persisted accurately |
| **TC-API-007** | Delete book entity | `DELETE /api/books/<id>` | Existing book ID | HTTP 200, returned deleted object, subsequent `GET /api/books` does not include ID |

### 5.2 API Negative and Boundary Scenarios

| Test Case ID | Test Objective | Method & Endpoint | Input Data / Preconditions | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-API-008** | Create book with empty JSON body | `POST /api/books` | `{}` with `Content-Type: application/json` | HTTP 400 or 422 Bad Request rejecting entity creation with missing mandatory fields |
| **TC-API-009** | Create book with missing required fields | `POST /api/books` | `{"pages": 200}` (missing `title` and `author`) | HTTP 400 or 422 Bad Request with descriptive validation message |
| **TC-API-010** | Create book with non-JSON content type | `POST /api/books` | Raw text or missing `Content-Type` header | HTTP 415 Unsupported Media Type |
| **TC-API-011** | Create book with invalid rating boundaries | `POST /api/books` | `{"title": "Test", "author": "QA", "rating": 999}` or `{"rating": -5}` | HTTP 400 or 422 rejecting ratings outside standard 0.0 to 5.0 range |
| **TC-API-012** | Create book with negative page count | `POST /api/books` | `{"title": "Test", "author": "QA", "pages": -100}` | HTTP 400 or 422 rejecting negative page numbers |
| **TC-API-013** | Create book with invalid status value | `POST /api/books` | `{"title": "Test", "author": "QA", "status": "invalid_status_enum"}` | HTTP 400 or 422 rejecting status values outside allowed domain (`read`, `reading`, `want-to-read`) |
| **TC-API-014** | Update non-existent book ID | `PUT /api/books/999999` | Non-existent ID, valid payload | HTTP 404 Not Found with `{"error": "Book not found"}` |
| **TC-API-015** | Delete non-existent book ID | `DELETE /api/books/999999` | Non-existent ID | HTTP 404 Not Found with `{"error": "Book not found"}` |
| **TC-API-016** | ID generation resilience after deletion | `DELETE` followed by `POST` | Delete intermediate book ID, then add new book | New book receives unique monotonically increasing ID without ID collision |
| **TC-API-017** | Stored XSS payload handling | `POST /api/books` | `title: "<script>alert('xss')</script>"` | Input sanitized or escaped; payload must not execute in browser DOM |
| **TC-API-018** | SQL injection string handling | `POST /api/books` | `title: "' OR '1'='1'; DROP TABLE books; --"` | Treated as literal text string; does not disrupt data store |
| **TC-API-019** | Boundary string length stress | `POST /api/books` | `genre` containing 5,000 characters | HTTP 400 or payload truncated safely to field boundary |
| **TC-API-020** | Rapid repeated requests | `GET /api/books` | 50 concurrent requests | All requests succeed with HTTP 200 without race conditions or server crash |

### 5.3 Frontend Browse Library E2E Scenarios

| Test Case ID | Test Objective | Target Element / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-E2E-001** | Browse Library initial render | Navigate to Library -> Browse | Heading "Browse Library" visible, books count displayed, catalog items loaded from backend |
| **TC-E2E-002** | Search books by title | Search input filled with "Gatsby" | List displays "The Great Gatsby", hides non-matching books, result count matches |
| **TC-E2E-003** | Search books by author | Search input filled with "George Orwell" | List displays "1984", hides non-matching books |
| **TC-E2E-004** | Filter books by genre button | Click "Classic" genre pill | Only books matching "Classic" genre are visible |
| **TC-E2E-005** | Reset genre filter to all | Click "All Genres" pill | Full book catalog is restored in view |
| **TC-E2E-006** | Add to library interaction | Click "+" button on `want-to-read` book | `PUT /api/books/<id>` dispatched, status remains or updates as indicated |
| **TC-E2E-007** | Empty search result handling | Search input filled with non-existent query "xyzabc123" | Message "No books found matching your criteria" displayed, 0 books found |

---

## 6. Entry and Exit Criteria

### 6.1 Entry Criteria
- Flask backend API running on `http://localhost:5000` (or `http://127.0.0.1:5001`).
- Vite React frontend running on `http://localhost:5173` (or `http://localhost:8080`).
- Automated dependencies installed (`@playwright/test`, `python-dotenv`, `Flask`, `Flask-Cors`).

### 6.2 Exit Criteria
- 100% of automated test scenarios executed with reports generated.
- All documented defects analyzed, assigned severity/priority, and cataloged in `BUG_REPORTS.md`.
- Performance latency benchmarks established for single and concurrent workloads.
- Accessibility evaluation completed with remediation recommendations.

---

## 7. Defect Management and Severity Classification

- **Critical (S1):** System crash, memory corruption, unhandled 500 error on valid data, or severe ID collision causing data corruption.
- **High (S2):** Missing server-side validation leading to bad entity state, security vulnerabilities (Stored XSS), or non-functional major features.
- **Medium (S3):** Missing HTTP route handlers (OPTIONS), UI state desynchronization, or unhandled UI error boundaries.
- **Low (S4):** Minor visual contrast deficiencies, inert buttons without click handlers, or missing accessible names.
