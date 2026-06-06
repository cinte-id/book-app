# Test Instruction

## 📝 Submission Notes

### 👩💻 Role: Mid-Level Fullstack Developer

### ✅ Task yang Diselesaikan
Berdasarkan `TASKS_FULLSTACK_MID.md`:
- [x] **Search & filter** — Implementasi pencarian dan filter genre secara server-side pada `/api/books?q=&genre=`.
- [x] **Detail page** — Halaman detail buku (`/books/:id`) yang fungsional dengan kontrol perubahan status bacaan (Want to read → Reading → Read).
- [x] **User library** — Arsitektur Library diubah menjadi "Isolated Per-User Library" menggunakan `user_libraries.json`. Setiap pengguna memiliki *library* dari 0.
- [x] **Hapus dari My Library** — Fitur menghapus buku dari koleksi pribadi (mengembalikan ke status `unread`) tanpa menghancurkan data di master katalog.
- [x] **Reading progress** — Kemampuan memperbarui halaman bacaan saat ini (`currentPage`) lengkap dengan visualisasi *Progress Bar*.
- [x] **Input validation** — Backend divalidasi ketat dan merespons `400 Bad Request` jika input negatif atau salah format.
- [x] **[Opsional] Pagination** — Katalog buku mengadopsi API `limit` dan `page` untuk penanganan data skala besar yang ringan.
- [x] **[Opsional] Authentication** — Mengamankan API mutasi data. Dilengkapi sistem *Token* kustom, serta halaman Login & Register.
- [x] **[Opsional] Reading stats** — Tab Profil 100% *Live*, dihitung oleh backend (`GET /api/stats`) berdasarkan buku yang statusnya `read` di *library* milik user.
- [x] **[Bonus] Unit Testing** — Penulisan tes otomatis (`test_app.py`) berbasis `unittest` untuk rute API Backend.

---

### 🔄 Ringkasan Perubahan & Arsitektur

| Konsep | Penjelasan |
|---|---|
| **Global Catalog vs User Library** | Master katalog disimpan di `books.json`. Progres bacaan dan status personal setiap pengguna dipisah dan disimpan di `user_libraries.json`. Hal ini membuat *library* satu *user* tidak merusak *library* pengguna lain. |
| **Authentication Flow** | Endpoint yang mengubah data (POST, PUT, DELETE) dikunci dengan dekorator `@requires_auth`. Frontend menyisipkan Token di *header* via Axios Interceptor. Jika ditolak (401), *user* di-redirect ke halaman Login. |
| **Statistik Real-Time** | Backend menyisir `user_libraries` milik akun yang login, lalu menghitung metrik secara dinamis (Total buku dibaca, total halaman, genre favorit). |

---

### 📦 File yang Diubah & Ditambahkan

| File | Status | Perubahan |
|---|---|---|
| `backend/app.py` | ✏️ Diubah | Server-side filter, Paginasi, Auth Middleware, Logika Pemisahan User Library, & Endpoint Statistik. |
| `backend/users.json` | 🆕 File baru | Database khusus kredensial login pengguna. |
| `backend/test_app.py` | 🆕 File baru | Skrip Unit Test Python untuk menjamin *quality control* pada endpoint backend. |
| `frontend/src/services/api.ts` | ✏️ Diubah | Menambahkan Axios *request interceptor* (Token) & *response interceptor* (Global 401 Redirect). |
| `frontend/src/pages/Index.tsx` | ✏️ Diubah | Menambahkan tombol Sign In/Log Out, integrasi Live Profil Stats, fungsionalitas Remove dari Library. |
| `frontend/src/pages/Login.tsx` & `Register.tsx` | 🆕 File baru | UI autentikasi penuh untuk pengguna. |
| `frontend/src/components/BookCard.tsx` | ✏️ Diubah | Menambahkan Ikon *Trash* (Remove) yang beroperasi via handler tanpa mengganggu navigasi Link. |
| `frontend/src/App.tsx` | ✏️ Diubah | Mendaftarkan *routes* untuk `/login` dan `/register`. |

---

### 🚀 Cara Menjalankan

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows Git Bash: source venv/Scripts/activate
# Install dependensi (jika belum)
# pip install flask flask-cors python-dotenv
python app.py
# → API berjalan di http://localhost:5001
```

**Testing Backend:**
```bash
cd backend
python test_app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# → Web berjalan di http://localhost:5173
```

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
