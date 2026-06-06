# 📚 Book Tracker App — Fullstack Submission Report

---

## 👨‍💻 Profile
* **Nama:** Muhammad Zaky Maizi
* **Role:** Mid-Level Fullstack Developer

---

## 📝 Submission Notes & Tasks Completed
Berhasil mengimplementasikan seluruh target tantangan yang tertera pada panduan `TASKS_FULLSTACK_MID.md`:

### 🔹 Core Features (Fitur Utama)
* [x] **Search & Filter** — Implementasi pencarian teks dan filter genre *server-side* melalui endpoint `/api/books?q=&genre=`.
* [x] **Detail Page** — Halaman detail buku (`/books/:id`) interaktif yang mendukung kontrol transisi status bacaan (*Want to read* ➡️ *Reading* ➡️ *Read*).
* [x] **Isolated User Library** — Rekayasa arsitektur penyimpanan dari global menjadi personal menggunakan berkas pengisolasi `user_libraries.json`. Setiap akun memulai koleksi dari nol.
* [x] **Remove from My Library** — Fitur menghapus buku dari koleksi pribadi (mengembalikan status menjadi `unread`) tanpa merusak atau menghapus data master pada katalog utama.
* [x] **Reading Progress** — Penjejakan halaman bacaan aktif (`currentPage`) yang dilengkapi dengan indikator visual *Progress Bar* dinamis.
* [x] **Input Validation** — Proteksi ketat pada *backend* untuk menangkap data anomali (seperti input negatif atau format salah) dan merespons dengan `400 Bad Request`.

### ⚡ Optional & Bonus Features
* [x] **[Opsional] Server-Side Pagination** — Optimasi performa katalog buku menggunakan parameter `limit` dan `page` untuk menangani data skala besar secara ringan.
* [x] **[Opsional] Token Authentication** — Sistem keamanan mutasi data (POST, PUT, DELETE) menggunakan mekanisme *Custom Token* lengkap dengan halaman registrasi dan login.
* [x] **[Opsional] Real-time Reading Stats** — Halaman profil *live* yang menghitung statistik pengguna langsung dari sisi backend via `GET /api/stats` berdasarkan buku yang selesai dibaca.
* [x] **[Bonus] Automated Unit Testing** — Jaminan stabilitas kode melalui skrip pengujian otomatis `test_app.py` menggunakan modul *unittest* Python untuk rute API Backend.

---

## 📐 Architecture & Changes Summary

### ⚙️ Konsep Arsitektur
| Konsep | Penjelasan |
| :--- | :--- |
| **Global Catalog vs User Library** | Master katalog disimpan aman di `books.json`. Progres bacaan dan status personal setiap pengguna dipisah ke `user_libraries.json` agar aktivitas antar-user tidak saling mengganggu. |
| **Authentication Flow** | Endpoint mutasi data (POST, PUT, DELETE) dikunci dekorator `@requires_auth`. Frontend menyisipkan Token di *header* via Axios Interceptor dan otomatis melakukan redirect ke `/login` jika menerima respons `401 Unauthorized`. |
| **Statistik Real-Time** | Backend menyisir `user_libraries` milik akun yang sedang login, lalu menghitung metrik secara dinamis (Total buku dibaca, total halaman, dan genre favorit). |

### 📂 File yang Diubah & Ditambahkan
| File | Status | Perubahan |
| :--- | :---: | :--- |
| `backend/app.py` | ✏️ Diubah | Server-side filter, Paginasi, Auth Middleware, Logika Pemisahan User Library, & Endpoint Statistik. |
| `backend/users.json` | 🆕 Baru | Database lokal khusus menyimpan kredensial login pengguna. |
| `backend/test_app.py` | 🆕 Baru | Skrip Unit Test Python untuk menjamin *quality control* pada endpoint backend. |
| `frontend/src/services/api.ts` | ✏️ Diubah | Menambahkan Axios *request interceptor* (Token) & *response interceptor* (Global 401 Redirect). |
| `frontend/src/pages/Index.tsx` | ✏️ Diubah | Menambahkan tombol Sign In/Log Out, integrasi Live Profil Stats, fungsionalitas Remove dari Library. |
| `frontend/src/pages/Login.tsx` & `Register.tsx` | 🆕 Baru | UI/Halaman autentikasi penuh untuk login dan pendaftaran pengguna baru. |
| `frontend/src/components/BookCard.tsx` | ✏️ Diubah | Menambahkan Ikon *Trash* (Remove) yang beroperasi via handler tanpa mengganggu navigasi Link. |
| `frontend/src/App.tsx` | ✏️ Diubah | Mendaftarkan jalur *routing* baru untuk halaman `/login` dan `/register`. |

---

## 🚀 Cara Menjalankan Aplikasi

*Backend:*
bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows Git Bash: source venv/Scripts/activate
# Install dependensi (jika belum)
# pip install flask flask-cors python-dotenv
python app.py
# → API berjalan di http://localhost:5001


*Testing Backend:*
bash
cd backend
python test_app.py


*Frontend:*
bash
cd frontend
npm install
npm run dev
# → Web berjalan di http://localhost:8080
