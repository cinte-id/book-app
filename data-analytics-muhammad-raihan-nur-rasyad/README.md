# Book App Performance Data Analytics Solution
## Brief Introduction
Proyek ini berfokus pada pengembangan *data pipeline* dan analisis data sederhana untuk aplikasi *book app*. Tujuannya adalah untuk mensimulasikan alur kerja dunia nyata, di mana data dikumpulkan, dibersihkan, dimodelkan, dan divisualisasikan guna memperoleh wawasan mengenai perilaku pengguna dalam membaca serta performa aplikasi *book app*.

## Setup Instruction
**Tools yang digunakan**
- Python ≥ 3.8 — untuk tahap ETL (data preparation)
- Microsoft SQL Server — untuk tahap data modeling & query analysis
- SQL Server Management Studio (SSMS) — untuk menjalankan perintah SQL
- Microsoft Power BI Desktop — untuk tahap dashboard creation

**Instalasi Python dependencies**
Semua dependensi sudah tercantum dalam file `requirements.txt.` 

**Sturuktur folder**
```text
data-analytics-muhammad-raihan-nur-rasyad/
├── README.md                           # Setup instructions and findings
├── data/
│   ├── raw/
│   │   └── books.json                  # Original data
│   ├── processed/
│   │   ├── books_clean.csv
│   │   ├── user_interactions.csv
│   │   └── reading_progress.csv
│   └── sample_data_generator.py        # Script to create sample data
├── sql/
│   ├── data_model.sql                  # DDL scripts
│   └── analytical_queries.sql          # Your SQL queries
├── notebooks/
│   └── data_analysis.ipynb             # Jupyter notebook (if using Python)
├── dashboard/
│   ├── dashboard.pbix
│   └── dashboard_screenshots/          # Screenshots if needed
└── scripts/
    ├── data_preparation.py             # ETL scripts
    └── requirements.txt                # Python dependencies
```

**Menjalankan Tahap ETL**

Jalankan file `data_preparation.py`. Script akan:
- Membaca file `books.json`
- Membersihkan dan memproses data
- Membuat data user interactions dan reading progress
- Menghasilkan file `books_clean.csv`, `user_interaction.csv`, dan `reading_progress.csv` siap untuk analisis 

**Memasukkan Data ke Microsoft SQL Server**

- Jalankan script `sql/create_tables.sql` untuk membuat database serta struktur tabel. Impor file CSV menggunakan SSMS → Tasks → Import Data → Flat File Source.
- Gunakan script `sql/analysis_queries.sql` untuk menjalankan query analisis.

**Visualisasi di Power BI**
- Buka Power BI → Get Data → SQL Server Database
- Hubungkan ke database dan gunakan custom queries seperti berikut untuk mengambil data.
```sql
SELECT 
    ui.user_id,
    b.id AS book_id,
    b.title,
    b.author,
    b.genre,
    b.rating AS book_rating,
    rp.pages_read,
    rp.total_pages,
    rp.completion_rate,
    ui.action,
    CAST(ui.timestamp AS DATE) AS date
FROM user_interactions AS ui
JOIN books AS b 
    ON ui.book_id = b.id
JOIN reading_progress AS rp 
    ON ui.user_id = rp.user_id AND ui.book_id = rp.book_id
ORDER BY ui.user_id, ui.timestamp;
```

- Membuat visualisasi seperti Total buku per genre, Rata-rata completion rate per user, Aktivitas pengguna berdasarkan jenis interaksi, dsb.
- Hasil berupa dashboard/dashboard.pbix.

## Key findings and recommendations

<p align="center">
  <kbd><img src="dashboard\Dashboard Screenshot.jpg" width=800px> </kbd> <br>
 Book App Performance Dashboard
</p>

**Insight Utama**

- Genre Fantasy, Fiction, dan Classic memiliki jumlah pembaca tertinggi.
- Aktivitas pengguna meningkat signifikan pada bulan Juni–Agustus.
- Buku *The Lord of the Rings* dan *To Kill a Mockingbird* memperoleh rating tertinggi.
- Rata-rata reading completion rate sekitar 50%.
- Sebagian besar pengguna tergolong High Reader (51%), menunjukkan tingkat keterlibatan tinggi.

**Rekomendasi Bisnis**

- Fokuskan promosi dan rekomendasi buku pada genre populer (Fantasy & Fiction).
- Lakukan kampanye membaca musiman di pertengahan tahun untuk menjaga momentum aktivitas pengguna.
- Tambahkan fitur progress tracker atau reminder untuk meningkatkan completion rate.
- Pertahankan loyalitas High Reader melalui sistem reward dan personalisasi rekomendasi.

## Assumptions & Limitations

- Data user interaction dan reading progress bersifat data sample, bukan data pengguna nyata.
- Analisis dilakukan pada periode waktu terbatas (satu tahun), sehingga tren musiman mungkin belum sepenuhnya akurat.
- Tidak semua faktor eksternal (seperti kampanye promosi atau perilaku pengguna di luar aplikasi) tercakup dalam data.
- Genre dan rating buku bergantung pada dataset awal, sehingga hasil dapat berbeda jika data diperbarui.