# Test Coverage Report

## Overview
Laporan ini merangkum hasil pengujian aplikasi **BookTracker**:

- **API Testing (Backend)**: Mengecek semua test case CRUD (GET, POST, PUT, DELETE)  
- **Functional Testing (Frontend)**: Mengecek fitur pada menu Home, Library, Discover, Reading, dan Profile

---

## 1. API Testing (Backend)

- **Total Test Cases (TC):** 39  
- **Pass:** 19  
- **Fail:** 20  
- **Coverage:** 48.72%

**Distribusi per method:**

| Method | Total TC |
|--------|----------|
| GET    | 4        |
| POST   | 19       |
| DELETE | 3        |
| PUT    | 13       |

**Interpretasi:**  
- Sekitar setengah TC gagal, menunjukkan backend perlu diperbaiki terutama pada beberapa endpoint CRUD.

---

## 2. Functional Testing (Frontend)

- **Total Test Cases (TC):** 18  
- **Pass:** 15  
- **Fail:** 3  
- **Coverage:** 83.33%

**Distribusi per menu / feature:**

| Menu / Feature               | Total TC |
|-------------------------------|----------|
| Verifikasi Halaman tiap menu  | 5        |
| Home                          | 2        |
| Library                       | 7        |
| Discover                      | 2        |
| Reading                       | 1        |
| Profile                       | 1        |

**Interpretasi:**  
- Sebagian besar TC lulus → fungsional UI cukup stabil  
- 3 TC gagal pada Library & Discover → perlu diperbaiki (filter, search, add book).

---

## 3. Summary Coverage

| Layer             | Total TC | Pass | Fail | Coverage (%) |
|------------------|----------|------|------|--------------|
| Backend (API)    | 39       | 19   | 20   | 48.72%       |
| Frontend (UI)    | 18       | 15   | 3    | 83.33%       |

**Kesimpulan:**  
- **Backend:** Perlu perbaikan pada beberapa CRUD endpoint, terutama GET by ID dan validasi data.  
- **Frontend:** Umumnya stabil, namun Library dan Discover membutuhkan perbaikan untuk filter, search, dan penambahan buku.  

---

*Report ini dibuat berdasarkan hasil pengujian manual dan automated test (jika ada).*
