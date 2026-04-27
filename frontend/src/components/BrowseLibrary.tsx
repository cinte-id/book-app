import { Search, Filter, Plus, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { updateBook, Book } from '../services/api';
import BookCard from './BookCard';
import { useNavigate } from 'react-router-dom';

interface BrowseLibraryProps {
    books: Book[];
    onBooksChange: (updated: Book[]) => void;
}

const BrowseLibrary = ({ books, onBooksChange }: BrowseLibraryProps) => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [error, setError] = useState<string | null>(null);
    const [addingId, setAddingId] = useState<number | null>(null);

    // Debounce search — 400ms
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Derive genre list from the books prop
    const genres = useMemo(() => {
        const unique = Array.from(new Set(books.map((b) => b.genre).filter(Boolean)));
        return ['all', ...unique];
    }, [books]);

    // Filter books locally — no extra fetch needed
    const filteredBooks = useMemo(() => {
        return books.filter((b) => {
            const matchesSearch =
                !debouncedSearch ||
                b.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                b.author.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesGenre = selectedGenre === 'all' || b.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        });
    }, [books, debouncedSearch, selectedGenre]);

    const handleAddBook = async (bookId: number) => {
        try {
            setError(null);
            setAddingId(bookId);
            await updateBook(bookId, { status: 'want-to-read' });
            const updated = books.map((b) =>
                b.id === bookId ? { ...b, status: 'want-to-read' as const } : b
            );
            onBooksChange(updated);
        } catch {
            setError('Gagal menambahkan buku. Coba lagi.');
        } finally {
            setAddingId(null);
        }
    };

    const clearSearch = () => setSearchTerm('');

    const SkeletonCard = () => (
        <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex space-x-3">
                <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
                </div>
            </div>
        </div>
    );

    const isLoading = books.length === 0 && !error;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
                <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                    <Filter size={20} />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search books or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedGenre === genre
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {genre === 'all' ? 'All Genres' : genre}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-2 text-sm text-red-700 underline hover:no-underline"
                    >
                        Tutup
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                <p className="text-sm text-gray-600">
                    {filteredBooks.length} buku ditemukan
                    {debouncedSearch && (
                        <span className="text-gray-400"> untuk &quot;{debouncedSearch}&quot;</span>
                    )}
                </p>
            )}

            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">Tidak ada buku yang ditemukan</p>
                        {(debouncedSearch || selectedGenre !== 'all') && (
                            <button
                                onClick={() => { clearSearch(); setSelectedGenre('all'); }}
                                className="mt-2 text-blue-500 text-sm underline hover:no-underline"
                            >
                                Reset filter
                            </button>
                        )}
                    </div>
                ) : (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="relative">
                            <div
                                className="cursor-pointer"
                                onClick={() => navigate(`/books/${book.id}`)}
                            >
                                <BookCard book={book} variant="discover" />
                            </div>

                            {book.status === 'want-to-read' ? (
                                <div
                                    className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    want to read
                                </div>
                            ) : book.status === 'read' || book.status === 'reading' ? (
                                <div
                                    className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {book.status}
                                </div>
                            ) : (
                                <button
                                    disabled={addingId === book.id}
                                    className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg disabled:opacity-60"
                                    onClick={(e) => { e.stopPropagation(); handleAddBook(book.id); }}
                                >
                                    {addingId === book.id ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BrowseLibrary;