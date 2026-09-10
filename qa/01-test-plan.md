# Test Plan Book Tracker App

### **Tester:** Astry Debora Sipayung
### **Role:** QA
### **Date:** Rabu, 09 September 2026
---

## 1. Objective

Memastikan fitur **Browse Library** pada Book Tracker App berfungsi dengan benar, baik untuk skenario normal (positive) maupun skenario gagal/tidak umum (negative & edge case), serta memastikan bagian lain aplikasi tidak mengalami crash.

## 2. Scope

Berdasarkan catatan resmi di dokumentasi project:
> "Integration with backend only works on page Library section Browse Library."

| Area | Level Testing | Alasan |
|---|---|---|
| **Library → Browse** | Deep testing (functional, negative, edge case, API-level) | Satu-satunya bagian yang terhubung ke backend/API real |
| Library → My Books | Smoke test saja | Tab lain dalam Library |
| Home, Discover, Reading, Profile | Smoke test saja | Halaman terpisah di bottom nav|

**Out of scope:** performance/load testing, security testing, testing di device fisik (hanya browser desktop).

## 3. Test Environment

| Item | Detail |
|---|---|
| Backend | Flask, `http://127.0.0.1:5001` (README menyebut port 5000) |
| Frontend | React + Vite, `http://localhost:8080` (README menyebut port 5173) |
| Browser | Google Chrome 128.0.6613.86 |
| OS | Windows 11 |
| Live environment | https://book-app.cinte.id/ |

## 4. Test Strategy

Kategori jenis test case yang dipakai di dokumen `02-test-cases.md`:

| Type | Artinya |
|---|---|
| **Positive** | Input/kondisi normal, harus berhasil |
| **Negative** | Input/kondisi salah, memastikan app gagal dengan wajar |
| **Edge case** | Kondisi yang jarang tapi mungkin terjadi |
| **Observasi** | Perilaku belum diketahui pasti, perlu dicoba dan dicatat aktualnya |

## 5. Deliverables

1. `01-test-plan.md` — dokumen ini
2. `02-test-cases.md` — daftar skenario yang akan diuji
3. `03-test-execution-results.md` — hasil aktual dari eksekusi tiap test case
4. `04-bug-reports/` — laporan bug (jika ditemukan), satu file per bug
5. `05-test-coverage.md` — ringkasan cakupan & hasil testing
6. `evidence/` — screenshot pendukung bug report

## 6. Notes dari Proses Setup

1. README menyatakan backend di `localhost:5000`, aktual di port `5001`.
2. README menyatakan frontend di `localhost:5173`, aktual di port `8080`.
3. `requirements.txt` berada di dalam folder `backend/`, bukan di root project.
4. Backend memerlukan izin Windows Firewall untuk jaringan Private agar dapat diakses.
