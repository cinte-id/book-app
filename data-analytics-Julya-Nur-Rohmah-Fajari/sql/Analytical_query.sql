
-- Top 5 Buku Teratas
SELECT title, author, rating
FROM books
ORDER BY rating DESC
LIMIT 5;

-- Daily Activity
SELECT
    DATE(timestamp) AS activity_date,
    COUNT(*) AS total_interactions
FROM user_interactions
GROUP BY DATE(timestamp)
ORDER BY activity_date;

-- Segmen Reading Speed
SELECT
    s.reader_segment AS segment,
    ROUND(AVG(p.reading_speed_numeric), 2) AS avg_speed
FROM reading_progress p
JOIN user_segments s ON p.user_id = s.user_id
GROUP BY s.reader_segment
ORDER BY avg_speed DESC;

-- Total Pages Read by Genre
SELECT b.genre,
       SUM(r.pages_read) AS total_pages_read,
       COUNT(DISTINCT r.user_id) AS user_count
FROM reading_progress r
JOIN books b ON r.book_id = b.id
GROUP BY b.genre
ORDER BY total_pages_read DESC;
