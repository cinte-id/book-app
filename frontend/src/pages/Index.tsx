import { useState, useEffect, useCallback } from 'react';
import { Book, Search, User, Plus, Library, BookOpen, Star } from 'lucide-react';
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';
import { currentlyReading, readingStats } from '../data/dummyData';
import { getBooks, updateBook, Book as ApiBook } from '../services/api';

const Index = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [libraryView, setLibraryView] = useState('my-books');

    // Single source of truth — shared by My Books, Browse, and Insight
    const [allBooks, setAllBooks] = useState<ApiBook[]>([]);
    const [booksLoading, setBooksLoading] = useState(true);

    const fetchAllBooks = useCallback(async () => {
        try {
            setBooksLoading(true);
            const res = await getBooks();
            setAllBooks(res.data);
        } catch {
            // backend belum jalan — biarkan list kosong
        } finally {
            setBooksLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllBooks();
    }, [fetchAllBooks]);

    // Called by BrowseLibrary when a book's status changes
    const handleBooksChange = (updated: ApiBook[]) => setAllBooks(updated);

    // Called by BookCard status dropdown in My Books
    const handleStatusChange = async (bookId: number, newStatus: ApiBook['status']) => {
        try {
            await updateBook(bookId, { status: newStatus });
            setAllBooks((prev) =>
                prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
            );
        } catch {
            console.error('Gagal mengubah status buku');
        }
    };

    const myBooks = allBooks; // semua buku tampil di My Books

    const SkeletonCard = () => (
        <div className="bg-white rounded-xl border border-gray-100 p-3 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {

            // ── Library ──────────────────────────────────────────────────────────
            case 'library':
                return (
                    <div className="space-y-4">
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setLibraryView('my-books')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${libraryView === 'my-books'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Book size={16} />
                                <span>My Books</span>
                            </button>
                            <button
                                onClick={() => setLibraryView('browse')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${libraryView === 'browse'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Library size={16} />
                                <span>Browse</span>
                            </button>
                        </div>

                        {libraryView === 'my-books' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">My Library</h2>
                                    <button
                                        onClick={() => setLibraryView('browse')}
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {booksLoading ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                                    </div>
                                ) : myBooks.length === 0 ? (
                                    <div className="text-center py-16">
                                        <p className="text-gray-500 text-sm mb-2">Belum ada buku di koleksimu.</p>
                                        <button
                                            onClick={() => setLibraryView('browse')}
                                            className="text-blue-500 text-sm underline"
                                        >
                                            Tambah dari Browse Library
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {myBooks.map((book) => (
                                            <BookCard
                                                key={book.id}
                                                book={book}
                                                variant="library"
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <BrowseLibrary books={allBooks} onBooksChange={handleBooksChange} />
                        )}
                    </div>
                );

            // ── Discover ─────────────────────────────────────────────────────────
            case 'discover':
                return (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search books..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
                        <div className="space-y-3">
                            {allBooks.slice(3, 8).map((book) => (
                                <BookCard key={book.id} book={book} variant="discover" />
                            ))}
                        </div>
                    </div>
                );

            // ── Currently Reading ─────────────────────────────────────────────────
            case 'reading':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">Currently Reading</h2>
                        <div className="space-y-4">
                            {currentlyReading.map((book) => (
                                <ProgressCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                );

            // ── Profile ───────────────────────────────────────────────────────────
            case 'profile': {
                const profileReadCount = allBooks.filter((b) => b.status === 'read').length;
                const profileReadingCount = allBooks.filter((b) => b.status === 'reading').length;
                const profileWantCount = allBooks.filter((b) => b.status === 'want-to-read').length;
                const profileAvgRating = allBooks.length
                    ? +(allBooks.reduce((s, b) => s + (b.rating || 0), 0) / allBooks.length).toFixed(1)
                    : 0;
                const profileTotalPages = allBooks
                    .filter((b) => b.status === 'read')
                    .reduce((s, b) => s + (b.pages || 0), 0);

                // Top genre from allBooks
                const profileGenreMap: Record<string, number> = {};
                allBooks.forEach((b) => {
                    if (b.genre) profileGenreMap[b.genre] = (profileGenreMap[b.genre] || 0) + 1;
                });
                const profileTopGenre = Object.entries(profileGenreMap)
                    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

                // Recently read books (last 3 with status 'read')
                const recentlyRead = allBooks.filter((b) => b.status === 'read').slice(-3).reverse();

                return (
                    <div className="space-y-5">
                        {/* Avatar & name */}
                        <div className="text-center pt-2">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <User className="text-white" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Book Lover</h2>
                            <p className="text-gray-500 text-sm">Reading enthusiast since 2020</p>
                        </div>

                        {/* 3-stat bar — synced from allBooks */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <p className="text-2xl font-bold text-blue-600">{profileReadCount}</p>
                                <p className="text-xs text-gray-600 mt-0.5">Books Read</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <p className="text-2xl font-bold text-purple-600">{profileReadingCount}</p>
                                <p className="text-xs text-gray-600 mt-0.5">Reading</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-xl">
                                <p className="text-2xl font-bold text-orange-500">{profileWantCount}</p>
                                <p className="text-xs text-gray-600 mt-0.5">Want to Read</p>
                            </div>
                        </div>

                        {/* Extra stats row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                <p className="text-2xl font-bold text-yellow-500">{profileAvgRating}</p>
                                <p className="text-xs text-gray-600 mt-0.5">Avg Rating</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <p className="text-2xl font-bold text-green-600">{allBooks.length}</p>
                                <p className="text-xs text-gray-600 mt-0.5">Total Books</p>
                            </div>
                            <div className="text-center p-4 bg-pink-50 rounded-xl">
                                <p className="text-lg font-bold text-pink-500 leading-tight mt-1">{(profileTotalPages / 1000).toFixed(1)}k</p>
                                <p className="text-xs text-gray-600 mt-0.5">Pages Read</p>
                            </div>
                        </div>

                        {/* Favorite genre */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Favorite Genre</p>
                                <p className="font-bold text-gray-800">{profileTopGenre}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                <BookOpen size={18} className="text-blue-500" />
                            </div>
                        </div>

                        {/* Recently read */}
                        {recentlyRead.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                <p className="text-sm font-semibold text-gray-800 mb-3">Recently Read</p>
                                <div className="space-y-3">
                                    {recentlyRead.map((book) => (
                                        <div key={book.id} className="flex items-center space-x-3">
                                            <div className="w-9 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <BookOpen size={14} className="text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{book.title}</p>
                                                <p className="text-xs text-gray-500">{book.author}</p>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Star size={10} className="text-yellow-400 mr-0.5" />
                                                {book.rating}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            // ── Home ──────────────────────────────────────────────────────────────
            default:
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                            <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
                            <p className="opacity-90">You've read {readingStats.pagesThisWeek} pages this week</p>
                            <div className="mt-4 bg-white/20 rounded-full h-2">
                                <div className="bg-white rounded-full h-2 w-3/4" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Continue Reading</h3>
                            <div className="space-y-3">
                                {currentlyReading.slice(0, 2).map((book) => (
                                    <ProgressCard key={book.id} book={book} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended for You</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {allBooks.slice(0, 4).map((book) => (
                                    <BookCard key={book.id} book={book} variant="compact" />
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
            <HeaderNav activeTab={activeTab} />
            <main className="px-4 py-6 pb-20">
                {renderContent()}
            </main>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default Index;