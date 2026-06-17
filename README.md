# 📝 Submission — Fullstack Developer (Junior)

**Candidate:** Qlio Amanda Febriany  
**Role:** Fullstack Developer (Junior)  
**Branch:** `feature/fullstack-tasks`

---

## ✅ Completed Tasks

### Required Tasks
| # | Task | Status |
|---|------|--------|
| 1 | **Search** — Real-time search by title & author on Library > Browse page | ✅ Already implemented |
| 2 | **Category filter** — Filter by genre, works alongside search | ✅ Already implemented |
| 3 | **Detail page** — Book detail page at `/books/:id` with cover, title, author, genre, pages, rating, and add-to-library button | ✅ Implemented |
| 4 | **Backend route** — `GET /api/books/:id` endpoint to serve single book data | ✅ Implemented |

### Optional Tasks
| Task | Status |
|------|--------|
| Loading state (spinner while fetching data) | ✅ Implemented |
| Error handling when API is unavailable | ✅ Implemented |
| "Book not found" (404) message | ✅ Implemented |
| Preserve search/filter state when navigating back | ✅ Implemented |

---

## 🔧 How to Run

### Prerequisites
- Python 3.x
- Node.js 16.x or later

### 1. Backend (Flask)
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5001`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:8080`

### 3. Testing the Features
1. Open `http://localhost:8080` in your browser
2. Click **Library** in the bottom navigation
3. Switch to the **Browse** tab
4. Try the **Search** bar — type a book title or author name
5. Try the **Genre filter** dropdown — select any genre
6. **Click on any book card** → you will be redirected to the **Book Detail Page** (`/books/:id`)
7. On the detail page, you can see cover, title, author, rating, pages, genre, and click **"Add to Library"**
8. Click the **back arrow (←)** → you should return to the **same tab and search/filter state** you left

---

## 📋 Notes & Decisions

1. **Tasks 1 & 2 (Search & Filter)** were already implemented in the original codebase within `BrowseLibrary.tsx`. I verified they work correctly and left them untouched.
2. **Task 3 (Detail Page)** — Created `frontend/src/pages/BookDetail.tsx` as a new page component. Added route `/books/:id` in `App.tsx` and made all `BookCard` variants clickable using `useNavigate()`.
3. **Task 4 (Backend Route)** — Added `GET /api/books/<int:book_id>` endpoint in `backend/app.py` that returns a single book by ID, or a 404 error if not found.
4. **Optional: Loading & Error States** — The `BookDetail` component includes a loading spinner, a friendly error message when the API is unavailable, and a "Book not found" screen for invalid IDs.
5. **Optional: Preserve State** — Used `sessionStorage` to persist the active tab, library view, search term, and genre filter so users return to their exact position after navigating back from the detail page.
6. **Branching** — Worked on a separate `feature/fullstack-tasks` branch to keep `main` clean.

### Files Modified
- `backend/app.py` — Added `GET /api/books/<id>` endpoint
- `frontend/src/App.tsx` — Added route for `/books/:id`
- `frontend/src/components/BookCard.tsx` — Added `onClick` navigation to detail page
- `frontend/src/components/BrowseLibrary.tsx` — Added `sessionStorage` to preserve search/filter state
- `frontend/src/pages/Index.tsx` — Added `sessionStorage` to preserve active tab state
- `frontend/src/pages/BookDetail.tsx` — **[NEW]** Book detail page component

---
---

# Test Instruction

Hi there! 👋  
Thanks for applying to our company.

This is a small take-home assignment where you'll contribute to a simple **Book Tracker App**.  
You can choose how to contribute based on your strongest area: **Frontend, Backend, DevOps, QA, or Data**.

---

## 🧭 Goal

We want to see how you solve problems, write code, and structure your work — all in about **2–4 hours**.

---

If you're applying for **DevOps**, **QA**, or **Data**, you can use the provided base code in the `backend/` or `frontend/` folders.

---

## ✅ What to Do

1. **Fork this repo** into your own GitHub account.
2. **Pick ONE area** you're applying in:
   - Frontend
   - Backend
   - DevOps
   - QA
   - Data
   - Project/Product Manager
   - UI/UX
   - Customer Services
3. **Work only in the part that fits your chosen role.**
4. Push your code and include in your `README.md`:
   - Your chosen role
   - How to run/test your part
   - Any notes or decisions you made
5. Create a Pull Request (PR) to the main branch of this repository
6. Share the PR link with us for review

---

## 🔧 Tasks by Role

Choose your role and follow the detailed task instructions:

- [🔹 **Fullstack** (Junior)](TASKS_FULLSTACK.md) - Complete Library Browse page features
- [🔹 **Fullstack** (Mid-Level)](TASKS_FULLSTACK_MID.md) - Complete Library Browse page features (mid-level)
- [🔹 **Frontend**](TASKS_FRONTEND.md) - Build User Authentication, Settings, and Insight UIs
- [🔹 **Backend**](TASKS_BACKEND.md) - Build REST API with search and filtering
- [🔹 **DevOps** (Junior)](TASKS_DEVOPS.md) - Create Dockerfiles and CI/CD workflows
- [🔹 **DevOps** (Mid-Level)](TASKS_DEVOPS_MID.md) - Create Dockerfiles and CI/CD workflows (mid-level)
- [🔹 **QA**](TASKS_QA.md) - Create comprehensive test plans and execute testing
- [🔹 **UI/UX**](TASKS_UIUX.md) - Design User Authentication and Settings pages
- [🔹 **Project/Product Manager** (Junior)](TASKS_PM.md) - Create project timelines and task breakdowns
- [🔹 **Project/Product Manager** (Mid-Level)](TASKS_PM_MID.md) - Create full project plan with risk register and stakeholder plan
- [🔹 **Data Analytic Engineer**](TASKS_DATA.md) - Build data analytics solution and dashboard
- [🔹 **Customer Service**](TASKS_CUSTOMER_SERVICE.md) - Create customer support system

---

## 🌟 Bonus Points (Optional)

We appreciate extra touches like:

- ✅ Clean code structure / design pattern
- ✅ Branching with meaningful commit history
- ✅ README with clear instructions
- ✅ Use of linters, formatters, or type checkers
- ✅ Tests even if you're not applying for QA
- ✅ CI workflow using GitHub Actions
- ✅ UI polish, error handling, logging, etc.

---

## 🕐 Timebox

This should take around **2–4 hours**.  
No need to overengineer — focus on clarity and your best work in a short time.

---

## 📩 Submission

Once you're done:
1. Create a Pull Request (PR) to the main branch of this repository
2. Share the PR link with us for review

**Note**: We prefer PRs to the original repository rather than separate repo links, as this allows us to see your changes in context and review your contribution directly.

Good luck, and have fun! 🚀

---

# Book Tracker App

A full-stack web application for managing your reading list, built with Flask and React. Build for People Recruitment Test. Integration with backend only works on page Library section Browse Library. Live preview on: https://book-app.cinte.id/

<img src="./assets/home.png" height="200" alt="Home">
<img src="./assets/library.png" height="200" alt="Library">

## Features

- 📚 Add, view, update, and delete books
- 📖 Track reading status (unread/reading/completed)
- 🎨 Modern and responsive UI with Tailwind CSS
- 🔄 Real-time updates
- ⚡ Fast and efficient with React + Vite
- 🛡️ Type-safe with TypeScript

## Tech Stack

### Backend
- Python 3.x
- Flask
- Flask-CORS
- SQLAlchemy
- python-dotenv

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- shadcn/ui components

## Prerequisites

- Python 3.x
- Node.js 16.x or later
- npm or yarn

## Getting Started

### Backend Setup

1. Create and activate a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
cd backend
python app.py
```

The backend server will start on http://localhost:5000

### Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Documentation

### Endpoints

#### GET /api/books
- Returns all books
- Response: Array of book objects

#### POST /api/books
- Creates a new book
- Request Body:
```json
{
  "title": "string",
  "author": "string",
  "status": "unread" | "reading" | "completed"
}
```

#### PUT /api/books/<id>
- Updates an existing book
- Request Body: Same as POST

#### DELETE /api/books/<id>
- Deletes a book by ID

## Project Structure

```
book-app/
├── backend/
│   └── app.py              # Flask backend API
├── frontend/
│   ├── src/
│   │   ├── types/
│   │   │   └── book.ts     # TypeScript interfaces
│   │   ├── services/
│   │   │   └── api.ts      # API service functions
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # Frontend dependencies
└── requirements.txt        # Backend dependencies
```

## Development

### Backend Development
- The backend uses Flask for the API
- CORS is enabled for frontend communication
- Currently using in-memory storage (can be extended to use a database)

### Frontend Development
- Built with React + Vite for fast development
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components for consistent UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Authentication system
- [ ] Search and filtering
- [ ] Sorting options
- [ ] Book categories/tags
- [ ] Reading progress tracking
- [ ] Book ratings and reviews
- [ ] Database integration
- [ ] User profiles and personal libraries

## License

This project is licensed under the MIT License - see the LICENSE file for details.
