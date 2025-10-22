Test Plan Document – Book App

Dokumen ini menjelaskan rencana pengujian aplikasi Book App untuk memastikan semua fitur berjalan sesuai kebutuhan, baik di local environment maupun live environment.

Backend (Local): http://localhost:5001 (port yang saya gunakan) | http://localhost:5000 (port di dokumen)

Frontend (Local): http://localhost:8080 (port yang saya gunakan) | http://localhost:5173 (port di dokumen)

Live App: https://book-app.cinte.id/

**Ruang Lingkup yang di uji**

1.  tambah, lihat, update, and hapus books (Backend/API)
2.  fitur search (home, library, discover, reading, profile)
3.  fitur notifikasi
4.  fitur tambah library
5.  fitur filter library
6.  fitur lanjut baca (home, reading)
7.  fitur detail buku (home, discover)

**Tujuan Pengujian**

1.  memastikan API berfungsi dengan baik
2.  Memastikan fungsi berjalan sesuai ekspektasi (positive case).
3.  Memastikan sistem dapat menangani error & input tidak valid (negative case).

**Lingkungan Uji**

1.  Local Development: Backend & frontend berjalan di localhost.
2.  Live Environment: Aplikasi tersedia.
3.  Browser: Firefox.
4.  Device: Desktop.

**Strategi Pengujian**

1.  Functional Testing
2.  API testing

**Test Scenarios**

1.  tambah, lihat, update, and hapus books (Backend/API)

ID : BOOK-GET-01
Test Scenario : Ambil semua buku (GET /books).

ID : BOOK-POST-01
Test Scenario : Menambahkan buku baru

ID : BOOK-PUT-01
Test Scenario : mengupdate buku yang sudah ada

ID : BOOK-DELETE-01
Test Scenario : menghapus buku berdasarkan ID

2.  fitur search (home, library, discover, reading, profile)

ID : SEARCH-HOME
Test Scenario : melakukan pencarian data buku di menu home

ID : SEARCH-LIBRARY
Test Scenario : melakukan pencarian data buku di menu library

ID : SEARCH-DISCOVER
Test Scenario : melakukan pencarian data buku di menu discover

ID : SEARCH-READING
Test Scenario : melakukan pencarian data buku di menu reading

ID : SEARCH-PROFILE
Test Scenario : melakukan pencarian data buku di menu profile

3.  fitur notifikasi

ID : NOTIFIKASI
Test Scenario : melihat notifikasi yang ada

4.  fitur tambah library

ID : TAMBAH-LIBRARY
Test Scenario : menambahkan buku ke my library di browse library

5.  fitur filter library

ID : FILTER-LIBRARY
Test Scenario : memfilter buku di browse library

6.  fitur lanjut baca (home, reading)

ID : LANJUT-BACA-HOME
Test Scenario : Kembali Membaca buku tertentu di menu home

ID : LANJUT-BACA-READING
Test Scenario : Kembali Membaca buku tertentu di menu reading

7.  fitur detail buku (home, discover)

ID : DETAIL-BUKU-HOME
Test Scenario : melihat detail buku di menu home (Recommended for You)

ID : DETAIL-BUKU-DISCOVER
Test Scenario : melihat detail buku di menu discover (Trending Now)

8.  fitur search browse library
    ID : SEARCG-BROWSE-LIBRARY
    Test Scenario : melakukan pencarian di browse library

**Deliverables**

1.  Test Plan Document (dokumen ini).
2.  Test Execution Results (PASS/FAIL).
3.  Bug Reports.
4.  Test Coverage Report (fitur yang diuji + persentase).
