from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# 1. INITIALIZATION
load_dotenv()
app = Flask(__name__)

# Konfigurasi dari .env
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5001))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
DATA_FILE = os.getenv('DATA_FILE', 'books.json')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-tania-sija')

app.secret_key = SECRET_KEY

# 2. CORS CONFIGURATION (Full Access for Development)
CORS(app, 
     origins="*", 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# 3. HELPER FUNCTIONS (Database JSON)
def load_books():
    try:
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('books', [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_books(books_data):
    with open(DATA_FILE, 'w') as f:
        json.dump({'books': books_data}, f, indent=2)

# 4. API ROUTES

# GET ALL BOOKS (Browse & Filter)
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
        
    return jsonify(list(filtered_books))

# GET DETAIL (Trigger: Update to 'reading')
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book_detail(book_id):
    all_books = load_books()
    book = next((b for b in all_books if b['id'] == book_id), None)
    
    if book:
        # LOGIKA: Jika user buka detail buku yang masih 'want-to-read', ubah ke 'reading'
        if book.get('status') == 'want-to-read':
            book['status'] = 'reading'
            save_books(all_books)
            
        return jsonify(book)
    return jsonify({'error': 'Book not found'}), 404

# POST ADD BOOK (Trigger: Set to 'want-to-read')
@app.route('/api/books', methods=['POST'])
def add_book():
    all_books = load_books()
    data = request.json
    
    # ID Auto Increment sederhana
    new_id = max([b['id'] for b in all_books], default=0) + 1
    
    book = {
        'id': new_id,
        'title': data.get('title'),
        'author': data.get('author'),
        'cover': data.get('cover', ''),
        'rating': data.get('rating', 0),
        'pages': data.get('pages', 0),
        'genre': data.get('genre', ''),
        # Default saat klik Tambah adalah 'want-to-read'
        'status': data.get('status', 'want-to-read'),
        'completed_at': None,
        'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    all_books.append(book)
    save_books(all_books)
    return jsonify(book), 201

# PUT UPDATE (Trigger: Set to 'read' & Record History)
@app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
def update_book(book_id):
    if request.method == 'OPTIONS': return jsonify({})
    
    all_books = load_books()
    data = request.json
    
    for book in all_books:
        if book['id'] == book_id:
            old_status = book.get('status')
            new_status = data.get('status', old_status)
            
            # LOGIKA HISTORY: Jika status berubah jadi 'read', catat tanggalnya
            if new_status == 'read' and old_status != 'read':
                book['completed_at'] = datetime.now().strftime("%d %B %Y, %H:%M")
            
            # Update data lainnya
            book['status'] = new_status
            book['rating'] = data.get('rating', book.get('rating'))
            book['pages_read'] = data.get('pages_read', book.get('pages_read', 0))
            
            save_books(all_books)
            return jsonify(book)
            
    return jsonify({'error': 'Book not found'}), 404

# DELETE BOOK
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
    print(f" Backend aktif di http://{FLASK_HOST}:{FLASK_PORT}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)