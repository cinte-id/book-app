from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
import uuid
import hashlib
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

# Set Flask secret key
app.secret_key = SECRET_KEY

# Configure CORS with environment variables
CORS(app, 
     origins=CORS_ORIGINS,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     supports_credentials=True)

# Add a test endpoint to check CORS
@app.route('/api/test', methods=['GET', 'OPTIONS'])
def test_cors():
    return jsonify({"message": "CORS is working!"})

# Load books from JSON file
def load_books():
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('books', [])
    except FileNotFoundError:
        return []

# Save books to JSON file
def save_books(books_data):
    with open(DATA_FILE, 'w') as f:
        json.dump({'books': books_data}, f, indent=2)

# Initialize books from JSON file
books = load_books()

USERS_FILE = 'users.json'

def load_users():
    try:
        with open(USERS_FILE, 'r') as f:
            data = json.load(f)
            return data.get('users', [])
    except FileNotFoundError:
        return []

def save_users(users_data):
    with open(USERS_FILE, 'w') as f:
        json.dump({'users': users_data}, f, indent=2)

users = load_users()
sessions = {}

USER_LIBRARIES_FILE = 'user_libraries.json'

def load_user_libraries():
    try:
        with open(USER_LIBRARIES_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_user_libraries(data):
    with open(USER_LIBRARIES_FILE, 'w') as f:
        json.dump(data, f, indent=2)

user_libraries = load_user_libraries()

def get_current_username():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
        return sessions.get(token)
    return None

def requires_auth(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        token = token.split(' ')[1]
        if token not in sessions:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'errors': {'auth': 'Username and password required'}}), 400
        
    for u in users:
        if u['username'] == username:
            return jsonify({'errors': {'username': 'Username already exists'}}), 400
            
    users.append({'username': username, 'password': hashlib.sha256(password.encode()).hexdigest()})
    save_users(users)
    return jsonify({'message': 'Registered successfully'}), 201

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
        
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    hashed = hashlib.sha256(password.encode()).hexdigest() if password else ''
    
    for u in users:
        if u['username'] == username and u['password'] == hashed:
            token = str(uuid.uuid4())
            sessions[token] = username
            return jsonify({'token': token, 'username': username})
            
    return jsonify({'errors': {'auth': 'Invalid credentials'}}), 401

@app.route('/api/stats', methods=['GET', 'OPTIONS'])
def get_stats():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
        
    username = get_current_username()
    user_lib = user_libraries.get(username, {}) if username else {}
    
    total_read = 0
    pages_read = 0
    genres = []
    
    for b in books:
        b_id_str = str(b['id'])
        if b_id_str in user_lib:
            lib_entry = user_lib[b_id_str]
            status = lib_entry.get('status')
            current_page = lib_entry.get('currentPage', 0)
            
            if status == 'read':
                total_read += 1
            if status in ('reading', 'read'):
                pages_read += current_page
                
            if status == 'read' and b.get('genre'):
                genres.append(b.get('genre'))
                
    fav_genre = max(set(genres), key=genres.count) if genres else 'None'
    
    return jsonify({
        'totalBooks': total_read,
        'pagesThisWeek': pages_read,
        'favouriteGenre': fav_genre,
        'currentStreak': 5,
        'avgRating': 4.5
    })

@app.route('/api/books', methods=['GET', 'OPTIONS'])
def get_books():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    q = request.args.get('q', '').lower()
    genre = request.args.get('genre', '')
    page = request.args.get('page', type=int, default=1)
    limit = request.args.get('limit', type=int, default=10)

    username = get_current_username()
    user_lib = user_libraries.get(username, {}) if username else {}

    # Map books with user specific data
    mapped_books = []
    for b in books:
        b_copy = b.copy()
        b_id_str = str(b['id'])
        if b_id_str in user_lib:
            b_copy.update(user_lib[b_id_str])
        else:
            b_copy['status'] = 'unread'
            b_copy['currentPage'] = 0
        mapped_books.append(b_copy)

    # Filter books
    filtered_books = [b for b in mapped_books if 
                      (q in b['title'].lower() or q in b['author'].lower()) and
                      (not genre or genre.lower() == 'all' or b['genre'].lower() == genre.lower())]
    
    total = len(filtered_books)
    start = (page - 1) * limit
    end = start + limit
    paginated_books = filtered_books[start:end]
    
    return jsonify({
        'data': paginated_books,
        'total': total,
        'page': page,
        'totalPages': (total + limit - 1) // limit if limit > 0 else 1,
        'limit': limit
    })

@app.route('/api/books', methods=['POST', 'OPTIONS'])
@requires_auth
def add_book():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
        
    data = request.json
    errors = {}
    if not data.get('title'): errors['title'] = 'Title is required'
    if not data.get('author'): errors['author'] = 'Author is required'
    if 'pages' in data and (not isinstance(data['pages'], int) or data['pages'] < 0):
        errors['pages'] = 'Pages must be a positive number'
    if 'currentPage' in data and (not isinstance(data['currentPage'], int) or data['currentPage'] < 0):
        errors['currentPage'] = 'Current page must be a positive number'

    if errors:
        return jsonify({'errors': errors}), 400

    book = {
        'id': len(books) + 1,
        'title': data.get('title'),
        'author': data.get('author'),
        'cover': data.get('cover', ''),  # Book cover image URL
        'rating': data.get('rating', 0),  # Book rating (0-5)
        'pages': data.get('pages', 0),    # Number of pages
        'genre': data.get('genre', ''),   # Book genre
    }
    books.append(book)
    save_books(books)  # Save to JSON file
    return jsonify(book), 201

@app.route('/api/books/<int:book_id>', methods=['GET', 'OPTIONS'])
def get_book(book_id):
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
        
    username = get_current_username()
    user_lib = user_libraries.get(username, {}) if username else {}
    
    for book in books:
        if book['id'] == book_id:
            b_copy = book.copy()
            b_id_str = str(book['id'])
            if b_id_str in user_lib:
                b_copy.update(user_lib[b_id_str])
            else:
                b_copy['status'] = 'unread'
                b_copy['currentPage'] = 0
            return jsonify(b_copy)
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books/<int:book_id>', methods=['PUT', 'OPTIONS'])
@requires_auth
def update_book(book_id):
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    data = request.json
    errors = {}
    if 'pages' in data and (not isinstance(data['pages'], int) or data['pages'] < 0):
        errors['pages'] = 'Pages must be a positive number'
    if 'currentPage' in data and (not isinstance(data['currentPage'], int) or data['currentPage'] < 0):
        errors['currentPage'] = 'Current page must be a positive number'

    if errors:
        return jsonify({'errors': errors}), 400

    # Update user_libraries instead of global books
    username = get_current_username()
    if not username:
        return jsonify({'error': 'Unauthorized'}), 401
        
    for book in books:
        if book['id'] == book_id:
            if username not in user_libraries:
                user_libraries[username] = {}
                
            b_id_str = str(book_id)
            if b_id_str not in user_libraries[username]:
                user_libraries[username][b_id_str] = {'status': 'unread', 'currentPage': 0}
                
            if 'status' in data:
                user_libraries[username][b_id_str]['status'] = data['status']
            if 'currentPage' in data:
                user_libraries[username][b_id_str]['currentPage'] = data['currentPage']
                
            save_user_libraries(user_libraries)
            
            b_copy = book.copy()
            b_copy.update(user_libraries[username][b_id_str])
            return jsonify(b_copy)
            
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books/<int:book_id>', methods=['DELETE', 'OPTIONS'])
@requires_auth
def delete_book(book_id):
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    for i, book in enumerate(books):
        if book['id'] == book_id:
            deleted_book = books.pop(i)
            save_books(books)  # Save to JSON file
            return jsonify(deleted_book)
    return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    print(f"Starting Flask server on http://{FLASK_HOST}:{FLASK_PORT}")
    print("CORS enabled for development")
    print(f"Allowed origins: {CORS_ORIGINS}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST) 