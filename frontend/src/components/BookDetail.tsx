import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Plus } from 'lucide-react';
import api from '../services/api';
import { Book } from './BrowseLibrary';

const BookDetail = ({bookId, onBack}) => {
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                setLoading(true);
                const response = await api.get<Book>(`/api/books/${bookId}`);
                setBook(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch book details');
                console.error('Error fetching book detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetail();
    }, [bookId]);

    if (error || !book) {
        return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col items-center justify-center p-4">
            <p className="text-red-500 mb-4">{error || 'Book not found'}</p>
            <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
            >
            <ArrowLeft size={18} />
            <span>Go back</span>
            </button>
        </div>
        );
    }

    const renderStars = (rating: number) => {
        return (
        <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={16} className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            ))}
        </div>
        );
    };

    return (
        <div className="bg-gray-50">
            <div className="px-4 py-6 pb-20">
                <div className="flex items-center mb-6">
                    <button onClick={() => onBack ? onBack() : navigate(-1)}
                        className="p-2 -ml-2 mr-2 text-gray-600 hover:text-gray-800 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-500">Back</h1>
                </div>

                {/* Book detail card */}
                <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    <div className="relative">
                        {book.cover && <img src={book.cover} alt={book.title} className="w-[50%] m-auto object-cover" />}
                        <div className="absolute top-4 right-4">
                            {book.status === 'want-to-read' ? (
                                <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg">
                                    <Plus size={16} />
                                </button>
                            ) : (
                                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    {book.status}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
                            <p className="text-gray-600 mt-1"><span className='font-bold'>Author:</span> {book.author}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            {renderStars(book.rating)}
                            <span className="text-sm text-gray-500">{book.rating}/5</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-blue-50 p-3 rounded-xl text-center">
                                <p className="text-xs text-gray-500">Pages</p>
                                <p className="text-lg font-semibold text-gray-800">{book.pages}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-xl text-center">
                                <p className="text-xs text-gray-500">Genre</p>
                                <p className="text-lg font-semibold text-gray-800">{book.genre}</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-sm text-gray-500">
                                Status: <span className="text-gray-800 font-medium capitalize">{book.status.replace(/-/g, ' ')}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;