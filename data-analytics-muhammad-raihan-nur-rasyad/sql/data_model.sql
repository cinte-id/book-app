
/* Data Model Explanation
Database books_db terdiri dari tiga tabel utama:
- books: Menyimpan data buku (judul, penulis, genre, halaman, dan rating) sebagai tabel referensi utama.
- user_interactions: Mencatat aktivitas pengguna seperti view, search, dan rate, dengan relasi ke tabel books.
- reading_progress: Menyimpan perkembangan membaca (halaman dibaca dan completion rate) juga terhubung ke books.
*/

CREATE DATABASE books_db;

--books
CREATE TABLE books (
    id              INT PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(150),
    rating          DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 5),
    pages           INT CHECK (pages >= 0),
    genre           NVARCHAR(50)
);

BULK INSERT dbo.books
FROM 'C:\Users\raihan\Documents\12\csv\books_clean.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0a',
    TABLOCK
);

--user_interactions
CREATE TABLE user_interactions (
    user_id         INT NOT NULL,
    book_id         INT NOT NULL,
    action          VARCHAR(50),             
    timestamp       datetime2,
    FOREIGN KEY (book_id) REFERENCES books(id),
);

BULK INSERT dbo.user_interactions
FROM 'C:\Users\raihan\Documents\12\csv\user_interaction.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0a',
    TABLOCK
);

--reading_progress
CREATE TABLE reading_progress (
    user_id         INT NOT NULL,
    book_id         INT NOT NULL,
    pages_read      INT CHECK (pages_read >= 0),
    total_pages     INT CHECK (total_pages >= 0),
    completion_rate DECIMAL(4,2) CHECK (completion_rate >= 0 AND completion_rate <= 1),
    FOREIGN KEY (book_id) REFERENCES books(id),
);

BULK INSERT dbo.reading_progress
FROM 'C:\Users\raihan\Documents\12\csv\reading_progress.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0a',
    TABLOCK
);