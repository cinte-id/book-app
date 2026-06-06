from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration settings
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5001))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:8080,http://localhost:5173').split(',')
DATA_FILE = os.getenv('DATA_FILE', 'books.json')
USER_LIBRARIES_FILE = os.getenv('USER_LIBRARIES_FILE', 'user_libraries.json') # Isolated user libraries file
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

app.secret_key = SECRET_KEY

# Configure CORS
CORS(app, 
     origins=CORS_ORIGINS,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     supports_credentials=True)

# CORS preflight route helper
@app.route('/api/test', methods=['GET', 'OPTIONS'])
def test_cors():
    return jsonify({"message": "CORS is working!"})

# Mock user database (In-memory)
users = [
    {"username": "testuser", "password": "password123"}
]

# Helper to check authentication token
def check_auth():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return False
    token = auth_header.split(' ')[1]
    # Simple token validation (ends with custom session suffix)
    return token.endswith('-token-session')

# Extract username safely from Bearer token
def get_auth_username():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        if token.endswith('-token-session'):
            return token.replace('-token-session', '')
    return None

# Load books dataset from local JSON storage
def load_books():
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('books', [])
    except FileNotFoundError:
        return []

# Load user-specific isolated libraries data
def load_user_libraries():
    try:
        with open(USER_LIBRARIES_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# Save user-specific isolated libraries data
def save_user_libraries(data):
    with open(USER_LIBRARIES_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Global dataset references
books = load_books()
user_libraries = load_user_libraries()

# Validate book schema before creating/updating
def validate_book_payload(data, is_update=False, current_book=None):
    errors = {}
    
    # Title validation
    if not is_update or 'title' in data:
        title = data.get('title')
        if not title or not isinstance(title, str) or not title.strip():
            errors['title'] = 'Title is required and must be a valid non-empty string.'
            
    # Author validation
    if not is_update or 'author' in data:
        author = data.get('author')
        if not author or not isinstance(author, str) or not author.strip():
            errors['author'] = 'Author is required and must be a valid non-empty string.'
            
    # Total pages validation
    total_pages = 0
    if 'pages' in data:
        try:
            total_pages = int(data['pages'])
            if total_pages <= 0:
                errors['pages'] = 'Total pages must be an integer greater than 0.'
        except (ValueError, TypeError):
            errors['pages'] = 'Total pages must be a valid integer.'
    elif current_book:
        total_pages = current_book.get('pages', 0)
            
    # Reading progress validation
    if 'currentPage' in data:
        try:
            current_page = int(data['currentPage'])
            if current_page < 0:
                errors['currentPage'] = 'Current page cannot be negative.'
            elif total_pages > 0 and current_page > total_pages:
                errors['currentPage'] = f'Current page ({current_page}) cannot exceed total pages ({total_pages}).'
        except (ValueError, TypeError):
            errors['currentPage'] = 'Current page must be a valid integer.'
            
    # Rating validation
    if 'rating' in data:
        try:
            rating = float(data['rating'])
            if not (0 <= rating <= 5):
                errors['rating'] = 'Rating must be a decimal value between 0.0 and 5.0.'
        except (ValueError, TypeError):
            errors['rating'] = 'Rating must be a valid numeric value.'
            
    # Status validation
    if 'status' in data:
        allowed_statuses = ['want-to-read', 'reading', 'read', 'completed', 'unread', '']
        status = data.get('status')
        if status not in allowed_statuses:
            errors['status'] = f"Status must be one of: {', '.join(allowed_statuses)}"
            
    return errors

# --- AUTHENTICATION ROUTES ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    if not username or not password:
        return jsonify({"errors": {"username": "Username and password are required"}}), 400
        
    for user in users:
        if user['username'] == username:
            return jsonify({"errors": {"username": "Username is already taken"}}), 400
            
    users.append({"username": username, "password": password})
    return jsonify({"message": "Registration successful"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    for user in users:
        if user['username'] == username and user['password'] == password:
            token = f"{username}-token-session"
            return jsonify({"token": token, "username": username}), 200
            
    return jsonify({"errors": {"login": "Invalid username or password"}}), 401

# --- BOOK COLLECTION ROUTES ---
@app.route('/api/books', methods=['GET', 'OPTIONS'])
def get_books():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    q = request.args.get('q', '').strip().lower()
    genre = request.args.get('genre', '').strip().lower()
    page = request.args.get('page')
    limit = request.args.get('limit')
    
    # Identify active user session to merge personal reading statuses
    username = get_auth_username()
    user_library = user_libraries.get(username, {}) if username else {}

    personalized_books = []
    for book in books:
        book_copy = dict(book)
        book_id_str = str(book['id'])
        
        # Merge user isolated progress if logged in; default to empty if guest/not added
        if book_id_str in user_library:
            book_copy['status'] = user_library[book_id_str].get('status', '')
            book_copy['currentPage'] = user_library[book_id_str].get('currentPage', 0)
        else:
            book_copy['status'] = ''
            book_copy['currentPage'] = 0
        personalized_books.append(book_copy)
        
    filtered_books = personalized_books
    
    # Filter by search string
    if q:
        filtered_books = [
            book for book in filtered_books
            if (q in book.get('title', '').lower() or 
                q in book.get('author', '').lower())
        ]
        
    # Filter by genre selection
    if genre and genre != 'all':
        filtered_books = [
            book for book in filtered_books
            if book.get('genre', '').lower() == genre
        ]
        
    # MID-LEVEL SPEC: Pagination support
    if page and limit:
        try:
            page = int(page)
            limit = int(limit)
            start = (page - 1) * limit
            end = start + limit
            
            paginated_books = filtered_books[start:end]
            return jsonify({
                "books": paginated_books,
                "total": len(filtered_books),
                "page": page,
                "limit": limit
            })
        except ValueError:
            pass
            
    return jsonify(filtered_books)

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    username = get_auth_username()
    user_library = user_libraries.get(username, {}) if username else {}
    
    for book in books:
        if book['id'] == book_id:
            book_copy = dict(book)
            book_id_str = str(book_id)
            
            # Merge user progress details
            if book_id_str in user_library:
                book_copy['status'] = user_library[book_id_str].get('status', '')
                book_copy['currentPage'] = user_library[book_id_str].get('currentPage', 0)
            else:
                book_copy['status'] = ''
                book_copy['currentPage'] = 0
            return jsonify(book_copy), 200
            
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books', methods=['POST'])
def add_book():
    if not check_auth():
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    data = request.json or {}
    
    validation_errors = validate_book_payload(data, is_update=False)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400
        
    book = {
        'id': len(books) + 1,
        'title': data.get('title'),
        'author': data.get('author'),
        'cover': data.get('cover', ''),
        'rating': float(data.get('rating', 0)),
        'pages': int(data.get('pages', 0)),
        'genre': data.get('genre', '')
    }
    books.append(book)
    save_books(books)
    return jsonify(book), 201

@app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
def update_book(book_id):
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    username = get_auth_username()
    if not username:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    data = request.json or {}
    
    target_book = None
    for book in books:
        if book['id'] == book_id:
            target_book = book
            break
            
    if not target_book:
        return jsonify({'error': 'Book not found'}), 404
        
    # Extract current personalized states for validation checks
    user_library = user_libraries.get(username, {})
    book_id_str = str(book_id)
    current_user_state = user_library.get(book_id_str, {"status": "", "currentPage": 0})
    
    merged_book = dict(target_book)
    merged_book['status'] = current_user_state.get('status', '')
    merged_book['currentPage'] = current_user_state.get('currentPage', 0)
    
    validation_errors = validate_book_payload(data, is_update=True, current_book=merged_book)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400
        
    # Persist the dynamic properties (status and progress) isolated to user context
    if username not in user_libraries:
        user_libraries[username] = {}
        
    user_libraries[username][book_id_str] = {
        "status": data.get('status', merged_book['status']),
        "currentPage": int(data.get('currentPage', merged_book['currentPage']))
    }
    
    save_user_libraries(user_libraries)
    
    # Return personalized structure response
    response_book = dict(target_book)
    response_book['status'] = user_libraries[username][book_id_str]['status']
    response_book['currentPage'] = user_libraries[username][book_id_str]['currentPage']
    
    return jsonify(response_book)

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    username = get_auth_username()
    if not username:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    book_id_str = str(book_id)
    
    # Remove from isolated user's library context
    if username in user_libraries and book_id_str in user_libraries[username]:
        del user_libraries[username][book_id_str]
        save_user_libraries(user_libraries)

    for book in books:
        if book['id'] == book_id:
            book_copy = dict(book)
            book_copy['status'] = ''
            book_copy['currentPage'] = 0
            return jsonify(book_copy)
            
    return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    print(f"Starting Flask server on http://{FLASK_HOST}:{FLASK_PORT}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)