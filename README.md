## 👤 My Contribution — Customer Service Role

### Role

**Customer Service** — Added customer support features into the existing BookTracker frontend, including FAQ, support form, live chat simulation, feedback system, and customer service dashboard.

### How to Run

> No backend integration is required. Customer service features are implemented using local React state and mock data.

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) → go to **Profile** tab → tap **"Open Help Center"**.

### Features Implemented

#### ✅ Core Deliverables

| Feature                                          | Location                                      |
| ------------------------------------------------ | --------------------------------------------- |
| Help & FAQ page with categorized Q&A + search    | `src/components/support/FAQSection.tsx`       |
| Contact Support form with validation + ticket ID | `src/components/support/ContactForm.tsx`      |
| User onboarding tutorial pages (5 topics)        | `src/components/support/UserGuide.tsx`        |
| Feedback form (star rating + comment)            | `src/components/support/FeedbackForm.tsx`     |
| Customer service dashboard layout                | `src/components/support/SupportDashboard.tsx` |
| Live Chat widget (UI only)                       | `src/components/support/LiveChat.tsx`         |

#### 🌟 Bonus Features

| Feature                                                            | Location                                        |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| Knowledge base with article categories (5 categories, 12 articles) | `src/components/support/KnowledgeBase.tsx`      |
| User satisfaction survey (NPS + multiple choice)                   | `src/components/support/SatisfactionSurvey.tsx` |
| ticket status tracking with status timeline                        | `src/components/support/SupportDashboard.tsx`   |
| Analytics bar chart (weekly ticket volume using recharts)          | `src/components/support/SupportDashboard.tsx`   |
| Multi-language support structure (EN + ID)                         | `src/locales/en.ts`, `src/locales/id.ts`        |

### Decisions Made

- **No backend integration** — all data is local React state or hardcoded mock data, as stated in the task requirements.
- **Recharts for analytics** — already present in `package.json`, so no new dependencies were installed.
- **Multi-language as a structure** — locale files (`en.ts`, `id.ts`) define the full translation key shape with TypeScript typing. Plugging in a context/hook to consume them is a one-step extension.
- **Ticket ID generation** — uses `Math.random()` to produce a `CS-XXX` format ID, simulating a real ticket system without backend.
- **Live Chat auto-reply** — cycles through 4 generic responses with a 900ms delay to simulate a support agent, keeping UX realistic without any server.
- **All components isolated** — every feature lives in `src/components/support/` and is wired through `SupportCenter.tsx`. Zero changes to unrelated files.

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
