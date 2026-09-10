# QA Engineer Take Home Test

## Role yang Dipilih

**QA Engineer**

Saya memilih posisi QA Engineer karena tertarik pada proses memastikan kualitas perangkat lunak melalui pengujian, penyusunan test case, identifikasi bug, dan evaluasi apakah aplikasi telah berjalan sesuai dengan kebutuhan pengguna.

---

## Cara Menjalankan / Melakukan Pengujian

Take-home test ini dilakukan menggunakan pendekatan **manual testing**.

Dokumentasi yang tersedia dalam repository:

* **Test Plan.pdf** — Berisi rencana, strategi, ruang lingkup, pendekatan, serta proses pengujian.
* **Test Case** — Berisi test scenario dan test case yang digunakan sebagai acuan dalam melakukan pengujian.
* **Bug Report** — Berisi dokumentasi bug yang ditemukan selama proses pengujian.
* **Test Coverage** — Berisi rangkuman cakupan dan hasil pengujian.
* **Evidence/** — Berisi screenshot atau bukti pendukung dari hasil pengujian dan bug yang ditemukan.

### Proses Pengujian

1. Mempelajari requirement dan fungsionalitas aplikasi.
2. Menentukan scope dan pendekatan pengujian berdasarkan hasil analisis.
3. Menyusun test scenario dan test case.
4. Melakukan pengujian secara manual berdasarkan test case yang telah dibuat.
5. Mencatat hasil aktual dari setiap test case.
6. Mendokumentasikan bug yang ditemukan ke dalam Bug Report.
7. Mengumpulkan evidence sebagai bukti hasil pengujian.
8. Menyusun Test Coverage untuk memberikan gambaran mengenai cakupan dan hasil pengujian.

---

## Catatan & Keputusan

* Pengujian dilakukan menggunakan **manual testing** dan belum menggunakan automation testing.
* Positive dan negative test case digunakan untuk memvalidasi kondisi normal maupun kondisi yang tidak diharapkan.
* Test case diprioritaskan berdasarkan tingkat kepentingan dan dampaknya terhadap fungsi aplikasi.
* Setiap bug yang ditemukan didokumentasikan dalam Bug Report dan dilengkapi dengan evidence yang relevan.
* Test Case digunakan sebagai acuan pengujian, sedangkan hasil aktual pengujian dicatat untuk menentukan status **Pass** atau **Fail**.
* Test Coverage digunakan untuk merangkum cakupan pengujian dan hasil eksekusi test case.
* Beberapa keputusan dan asumsi selama proses pengujian didasarkan pada requirement dan perilaku aplikasi yang tersedia saat pengujian dilakukan.
* apps masih tergolong statis, hanya 1 page saja yang terhubung dengan backend, itu pun belum memiliki fitur Create, Update dan Delete.
* Backend berjalan dengan baik untuk CRUDnya meskipun belum memiliki logic yang matang.
---

## Ringkasan Hasil Pengujian

| Metrik          | Hasil |
| --------------- | ----: |
| Total Test Case |    20 |
| Passed          |    18 |
| Failed          |    2 |
| Bug Ditemukan   |    2 |
| Test Coverage   |   90% |

---

## Struktur Repository

```text
QA-Testing/
│
├── BookTracker Test Plan
├── BookTracker Test Case
├── Bug Report
├── Test Coverage Report
│
└── Evidence/
    ├── ...
    └── ...
```

---

## Submission

Repository ini berisi seluruh dokumentasi hasil **QA Engineer Take Home Test**, mulai dari perencanaan pengujian, test case, hasil pengujian, bug report, test coverage, hingga evidence sebagai bukti pendukung.
