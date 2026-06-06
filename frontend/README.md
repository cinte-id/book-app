📚 Book Tracker App (Fullstack Enhancement)

    A modern full-stack web application for managing and tracking your reading activity.
    This project is based on the original Book Tracker App, enhanced with additional features, improved UI/UX, and better user experience.

    🚀 Role: Fullstack Developer (Enhancement & Feature Development)

✨ Key Improvements

    This project extends the base application with several new features and improvements:

    🔍 Smart Search Integration
        - Search in Header Navbar is now connected to the Discover tab
        - Real-time filtering of books based on user input

    🏠 Home Dashboard Enhancement
        - “Welcome Back” now dynamically shows:
           - Total books being read
           - Reading progress 📊
        - Added Continue Reading section based on current reading status

    📊 New Book Status System
        Added a new status:
        - none → default (not categorized yet)
        Now statuses are:
        - reading
        - read (finished)
        - want-to-read
        - none
        This allows better tracking and separation of book states.

    🤖 Smart Recommendation System
        - Recommends books based on:
           - User interest
           - Author similarity
        - If no none books left → fallback to random recommendation 

    📚 Library Improvements
        My Library:
            Displays only:
            - reading
            - want-to-read
            - read
            Excludes none books
        Browse Section:
        🔍 Search by title
        🏷️ Filter by genre (based on database)
        ➕ Add book to collection
        📌 Bookmark (Saved/Loved state)

    📖 Book Detail Page
        - Full book information
        - ❤️ “Love” feature (same as bookmark)
        - ⭐ Rating system:
            - Add rating
            - Edit rating
            - Uses dummy rating database
        - 🚀 “Start Reading” button:
            - Changes status → reading
            - Opens reading mode

    📄 Reader Page (NEW 🔥)
        - Page-by-page reading system
        - Next / Previous navigation
        - Manual page input
        - Auto-save progress
        - Manual save button
        - Pause reading:
            - Changes status → want-to-read
            - Keeps progress saved

    🔄 Reading Logic Improvements
        - If “Love” is removed while reading → book removed from reading list
        - Reading tab now:
            - Tracks progress 
            - Allows continue reading
            - Allows delete

    🔎 Discover Page Upgrade
        - Search feature
        - Sorting system
        - Better browsing experience

    👤 Profile Page Sync
        - Automatically synced with:
        - Books read
        - Ratings average ⭐
        - Ignores none status
        - Shows real user reading stats

    🎨 UI/UX Enhancements
        - Cleaner and modern design
        - Better spacing & layout
        - More intuitive navigation

    🔔 Notifications & Alerts
        - Toast notifications using Sonner
        - Confirmation dialog:
            - Delete book
            - Remove from reading
            - Remove from favorites

    🛠️ Tech Stack
    Backend:
    - Python 3.x
    - Flask
    - Flask-CORS
    - SQLAlchemy
    - python-dotenv
    Frontend:
    - React 18
    - TypeScript
    - Vite
    - Tailwind CSS
    - Axios
    - shadcn/ui
    - Sonner (toast notifications)

    📁 Project Structure
        book-app-tes/
        ├── backend/
        │   └── app.py
        ├── frontend/
        │   ├── src/
        │   │   ├── components/
        │   │   ├── pages/
        │   │   ├── services/
        │   │   ├── data/
        │   │   └── App.tsx
        │   └── package.json
        └── requirements.txt

    ⚙️ Getting Started

        Backend Setup:

        python -m venv venv
        # Windows
        venv\Scripts\activate
        # Install dependencies
        pip install -r requirements.txt
        # Run server
        cd backend
        python app.py

        Backend runs on:
        http://localhost:5001

        Frontend Setup:

        cd frontend
        npm install
        npm run dev
        
        Frontend runs on:
        http://localhost:5173

    🔌 API Endpoints
    Method	        Endpoint	        Description
    GET	           /api/books	        Get all books
    GET	           /api/books/:id	    Get book detail
    PUT	           /api/books/:id	    Update book
    DELETE	       /api/books/:id	    Delete book

    🎯 Fullstack Task Completion
        Based on TASKS_FULLSTACK.md:
        ✅ Complete Library Browse page
        ✅ Implement search (title & category)
        ✅ Add Book Detail page
        ✅ BONUS: Added advanced features:

        - Reading system 📖
        - Rating ⭐
        - Recommendation 🤖
        - Profile analytics 📊
        - UI/UX improvements 🎨

    🚀 Future Improvements
        🔐 Authentication system
        🧠 AI-based recommendations
        🗂️ Book categories & tags
        ☁️ Database integration (production)
        👥 Multi-user support
        
    📄 License
        This project is licensed under the MIT License.

    🙌 Notes
        This project was developed as part of a Fullstack assignment, focusing on:
        - Feature enhancement
        - UI/UX improvement
        - Clean architecture
        - Real-world user experience

    Author
        Raden Tania Cinta Kinan Lestari
        Fullstack Developer (Candidate)