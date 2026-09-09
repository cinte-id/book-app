# Test Coverage Report

**Project:** Book Tracker Application
**Generated Date:** 2026-09-09 15:54:05 UTC+7
**Coverage Tools:** `coverage.py` / `pytest-cov` (Backend), `Vitest v8` (Frontend)

---

## Executive Summary

| Subsystem                                        | Total Statements / Lines | Covered Lines | Coverage % | Target | Status             |
| :----------------------------------------------- | :----------------------: | :-----------: | :--------: | :----: | :----------------- |
| **Backend API (`backend/app.py`)**               |            80            |       76      |  **95.0%** |   80%  | **EXCEEDS TARGET** |
| **Frontend Core Data (`src/data/dummyData.ts`)** |            127           |      127      | **100.0%** |   80%  | **EXCEEDS TARGET** |
| **Frontend API Service (`src/services/api.ts`)** |            61            |       26      |  **42.6%** |   80%  | **IN PROGRESS**    |

---

## 1. Backend Code Coverage Report

### File Level Coverage Metrics

| Module Path       | Statements | Missed | Executed | Coverage % | Missing Line Numbers                                  |
| :---------------- | :--------: | :----: | :------: | :--------: | :---------------------------------------------------- |
| `backend/app.py`  |     80     |    4   |    76    |  **95.0%** | `116-119` (`if __name__ == '__main__': app.run(...)`) |
| **Total Backend** |   **80**   |  **4** |  **76**  |  **95.0%** |                                                       |

### Uncovered Code Analysis

The uncovered lines are lines `116-119`:

```python
115: if __name__ == '__main__':
116:     print(f"Starting Flask server on http://{FLASK_HOST}:{FLASK_PORT}")
117:     print("CORS enabled for development")
118:     print(f"Allowed origins: {CORS_ORIGINS}")
119:     app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)
```

**Analysis:**
Lines 116-119 represent the standalone server entrypoint block executed when `app.py` is invoked directly from the CLI. During pytest suite runs, Flask is loaded as an imported module using test client fixtures, so the main block is intentionally bypassed.

---

## 2. Frontend Code Coverage Report

### Summary by Directory and Module

```text
% Coverage report from v8

-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
src/data           |     100 |      100 |     100 |     100 |
  dummyData.ts     |     100 |      100 |     100 |     100 |
src/services       |   42.59 |      100 |       0 |   42.59 |
  api.ts           |   42.59 |      100 |       0 |   42.59 | ...29,35-39,41-58
-------------------|---------|----------|---------|---------|-------------------
```

### Module Breakdown

| Component / Module      | Statement Coverage | Branch Coverage | Functions | Line Coverage | Status               |
| :---------------------- | :----------------: | :-------------: | :-------: | :-----------: | :------------------- |
| `src/data/dummyData.ts` |       100.0%       |      100.0%     |   100.0%  |   **100.0%**  | **Fully Covered**    |
| `src/services/api.ts`   |        42.6%       |      100.0%     |    0.0%   |   **42.6%**   | **Partial Coverage** |

---

## 3. Recommendations for Coverage Expansion

### 3.1 Frontend Component Integration Tests

Add unit and component tests for the following components using `@testing-library/react`:

* `BookCard.tsx`
* `HeaderNav.tsx`
* `BrowseLibrary.tsx`

The tests should cover component rendering states and user interactions.

### 3.2 Frontend Interceptor Exception Testing

Mock Axios request and response rejections in `api.test.ts` to trigger and test the uncovered lines `28-30` and `41-58` in `api.ts`.

### 3.3 Backend Integration and Edge Cases

Extend the pytest suite to test invalid JSON payloads for `POST /api/books`, including validation of the expected `400` response code.
