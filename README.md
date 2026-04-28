# 📚 Book Tracker App

A full-stack web application for managing your reading list, built with **Flask** (backend) and **React + TypeScript** (frontend).
 
> **Live Preview:** https://book-app.cinte.id/

<img src="./assets/home.png" height="200" alt="Home Screenshot">
<img src="./assets/library.png" height="200" alt="Library Screenshot">

---

## ✨ Features

- 📖 Browse all books from the backend with live search & genre filter
- 🏷️ Change reading status per book via interactive dropdown (**Want to read / Reading / Read**)
- 🏠 Home dashboard with "Continue Reading" and "Recommended for You" sections
- 📊 **Profile page** with live reading stats synced from backend data:
  - Books Read, Currently Reading, Want to Read counts
  - Average rating, total books, total pages read
  - Favorite genre (auto-detected)
  - Recently Read list
- 🔄 Single source of truth — all tabs share one global book state (no redundant API calls)
- ⚡ Local search & filter (no extra fetch on every keystroke)
- 💀 Skeleton loading states on Library and Browse pages
- 📱 Fully responsive mobile-first UI (max-w-md)
- ➕ **Add book to My Library** from Browse page — sets initial status to `want-to-read`
- 🗑️ **Remove book from My Library** — resets status to `null`, book remains in Browse Library
- 📄 **Book Detail page** — view full book info, change reading status, add/remove from library
- 🔍 **Search & filter support on API** — `GET /api/books` now accepts `?search=`, `?genre=`, and `?status=` query params
- 🆔 **Single book endpoint** — `GET /api/books/<id>` to fetch one book by ID
- ⚙️ **Backend config via environment variables** — host, port, debug mode, CORS origins, and data file path configurable via `.env`

---

## 🛠 Tech Stack

### Backend
| Tech | Version |
|---|---|
| Python | 3.x |
| Flask | latest |
| Flask-CORS | latest |
| python-dotenv | latest |

Data is persisted in a local `books.json` file.

### Frontend
| Tech | Version |
|---|---|
| React | 18 |
| TypeScript | 5.x |
| Vite | 5.x |
| Tailwind CSS | 3.x |
| shadcn/ui | latest |
| Axios | latest |
| Lucide React | latest |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- Node.js 16.x or later
- npm or yarn

### Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

Backend runs at → `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at → `http://localhost:8081`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/books` | Get all books (supports `?search=`, `?genre=`, and `?status=` query params) |
| `GET` | `/api/books/<id>` | Get a single book by ID |
| `POST` | `/api/books` | Add a new book |
| `PUT` | `/api/books/<id>` | Update a book (e.g. change status, set `null` to remove from library) |
| `DELETE` | `/api/books/<id>` | Delete a book |
| `GET` | `/api/test` | CORS health check |

**Book status values:** `want-to-read` | `reading` | `read` | `null` *(not in library)*

---

## 🗂 Project Structure

```
book-app-test/
├── backend/
│   ├── app.py              # Flask API & routes
│   ├── books.json          # Persistent book data (JSON)
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── BookCard.tsx        # Book card with StatusDropdown
│       │   ├── BrowseLibrary.tsx   # Browse tab (props-based, no own fetch)
│       │   ├── HeaderNav.tsx       # Top navigation bar
│       │   ├── BottomNav.tsx       # Bottom tab bar
│       │   └── ProgressCard.tsx    # Reading progress card
│       ├── pages/
│       │   ├── Index.tsx           # Main page — global state & tab renderer
│       │   ├── BookDetail.tsx      # Book detail page
│       │   └── NotFound.tsx
│       ├── services/
│       │   └── api.ts              # Axios API service
│       └── data/
│           └── dummyData.ts        # Static fallback / dummy data
├── assets/
│   ├── home.png
│   └── library.png
└── README.md
```

---

## 👩‍💻 My Contribution (Fullstack Role)

> Applied role: **Fullstack**  
> Based on task: [`TASKS_FULLSTACK.md`](TASKS_FULLSTACK.md)

### Summary of Changes

This fork implements the Fullstack tasks — completing the Library Browse page and extending the UI with real backend integration across all tabs.

---

### 🔁 Architecture Refactor — Single Source of Truth (`Index.tsx`)

**Problem in original:** `BrowseLibrary` fetched its own books independently. My Books tab used static dummy data. There was no shared state — tabs were completely disconnected.

**Solution:** Moved all data fetching into `Index.tsx` using a single `allBooks` state + `fetchAllBooks()`. All tabs — Library (My Books & Browse), Discover, and Profile — now read from and write to this shared state.

```
Index.tsx
├── allBooks (state)
├── fetchAllBooks() → GET /api/books
├── handleStatusChange() → PUT /api/books/:id → update allBooks
├── handleBooksChange() → called by BrowseLibrary
│
├── <BrowseLibrary books={allBooks} onBooksChange={handleBooksChange} />
├── <BookCard onStatusChange={handleStatusChange} />  ← all variants
└── Profile tab reads allBooks directly for live stats
```

---

### 📦 Changed Files

#### `backend/app.py`
- Added `?search=`, `?genre=`, and `?status=` query param support on `GET /api/books`
- Added `GET /api/books/<id>` endpoint to fetch a single book by ID
- Fixed ID generation on `POST /api/books` (use `max ID + 1` instead of `len`)
- Support `null` status on `PUT /api/books/<id>` to remove a book from My Library without deleting it
- Load server config from environment variables via `.env` (host, port, debug, CORS origins, data file path)
- Changed default port from `5001` to `5000`
- Refactored code structure with section comments for better readability

#### `frontend/src/pages/Index.tsx`
- Added `useEffect` + `useCallback` to fetch all books from backend on mount
- Introduced `allBooks` state as global source of truth shared across all tabs
- Replaced static `books` dummy import with live API data in: Home (Recommended), Library (My Books grid), Discover (Trending Now)
- Added `handleStatusChange()` — calls `PUT /api/books/:id` and updates local state optimistically
- Added `handleBooksChange()` — propagates BrowseLibrary status changes back up
- Added `handleRemoveFromLibrary()` — sets status to `null` via API, removes book from My Library view
- Extracted `MyLibraryFilter` sub-component with status filter chips (All / Reading / Want to Read / Read) and per-book count badges
- Added per-book remove confirmation overlay with loading spinner in My Library grid
- Added skeleton loading state (`SkeletonCard`) for My Library grid
- Added empty state with CTA to Browse Library when `myBooks` is empty
- **Profile tab** completely rebuilt: all stats (Books Read, Reading, Want to Read, Avg Rating, In Library, Pages Read, Favorite Genre, Recently Read) are now computed live from `allBooks` instead of hardcoded dummy values

#### `frontend/src/components/BrowseLibrary.tsx`
- Removed self-contained fetch logic — now receives `books: Book[]` and `onBooksChange` as props
- Genre list and filtered books derived via `useMemo` from the `books` prop (no extra API call on filter/search change)
- Added debounced search (400ms) on title and author fields
- Added genre filter chips with "All Genre" option
- Added "Add" button per book to set status to `want-to-read` via API with loading spinner
- Show status badge (Read / Reading / Want to read) if book already in library, replacing the add button
- Navigate to Book Detail page on card click
- Show skeleton loading state and empty state with reset filter option
- Display count of books already in library vs total

#### `frontend/src/pages/BookDetail.tsx` *(new file)*
- Fetch single book by ID from `GET /api/books/<id>` on mount
- Display book cover, title, author, rating, pages, and genre in a dedicated detail page
- Show "Tambah ke My Library" CTA if book has no status yet
- Allow changing reading status (want-to-read / reading / read) inline via API
- Add remove-from-library action (sets status to `null`) with bottom-sheet confirmation dialog
- Show current status badge in sticky header; disable all buttons during update
- Handle skeleton loading state and error state

---

### 🎯 Key Design Decisions

| Decision | Reason |
|---|---|
| Single fetch in `Index.tsx`, not per-tab | Avoids redundant API calls; all tabs stay in sync |
| `useMemo` for filter/genre in BrowseLibrary | Instant filtering without extra network requests |
| `StatusDropdown` in BookCard | Better UX — status change is inline, no page reload needed |
| Optimistic UI update before API resolves | Feels faster; reverts on failure |
| Profile stats computed from `allBooks` | Stats always reflect actual backend data, not stale dummy values |
| `null` status = not in library | Keeps all books in the catalogue while cleanly separating My Library view |
| Book Detail as separate route `/books/:id` | Allows deep-linking and cleaner separation of browse vs detail concerns |

---

## 🔮 Future Enhancements

- [ ] Authentication & user accounts
- [ ] Sorting options (by title, author, rating, pages)
- [ ] Book detail edit form
- [ ] Reading progress tracking (pages read)
- [ ] Book reviews & notes
- [ ] Database integration (PostgreSQL / SQLite)
- [ ] CI/CD with GitHub Actions
- [ ] Unit & integration tests

---

## 📋 Test Instruction (Original)

<details>
<summary>Click to expand original recruitment test instructions</summary>

Hi there! 👋  
Thanks for applying to our company.

This is a small take-home assignment where you'll contribute to a simple **Book Tracker App**.  
You can choose how to contribute based on your strongest area: **Frontend, Backend, DevOps, QA, or Data**.

**Goal:** We want to see how you solve problems, write code, and structure your work — all in about **2–4 hours**.

**What to Do:**
1. Fork this repo into your own GitHub account
2. Pick ONE area: Frontend / Backend / DevOps / QA / Data / PM / UI/UX / Customer Service
3. Work only in the part that fits your chosen role
4. Push your code and include in your README: your role, how to run/test, and any decisions made
5. Create a Pull Request (PR) to the main branch
6. Share the PR link for review

**Tasks by Role:**
- [Fullstack](TASKS_FULLSTACK.md) - Complete Library Browse page features
- [Frontend](TASKS_FRONTEND.md) - Build User Authentication, Settings, and Insight UIs
- [Backend](TASKS_BACKEND.md) - Build REST API with search and filtering
- [DevOps](TASKS_DEVOPS.md) - Create Dockerfiles and CI/CD workflows
- [QA](TASKS_QA.md) - Create comprehensive test plans and execute testing
- [UI/UX](TASKS_UIUX.md) - Design User Authentication and Settings pages
- [PM](TASKS_PM.md) - Create project timelines and task breakdowns
- [Data](TASKS_DATA.md) - Build data analytics solution and dashboard
- [Customer Service](TASKS_CUSTOMER_SERVICE.md) - Create customer support system

</details>

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
