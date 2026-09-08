# Test Execution Report: Book Tracker Application

**Author:** Sandy Yoga Prakasa Holley  
**Role:** QA Engineer  
**GitHub Profile:** [https://github.com/Sandy-YP-Holley](https://github.com/Sandy-YP-Holley)  
**Execution Date:** September 8, 2026  
**Execution Environment:** Windows 10 (AMD64), Node.js v24.20.0, Python 3.14.7, Playwright v1.47.0  
**Target Services:** Backend API (`http://localhost:5000`), Frontend UI (`http://localhost:5173`)  

---

## 1. Execution Summary Dashboard

```
=============================================================================
                          TEST EXECUTION OVERVIEW
=============================================================================
Total Test Scenarios Defined:               27
Automated Test Executions Run:              22 (11 on Chromium + 11 on Edge)
Automated Tests Passed:                     22
Automated Tests Failed:                      0
Automated Pass Rate:                       100.0%
Exploratory / Negative Tests Executed:      13
Exploratory Scenarios Flagged (Defects):     7 (Documented in BUG_REPORTS.md)
Overall Release Recommendation:             CONDITIONAL REJECTION (Fix S1/S2)
=============================================================================
```

---

## 2. Automated Test Suite Execution Details

Automated tests were executed via Playwright (`@playwright/test`) with strict test isolation and teardown cleanup against the volatile in-memory/JSON store.

### 2.1 Backend API Test Results (`qa-tests/tests/api.spec.ts`)

| Test Case ID | Test Scenario | Project / Engine | Duration | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-API-001** | Health check endpoint returns CORS confirmation | Chromium | 33 ms | **PASS** |
| **TC-API-002** | GET /api/books returns book collection with valid schema | Chromium | 13 ms | **PASS** |
| **TC-API-003** | POST /api/books creates a valid book record | Chromium | 19 ms | **PASS** |
| **TC-API-004** | PUT /api/books/\<id\> updates book fields and status | Chromium | 30 ms | **PASS** |
| **TC-API-005** | DELETE /api/books/\<id\> removes record successfully | Chromium | 23 ms | **PASS** |
| **TC-API-006** | PUT /api/books/\<id\> with non-existent ID returns 404 | Chromium | 20 ms | **PASS** |
| **TC-API-007** | DELETE /api/books/\<id\> with non-existent ID returns 404 | Chromium | 9 ms | **PASS** |
| **TC-API-001** | Health check endpoint returns CORS confirmation | Microsoft Edge | 33 ms | **PASS** |
| **TC-API-002** | GET /api/books returns book collection with valid schema | Microsoft Edge | 13 ms | **PASS** |
| **TC-API-003** | POST /api/books creates a valid book record | Microsoft Edge | 20 ms | **PASS** |
| **TC-API-004** | PUT /api/books/\<id\> updates book fields and status | Microsoft Edge | 35 ms | **PASS** |
| **TC-API-005** | DELETE /api/books/\<id\> removes record successfully | Microsoft Edge | 23 ms | **PASS** |
| **TC-API-006** | PUT /api/books/\<id\> with non-existent ID returns 404 | Microsoft Edge | 24 ms | **PASS** |
| **TC-API-007** | DELETE /api/books/\<id\> with non-existent ID returns 404 | Microsoft Edge | 10 ms | **PASS** |

### 2.2 Browse Library E2E Browser Test Results (`qa-tests/tests/e2e.spec.ts`)

| Test Case ID | Test Scenario | Project / Engine | Duration | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-E2E-001** | Browse Library loads and displays books from backend | Chromium | 1,200 ms | **PASS** |
| **TC-E2E-002** | Search input filters books dynamically by title and author | Chromium | 1,100 ms | **PASS** |
| **TC-E2E-003** | Genre filter button updates visible book collection | Chromium | 1,400 ms | **PASS** |
| **TC-E2E-004** | Status interaction on want-to-read book triggers PUT request | Chromium | 1,100 ms | **PASS** |
| **TC-E2E-001** | Browse Library loads and displays books from backend | Microsoft Edge | 1,500 ms | **PASS** |
| **TC-E2E-002** | Search input filters books dynamically by title and author | Microsoft Edge | 1,100 ms | **PASS** |
| **TC-E2E-003** | Genre filter button updates visible book collection | Microsoft Edge | 1,100 ms | **PASS** |
| **TC-E2E-004** | Status interaction on want-to-read book triggers PUT request | Microsoft Edge | 1,100 ms | **PASS** |

---

## 3. Exploratory, Negative, and Edge Scenario Execution Results

| Test Case ID | Objective | Tested Input / Trigger | Observed Result | Defect Link | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-API-008** | Empty JSON Body on POST | `POST /api/books` with `{}` | Returns HTTP 201 with null values; entity stored | **BUG-002** | **FAIL** |
| **TC-API-009** | Missing Mandatory Fields | `POST /api/books` without `title` | Returns HTTP 201 with null title; entity stored | **BUG-002** | **FAIL** |
| **TC-API-010** | Content-Type Validation | `POST /api/books` with no headers | Returns HTTP 415 Unsupported Media Type | None | **PASS** |
| **TC-API-011** | Boundary Numerical Ratings | `POST` rating: `999` and `-5` | Accepted with HTTP 201 and stored verbatim | **BUG-003** | **FAIL** |
| **TC-API-012** | Boundary Negative Pages | `POST` pages: `-50` | Accepted with HTTP 201 and stored verbatim | **BUG-003** | **FAIL** |
| **TC-API-013** | Unvalidated Status Strings | `POST` status: `"invalid_status"` | Accepted with HTTP 201 and stored verbatim | **BUG-004** | **FAIL** |
| **TC-API-014** | PUT Non-existent ID | `PUT /api/books/999999` | Returns HTTP 404 `{"error": "Book not found"}` | None | **PASS** |
| **TC-API-015** | DELETE Non-existent ID | `DELETE /api/books/999999` | Returns HTTP 404 `{"error": "Book not found"}` | None | **PASS** |
| **TC-API-016** | ID Monotonicity after Deletion | Delete ID 2, then `POST` | Assigns duplicate ID `8` (`len(books) + 1`) | **BUG-001** | **FAIL** |
| **TC-API-017** | Stored XSS Script Payload | `<script>alert('xss')</script>` | Stored verbatim into database without escaping | **BUG-005** | **FAIL** |
| **TC-API-018** | SQL Injection Syntax Test | `' OR '1'='1'; --` | Persisted as raw string (SQLite unattached) | None | **PASS** |
| **TC-API-019** | Large Payload String Stress | 5,000 characters in `genre` | Accepted with HTTP 201 without length limits | None | **PASS** |
| **TC-API-020** | Concurrent Load Stability | 50 requests with 5 workers | 100% HTTP 200 response rate, 394.75 RPS | None | **PASS** |
| **TC-E2E-005** | Reset Filter to All Genres | Click "All Genres" button | Restores full list accurately | None | **PASS** |
| **TC-E2E-006** | Status Lifecycle Control | Click Plus button on item | Re-sends same status; no reading/read controls | **BUG-007** | **FAIL** |
| **TC-E2E-007** | No Match Search Query | Search "xyznonexistent" | Displays "No books found matching your criteria" | None | **PASS** |

---

## 4. Key Quality Findings and Risk Assessment

1. **Data Integrity Hazard (Critical):**
   The primary key assignment mechanism (`'id': len(books) + 1`) in `backend/app.py` is unsafe for production. Once any intermediate book is deleted, adding a subsequent record causes duplicated primary keys, breaking relational consistency and record retrieval.
2. **Missing Ingestion Boundaries (High):**
   Zero server-side validation is implemented on `POST /api/books`. The API happily persists entities with `null` titles, negative page numbers, out-of-range ratings, and unvalidated status strings.
3. **Security Ingestion Risk (High):**
   Raw HTML and script tags are accepted without sanitization or HTML entity escaping. This introduces Stored XSS risks if downstream clients render entity properties without escaping.
4. **Browse Library Functional Gap (Medium):**
   While the backend exposes complete CRUD capabilities, the frontend UI currently only consumes `GET /api/books` and an idempotent `PUT` (setting `status: 'want-to-read'`). Neither entity creation (`POST`) nor deletion (`DELETE`) is exposed in the user interface.

---

## 5. Release Recommendation

- **Deployment Status:** **CONDITIONAL REJECTION**
- **Action Required Prior to Release:**
  1. Patch `BUG-001` (ID autoincrement mechanism) to guarantee unique IDs.
  2. Implement request schema validation (`BUG-002`, `BUG-003`, `BUG-004`) rejecting malformed payloads with HTTP 400 Bad Request.
  3. Sanitize text ingestion to eliminate Stored XSS vectors (`BUG-005`).
