import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, Clock, Plus } from 'lucide-react';
import api from '../services/api';
import { useToast } from '@/hooks/use-toast';
interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    rating: number;
    pages: number;
    currentPage?: number;
    genre: string;
    status: 'read' | 'reading' | 'want-to-read' | 'unread' | string;
}
const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await api.get<Book>(`/api/books/${id}`);
                setBook(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch book details. It might have been removed or the server is unavailable.');
                console.error('Error fetching book:', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchBook();
        }
    }, [id]);
    const handleUpdateStatus = async (newStatus: string) => {
        if (!book) return;
        try {
            setIsAdding(true);
            const response = await api.put<Book>(`/api/books/${book.id}`, {
                status: newStatus
            });
            setBook(response.data);
            toast({
                title: "Status Updated",
                description: `Book status changed to ${newStatus.replace('-', ' ')}.`,
            });
        } catch (err: any) {
            console.error('Error updating status:', err);
            toast({
                title: "Error",
                description: err.response?.data?.errors?.status || "Failed to update status. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdateProgress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;
        try {
            setIsAdding(true);
            const response = await api.put<Book>(`/api/books/${book.id}`, {
                currentPage: book.currentPage
            });
            setBook(response.data);
            toast({
                title: "Progress Updated",
                description: `You are on page ${book.currentPage}.`,
            });
        } catch (err: any) {
            console.error('Error updating progress:', err);
            toast({
                title: "Error",
                description: err.response?.data?.errors?.currentPage || "Failed to update progress.",
                variant: "destructive"
            });
        } finally {
            setIsAdding(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center max-w-md mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto p-4 flex flex-col items-center justify-center text-center">
                <p className="text-red-500 mb-4">{error || "Book not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="ml-2 font-semibold text-lg text-gray-800 line-clamp-1 text-center flex-1 pr-8">
                    Book Details
                </h1>
            </div>
            {/* Content */}
            <main className="p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Cover Area */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 relative flex items-center justify-center">
                        {book.cover ? (
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="h-[80%] object-contain shadow-lg"
                            />
                        ) : (
                            <BookOpen className="text-blue-500" size={64} />
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-sm flex items-center">
                            <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-sm font-semibold text-gray-800">{book.rating}</span>
                        </div>
                    </div>
                    {/* Details */}
                    <div className="p-6 text-center space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{book.title}</h2>
                            <p className="text-gray-600 font-medium">{book.author}</p>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {book.genre}
                            </span>
                            <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                <Clock size={14} className="mr-1" />
                                {book.pages} pages
                            </span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 space-y-4">
                            <div className="flex flex-col text-left">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Library Status</label>
                                <select 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                    value={book.status === 'unread' ? '' : book.status}
                                    onChange={(e) => handleUpdateStatus(e.target.value)}
                                    disabled={isAdding}
                                >
                                    <option value="" disabled>Add to Library...</option>
                                    <option value="want-to-read">Want to Read</option>
                                    <option value="reading">Currently Reading</option>
                                    <option value="read">Read</option>
                                </select>
                            </div>

                            {book.status === 'reading' && (
                                <form onSubmit={handleUpdateProgress} className="flex flex-col text-left pt-2 border-t border-gray-100">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Update Progress (Pages)</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="number" 
                                            min="0"
                                            max={book.pages}
                                            value={book.currentPage === 0 ? '' : book.currentPage}
                                            onChange={(e) => setBook({...book, currentPage: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={isAdding}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-70"
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(0, ((book.currentPage || 0) / book.pages) * 100))}%` }}></div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default BookDetail;
