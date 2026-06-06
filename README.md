# 📚 Book Tracker App - Fullstack Submission
Name : Dika Jefrianto
This repository contains my full-stack submission for the **Fullstack Developer (Mid-Level)** role.

I have completed all the **core requirements of the Mid-Level task**, incorporated the **Junior-Level tasks as bonus features**, implemented **all optional tasks** (*Pagination, Authentication, and Dynamic Reading Statistics*), and added a **backend integration test suite** to ensure application reliability.

---

# 👤 Chosen Role

* **Role:** Fullstack Developer (Mid-Level)
* **Position Applied:** Mid-Level Fullstack Developer (2–5 years experience)

---

# 🛠️ How to Run & Test

## 1. Prerequisites

Make sure the following software is installed:

* Python 3.x
* Node.js 16.x or later
* npm or yarn

---

## 2. Environment Setup

Both frontend and backend are configured using environment-specific setups.

### Backend Setup

```bash
cd backend

# Create Virtual Environment
python -m venv venv

# Activate Virtual Environment

# Windows (PowerShell)
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run environment setup
python setup.py

# Choose "development" when prompted

# Start Flask API Server
python app.py
```

Backend API will be available at:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend application will be available at:

```text
http://localhost:8080
```

---

## 3. Running Backend Integration Tests (Bonus)

A backend integration test suite has been prepared using **pytest** to validate:

* Core API endpoints
* Authentication flow
* Request payload validation
* Unauthorized access restrictions

Run the tests using:

```bash
cd backend

pip install pytest

pytest
```

---

# ✅ Implemented Features

## Core Mid-Level Requirements

### 🔍 Server-Side Search & Filter

Replaced client-side filtering with real-time server-side processing.

Supported query parameters:

```http
GET /api/books?q=
GET /api/books?genre=
```

Features:

* Keyword search
* Genre filtering
* Combined search and filter support

---

### 📖 Book Detail Page

Implemented an interactive detail page:

```text
/books/:id
```

Displays complete book metadata:

* Cover image
* Title
* Author
* Rating
* Page count
* Genre

---

### 🔄 Persisted Reading Status Lifecycle

Implemented reading status management with persistence:

```text
want-to-read ⇄ reading ⇄ completed
```

Changes are:

* Saved globally
* Synced through the API
* Updated in real time

---

### 📊 Reading Progress Tracker

Users can update their current reading page.

Progress percentage is calculated dynamically:

```text
(currentPage / totalPages) × 100
```

Displayed on:

* Library cards
* Book detail page

Only active when the book status is:

```text
reading
```

---

### 🛡️ Backend Payload Validation

Implemented robust Flask-side validation for:

* POST requests
* PUT requests

Validation checks:

* Required fields
* Data types
* Invalid values

Invalid requests return:

```http
400 Bad Request
```

Including field-level validation messages.

---

# ⭐ Optional Tasks Implemented

## 📄 Server-Side Pagination

Implemented pagination support:

```http
GET /api/books?page=&limit=
```

Integrated with:

* Next button
* Previous button

For efficient browsing of large datasets.

---

## 🔐 User Authentication

Implemented authentication system with:

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

Features:

* User registration
* User login
* Session token validation
* Protected library modifications

---

## 📈 Dynamic Profile Statistics

Profile page displays statistics generated from live backend data.

Examples:

* Total books completed
* Favorite genre
* Reading activity summary

All statistics are dynamically calculated.

---

# 🎁 Additional Enhancements (Bonus / Junior Tasks)

## ⚡ Debounced Search Inputs

Implemented a **300ms debounce mechanism** inside:

```text
BrowseLibrary.tsx
```

Benefits:

* Reduces API requests
* Improves responsiveness
* Enhances user experience

---

## 🎯 Stable Genre Selection

Genre categories are loaded once during initial mount.

This prevents:

* Buttons disappearing
* Filter options changing unexpectedly
* UI jumps during searches or pagination

---

## 👥 User-Specific Library Isolation

Merged backend datasets dynamically against authenticated user sessions.

Benefits:

* User data isolation
* Independent reading progress
* Personalized library states

---

## 🧪 Backend Integration Test Suite

Created a dedicated pytest suite covering:

* API availability
* CORS validation
* Authentication flow
* Unauthorized mutation protection

---

# 📝 Design Decisions & Technical Notes

## 1. Safe localStorage Wrapper (Browser Security Fallback)

Some environments (such as restricted iframes or privacy-focused browsers) may block access to browser storage and throw a fatal:

```text
SecurityError
```

To ensure application stability, a custom **safeLocalStorage** wrapper was implemented.

### Behavior

* Uses `try...catch` around storage operations
* Automatically falls back to an in-memory session store
* Prevents crashes caused by storage restrictions

Benefits:

* Improved browser compatibility
* Graceful degradation
* Better user experience

---

## 2. User Library Isolation

Instead of storing user progress directly inside:

```text
books.json
```

a dedicated storage layer was introduced:

```text
user_libraries.json
```

This stores user-specific properties such as:

* Reading status
* Current page progress

Mapped directly to the authenticated user.

Benefits:

* Prevents data leakage across accounts
* Supports multi-user environments
* Preserves personalized reading states

---

## 3. Event Bubbling Protection

Book cards are wrapped with React Router:

```jsx
<Link>
```

for easier navigation.

To avoid unintended navigation when interacting with overlay actions (e.g., **Add Book** buttons), click handlers utilize:

```javascript
e.stopPropagation();
```

Benefits:

* Cleaner UX
* Reliable button interactions
* Prevention of accidental route changes

---

# 📂 Project Structure

```text
project-root/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── tests/
│   ├── requirements.txt
│   └── setup.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# 🚀 Submission Summary

### Completed

✅ Mid-Level Core Requirements

✅ Junior-Level Bonus Features

✅ Pagination

✅ Authentication

✅ Dynamic Reading Statistics

✅ Backend Payload Validation

✅ Reading Progress Tracking

✅ Integration Test Suite

✅ User-Specific Library Persistence

✅ Improved UX & Performance Optimizations

This submission demonstrates a complete full-stack implementation with a focus on **scalability, maintainability, user experience, backend validation, authentication, and automated testing**.
