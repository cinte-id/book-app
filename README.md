# QA Engineer Technical Assessment Submission

**Candidate Name:** Sandy Yoga Prakasa Holley  
**Role Applied:** QA Engineer  
**GitHub Profile:** [https://github.com/Sandy-YP-Holley](https://github.com/Sandy-YP-Holley)  
**Target Repository:** `cinte-id/book-app`  
**Submission Date:** September 8, 2026  

---

## 1. QA Submission Summary

This submission provides a complete, production-grade Quality Assurance test engineering suite and verification audit for the Book Tracker application.

### Key Deliverables:
- **`qa-artifacts/TEST_PLAN.md`**: Comprehensive Test Plan defining scope, environments, risk strategy, and a detailed 27-scenario matrix (positive CRUD, negative boundaries, security payloads, and E2E flows).
- **`qa-artifacts/TEST_EXECUTION_REPORT.md`**: Full execution results detailing 22 passed automated tests across Chromium and Microsoft Edge, along with 13 exploratory defect investigations.
- **`qa-artifacts/BUG_REPORTS.md`**: Defect audit documenting 9 verified defects discovered in `backend/app.py` and `frontend/src/` (including Critical Primary Key Collision and Stored XSS vectors).
- **`qa-artifacts/TEST_COVERAGE_REPORT.md`**: Requirements Traceability Matrix (RTM) linking requirements to test scripts and defects, with 100% backend API coverage analysis.
- **`qa-artifacts/ACCESSIBILITY_AND_PERFORMANCE.md`**: Performance benchmark analysis (sub-10ms single request latency, 394+ RPS concurrency profile) and WCAG 2.1 AA accessibility audit.
- **`qa-tests/`**: Automated Playwright test automation harness (`@playwright/test`) supporting cross-browser execution, backend API testing, and isolated Browse Library E2E testing.

### Key Findings Summary:
1. **Critical Defect (BUG-001):** The backend primary key assignment (`'id': len(books) + 1`) causes primary key collisions whenever an intermediate entity is deleted and a new book is added.
2. **Missing Validation (BUG-002, BUG-003, BUG-004):** `POST /api/books` accepts empty payloads (`{}`) creating null records, negative pages, astronomical ratings, and unvalidated status strings.
3. **Security Ingestion Risk (BUG-005):** Unsanitized script tags (e.g. `<script>alert('xss')</script>`) are stored raw into `books.json`.
4. **Browse Library UI Scope (BUG-007):** The frontend only integrates `GET /api/books` and a static `PUT` (setting `want-to-read`). `POST` and `DELETE` endpoints are not integrated into the UI.

---

## 2. How to Run the QA Automated Test Suite

### Prerequisites:
- Node.js (v18+) and npm installed
- Flask backend running on `http://localhost:5000`
- Vite frontend running on `http://localhost:5173`

### Step-by-Step Execution:

```bash
# Navigate to the automated QA test suite directory
cd qa-tests

# Install QA automation dependencies
npm install

# Run the complete automated test suite (API + E2E on Chromium and Edge)
npx playwright test

# (Optional) Run API tests only
npx playwright test tests/api.spec.ts

# (Optional) Run Browse Library E2E tests only
npx playwright test tests/e2e.spec.ts

# (Optional) View generated interactive HTML test report
npx playwright show-report
```

### Running Performance Benchmarks:
```bash
# From workspace root using the backend Python virtual environment:
& "venv/Scripts/python.exe" qa-tests/scripts/benchmark.py
```

---

## 3. Engineering Decisions & Architecture

1. **Test Framework Selection (Playwright):**
   Playwright (`@playwright/test`) was selected for its native unified execution model supporting both fast HTTP API testing and resilient cross-browser E2E browser automation (Chromium, Edge, Firefox, WebKit). Its built-in request fixture enables testing REST APIs with zero additional dependencies.
2. **Port Configuration Defaults:**
   `playwright.config.ts` strictly defaults to `http://localhost:5000` for backend API operations and `http://localhost:5173` for frontend UI browser execution, with dynamic environment variable overrides supported (`API_URL`, `BASE_URL`).
3. **State Isolation and Volatile Store Protection:**
   Because the Flask backend utilizes a volatile in-memory structure synchronized with `books.json`, each test creates distinct entities using timestamped titles and strictly cleans up created records in `test.afterEach` hooks to guarantee test idempotency and zero flaky test runs.
4. **Scope Restriction:**
   End-to-End browser test automation is restricted strictly to the "Browse Library" module as specified in the recruitment assessment guidelines.

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
