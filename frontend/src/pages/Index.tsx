import { useState, useEffect, useCallback } from 'react';
import { Book, Search, User, Plus, Library, BookOpen, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';
import { currentlyReading, readingStats } from '../data/dummyData';
import { getBooks, updateBook, Book as ApiBook } from '../services/api';

const Index = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [libraryView, setLibraryView] = useState('my-books');

    const [searchQuery, setSearchQuery] = useState('');
    const [allBooks, setAllBooks] = useState<ApiBook[]>([]);
    const [booksLoading, setBooksLoading] = useState(true);

    const fetchAllBooks = useCallback(async () => {
        try {
            setBooksLoading(true);
            const res = await getBooks();
            setAllBooks(res.data);
        } catch {
        } finally {
            setBooksLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllBooks(); }, [fetchAllBooks]);

    const handleBooksChange = (updated: ApiBook[]) => setAllBooks(updated);

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

    // Hapus dari My Library → reset status ke null
    const handleRemoveFromLibrary = async (bookId: number) => {
        try {
            await updateBook(bookId, { status: null });
            setAllBooks((prev) =>
                prev.map((b) => (b.id === bookId ? { ...b, status: null as unknown as ApiBook['status'] } : b))
            );
        } catch {
            console.error('Gagal menghapus buku dari library');
        }
    };

    // My Library = hanya buku yang punya status
    const myBooks = allBooks.filter((b) => b.status !== null && b.status !== undefined);

    const SkeletonCard = () => (
        <div className="bg-white rounded-xl border border-gray-100 p-3 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {

            case 'library':
                return (
                    <div className="space-y-4">
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setLibraryView('my-books')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${libraryView === 'my-books' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                <Book size={16} /><span>My Library</span>
                            </button>
                            <button
                                onClick={() => setLibraryView('browse')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${libraryView === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                <Library size={16} /><span>Browse</span>
                            </button>
                        </div>

                        {libraryView === 'my-books' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">My Books</h2>
                                        {!booksLoading && (
                                            <p className="text-xs text-gray-400 mt-0.5">{myBooks.length} buku tersimpan</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setLibraryView('browse')}
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                        title="Tambah dari Browse"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {!booksLoading && myBooks.length > 0 && (
                                    <MyLibraryFilter
                                        books={myBooks}
                                        onNavigate={navigate}
                                        onStatusChange={handleStatusChange}
                                        onRemove={handleRemoveFromLibrary}
                                    />
                                )}

                                {booksLoading ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                                    </div>
                                ) : myBooks.length === 0 ? (
                                    <div className="text-center py-16 space-y-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                                            <BookOpen size={28} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-sm">Belum ada buku di library-mu.</p>
                                        <p className="text-gray-400 text-xs">Tambahkan buku dari Browse Library</p>
                                        <button
                                            onClick={() => setLibraryView('browse')}
                                            className="mt-2 bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            Browse Library
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <BrowseLibrary books={allBooks} onBooksChange={handleBooksChange} />
                        )}
                    </div>
                );

            case 'discover':
                // Logika filtering
                const filteredDiscover = allBooks.filter((book) =>
                    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            {searchQuery ? 'Search Results' : 'Trending Now'}
                        </h2>

                        <div className="space-y-3">
                            {filteredDiscover.length > 0 ? (
                                filteredDiscover.map((book) => (
                                    <div key={book.id} className="cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                                        <BookCard book={book} variant="discover" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 py-10">Buku tidak ditemukan.</p>
                            )}
                        </div>
                    </div>
                );

            case 'reading':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">Currently Reading</h2>
                        <div className="space-y-4">
                            {currentlyReading.map((book) => <ProgressCard key={book.id} book={book} />)}
                        </div>
                    </div>
                );

            case 'profile': {
                const profileReadCount = allBooks.filter((b) => b.status === 'read').length;
                const profileReadingCount = allBooks.filter((b) => b.status === 'reading').length;
                const profileWantCount = allBooks.filter((b) => b.status === 'want-to-read').length;
                const profileAvgRating = allBooks.length ? +(allBooks.reduce((s, b) => s + (b.rating || 0), 0) / allBooks.length).toFixed(1) : 0;
                const profileTotalPages = allBooks.filter((b) => b.status === 'read').reduce((s, b) => s + (b.pages || 0), 0);
                const profileGenreMap: Record<string, number> = {};
                allBooks.forEach((b) => { if (b.genre) profileGenreMap[b.genre] = (profileGenreMap[b.genre] || 0) + 1; });
                const profileTopGenre = Object.entries(profileGenreMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
                const recentlyRead = allBooks.filter((b) => b.status === 'read').slice(-3).reverse();

                return (
                    <div className="space-y-5">
                        <div className="text-center pt-2">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <User className="text-white" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Book Lover</h2>
                            <p className="text-gray-500 text-sm">Reading enthusiast since 2020</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-4 bg-blue-50 rounded-xl"><p className="text-2xl font-bold text-blue-600">{profileReadCount}</p><p className="text-xs text-gray-600 mt-0.5">Books Read</p></div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl"><p className="text-2xl font-bold text-purple-600">{profileReadingCount}</p><p className="text-xs text-gray-600 mt-0.5">Reading</p></div>
                            <div className="text-center p-4 bg-orange-50 rounded-xl"><p className="text-2xl font-bold text-orange-500">{profileWantCount}</p><p className="text-xs text-gray-600 mt-0.5">Want to Read</p></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-4 bg-yellow-50 rounded-xl"><p className="text-2xl font-bold text-yellow-500">{profileAvgRating}</p><p className="text-xs text-gray-600 mt-0.5">Avg Rating</p></div>
                            <div className="text-center p-4 bg-green-50 rounded-xl"><p className="text-2xl font-bold text-green-600">{myBooks.length}</p><p className="text-xs text-gray-600 mt-0.5">In Library</p></div>
                            <div className="text-center p-4 bg-pink-50 rounded-xl"><p className="text-lg font-bold text-pink-500 leading-tight mt-1">{(profileTotalPages / 1000).toFixed(1)}k</p><p className="text-xs text-gray-600 mt-0.5">Pages Read</p></div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                            <div><p className="text-xs text-gray-500 mb-0.5">Favorite Genre</p><p className="font-bold text-gray-800">{profileTopGenre}</p></div>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><BookOpen size={18} className="text-blue-500" /></div>
                        </div>
                        {recentlyRead.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                <p className="text-sm font-semibold text-gray-800 mb-3">Recently Read</p>
                                <div className="space-y-3">
                                    {recentlyRead.map((book) => (
                                        <div key={book.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors" onClick={() => navigate(`/books/${book.id}`)}>
                                            <div className="w-9 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><BookOpen size={14} className="text-blue-500" /></div>
                                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 truncate">{book.title}</p><p className="text-xs text-gray-500">{book.author}</p></div>
                                            <div className="flex items-center text-xs text-gray-400"><Star size={10} className="text-yellow-400 mr-0.5" />{book.rating}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            default:
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                            <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
                            <p className="opacity-90">You've read {readingStats.pagesThisWeek} pages this week</p>
                            <div className="mt-4 bg-white/20 rounded-full h-2"><div className="bg-white rounded-full h-2 w-3/4" /></div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Continue Reading</h3>
                            <div className="space-y-3">{currentlyReading.slice(0, 2).map((book) => <ProgressCard key={book.id} book={book} />)}</div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended for You</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {allBooks.slice(0, 4).map((book) => (
                                    <div key={book.id} className="cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                                        <BookCard book={book} variant="compact" />
                                    </div>
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
            <main className="px-4 py-6 pb-20">{renderContent()}</main>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

// ── My Library ───────────────────────────────
const STATUS_FILTERS = [
    { key: 'all', label: 'Semua' },
    { key: 'reading', label: 'Reading' },
    { key: 'want-to-read', label: 'Want to read' },
    { key: 'read', label: 'Read' },
] as const;

const MyLibraryFilter = ({
    books,
    onNavigate,
    onStatusChange,
    onRemove,
}: {
    books: ApiBook[];
    onNavigate: (path: string) => void;
    onStatusChange: (bookId: number, newStatus: ApiBook['status']) => void;
    onRemove: (bookId: number) => Promise<void>;
}) => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'reading' | 'want-to-read' | 'read'>('all');
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const filtered = activeFilter === 'all' ? books : books.filter((b) => b.status === activeFilter);

    const handleConfirmRemove = async (e: React.MouseEvent, bookId: number) => {
        e.stopPropagation();
        setRemovingId(bookId);
        setConfirmId(null);
        await onRemove(bookId);
        setRemovingId(null);
    };

    return (
        <div className="space-y-4">
            {/* Filter chips */}
            <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                {STATUS_FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {label}
                        <span className="ml-1 opacity-70">
                            ({key === 'all' ? books.length : books.filter(b => b.status === key).length})
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">Tidak ada buku dengan status ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {filtered.map((book) => (
                        <div key={book.id} className="relative">

                            {/* Overlay konfirmasi hapus */}
                            {confirmId === book.id && (
                                <div
                                    className="absolute inset-0 z-20 bg-white/95 rounded-xl border border-red-200 flex flex-col items-center justify-center p-3 space-y-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 size={20} className="text-red-400" />
                                    <p className="text-xs text-center text-gray-700 font-medium leading-snug">
                                        Hapus dari<br />My Library?
                                    </p>
                                    <p className="text-xs text-center text-gray-400">Data buku tetap ada</p>
                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setConfirmId(null); }}
                                            className="flex-1 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={(e) => handleConfirmRemove(e, book.id)}
                                            className="flex-1 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Card buku */}
                            <div
                                className={`cursor-pointer transition-opacity ${removingId === book.id ? 'opacity-40 pointer-events-none' : ''}`}
                                onClick={() => onNavigate(`/books/${book.id}`)}
                            >
                                <BookCard book={book} variant="library" onStatusChange={onStatusChange} />
                            </div>

                            {/* Tombol hapus pojok kanan atas */}
                            {confirmId !== book.id && removingId !== book.id && (
                                <button
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 hover:bg-red-50 rounded-full shadow-sm transition-colors group"
                                    onClick={(e) => { e.stopPropagation(); setConfirmId(book.id); }}
                                    title="Hapus dari My Library"
                                >
                                    <Trash2 size={13} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                                </button>
                            )}

                            {/* Spinner saat menghapus */}
                            {removingId === book.id && (
                                <div className="absolute top-2 right-2 z-10 p-1.5">
                                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Index;
