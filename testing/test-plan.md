# Test Plan – BookTracker Application

## 1. Overview
Dokumen ini menjelaskan rencana pengujian untuk aplikasi **BookTracker**, mencakup strategi, scope, test cases, dan kriteria keberhasilan. Pengujian dilakukan pada **Backend (API CRUD)** dan **Frontend (UI / Functional)**.

---

## 2. Objectives
- Memastikan **API CRUD** (GET, POST, PUT, DELETE) berfungsi sesuai requirement.  
- Memastikan **UI/Functional Testing** pada semua menu (Home, Library, Discover, Reading, Profile) berjalan dengan baik.  
- Menemukan bug dan area yang perlu diperbaiki.  
- Menyediakan data untuk Test Coverage Report.

---

## 3. Scope
- Backend API Testing:  
  - GET, POST, PUT, DELETE endpoint untuk books  
  - Validasi response code, response body, dan data  
- Frontend Functional Testing:  
  - Verifikasi halaman menu (Home, Library, Discover, Reading, Profile)  
  - Home: Continue Reading, Recommended For You  
  - Library: My Books, Browse (search & filter), Add Book  
  - Discover: Trending Now, Search  
  - Reading: Currently Reading  
  - Profile: Nama & info user  

---

## 4. Test Strategy
- **Manual Testing:**  
  - Functional Testing untuk semua menu dan fitur UI  
  - API Testing untuk CRUD endpoint menggunakan tool Postman 

---

## 5. Test Approach
1. **Backend (API) Testing:**  
   - Buat test case untuk setiap endpoint (GET, POST, PUT, DELETE)  
   - Verifikasi status code, data response, error handling  
2. **Frontend (UI) Testing:**  
   - Gunakan browser (Chrome / Firefox)  
   - Cek setiap menu, klik button, input search, filter  
   - Validasi elemen muncul sesuai ekspektasi (title, daftar buku, tombol)

---

## 6. Test Deliverables
- Test Cases (TC) Backend dan Frontend  
- Test Execution Results (Pass / Fail)  
- Bug Reports / Test Incident 
- Test Coverage Report  

---

