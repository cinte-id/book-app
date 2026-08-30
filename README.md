# Book Tracker App - QA Submission

A full-stack web application for managing your reading list, built with Flask and React. Live preview on: https://book-app.cinte.id/

<img src="./assets/home.png" height="200" alt="Home">
<img src="./assets/library.png" height="200" alt="Library">

---

## 🎯 Recruitment Test Submission

Chosen Role: QA (Quality Assurance)

## How to view/test my part:**
Manual Testing & Matrix: Please navigate to the QA_Sandhi_Rizki_Aryadi/Test Plan & Test Case folder at the root of this repository to find the comprehensive Excel file.

Automated Testing (Cypress): The automation scripts are located in QA_Sandhi_Rizki_Aryadi/cypress. To run them, navigate to the frontend folder, run npm install, then execute npx cypress open.

Performance & Cross-Browser Testing: Evidence screenshots (Lighthouse and Edge compatibility) are neatly organized in the QA_Sandhi_Rizki_Aryadi/Evidence Testing folder.


---

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