from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# 1. INITIALIZATION
load_dotenv()
app = Flask(__name__)

# Konfigurasi dari .env atau default
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5001))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
DATA_FILE = os.getenv('DATA_FILE', 'books.json')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-tania-sija')

app.secret_key = SECRET_KEY

# 2. CORS CONFIGURATION
# Mengizinkan Frontend mengakses API tanpa blokir browser
CORS(app, 
     origins="*",
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# 3. HELPER FUNCTIONS
def load_books():
    """Membaca data dari file books.json"""
    try:
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('books', [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_books(books_data):
    """Menyimpan data kembali ke file books.json"""
    with open(DATA_FILE, 'w') as f:
        json.dump({'books': books_data}, f, indent=2)

# 4. API ROUTES

@app.route('/api/books', methods=['GET', 'OPTIONS'])
def get_books():
    if request.method == 'OPTIONS': return jsonify({})
    all_books = load_books()
    
    search_query = request.args.get('search', '').lower()
    genre_filter = request.args.get('genre', '').lower()
    
    filtered_books = all_books
    if search_query:
        filtered_books = [b for b in filtered_books if search_query in b.get('title', '').lower() or search_query in b.get('author', '').lower()]
    
    if genre_filter and genre_filter != 'all':
        filtered_books = [b for b in filtered_books if b.get('genre', '').lower() == genre_filter]
        
    return jsonify({"books": filtered_books})

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book_detail(book_id):
    all_books = load_books()
    book = next((b for b in all_books if b.get('id') == book_id), None)
    
    if book:
        return jsonify(book)
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books', methods=['POST'])
def add_book():
    all_books = load_books()
    data = request.get_json() or {}
    new_id = max([b['id'] for b in all_books], default=0) + 1
    
    book = {
        'id': new_id,
        'title': data.get('title'),
        'author': data.get('author'),
        'cover': data.get('cover', ''),
        'description': data.get('description', 'No description available.'),
        'rating': data.get('rating', 0),
        'rating_sum': 0,
        'rating_count': 0,
        'user_rating': 0,
        'pages': data.get('pages', 0),
        'current_page': 0,
        'genre': data.get('genre', ''),
        'status': data.get('status', 'none'),
        'completed_at': None,
        'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    all_books.append(book)
    save_books(all_books)
    return jsonify(book), 201

@app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
def update_book(book_id):
    if request.method == 'OPTIONS': return jsonify({})
    
    all_books = load_books()
    data = request.json
    
    for book in all_books:
        if book['id'] == book_id:
            old_status = book.get('status')
            new_status = data.get('status', old_status)
            
            if new_status == 'read' and old_status != 'read':
                book['completed_at'] = datetime.now().strftime("%d %B %Y, %H:%M")
                book['current_page'] = book.get('pages', 0)
            elif new_status == 'none':
                book['completed_at'] = None
                book['current_page'] = 0
            
            book['status'] = new_status
            if 'current_page' in data:
                try:
                    requested_page = int(data.get('current_page', 0))
                except (ValueError, TypeError):
                    requested_page = 0
                total_pages = int(book.get('pages', 0))

                # Pastikan tidak lebih dari total halaman & tidak negatif
                book['current_page'] = max(0, min(requested_page, total_pages))

                # Auto selesai kalau sudah sampai halaman terakhir
                if book['current_page'] == total_pages and total_pages > 0:
                    book['status'] = 'read'
                    book['completed_at'] = datetime.now().strftime("%d %B %Y, %H:%M")

            # Logika Rating
            if 'rating' in data: 
                book['rating'] = data.get('rating')
            if 'rating_sum' in data: 
                book['rating_sum'] = data.get('rating_sum')
            if 'rating_count' in data: 
                book['rating_count'] = data.get('rating_count')
            if 'user_rating' in data: 
                book['user_rating'] = data.get('user_rating')
            
            # Update data lain jika ada
            if 'description' in data:
                book['description'] = data.get('description')
            
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

# 5. SERVER RUN
if __name__ == '__main__':
    print(f"Backend Book App Aktif di http://{FLASK_HOST}:{FLASK_PORT}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)