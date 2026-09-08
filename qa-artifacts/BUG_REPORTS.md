# Defect Audit & Bug Reports: Book Tracker Application

**Author:** Sandy Yoga Prakasa Holley  
**Role:** QA Engineer  
**GitHub Profile:** [https://github.com/Sandy-YP-Holley](https://github.com/Sandy-YP-Holley)  
**Document Version:** 1.0.0  
**Date:** September 8, 2026  
**Audit Scope:** `backend/app.py`, `frontend/src/components/BrowseLibrary.tsx`, running Flask REST API, and Vite React frontend  

---

## Defect Summary Dashboard

| Bug ID | Title | Severity | Priority | Component | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Primary Key Collision on `POST /api/books` Following Entity Deletion | Critical | High | Backend API (`app.py`) | Verified |
| **BUG-002** | Absence of Server-Side Mandatory Field Validation on `POST /api/books` | High | High | Backend API (`app.py`) | Verified |
| **BUG-003** | Lack of Value and Range Validation on Numeric Fields (`rating`, `pages`) | High | High | Backend API (`app.py`) | Verified |
| **BUG-004** | Unrestricted Domain String Acceptance on Book `status` Attribute | Medium | High | Backend API (`app.py`) | Verified |
| **BUG-005** | Stored Cross-Site Scripting (XSS) Exposure via Unsanitized Payload Persistence | High | High | Backend API (`app.py`) | Verified |
| **BUG-006** | Missing `OPTIONS` HTTP Method on `DELETE /api/books/<id>` Route | Medium | Medium | Backend API (`app.py`) | Verified |
| **BUG-007** | Redundant Status Assignment and Incomplete Status Lifecycle in Browse Library UI | Medium | Medium | Frontend (`BrowseLibrary.tsx`) | Verified |
| **BUG-008** | Inert Filter Button in Browse Library Interface with Missing Event Binding | Low | Low | Frontend (`BrowseLibrary.tsx`) | Verified |
| **BUG-009** | Relative Working Directory Dependency for `DATA_FILE` Persistence | Medium | Medium | Backend API (`app.py`) | Verified |

---

## Formal Defect Reports

### BUG-001: Primary Key Collision on `POST /api/books` Following Entity Deletion

- **Bug ID:** BUG-001
- **Title:** Primary Key Collision on `POST /api/books` Following Entity Deletion
- **Severity:** Critical (S1)
- **Priority:** High (P1)
- **Component:** Backend API (`backend/app.py`, line 69)
- **Preconditions:**
  - Backend API running with initial 8 records (IDs 1 through 8).
- **Steps to Reproduce:**
  1. Send `GET /api/books` and verify 8 books exist with IDs 1 to 8.
  2. Send `DELETE /api/books/2` to delete book with ID 2.
  3. Send `GET /api/books` and verify total count is 7 books.
  4. Send `POST /api/books` with payload:
     ```json
     {
       "title": "New Specimen Book",
       "author": "QA Author"
     }
     ```
  5. Inspect the returned object's `id` and the subsequent `GET /api/books` collection.
- **Expected Result:**
  - The new entity receives a unique identifier (e.g., `id: 9` or higher), preventing duplicate primary keys.
- **Actual Result:**
  - The backend calculates ID via `'id': len(books) + 1`. Since `len(books)` after deletion was 7, the new record is assigned `'id': 8`.
  - The database now contains two distinct books with `id: 8` (`"The Lord of the Rings"` and `"New Specimen Book"`).
  - Any subsequent `PUT /api/books/8` or `DELETE /api/books/8` operates only on the first matching book in the array, rendering the second entity immutable and un-deletable.
- **Suggested Fix:**
  - Generate IDs using a monotonic autoincrement sequence, maximum current ID increment (`max([b['id'] for b in books], default=0) + 1`), or standard UUID v4 strings.

---

### BUG-002: Absence of Server-Side Mandatory Field Validation on `POST /api/books`

- **Bug ID:** BUG-002
- **Title:** Absence of Server-Side Mandatory Field Validation on `POST /api/books`
- **Severity:** High (S2)
- **Priority:** High (P1)
- **Component:** Backend API (`backend/app.py`, lines 67-80)
- **Preconditions:**
  - Backend service operational on `http://localhost:5000`.
- **Steps to Reproduce:**
  1. Send `POST /api/books` with an empty JSON object:
     ```bash
     curl -X POST http://localhost:5000/api/books -H "Content-Type: application/json" -d "{}"
     ```
  2. Inspect HTTP status code and response body.
- **Expected Result:**
  - HTTP 400 Bad Request or HTTP 422 Unprocessable Entity with error message indicating that `title` and `author` are required fields.
- **Actual Result:**
  - HTTP 201 Created returned:
    ```json
    {
      "author": null,
      "cover": "",
      "genre": "",
      "id": 9,
      "pages": 0,
      "rating": 0,
      "status": "want-to-read",
      "title": null
    }
    ```
  - An empty invalid entity is stored in `books.json`.
- **Suggested Fix:**
  - Implement request schema validation verifying presence and non-empty string types for mandatory attributes:
    ```python
    if not data or not data.get('title') or not data.get('author'):
        return jsonify({'error': 'Title and author are required fields'}), 400
    ```

---

### BUG-003: Lack of Value and Range Validation on Numeric Fields (`rating`, `pages`)

- **Bug ID:** BUG-003
- **Title:** Lack of Value and Range Validation on Numeric Fields (`rating`, `pages`)
- **Severity:** High (S2)
- **Priority:** High (P2)
- **Component:** Backend API (`backend/app.py`, lines 73-74)
- **Preconditions:**
  - Backend service operational.
- **Steps to Reproduce:**
  1. Send `POST /api/books` with boundary-violating numerical values:
     ```json
     {
       "title": "Invalid Numbers Test",
       "author": "QA Tester",
       "rating": 999,
       "pages": -50
     }
     ```
  2. Inspect the returned entity.
- **Expected Result:**
  - HTTP 400 Bad Request indicating that `rating` must be between `0.0` and `5.0`, and `pages` must be an integer greater than 0.
- **Actual Result:**
  - HTTP 201 Created returned. Negative page count (`-50`) and astronomical rating (`999`) are persisted verbatim.
- **Suggested Fix:**
  - Enforce bounds validation in `add_book()` and `update_book()`:
    ```python
    try:
        rating = float(data.get('rating', 0))
        pages = int(data.get('pages', 0))
        if not (0.0 <= rating <= 5.0) or pages < 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid numeric range for rating (0-5) or pages (>= 0)'}), 400
    ```

---

### BUG-004: Unrestricted Domain String Acceptance on Book `status` Attribute

- **Bug ID:** BUG-004
- **Title:** Unrestricted Domain String Acceptance on Book `status` Attribute
- **Severity:** Medium (S3)
- **Priority:** High (P2)
- **Component:** Backend API (`backend/app.py`, line 76 and line 101)
- **Preconditions:**
  - Backend service operational.
- **Steps to Reproduce:**
  1. Send `POST /api/books` with arbitrary status string:
     ```json
     {
       "title": "Domain Status Test",
       "author": "QA Tester",
       "status": "archived_non_standard"
     }
     ```
  2. Send `GET /api/books` to inspect persisted status.
- **Expected Result:**
  - HTTP 400 Bad Request rejecting statuses outside allowed set: `['want-to-read', 'reading', 'read']`.
- **Actual Result:**
  - HTTP 201 Created returned. Arbitrary string is stored, breaking frontend display contracts that expect `'read' | 'reading' | 'want-to-read'`.
- **Suggested Fix:**
  - Validate `status` against an enum set:
    ```python
    ALLOWED_STATUSES = {'want-to-read', 'reading', 'read'}
    if data.get('status') and data.get('status') not in ALLOWED_STATUSES:
        return jsonify({'error': f'Status must be one of: {list(ALLOWED_STATUSES)}'}), 400
    ```

---

### BUG-005: Stored Cross-Site Scripting (XSS) Exposure via Unsanitized Payload Persistence

- **Bug ID:** BUG-005
- **Title:** Stored Cross-Site Scripting (XSS) Exposure via Unsanitized Payload Persistence
- **Severity:** High (S2)
- **Priority:** High (P1)
- **Component:** Backend API (`backend/app.py`, lines 70-71)
- **Preconditions:**
  - Backend service operational.
- **Steps to Reproduce:**
  1. Send `POST /api/books` with script tag injection payload:
     ```json
     {
       "title": "<script>alert('xss')</script>",
       "author": "Attacker",
       "genre": "<img src=x onerror=alert(1)>"
     }
     ```
  2. Inspect response body and backend `books.json` content.
- **Expected Result:**
  - Raw HTML/JavaScript characters `<` and `>` are sanitized, encoded, or stripped on ingestion.
- **Actual Result:**
  - Payloads are stored raw into `books.json` and served verbatim via `GET /api/books`. If rendered in clients without automatic context-aware escaping (e.g. `dangerouslySetInnerHTML`), arbitrary JavaScript executes in client browser contexts.
- **Suggested Fix:**
  - Strip or escape markup tags on ingestion using libraries such as `bleach` or `html.escape()`.

---

### BUG-006: Missing `OPTIONS` HTTP Method on `DELETE /api/books/<id>` Route

- **Bug ID:** BUG-006
- **Title:** Missing `OPTIONS` HTTP Method on `DELETE /api/books/<id>` Route
- **Severity:** Medium (S3)
- **Priority:** Medium (P2)
- **Component:** Backend API (`backend/app.py`, line 106)
- **Preconditions:**
  - Backend service operational.
- **Steps to Reproduce:**
  1. Inspect line 106 of `backend/app.py`:
     ```python
     @app.route('/api/books/<int:book_id>', methods=['DELETE'])
     def delete_book(book_id):
     ```
  2. Compare with `PUT` route at line 82:
     ```python
     @app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
     ```
  3. Send an HTTP `OPTIONS` request to `/api/books/1`.
- **Expected Result:**
  - HTTP 200 OK with allowed CORS preflight headers (`Access-Control-Allow-Methods: DELETE,...`).
- **Actual Result:**
  - In environments where standard preflight routing relies on endpoint method declarations, preflight `OPTIONS` requests fail with HTTP 405 Method Not Allowed.
- **Suggested Fix:**
  - Add `'OPTIONS'` to route methods or rely uniformly on Flask-CORS middleware rather than manual ad-hoc method routing:
    ```python
    @app.route('/api/books/<int:book_id>', methods=['DELETE', 'OPTIONS'])
    ```

---

### BUG-007: Redundant Status Assignment and Incomplete Status Lifecycle in Browse Library UI

- **Bug ID:** BUG-007
- **Title:** Redundant Status Assignment and Incomplete Status Lifecycle in Browse Library UI
- **Severity:** Medium (S3)
- **Priority:** Medium (P2)
- **Component:** Frontend (`frontend/src/components/BrowseLibrary.tsx`, lines 56-71, 137-148)
- **Preconditions:**
  - User is on the Browse Library page (`/`).
- **Steps to Reproduce:**
  1. Inspect a book that is in status `want-to-read`.
  2. Notice that the action button displayed is a green "+" icon.
  3. Click the "+" button.
  4. Inspect network traffic: The client dispatches:
     ```json
     PUT /api/books/<id> {"status": "want-to-read"}
     ```
  5. Inspect a book with status `reading` or `read`: Only a read-only pill is rendered with zero interaction controls.
- **Expected Result:**
  - Clicking the "+" button should add an unadded book or transition `want-to-read` to `reading`. Users should have interactive controls to transition books across all lifecycle statuses (`want-to-read` -> `reading` -> `read`).
- **Actual Result:**
  - Clicking "+" issues an idempotent mutation setting `status: 'want-to-read'` on a book that is already `want-to-read`.
  - Books with other statuses cannot be transitioned from the Browse Library interface.
- **Suggested Fix:**
  - Update `BrowseLibrary.tsx` with a status dropdown selector or cycle button enabling full state transition controls.

---

### BUG-008: Inert Filter Button in Browse Library Interface with Missing Event Binding

- **Bug ID:** BUG-008
- **Title:** Inert Filter Button in Browse Library Interface with Missing Event Binding
- **Severity:** Low (S4)
- **Priority:** Low (P3)
- **Component:** Frontend (`frontend/src/components/BrowseLibrary.tsx`, line 93)
- **Preconditions:**
  - User navigates to Browse Library view.
- **Steps to Reproduce:**
  1. Click the `<Filter />` icon button located in the header right corner next to "Browse Library".
  2. Inspect UI response and console logs.
- **Expected Result:**
  - Filter modal, drawer, or sorting menu opens to enable sorting by rating, pages, or publication date.
- **Actual Result:**
  - The button is completely inert. Code inspection reveals `<button className="p-2 text-gray-600 hover:text-gray-800 transition-colors"><Filter size={20} /></button>` lacks an `onClick` handler and accessible name.
- **Suggested Fix:**
  - Bind an `onClick` handler to open a sorting/filtering dialog or remove the inert element until implemented.

---

### BUG-009: Relative Working Directory Dependency for `DATA_FILE` Persistence

- **Bug ID:** BUG-009
- **Title:** Relative Working Directory Dependency for `DATA_FILE` Persistence
- **Severity:** Medium (S3)
- **Priority:** Medium (P2)
- **Component:** Backend API (`backend/app.py`, line 18)
- **Preconditions:**
  - Python application started from workspace root (`book-app/`) rather than `book-app/backend/`.
- **Steps to Reproduce:**
  1. Execute `python backend/app.py` from repository root.
  2. `DATA_FILE` defaults to `'books.json'`.
  3. `open('books.json', 'r')` looks for `books.json` in the current working directory (`book-app/books.json`) instead of `backend/books.json`.
- **Expected Result:**
  - Data file path resolves relative to the backend module directory (`os.path.join(os.path.dirname(__file__), DATA_FILE)`).
- **Actual Result:**
  - `FileNotFoundError` occurs if run from an arbitrary working directory, resetting database state to empty collection `[]`.
- **Suggested Fix:**
  - Resolve absolute path based on script location:
    ```python
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_FILE = os.path.join(BASE_DIR, os.getenv('DATA_FILE', 'books.json'))
    ```
