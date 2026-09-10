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

---

## Customer Service Feature Implementation by Badharalfath

For this assignment I chose the Customer Service role and built a complete
customer support system inside the existing React/Vite frontend. No backend changes,
no new project.

### How to Access

Run the frontend (`npm run dev`) and open `http://localhost:8080`, then:

- Tap the **help (?) icon in the header** (visible on every tab), or
- Open the **Profile tab → Bantuan menu**, or
- Tap the **Live Chat floating button** (bottom-right, on every page).

All support pages share the app's mobile-first layout. You can also visit the routes
directly:

- Help Center (`/help`): searchable FAQ accordion with category tabs + counts
- Contact Support (`/contact`): validated ticket form with generated ticket ID
- User Guide (`/guide`): 3-step onboarding stepper with progress indicator
- Feedback (`/feedback`): category pills, live char counter, optional star rating
- Ticket Tracking (`/track`): search tickets by ID + on-device ticket history
- Service Dashboard (`/support`): hub with live stats, service links, analytics chart
- Knowledge Base (`/kb`, `/kb/:slug`): long-form guides with categories + related articles

### Bonus Features

- **Knowledge Base:** 6 searchable, category-filterable articles with read time,
  numbered steps, related links, and per-article satisfaction survey.
- **User Satisfaction Survey:** Ya/Tidak micro-survey (`HelpfulSurvey`) on the Help,
  Guide, and every KB article page; answers persist per topic.
- **Support Ticket Tracking:** tickets created via Contact/Feedback persist in
  `localStorage` (cap 50) and can be searched, inspected, and deleted on `/track`.
- **Customer Service Analytics mockup:** stat cards (total/open/feedback/avg rating)
  plus a tickets-by-category bar chart (recharts) that updates live from stored tickets,
  with an honest empty state before any data exists.
- **Multi-language support structure:** `id` dictionary active with full `en` fallback
  (`src/data/support/i18n.ts`, typed keys), adopted by the survey component; language
  persists in `localStorage`.
- **Tests:** 12 vitest unit tests covering the ticket store and i18n (`npm test`).

### Tech Stack & Decisions

- React 18 + TypeScript + Vite, styled with Tailwind CSS and shadcn/ui (Card, Input,
  Textarea, Select, Button, Sheet replacements, etc.).
- Forms use React Hook Form + Zod with inline errors; invalid fields turn red on
  submit, and toast confirms successful submissions.
- Mock/persistent client data only: strongly-typed modules live in
  `src/data/support/` (`tickets.ts`, `kbArticles.ts`, `faqData.ts`, `i18n.ts`,
  `navigation.ts`). No backend or real API calls for CS features, per role constraints.
- Functional components with hooks and a modular structure (`src/components/support/`,
  one page per route); flat single-accent (blue-600) visual language with a shared
  centered header pattern; all motion respects `prefers-reduced-motion`.
- Routing wired in `src/App.tsx` as flat routes; chat widget mounted once globally.
- Ports note: the repo's own `vite.config.ts` and setup docs use backend `:5001` and
  frontend `:8080` (the task template says `5000`/`5173`), and the API client defaults
  to `http://localhost:5001`, so run with the repo's ports.

### How to run / test my part

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py        # → http://localhost:5001 (override with FLASK_PORT)

# Frontend (new terminal)
cd frontend
npm install
npm run dev          # → http://localhost:8080
```

Manual test path: open `/support` → create a ticket via Contact Support (note the
`TKT-xxxxxx` ID) → find it on `/track` → submit feedback → see dashboard stats
and chart update. Checks: `npx tsc --noEmit`, `npm test`, `npm run lint`,
`npm run build` (all green). Branch: `feat/customer-service` (single branch,
one commit per feature/fix).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
