
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    genre TEXT,
    pages INTEGER,
    rating REAL
);

CREATE TABLE IF NOT EXISTS user_interactions (
    user_id TEXT,
    book_id INTEGER,
    action TEXT,
    timestamp TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS reading_progress (
    user_id TEXT,
    book_id INTEGER,
    pages_read INTEGER,
    completion_rate REAL,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS user_segments (
    user_id TEXT PRIMARY KEY,
    segment TEXT,
    total_books_read INTEGER
);
