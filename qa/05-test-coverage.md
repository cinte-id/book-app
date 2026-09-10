# Test Coverage Report — Book Tracker App

**Tanggal:** 09 - 10 September 2026

## Ringkasan

| Kategori | Total Test Case | Pass | Fail | Pass with Notes |  N/A|  Belum Dites |
|---|---|---|---|---|---|---|
| Page Load & Initial Display | 5 | 5 | 0 | 0 | 0 | 0 |
| Search | 9 | 7 | 2 | 0 | 0 | 0 |
| Genre Filter | 6 | 5 | 0 | 0 | 1 | 0 |
| Interaksi Card | 3 | 2 | 0 | 1 | 0 | 0 |
| API-Level Testing | 8 | 4 | 3 | 1 | 0 | 0 |
| Responsiveness & Cross-check | 2 | 1 | 0 | 0 | 1 | 0 |
| Smoke Test (halaman lain) | 7 | 6 | 0 | 1 | 0 | 0 |
| **TOTAL** | **40** | **30** | **5** | **3** | **2**| **0** |

Keterangan:
- **Pass** = berjalan sesuai ekspektasi
- **Fail** = tidak sesuai ekspektasi (jadi bug report)
- **Pass with Notes** = berjalan, tapi ada catatan tambahan (bukan bug fatal)
- **N/A** = kondisi test tidak dapat disimulasikan dengan data yang tersedia
- **Belum Dites** = belum dieksekusi karena keterbatasan waktu/tools

## Coverage by Type

| Type | Jumlah Test Case |
|---|---|
| Positive | 16 |
| Negative | 9 |
| Edge case | 4 |
| Observasi | 3 |
| Cross-check | 1 |
| Smoke | 7 |
| **Total** | **40** |

## Bugs Ditemukan

| Bug ID | Judul | Severity | Status |
|---|---|---|---|
| BUG-001 | Port backend & frontend tidak sesuai dokumentasi README | Low | Open |
| BUG-002 | Halaman kembali ke Home saat di-refresh | Medium | Open |
| BUG-003 | Pencarian tidak konsisten menangani spasi berlebih | Low | Open |
| BUG-004 | Card buku terlihat bisa diklik, tapi tidak ada aksi saat diklik | Low | Open |
| BUG-005 | Nilai status di data API tidak sesuai dengan yang tertulis di README | Medium | Open |
| BUG-006 | POST /api/books tanpa title tetap diterima, menyebabkan halaman Browse Library crash | High| Open |
| BUG-007 | POST /api/books menerima nilai status yang tidak sesuai daftar yang ditentukan | Low | Open |

## Kesimpulan

Fitur utama Browse Library (search, filter genre, tampilan data) secara umum berfungsi dengan baik untuk skenario normal di sisi UI. Dari 40 test case yang dieksekusi, 30 dinyatakan Pass, 5 Fail, 3 Pass with Notes, dan 2 tidak dapat diuji karena keterbatasan data/environment yang tersedia.

Ditemukan 7 bug dengan rincian severity: 1 High, 2 Medium, 4 Low. Bug paling kritikal adalah BUG-006, di mana backend menerima data tanpa validasi (title kosong) yang kemudian menyebabkan seluruh halaman Browse Library crash di sisi frontend, ini menunjukkan kurangnya validasi input baik di level backend (API) maupun frontend (penanganan data tidak lengkap). Sisanya adalah bug minor terkait konsistensi dokumentasi, penanganan whitespace pada pencarian, dan validasi data di endpoint API.

Tidak ditemukan bug yang menghalangi penggunaan fitur utama secara normal (skenario dengan input valid berjalan lancar), namun ditemukan celah validasi input yang cukup signifikan di sisi backend yang sebaiknya menjadi prioritas perbaikan sebelum aplikasi digunakan di lingkungan produksi.