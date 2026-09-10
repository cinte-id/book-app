# Test Cases — Book Tracker App

Lihat `01-test-plan.md` untuk penjelasan kolom **Type**.

---

## A. Browse Library — Page Load & Initial Display

| ID | Scenario | Steps | Expected Result | Type |
|---|---|---|---|---|
| BL-001 | Halaman Browse Library berhasil dimuat | 1. Buka app di localhost:8080 <br> 2. Klik tab "Browse" di menu Library | Menampilkan judul "Browse Library", search bar, filter genre, daftar buku | Positive |
| BL-002 | Jumlah buku sesuai data | Bandingkan teks "8 books found" dengan jumlah card yang tampil | Angka sama dengan jumlah card aktual | Positive |
| BL-003 | Book card menampilkan info lengkap | Perhatikan satu book card | Menampilkan title, author, genre badge, rating, status badge | Positive |
| BL-004 | Loading state saat data belum siap | Refresh halaman, perhatikan detik pertama | Ada indikator loading, bukan halaman kosong tiba-tiba terisi | Positive |
| BL-005 | Error state saat backend mati | 1. Matikan backend <br> 2. Refresh halaman | Muncul pesan error yang jelas, bukan blank/crash | Negative |

## B. Browse Library — Search

| ID | Scenario | Steps | Expected Result | Type |
|---|---|---|---|---|
| BL-010 | Search judul buku valid | Ketik "Gatsby" | Hanya "The Great Gatsby" tampil | Positive |
| BL-011 | Search nama author valid | Ketik "Tolkien" | Buku dengan author Tolkien tampil | Positive |
| BL-012 | Search case-insensitive | Ketik "gatsby" (huruf kecil) | Tetap menemukan "The Great Gatsby" | Positive |
| BL-013 | Search keyword tidak ada | Ketik "xyzxyz123" | Pesan "no results found", bukan kosong tanpa keterangan | Negative |
| BL-014 | Hapus search setelah diisi | Ketik lalu hapus semua teks | Semua buku kembali tampil | Edge case |
| BL-015 | Search karakter spesial | Ketik `@#$%^&*` | Tidak crash, "no results" muncul wajar | Negative |
| BL-016 | Search dengan spasi berlebih | Ketik "  Gatsby  " | Tetap menemukan hasil yang sesuai | Edge case |
| BL-017 | Search hanya spasi | Ketik "   " | Diperlakukan sama seperti kosong | Edge case |
| BL-018 | Search realtime vs submit | Ketik huruf satu-satu | Catat: hasil update tiap ketikan atau perlu Enter | Observasi |

## C. Browse Library — Genre Filter

| ID | Scenario | Steps | Expected Result | Type |
|---|---|---|---|---|
| BL-020 | Filter "All Genres" default | Load halaman pertama kali | Tab "All Genres" aktif, semua buku tampil | Positive |
| BL-021 | Filter genre spesifik | Klik chip "Fiction" | Hanya buku genre Fiction tampil, counter update | Positive |
| BL-022 | Ganti antar genre | Klik "Fiction" lalu "Classic" | List berubah sesuai genre terbaru, tidak menumpuk | Positive |
| BL-023 | Kombinasi search + filter | Klik filter "Fantasy" lalu ketik keyword | Hasil irisan dari kedua kondisi (AND) | Edge case |
| BL-024 | Filter genre dengan 0 hasil | Klik genre yang kebetulan kosong | "No books found" wajar, bukan error | Negative |
| BL-025 | Scroll horizontal daftar genre | Geser area chip genre | Genre lain (setelah "Romance") bisa diakses semua | Positive |

## D. Browse Library — Interaksi Card

| ID | Scenario | Steps | Expected Result | Type |
|---|---|---|---|---|
| BL-030 | Klik book card | Klik card "The Great Gatsby" | Dokumentasikan perilaku aktual (buka detail / tidak ada aksi) | Observasi |
| BL-031 | Status badge sesuai data | Bandingkan badge dengan field `status` di API | Sama dengan response API | Positive |
| BL-032 | Rating sesuai data | Bandingkan angka rating card dengan field `rating` di API | Sama dengan response API | Positive |

## E. API-Level Testing

| ID | Scenario | Steps | Expected Result | Type |
|---|---|---|---|---|
| BL-040 | GET /api/books mengembalikan data valid | Akses `http://127.0.0.1:5001/api/books` | Array JSON, tiap object ada id, title, author, genre, status, rating, pages, cover | Positive |
| BL-041 | Konsistensi nilai `status` | Bandingkan status di response (read/reading/want-to-read) dengan API docs README (unread/reading/completed) | Catat sebagai temuan jika berbeda | Negative/Finding |
| BL-042 | POST /api/books data valid | Kirim title, author, status valid | Response sukses, buku baru muncul di GET | Positive |
| BL-043 | POST /api/books field kosong | Kirim tanpa title | Response error yang wajar (400), bukan 500 | Negative |
| BL-044 | POST /api/books status di luar enum | Kirim status: "invalid-status" | Idealnya ditolak (400) — catat jika diterima begitu saja | Negative |
| BL-045 | PUT /api/books/\<id\> id tidak ada | Update id 9999 | Response 404, bukan 500 | Negative |
| BL-046 | DELETE /api/books/\<id\> id tidak ada | Hapus id 9999 | Response 404 yang jelas | Negative |
| BL-047 | Data hilang setelah restart | POST buku baru, restart backend, GET lagi | Buku baru hilang (in-memory storage) — bukan bug, catat sebagai limitasi | Observasi |

## F. Responsiveness & Cross-check

| ID | Scenario | Steps | Expected Result | Type |
|---|---|---|---|---|
| BL-050 | Tampilan browser sempit | Resize browser / device toolbar | Layout tidak rusak, search & filter tetap bisa dipakai | Positive |
| BL-051 | Bandingkan localhost vs live | Buka book-app.cinte.id, bandingkan Browse Library | Perilaku & data konsisten, atau catat perbedaan | Cross-check |

## G. Smoke Test — Halaman Lain

| ID | Scenario | Expected Result |
|---|---|---|
| SM-001 | Buka halaman Home | Terbuka tanpa error/blank |
| SM-002 | Buka tab "My Books" | Terbuka, tampilkan UI meski data dummy |
| SM-003 | Buka halaman Discover | Terbuka tanpa error |
| SM-004 | Buka halaman Reading | Terbuka tanpa error |
| SM-005 | Buka halaman Profile | Terbuka tanpa error |
| SM-006 | Navigasi bottom nav | Tiap ikon mengarah ke halaman sesuai, ikon aktif ter-highlight |
| SM-007 | Refresh di tiap halaman | Tidak ada halaman error/404 saat direfresh langsung |
