# Test Execution Results

**Project:** Book Tracker Application
**Execution Date:** 2026-09-09 15:54:05 UTC+7
**Environment:** Windows (Node v22.11.0, Python 3.14.0)
**Overall Execution Status:** `PASSED` (16 / 16 Tests Passed)

---

## Summary Dashboard

| Suite            | Framework    | Total Tests | Passed | Failed | Skipped |  Duration |     Status    |
| :--------------- | :----------- | :---------: | :----: | :----: | :-----: | :-------: | :-----------: |
| **Backend API**  | Pytest 9.1.1 |      10     |   10   |    0   |    0    |   0.29s   |   **PASSED**  |
| **Frontend Web** | Vitest 2.1.9 |      6      |    6   |    0   |    0    |   4.72s   |   **PASSED**  |
| **TOTAL**        |              |    **16**   | **16** |  **0** |  **0**  | **5.01s** | **100% PASS** |

---

## 1. Backend Test Execution Details (`pytest`)

### Execution Command

```bash
.\venv\Scripts\python -m pytest test_app.py --cov=app --cov-report=term-missing
```

### Detailed Test Results Table

| Test File     | Test Case Name                   | Description                                                              |   Status   |  Time  |
| :------------ | :------------------------------- | :----------------------------------------------------------------------- | :--------: | :----: |
| `test_app.py` | `test_cors_endpoint`             | Verifies `/api/test` endpoint returns 200 and CORS confirmation message  | **PASSED** | <0.01s |
| `test_app.py` | `test_get_books`                 | Verifies `GET /api/books` returns full list of books                     | **PASSED** | <0.01s |
| `test_app.py` | `test_get_books_options`         | Verifies OPTIONS preflight request headers for `/api/books`              | **PASSED** | <0.01s |
| `test_app.py` | `test_add_book`                  | Verifies `POST /api/books` successfully creates and persists a new book  | **PASSED** |  0.02s |
| `test_app.py` | `test_update_book`               | Verifies `PUT /api/books/<id>` updates book properties correctly         | **PASSED** |  0.01s |
| `test_app.py` | `test_update_book_options`       | Verifies OPTIONS preflight request for book update route                 | **PASSED** | <0.01s |
| `test_app.py` | `test_update_book_not_found`     | Verifies `PUT /api/books/999` returns 404 error when book does not exist | **PASSED** | <0.01s |
| `test_app.py` | `test_delete_book`               | Verifies `DELETE /api/books/<id>` removes book from list                 | **PASSED** |  0.01s |
| `test_app.py` | `test_delete_book_not_found`     | Verifies `DELETE /api/books/999` returns 404 for invalid ID              | **PASSED** | <0.01s |
| `test_app.py` | `test_load_books_file_not_found` | Verifies graceful fallback to empty array when JSON file is missing      | **PASSED** | <0.01s |

### Raw Console Output

```text
============================= test session starts =============================

platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0

rootdir: C:\Users\Pongo\Downloads\book-app\backend

plugins: cov-7.1.0

collected 10 items

test_app.py ..........                                      [100%]

=============================== tests coverage ================================

___________ coverage: platform win32, python 3.14.0-final-0 ___________

Name     Stmts   Miss  Cover   Missing
--------------------------------------
app.py      80      4    95%   116-119
--------------------------------------
TOTAL       80      4    95%

============================= 10 passed in 0.29s ==============================
```

---

## 2. Frontend Test Execution Details (`vitest`)

### Execution Command

```bash
npx vitest run --coverage
```

### Detailed Test Results Table

| Test Suite File     | Test Case Name                                                  | Description                                                  |   Status   | Time |
| :------------------ | :-------------------------------------------------------------- | :----------------------------------------------------------- | :--------: | :--: |
| `dummyData.test.ts` | `should contain initial books array with required properties`   | Validates schema and status types of dummy books data        | **PASSED** |  5ms |
| `dummyData.test.ts` | `should contain currentlyReading array with valid page numbers` | Validates page bounds (`currentPage <= totalPages`)          | **PASSED** |  1ms |
| `dummyData.test.ts` | `should have consistent reading stats`                          | Checks boundaries for total books, ratings, and streaks      | **PASSED** |  1ms |
| `dummyData.test.ts` | `should have valid reading goals progress`                      | Ensures current progress does not exceed target goals        | **PASSED** |  2ms |
| `api.test.ts`       | `should be defined with correct default config`                 | Validates default headers and CORS options on Axios instance | **PASSED** |  4ms |
| `api.test.ts`       | `should have request and response interceptors registered`      | Verifies registration of error interceptors                  | **PASSED** |  2ms |

### Raw Console Output

```text
RUN  v2.1.9 C:/Users/Pongo/Downloads/book-app/frontend

     Coverage enabled with v8

✓ src/__tests__/dummyData.test.ts (4 tests) 9ms

✓ src/__tests__/api.test.ts (2 tests) 6ms

Test Files  2 passed (2)

     Tests  6 passed (6)

  Start at  15:54:05

  Duration  4.72s (transform 87ms, setup 75ms, collect 210ms, tests 15ms, environment 41.28s, prepare 797ms)
```

---
