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
| **BUG-005** | Lack of Input Sanitization and HTML Tag Stripping on Book Metadata Fields | Medium | Medium | Backend API (`app.py`) | Verified |
| **BUG-006** | Missing `OPTIONS` HTTP Method on `DELETE /api/books/<id>` Route (Declarative Route Inconsistency) | Medium | Medium | Backend API (`app.py`) | Verified |
| **BUG-007** | Redundant Status Assignment and Incomplete Status Lifecycle in Browse Library UI | Medium | Medium | Frontend (`BrowseLibrary.tsx`) | Verified |
| **BUG-008** | Inert Filter Button in Browse Library Interface with Missing Event Binding | Low | Low | Frontend (`BrowseLibrary.tsx`) | Verified |
| **BUG-009** | Absence of Atomic File Locking and Process Synchronization on JSON Store | Medium | Medium | Backend API (`app.py`) | Verified |

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
  - An empty invalid entity is stored in memory (`books` list).
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

### BUG-005: Lack of Input Sanitization and HTML Tag Stripping on Book Metadata Fields

- **Bug ID:** BUG-005
- **Title:** Lack of Input Sanitization and HTML Tag Stripping on Book Metadata Fields
- **Severity:** Medium (Input Validation / Hygiene defect)
- **Priority:** Medium (P2)
- **Component:** Backend API (`backend/app.py`, lines 70-71)
- **Preconditions:**
  - Backend service operational.
- **Steps to Reproduce:**
  1. Send `POST /api/books` with markup tag strings:
     ```json
     {
       "title": "<script>alert('test')</script> Clean Title",
       "author": "<b>Author</b>",
       "genre": "<i>Fiction</i>"
     }
     ```
  2. Send `GET /api/books` and inspect the returned entity in memory.
- **Expected Result:**
  - Raw HTML tags are stripped or sanitized upon ingestion to maintain clean data hygiene across consumer clients.
- **Actual Result:**
  - The REST API accepts, stores in memory (`books` list), and serves raw markup/tags without stripping or validation. While standard JSX rendering in React (`{book.title}`) escapes strings by default in the UI, this unstripped ingestion presents an input hygiene risk for non-JSX consumers, external API integrations, or future unescaped components (e.g., raw HTML email notifications or unescaped templates).
- **Suggested Fix:**
  - Implement server-side input sanitization by stripping HTML tags from string attributes on ingestion using regex or standard libraries (`bleach.clean(text, strip=True)` or `html.escape()`).

---

### BUG-006: Missing `OPTIONS` HTTP Method on `DELETE /api/books/<id>` Route (Declarative Route Inconsistency)

- **Bug ID:** BUG-006
- **Title:** Missing `OPTIONS` HTTP Method on `DELETE /api/books/<id>` Route (Declarative Route Inconsistency)
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
  2. Compare with `PUT` route at line 82 and `GET` collection route at line 53:
     ```python
     @app.route('/api/books', methods=['GET', 'OPTIONS'])
     ...
     @app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
     ```
  3. Send an HTTP `OPTIONS` preflight request to `/api/books/1`.
- **Expected Result:**
  - Route declarations should be consistent across mutating endpoints. If route-level `OPTIONS` handling and custom preflight headers are declared on `PUT /api/books/<id>`, the same pattern should consistently be declared on `DELETE /api/books/<id>`.
- **Actual Result:**
  - In `backend/app.py`, `PUT /api/books/<id>` explicitly declares `methods=['PUT', 'OPTIONS']` and provides a manual preflight response handler block, whereas `DELETE /api/books/<id>` omits `OPTIONS` entirely (`methods=['DELETE']`).
  - While Flask-CORS (`CORS(app, ...)`) intercepts preflight requests globally, explicitly omitting `OPTIONS` on `DELETE /api/books/<id>` violates route-level declarative consistency compared to the `PUT` endpoint. If route-level method declarations are evaluated or if preflight handling relies on endpoint route decorators, preflight `OPTIONS` requests fail with HTTP 405 Method Not Allowed.
- **Suggested Fix:**
  - Harmonize route-level method declarations across all endpoints. Either add `'OPTIONS'` to `DELETE /api/books/<id>` for declarative consistency:
    ```python
    @app.route('/api/books/<int:book_id>', methods=['DELETE', 'OPTIONS'])
    ```
  - Or refactor all routes to uniformly rely on global Flask-CORS middleware by removing redundant manual `OPTIONS` check blocks from individual route handlers.


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

### BUG-009: Absence of Atomic File Locking and Process Synchronization on JSON Store

- **Bug ID:** BUG-009
- **Title:** Absence of Atomic File Locking and Process Synchronization on JSON Store
- **Severity:** Medium (S3)
- **Priority:** Medium (P2)
- **Component:** Backend API (`backend/app.py`, lines 37-51, 79, 102, 111)
- **Preconditions:**
  - Backend running with an in-memory list synchronized to a local JSON flat file (`books.json`) via `load_books()` and `save_books()`.
- **Steps to Reproduce:**
  1. Inspect `load_books()` and `save_books()` in `backend/app.py`:
     ```python
     def load_books():
         try:
             with open(DATA_FILE, 'r') as f:
                 data = json.load(f)
                 return data.get('books', [])
         except FileNotFoundError:
             return []

     def save_books(books_data):
         with open(DATA_FILE, 'w') as f:
             json.dump({'books': books_data}, f, indent=2)

     books = load_books()
     ```
  2. Note that the backend implements JSON file persistence via `save_books()` and `load_books()` to `books.json`. However, `books` is loaded into an in-memory Python list only once at module import/startup (`books = load_books()`).
  3. Deploy the application in a multi-worker WSGI server (e.g. Gunicorn or uWSGI with multiple worker processes) or issue concurrent parallel mutating requests (`POST /api/books`, `PUT /api/books/<id>`, or `DELETE /api/books/<id>`).
  4. Worker Process A handles a mutation, updates its local `books` list, and calls `save_books(books)` (which executes `open('books.json', 'w')` followed by `json.dump`).
  5. Concurrently, Worker Process B handles another request with its own in-memory `books` list (which was initialized at boot and never refreshed from disk), and writes back to `books.json` without file locking.
- **Expected Result:**
  - Concurrent writes must be synchronized across processes using atomic file locking (e.g. `fcntl.flock` or a cross-platform lock file), atomic write-and-replace semantics (writing to a temporary file and atomically renaming via `os.replace`), or an ACID-compliant transactional relational database (SQLite / PostgreSQL) to prevent race conditions and lost updates.
- **Actual Result:**
  - While state is written to `books.json` via `save_books()`, the application completely lacks atomic file locking or process synchronization.
  - In a multi-worker production deployment, each worker maintains an isolated in-memory `books` list that never reloads from disk after startup, causing cross-process state desynchronization and lost updates (Worker B overwrites Worker A's saved state).
  - Parallel concurrent writes executing `open(DATA_FILE, 'w')` and `json.dump` concurrently risk file descriptor race conditions, partial writes, file corruption, or dirty writes.
- **Suggested Fix:**
  - **Short-term:** Wrap `save_books()` and `load_books()` with atomic file locking (e.g. utilizing the `filelock` library) and implement atomic file replacement (write serialized JSON to a temporary file and atomically rename it via `os.replace`). Ensure each worker refreshes its in-memory view or reads from the locked file store on mutation.
  - **Long-term (Recommended):** Migrate from flat JSON file storage to an ACID-compliant transactional database such as SQLite or PostgreSQL using SQLAlchemy (which is already declared in `requirements.txt`).
