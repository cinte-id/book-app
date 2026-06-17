# Book Tracker App

A full-stack web application for managing your reading list, built with Flask and React. 
This repository contains my submission for the **Fullstack Developer** technical test.

---

## 📝 Candidate Submission Details

### My Chosen Role
**Junior Fullstack Developer**

### How to Run/Test My Part

**1. Backend Configuration**
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies and run
pip install -r requirements.txt
python app.py
```
*(The backend API will run on `http://127.0.0.1:5000`)*

**2. Frontend Configuration**
```bash
cd frontend

# Install packages and run
npm install
npm run dev
```
*(The frontend app will run on `http://localhost:5173`)*

**3. Testing the Implementations**
- Open `http://localhost:5173` in your browser.
- Navigate to the **Library > Browse** tab to test the real-time search and category filtering.
- Click on any book to test the **Book Detail** page (`/books/:id`) and the "Add to Library" interaction.
- Press the browser's "Back" button from the detail page to verify that your search query and filters are **preserved**.
- Resize the browser window to see the new **Responsive Desktop Layout**.

---

### Notes & Decisions Made

- **Over-Delivered on Requirements**: Successfully completed all 4 *Required Tasks* (Search, Category Filter, Detail Page, Backend Route) and all 3 *Optional Tasks* (Loading/Empty States, Error Handling, and State Preservation).
- **State Preservation Approach**: Decided to use `useSearchParams` (URL Parameters) to preserve the search keyword and genre filter state. This ensures robust compatibility with the native browser "Back" button without needing heavy global state libraries.
- **Bonus Responsiveness**: The original app was locked to a mobile viewport (`max-w-md`). I introduced Tailwind breakpoints (`md:`, `lg:`) to transform the app into a fully responsive desktop experience. This includes shifting the Bottom Navigation to the Header on large screens, expanding the book grid, and creating a split-pane layout for the Detail page.
- **Global Navigation**: Modified the app so that every book card (in Home, Trending, Currently Reading) is clickable and routes to its respective detail page.
- **Search Optimization**: Activated the header search icon to navigate cleanly, and made the 'Discover' input field functional.
- **Code Consistency**: Ensured that the newly added code strictly adheres to the existing project formatting (2-space indents for TSX, 4-space for Python, consistent string quotes, and unified `CRLF` line endings).

---

## 🛠️ Tech Stack

### Backend
- Python 3.x
- Flask & Flask-CORS
- SQLAlchemy
- python-dotenv

### Frontend
- React 18 & Vite
- TypeScript
- Tailwind CSS
- Axios
- shadcn/ui components
