## Test Execution

**Project:** Book Tracker App
**Module:** api/test dan api/books  
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 27 Agustus 2025

**Tujuan Pengujian:** Memastikan API test dan books berjalan

**Lingkungan Pengujian:**

- Local: http://localhost:5001
- tools: postman

## Test Cases & Execution

### Test Case 1: [TC001] – [api/test]

- **Endpoint:** `GET api/test`
- **Tujuan:** apakah api ini berjalan atau tidak
- **Request Body:** Tidak ada
- **Langkah Pengujian:**
  1. Kirim request ke endpoint `/test`
  2. Periksa status code yang diterima
  3. Periksa format response JSON
- **Hasil yang Diharapkan:**
  - Status code 200 OK
  - Response JSON berisi array buku dengan field: message : "CORS is working!"
- **Hasil Aktual:**
  - Status code 200 OK
  - Response JSON berisi array buku dengan field: message : "CORS is working!"
- **Status:** Pass

### Test Case 2: [TC002] – [api/books]

- **Endpoint:** `GET /books`
- **Tujuan:** Mendapatkan daftar semua buku
- **Request Body:** Tidak ada
- **Langkah Pengujian:**
  1. Kirim request ke endpoint `/books`
  2. Periksa status code yang diterima
  3. Periksa format response JSON
- **Hasil yang Diharapkan:**
  - Status code 200 OK
  - Response JSON berisi array buku dengan field: author, cover, genre, id, pages, rating, status, title
- **Hasil Aktual:**
  - Status code 200 OK
  - Response JSON berisi array buku dengan field: author, cover, genre, id, pages, rating, status, title
- **Status:** Pass

### Test Case 3: [TC003] – [api/books]

- **Endpoint:** `POST /books`
- **Tujuan:** Menambahkan buku baru
- **Request Body:**
  {
  "title": "uji coba",
  "author": "dika",
  "status": "unread"
  }
- **Langkah Pengujian:**
  1. Kirim request POST ke endpoint /books dengan request body di atas
  2. Periksa status code yang diterima
  3. Periksa format response JSON
- **Hasil yang Diharapkan:**
  - Status code 201 Created
  - Response JSON berisi id buku baru, author, status, title
- **Hasil Aktual:**
  - Status code 201 Created
  - Response JSON berisi id buku baru, author, status, title
- **Status:** Pass

### Test Case 4: [TC004] – [api/books]

- **Endpoint:** `PUT /books`
- **Tujuan:** Memperbarui data buku berdasarkan ID tertentu
- **Request Body:**
  {
  "title": "Belajar Vue.js Lanjutan",
  "author": "Dika S.A",
  "status": "reading"
  }

- **Langkah Pengujian:**
  1. Kirim request PUT ke endpoint /books dengan id ternteu dan request body di atas
  2. Periksa status code yang diterima
  3. Periksa format response JSON
- **Hasil yang Diharapkan:**
  - Status code 200
  - Response JSON berisi author, status, title dengan data yang baru dan id yang dipilih
- **Hasil Aktual:**
  - Status code 200
  - Response JSON berisi author, status, title dengan data yang baru dan id yang dipilih
- **Status:** Pass

### Test Case 5: [TC005] – [api/books]

- **Endpoint:** `DELETE /books`
- **Tujuan:** menghapus data buku berdasarkan ID tertentu
- **Request Body:** tidak adad
- **Langkah Pengujian:**
  1. Kirim request DELETE ke endpoint /books dengan id tertentu
  2. Periksa status code yang diterima
  3. Periksa format response JSON
- **Hasil yang Diharapkan:**
  - Status code 200
  - Response JSON berisi data yang dihapus
- **Hasil Aktual:**
  - Status code 200
  - Response JSON berisi data yang dihapus
- **Status:** Pass

## Test Execution

**Project:** Book Tracker App
**Module:** fitur search (home, library, discover, reading, profile)  
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 27 Agustus 2025

**Tujuan Pengujian:** Memastikan fitur search berjalan dengan baik

**Lingkungan Pengujian:**

- Local: http://localhost:8080/
- Live App: https://book-app.cinte.id/
- browser : firefox (142.0.1)

### Test Case 1: [TC001] – [fitur search di menu home (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu Home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu Home.
  - Masukkan kata kunci pada kolom search (misal: "Atomic Habits").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Tombol atau icon search tidak bisa di klik
- **Status:** Fail

### Test Case 2: [TC002] – [fitur search di menu home (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu Home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu Home.
  - Masukkan kata kunci pada kolom search (misal: "Atomic Habits").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Tombol atau icon search tidak bisa di klik
- **Status:** Fail

### Test Case 3: [TC003] – [fitur search di menu library (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu library berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu library
  - klik search di bawah teks browse library
  - ketik Pride and Prejudice di kolom search dan klik enter
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Status:** pass

### Test Case 4: [TC004] – [fitur search di menu library (negative) (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu library berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu library
  - klik search di bawah teks browse library
  - ketik helloSemua di kolom search dan klik enter
- **Hasil yang Diharapkan:**
  - memunculkan pesan error (No books found matching your criteria)
- **Hasil Aktual:**
  - memunculkan pesan error (No books found matching your criteria)
- **Status:** pass

### Test Case 5: [TC005] – [fitur search di menu library (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu library berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu library dan tekan tombol atau icon browse.
  - Masukkan kata kunci pada kolom search (misal: "1984").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - tidak muncul halaman browse
- **Status:** Fail

### Test Case 6: [TC006] – [fitur search di menu discover (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu discover berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu discover.
  - Masukkan kata kunci pada kolom search (misal: "dune").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - tidak muncul daftar buku yang relevan walaupun ketika di cek secara manual buku tersebut ada dan tidak ada pesan error ketika buku tidak ada
- **Status:** Fail

### Test Case 7: [TC007] – [fitur search di menu discover (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu discover berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu discover.
  - Masukkan kata kunci pada kolom search (misal: "dune").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - tidak muncul daftar buku yang relevan walaupun ketika di cek secara manual buku tersebut ada dan tidak ada pesan error ketika buku tidak ada
- **Status:** Fail

### Test Case 8: [TC008] – [fitur search di menu reading (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu reading berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu reading.
  - Masukkan kata kunci pada kolom search (misal: "Atomic Habits").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Tombol atau icon search tidak bisa di klik
- **Status:** Fail

### Test Case 9: [TC009] – [fitur search di menu reading (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu reading berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu reading.
  - Masukkan kata kunci pada kolom search (misal: "Atomic Habits").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Tombol atau icon search tidak bisa di klik
- **Status:** Fail

### Test Case 10: [TC010] – [fitur search di menu profile (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu profile berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu profile.
  - Masukkan kata kunci pada kolom search (misal: "Atomic Habits").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Tombol atau icon search tidak bisa di klik
- **Status:** Fail

### Test Case 11: [TC011] – [fitur search di menu profile (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur search di menu profile berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu profile.
  - Masukkan kata kunci pada kolom search (misal: "Atomic Habits").
  - Tekan tombol search atau Enter.
  - Periksa apakah daftar buku yang muncul sesuai dengan kata kunci.
- **Hasil yang Diharapkan:**
  - Daftar buku yang relevan dengan kata kunci muncul.
- **Hasil Aktual:**
  - Tombol atau icon search tidak bisa di klik
- **Status:** Fail

## Test Execution

**Project:** Book Tracker App
**Module:** fitur notifikasi
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 27 Agustus 2025

**Tujuan Pengujian:** Memastikan fitur notifikasi berjalan dengan baik

**Lingkungan Pengujian:**

- Local: http://localhost:8080/
- Live App: https://book-app.cinte.id/
- browser : firefox (142.0.1)

### Test Case 12: [TC012] – [fitur notifikasi di menu home (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur notifikasi di menu home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu home.
  - Tekan tombol atau icon notifikasi di kanan atas.
- **Hasil yang Diharapkan:**
  - Memunculkan riwayat notifikasi
- **Hasil Aktual:**
  - tidak bisa di klik tombol atau icon notifikasi tersebut
- **Status:** Fail

### Test Case 13: [TC013] – [fitur notifikasi di menu home (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur notifikasi di menu home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App di menu home.
  - Tekan tombol atau icon notifikasi di kanan atas.
- **Hasil yang Diharapkan:**
  - Memunculkan riwayat notifikasi
- **Hasil Aktual:**
  - tidak bisa di klik tombol atau icon notifikasi tersebut
- **Status:** Fail

## Test Execution

**Project:** Book Tracker App
**Module:** fitur tambah library di menu library
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 29 Agustus 2025

**Tujuan Pengujian:** Memastikan fitur tambah libarary di menu libarary berfungsi dengan baik

**Lingkungan Pengujian:**

- Local: http://localhost:8080/
- Live App: https://book-app.cinte.id/
- browser : firefox (142.0.1)

### Test Case 14: [TC014] – [fitur tambah library di menu library (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur tambah libarary di menu libarary berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu library dan klik browse
  - klik tombol plus hijau untuk menambahkan buku tertentu ke dalam buku saya
- **Hasil yang Diharapkan:**
  - berhasil menambahkan buku ke dalam halaman buku saya di menu library
- **Hasil Aktual:**
  - tombol bisa di klik tetapi gagal untuk menambahkan buku ke halaman buku saya
- **Status:** Fail

### Test Case 15: [TC015] – [fitur tambah library di menu library (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur tambah libarary di menu libarary berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu library dan klik browse
  - klik tombol plus hijau untuk menambahkan buku tertentu ke dalam buku saya
- **Hasil yang Diharapkan:**
  - berhasil menambahkan buku ke dalam halaman buku saya di menu library
- **Hasil Aktual:**
  - tidak memunculkan halaman browse
- **Status:** Fail

## Test Execution

**Project:** Book Tracker App
**Module:** fitur filter library
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 29 Agustus 2025

**Tujuan Pengujian:** Memastikan fitur filter libarary di menu libarary berfungsi dengan baik

**Lingkungan Pengujian:**

- Local: http://localhost:8080/
- Live App: https://book-app.cinte.id/
- browser : firefox (142.0.1)

### Test Case 16: [TC016] – [fitur filter library di menu library (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur filter libarary di menu libarary berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu library dan klik browse
  - klik salah satu tombol genre
- **Hasil yang Diharapkan:**
  - berhasil memfilter sesuai genre yang di pilih
- **Hasil Aktual:**
  - berhasil memfilter sesuai genre yang di pilih
- **Status:** pass

### Test Case 17: [TC017] – [fitur filter library di menu library (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur filter libarary di menu libarary berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu library dan klik browse
  - klik salah satu tombol genre
- **Hasil yang Diharapkan:**
  - berhasil memfilter sesuai genre yang di pilih
- **Hasil Aktual:**
  - tidak memunculkan halaman browse
- **Status:** Fail

## Test Execution

**Project:** Book Tracker App
**Module:** fitur lanjut baca (home, reading)
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 29 Agustus 2025

**Tujuan Pengujian:** Memastikan fitur lanjut baca di menu home dan reading berfungsi dengan baik

**Lingkungan Pengujian:**

- Local: http://localhost:8080/
- Live App: https://book-app.cinte.id/
- browser : firefox (142.0.1)

### Test Case 18: [TC018] – [fitur lanjut baca di menu home (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur lanjut baca di menu home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu home dan klik tombol play di continue reading
- **Hasil yang Diharapkan:**
  - berhasil melanjutkan riwayat terakhir dari bacaan pengguna
- **Hasil Aktual:**
  - tombol tidak bisa di klik
- **Status:** fail

### Test Case 19: [TC019] – [fitur lanjut baca di menu home (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur lanjut baca di menu home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu home dan klik tombol play di continue reading
- **Hasil yang Diharapkan:**
  - berhasil melanjutkan riwayat terakhir dari bacaan pengguna
- **Hasil Aktual:**
  - tombol tidak bisa di klik
- **Status:** Fail

### Test Case 20: [TC020] – [fitur lanjut baca di menu reading (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur lanjut baca di menu reading berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu reading dan klik tombol play di continue reading
- **Hasil yang Diharapkan:**
  - berhasil melanjutkan riwayat terakhir dari bacaan pengguna
- **Hasil Aktual:**
  - tombol tidak bisa di klik
- **Status:** fail

### Test Case 21: [TC021] – [fitur lanjut baca di menu reading (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur lanjut baca di menu reading berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu reading dan klik tombol play di continue reading
- **Hasil yang Diharapkan:**
  - berhasil melanjutkan riwayat terakhir dari bacaan pengguna
- **Hasil Aktual:**
  - tombol tidak bisa di klik
- **Status:** Fail

## Test Execution

**Project:** Book Tracker App
**Module:** fitur detail buku (home, discover)
**Tester:** Dika Sulaeman Akbar  
**Tanggal:** 29 Agustus 2025

**Tujuan Pengujian:** Memastikan fitur detail buku di menu home dan discover berfungsi dengan baik

**Lingkungan Pengujian:**

- Local: http://localhost:8080/
- Live App: https://book-app.cinte.id/
- browser : firefox (142.0.1)

### Test Case 22: [TC022] – [fitur detail buku di menu home (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur detail buku di menu home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu home dan klik salah satu buku di Recommended for You
- **Hasil yang Diharapkan:**
  - berhasil melihat detail buku
- **Hasil Aktual:**
  - tidak bisa melihat detail buku
- **Status:** fail

### Test Case 23: [TC023] – [fitur detail buku di menu home (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur detail buku di menu home berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu home dan klik salah satu buku di Recommended for You
- **Hasil yang Diharapkan:**
  - berhasil melihat detail buku
- **Hasil Aktual:**
  - tidak bisa melihat detail buku
- **Status:** Fail

### Test Case 24: [TC024] – [fitur detail buku di menu discover (local)]

- **Endpoint:** `http://localhost:8080/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur detail buku di menu discover berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu discover dan klik salah satu buku di Trending Now
- **Hasil yang Diharapkan:**
  - berhasil melihat detail buku
- **Hasil Aktual:**
  - tidak bisa melihat detail buku
- **Status:** fail

### Test Case 25: [TC025] – [fitur detail buku di menu discover (Live App)]

- **Endpoint:** `https://book-app.cinte.id/`
- **Lingkuangan Pengujian:** firefox (142.0.1)
- **Tujuan:** Memastikan fitur detail buku di menu discover berfungsi dengan baik
- **Langkah Pengujian:**
  - Buka aplikasi Book Tracker App.
  - arahkan ke menu discover dan klik salah satu buku di Trending Now
- **Hasil yang Diharapkan:**
  - berhasil melihat detail buku
- **Hasil Aktual:**
  - tidak bisa melihat detail buku
- **Status:** Fail
