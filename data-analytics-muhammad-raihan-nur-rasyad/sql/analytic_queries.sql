-- Most popular books
SELECT 
    b.id,
    b.title,
    COUNT(DISTINCT ui.user_id) AS unique_readers
FROM user_interactions AS ui
JOIN books AS b 
    ON ui.book_id = b.id
GROUP BY b.id, b.title
ORDER BY unique_readers DESC;

--Total books
SELECT 
    user_id,
    COUNT(DISTINCT book_id) AS total_books_read
FROM reading_progress
GROUP BY user_id;

--Reading segments
SELECT
    user_id,
    completion_rate,
    CASE
        WHEN completion_rate <= 0.3 THEN 'Low Reader'
        WHEN completion_rate <= 0.7 THEN 'Moderate Reader'
        ELSE 'High Reader'
    END AS segment
FROM reading_progress;