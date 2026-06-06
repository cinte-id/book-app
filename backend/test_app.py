import unittest
import json
from app import app

class BookAppTestCase(unittest.TestCase):
    def setUp(self):
        # Mengatur aplikasi ke mode testing
        self.app = app.test_client()
        self.app.testing = True

    def test_get_books_pagination(self):
        """Test apakah endpoint GET /api/books mengembalikan data dengan format paginasi yang benar"""
        response = self.app.get('/api/books?page=1&limit=2')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertIn('data', data)
        self.assertIn('total', data)
        self.assertIn('page', data)
        self.assertIn('totalPages', data)
        self.assertTrue(len(data['data']) <= 2)

    def test_add_book_validation_error(self):
        """Test validasi input saat menambahkan buku (misal title kosong)"""
        payload = {
            'author': 'Test Author',
            'pages': -5 # Invalid pages
        }
        response = self.app.post('/api/books', 
                                 data=json.dumps(payload),
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('errors', data)
        self.assertIn('title', data['errors'])
        self.assertIn('pages', data['errors'])

    def test_add_book_success(self):
        """Test menambahkan buku dengan data yang valid"""
        payload = {
            'title': 'The Great Gatsby',
            'author': 'F. Scott Fitzgerald',
            'pages': 218
        }
        response = self.app.post('/api/books', 
                                 data=json.dumps(payload),
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['title'], 'The Great Gatsby')
        self.assertEqual(data['author'], 'F. Scott Fitzgerald')

if __name__ == '__main__':
    unittest.main()
