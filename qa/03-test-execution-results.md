# Test Execution Results Book Tracker App

**Tanggal eksekusi:** Rabu, 09 September 2026
**Tester:** Astry Debora Sipayung

Status: ✅ Pass | ❌ Fail | ⚠️ Pass with notes | N/A Skenario Tidak Bisa Dites | ⏳ Belum dites

---

## A. Page Load & Initial Display

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BL-001 | Halaman Browse Library berhasil dimuat | Halaman menampilkan judul "Browse Library", search bar, filter genre (scrollable), dan list 8 buku. Sesuai expected result.| ✅ |
| BL-002 | Jumlah buku sesuai data | Teks "8 books found" sesuai dengan jumlah card yang tampil (dihitung manual: 8 card). | ✅ |
| BL-003 | Book card menampilkan info lengkap | Card "The Great Gatsby" menampilkan title, author (F. Scott Fitzgerald), genre badge (Classic), rating (4.2), dan status badge (read). Semua field lengkap.| ✅ |
| BL-004 | Loading state saat data belum siap | Dengan kondisi network normal, transisi terlalu cepat untuk teramati. Setelah diubah ke "Slow 4G" di DevTools, muncul indikator loading (spinner biru berputar) sebelum data tampil. Behavior sesuai ekspektasi. | ✅ |
| BL-005 | Error state saat backend mati | Saat backend dimatikan lalu halaman di-refresh, muncul pesan "Failed to fetch books. Please try again later." dengan jelas, bukan halaman blank/crash. | ✅ |

## B. Search

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BL-010 | Search judul buku valid | Ketik "Gatsby" di search bar, hanya card "The Great Gatsby" yang muncul, buku lain ter-filter. | ✅ |
| BL-011 | Search nama author valid | Ketik "Tolkien" di search bar, buku dengan author J.R.R. Tolkien (The Lord of the Rings) muncul, buku lain ter-filter.| ✅ |
| BL-012 | Search case-insensitive |  Ketik "gatsby" (huruf kecil semua), tetap menemukan "The Great Gatsby" sama seperti pencarian dengan huruf kapital.| ✅ |
| BL-013 | Search keyword tidak ada | Ketik "xyzxyz123", muncul pesan "No books found matching your criteria". Tidak ada halaman kosong tanpa keterangan| ✅ |
| BL-014 | Hapus search setelah diisi | Setelah menghapus semua teks di search bar, semua 8 buku kembali ditampilkan seperti semula. | ✅ |
| BL-015 | Search karakter spesial | Ketik "@#$%^&*", muncul pesan "No books found matching your criteria" dengan wajar, tidak crash/freeze.| ✅ |
| BL-016 | Search dengan spasi berlebih | Perilaku tidak konsisten: (1) " Gatsby" (spasi di depan) → hasil muncul normal; (2) "Gatsby " (spasi di belakang) → "No books found matching your criteria"; (3) " Gatsby " (spasi depan+belakang) → "No books found matching your criteria"; (4) "  Gatsby" (2 spasi di depan) → "No books found matching your criteria". Search seharusnya trim whitespace secara konsisten di semua posisi. | ❌ |
| BL-017 | Search hanya spasi | Tidak konsisten: 1 spasi diperlakukan sebagai kosong (semua 8 buku tetap tampil), tapi 2 spasi atau lebih malah dianggap sebagai keyword pencarian sehingga muncul "No books found matching your criteria". Terkait dengan BUG-003.| ❌ |
| BL-018 | Search realtime vs submit | Hasil pencarian ter-update secara realtime tiap kali user mengetik satu karakter (tanpa perlu tekan Enter atau tombol submit). Contoh: ketik "g" langsung filter ke buku/author mengandung huruf "g", lanjut ketik "a" jadi "ga" hasil semakin spesifik.| ✅ |

## C. Genre Filter

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BL-020 | Filter "All Genres" default |  Setelah refresh halaman, tab "All Genres" aktif (highlight biru) secara default, dan semua 8 buku ditampilkan.| ✅ |
| BL-021 | Filter genre spesifik |  Klik chip "Fiction", hanya 1 buku dengan genre Fiction yang tampil (To Kill a Mockingbird), teks counter berubah menjadi "1 book found". | ✅ |
| BL-022 | Ganti antar genre | Dari filter "Fiction", klik genre "Classic", hasil langsung berganti total menampilkan hanya buku Classic, tidak menumpuk dengan filter sebelumnya.| ✅ |
| BL-023 | Kombinasi search + filter | Filter genre "Fantasy" dipilih (2 buku tampil), search bar bekerja sebagai irisan (AND): jika keyword cocok dengan title/author salah satu dari 2 buku Fantasy, hanya buku itu yang tampil; jika keyword tidak cocok sama sekali, muncul "No books found matching your criteria".| ✅ |
| BL-024 | Filter genre dengan 0 hasil |Semua genre yang dicoba ternyata punya minimal 1 buku, tidak ada genre yang kosong. Jadi kasus "no books found" belum bisa diuji langsung karena datanya tidak menyediakan genre kosong. | N/A |
| BL-025 | Scroll horizontal daftar genre | Area chip genre bisa di-scroll ke kanan, genre tambahan (Coming of Age, Fantasy, Sci-Fi) muncul setelah "Romance". Semua genre dapat diakses.| ✅ |

## D. Interaksi Card

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BL-030 | Klik book card | Klik card buku tidak memicu aksi apapun. Hanya ada efek bayangan (shadow) saat kursor diarahkan ke card, tapi tidak ada yang terjadi saat diklik.| ⚠️ |
| BL-031 | Status badge sesuai data |Status "read" pada card "The Great Gatsby" sesuai dengan field "status":"read" pada response API. | ✅ |
| BL-032 | Rating sesuai data | Rating 4.2 pada card "The Great Gatsby" sesuai dengan field "rating":4.2 pada response API. | ✅ |

## E. API-Level Testing

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BL-040 | GET /api/books mengembalikan data valid | Response berupa array JSON berisi 8 buku, tiap buku punya field lengkap: id, title, author, genre, status, rating, pages, cover. | ✅ |
| BL-041 | Konsistensi nilai `status` | README menyebut nilai status yang valid adalah unread, reading, completed. Tapi data asli dari GET /api/books memakai nilai berbeda: read, reading, want-to-read. Ada 2 nilai yang tidak sesuai dokumentasi (unread vs want-to-read, dan completed vs read). Lihat BUG-005.| ❌ |
| BL-042 | POST /api/books data valid | Response sukses (201 Created). Buku baru terbuat dengan id 9, title "Test Book", author "Test Author", status "reading". Field yang tidak dikirim (genre, cover, rating, pages) otomatis terisi nilai kosong/0.| ✅ |
| BL-043 | POST /api/books field kosong | Request tanpa title tetap diterima dengan status 201 Created, bukan ditolak dengan 400. Buku baru terbuat (id 10) dengan title bernilai null. Lihat BUG-006. | ❌ |
| BL-044 | POST /api/books status di luar enum | Request dengan status "invalid-status" tetap diterima (201 Created), seharusnya ditolak. Namun berbeda dengan kasus title null, status yang tidak valid ini tidak membuat UI crash, badge status pada card tetap menampilkan teks "invalid-status" apa adanya. Lihat BUG-007.| ❌ |
| BL-045 | PUT /api/books/\<id\> id tidak ada | Response menunjukkan status 404 dengan body {"error": "Book not found"}. Sesuai expected result, request ditolak dengan pesan error yang jelas.| ✅ |
| BL-046 | DELETE /api/books/\<id\> id tidak ada | Response menunjukkan status 404 dengan body {"error": "Book not found"}. Sesuai expected result, request ditolak dengan pesan error yang jelas.| ✅ |
| BL-047 | Data hilang setelah restart | Data (id 9, id 11) tetap ada setelah restart, tidak hilang seperti dugaan expected result. Kemungkinan storage bersifat persisten, bukan in-memory.| ⚠️ |

## F. Responsiveness & Cross-check

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BL-050 | Tampilan browser sempit | Layout tetap rapi saat browser diperkecil/disimulasikan sebagai device kecil, search bar dan filter genre tetap dapat digunakan tanpa overlap.| ✅ |
| BL-051 | Bandingkan localhost vs live | Tidak dapat dieksekusi. Live environment (https://book-app.cinte.id/) tidak dapat diakses saat testing dilakukan (ERR_HTTP2_PROTOCOL_ERROR). Cross-check dengan versi live tidak dapat dilakukan.| N/A |

## G. Smoke Test — Halaman Lain

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| SM-001 | Buka halaman Home | Halaman terbuka normal, tidak ada error atau blank screen.| ✅ |
| SM-002 | Buka tab "My Books" | Tab terbuka normal, menampilkan UI tanpa error. | ✅ |
| SM-003 | Buka halaman Discover | Halaman terbuka normal, tidak ada error atau blank screen. | ✅ |
| SM-004 | Buka halaman Reading | Halaman terbuka normal, tidak ada error atau blank screen. | ✅ |
| SM-005 | Buka halaman Profile | Halaman terbuka normal, tidak ada error atau blank screen.| ✅ |
| SM-006 | Navigasi bottom nav | Setiap ikon mengarah ke halaman yang sesuai (tidak ada yang tertukar). Ikon yang sedang aktif ter-highlight dengan warna biru dan sedikit membesar (zoom in) dibanding ikon lain. | ✅ |
| SM-007 | Refresh di tiap halaman | Tidak ada error/404 saat refresh di halaman manapun. Sesuai temuan BUG-002, refresh selalu mengembalikan ke halaman Home, bukan tetap di halaman yang sedang dibuka.| ⚠️ |
