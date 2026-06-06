# 📚 Book Tracker Application - Recruitment Technical Assessment

## 👨‍💻 Candidate Information

| Detail | Information |
|----------|-------------|
| **Name** | Muhammad 'Abdhu Syukra |
| **Position Applied** | Fullstack Developer (Mid-Level) |
| **Project Type** | Technical Recruitment Assignment |
| **Tech Stack** | Flask, React, TypeScript, Axios |

---

# 🎯 Project Overview

Aplikasi ini merupakan pengembangan dari sistem **Book Tracker** yang digunakan untuk mengelola daftar bacaan pengguna. Fokus pengerjaan berada pada peningkatan fitur backend dan frontend untuk mendukung pengalaman pengguna yang lebih personal, aman, dan mudah digunakan.

Selain fitur dasar pengelolaan buku, sistem kini mendukung:

- Autentikasi pengguna
- Library terpisah untuk setiap akun
- Progress membaca buku
- Statistik membaca secara real-time
- Validasi data backend
- Pagination dan filtering
- Automated unit testing

---

# ✅ Completed Features

## 1. Search & Genre Filtering

Implementasi pencarian dan filter genre dilakukan langsung di sisi backend melalui endpoint:

```http
GET /api/books?q=<keyword>&genre=<genre>
```

Keuntungan pendekatan ini:

- Mengurangi beban frontend
- Lebih efisien untuk dataset besar
- Mudah dikembangkan ke database production

---

## 2. Book Detail Page

Halaman detail buku (`/books/:id`) telah dilengkapi dengan:

- Informasi lengkap buku
- Status membaca
- Progress membaca
- Kontrol perubahan status

Alur status:

```text
Want To Read
      ↓
   Reading
      ↓
     Read
```

---

## 3. User-Based Library System

Library pengguna tidak lagi menggunakan data global.

Arsitektur baru:

```text
books.json
    ↓
Master Catalog

user_libraries.json
    ↓
User Reading Progress
User Reading Status
User Collections
```

Setiap akun memiliki koleksi buku yang independen sehingga aktivitas satu pengguna tidak mempengaruhi pengguna lainnya.

---

## 4. Remove Book From Library

Pengguna dapat menghapus buku dari koleksi pribadi tanpa menghapus data dari katalog utama.

Proses yang dilakukan:

```text
My Library
    ↓
Remove Book
    ↓
Status → unread
    ↓
Kembali ke katalog utama
```

---

## 5. Reading Progress Tracking

Fitur progress membaca memungkinkan pengguna memperbarui halaman terakhir yang dibaca.

Contoh:

```text
Total Halaman : 500
Halaman Saat Ini : 250

Progress : 50%
```

Visualisasi progress ditampilkan menggunakan progress bar pada antarmuka pengguna.

---

## 6. Backend Validation

Seluruh endpoint mutasi data telah dilengkapi validasi input.

Contoh validasi:

- Nilai negatif tidak diperbolehkan
- Format data tidak valid ditolak
- Data kosong tidak diproses

Response:

```http
400 Bad Request
```

---

## 7. Pagination Support (Optional)

Endpoint katalog mendukung pagination:

```http
GET /api/books?page=1&limit=10
```

Manfaat:

- Performa lebih baik
- Penggunaan bandwidth lebih kecil
- Skalabilitas meningkat

---

## 8. Authentication System (Optional)

Sistem autentikasi ditambahkan untuk mengamankan endpoint yang melakukan perubahan data.

Fitur:

- Register
- Login
- Token Authentication
- Protected Routes

Endpoint yang membutuhkan autentikasi:

```http
POST
PUT
DELETE
```

Frontend secara otomatis:

- Menyisipkan token melalui Axios Interceptor
- Redirect ke halaman login jika token tidak valid

---

## 9. Reading Statistics Dashboard (Optional)

Halaman profil menampilkan statistik yang dihitung langsung dari backend.

Endpoint:

```http
GET /api/stats
```

Data yang ditampilkan:

- Total buku selesai dibaca
- Total halaman yang telah dibaca
- Genre favorit pengguna

---

## 10. Unit Testing (Bonus)

Pengujian backend dilakukan menggunakan:

```python
unittest
```

Tujuan:

- Memastikan endpoint bekerja sesuai spesifikasi
- Mengurangi risiko bug saat pengembangan
- Menjaga kualitas kode

---

# 🏗️ Architecture Design

## Data Separation Strategy

```text
┌────────────────────┐
│    books.json      │
│ Master Catalogue   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ user_libraries.json│
│ User Collections   │
│ Reading Status     │
│ Reading Progress   │
└────────────────────┘
```

Pendekatan ini memastikan data katalog tetap konsisten dan tidak bergantung pada aktivitas pengguna tertentu.

---

# 📂 Modified & Added Files

| File | Description |
|--------|-------------|
| `backend/app.py` | Search, filtering, pagination, authentication middleware, statistics endpoint |
| `backend/users.json` | Penyimpanan data akun pengguna |
| `backend/test_app.py` | Automated backend testing |
| `frontend/src/services/api.ts` | Axios interceptors untuk authentication |
| `frontend/src/pages/Index.tsx` | Integrasi statistik dan fitur remove library |
| `frontend/src/pages/Login.tsx` | Halaman login |
| `frontend/src/pages/Register.tsx` | Halaman registrasi |
| `frontend/src/components/BookCard.tsx` | Tombol remove dari library |
| `frontend/src/App.tsx` | Routing login & register |

---

# 🚀 Installation Guide

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

pip install -r requirements.txt

python app.py
```

Backend akan berjalan di:

```text
http://localhost:5001
```

---

## Run Backend Tests

```bash
cd backend

python test_app.py
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:5173
```

---

# 🔍 Technical Decisions

## Mengapa User Library Dipisah?

Agar setiap pengguna memiliki riwayat membaca yang independen dan tidak mengubah data katalog utama.

## Mengapa Menggunakan Server-Side Filtering?

Lebih efisien dibandingkan memfilter seluruh data di frontend ketika jumlah buku bertambah besar.

## Mengapa Menambahkan Validation?

Untuk menjaga integritas data dan mencegah input tidak valid masuk ke sistem.

## Mengapa Menggunakan Axios Interceptor?

Supaya proses autentikasi dapat dikelola secara global tanpa perlu menambahkan token secara manual di setiap request.

---

# 🧪 Quality Assurance

Checklist pengujian:

- ✅ Authentication Flow
- ✅ Search Function
- ✅ Genre Filter
- ✅ Pagination
- ✅ Reading Progress Update
- ✅ Remove From Library
- ✅ Statistics Endpoint
- ✅ Input Validation
- ✅ Protected Routes
- ✅ Unit Testing

---

# 📌 Notes

Proyek ini dikembangkan sebagai bagian dari proses seleksi **Fullstack Developer (Mid-Level)** dengan fokus pada:

- Code Maintainability
- Scalability
- Data Isolation
- Security
- User Experience

---

## 🙏 Thank You

Terima kasih telah meluangkan waktu untuk melakukan review terhadap hasil pengerjaan saya.

**Muhammad 'Abdhu Syukra**  
*Fullstack Developer (Mid-Level Candidate)*