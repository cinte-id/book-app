from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get configuration from environment variables
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5001))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:8080,http://localhost:5173').split(',')
DATA_FILE = os.getenv('DATA_FILE', 'books.json')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

app.secret_key = SECRET_KEY

# Configure CORS
CORS(app, 
     origins="*", # Izinkan semua origin sementara
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Load books from JSON file
def load_books():
    try:
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('books', [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save books to JSON file
def save_books(books_data):
    with open(DATA_FILE, 'w') as f:
        json.dump({'books': books_data}, f, indent=2)

# GET Books
@app.route('/api/books', methods=['GET', 'OPTIONS'])
def get_books():
    if request.method == 'OPTIONS':
        return jsonify({})
    
    # Selalu load data terbaru dari file
    all_books = load_books()
    
    # Ambil parameter query dari URL 
    search_query = request.args.get('search', '').lower()
    genre_filter = request.args.get('genre', '').lower()
    
    filtered_books = all_books
    
    # 1. Logika Filter Pencarian (Judul atau Penulis)
    if search_query:
        filtered_books = [
            b for b in filtered_books 
            if search_query in b.get('title', '').lower() or 
               search_query in b.get('author', '').lower()
        ]
        
    # 2. Logika Filter Genre
    if genre_filter and genre_filter != 'all':
        filtered_books = [
            b for b in filtered_books 
            if b.get('genre', '').lower() == genre_filter
        ]
    print(f"DEBUG: Data yang dikirim -> {filtered_books}") 
    return jsonify(list(filtered_books)) 

# Detail
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book_detail(book_id):
    all_books = load_books()
    book = next((b for b in all_books if b['id'] == book_id), None)
    if book:
        return jsonify(book)
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books', methods=['POST'])
def add_book():
    all_books = load_books()
    data = request.json
    book = {
        'id': max([b['id'] for b in all_books], default=0) + 1,
        'title': data.get('title'),
        'author': data.get('author'),
        'cover': data.get('cover', ''),
        'rating': data.get('rating', 0),
        'pages': data.get('pages', 0),
        'genre': data.get('genre', ''),
        'status': data.get('status', 'want-to-read')
    }
    all_books.append(book)
    save_books(all_books)
    return jsonify(book), 201

@app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
def update_book(book_id):
    if request.method == 'OPTIONS':
        return jsonify({})
    
    all_books = load_books()
    data = request.json
    for book in all_books:
        if book['id'] == book_id:
            book['title'] = data.get('title', book.get('title'))
            book['author'] = data.get('author', book.get('author'))
            book['cover'] = data.get('cover', book.get('cover'))
            book['rating'] = data.get('rating', book.get('rating'))
            book['pages'] = data.get('pages', book.get('pages'))
            book['genre'] = data.get('genre', book.get('genre'))
            book['status'] = data.get('status', book.get('status'))
            save_books(all_books)
            return jsonify(book)
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    all_books = load_books()
    new_books = [b for b in all_books if b['id'] != book_id]
    if len(new_books) < len(all_books):
        save_books(new_books)
        return jsonify({'message': 'Book deleted'})
    return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    print(f"Starting Flask server on http://{FLASK_HOST}:{FLASK_PORT}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)