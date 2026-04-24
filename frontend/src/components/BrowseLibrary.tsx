import { Search, Filter, Plus, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getBooks, updateBook, Book } from '../services/api';
import BookCard from './BookCard';
import { useNavigate } from 'react-router-dom';

const BrowseLibrary = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [books, setBooks]                 = useState<Book[]>([]);
  const [genres, setGenres]               = useState<string[]>(['all']);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [addingId, setAddingId]           = useState<number | null>(null);

  // Debounce search — 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch from backend whenever search or genre changes
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBooks({
        search: debouncedSearch || undefined,
        genre: selectedGenre !== 'all' ? selectedGenre : undefined,
      });
      setBooks(res.data);

      // Rebuild genre list only when no filters active (so we always show all genres)
      if (!debouncedSearch && selectedGenre === 'all') {
        const allRes = await getBooks();
        const uniqueGenres = [
          'all',
          ...Array.from(new Set(allRes.data.map((b) => b.genre).filter(Boolean))),
        ];
        setGenres(uniqueGenres);
      }
    } catch (err) {
      setError('Gagal memuat buku. Pastikan backend sudah berjalan di port 5000.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedGenre]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Add book to "want-to-read"
  const handleAddBook = async (bookId: number) => {
    try {
      setAddingId(bookId);
      await updateBook(bookId, { status: 'want-to-read' });
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, status: 'want-to-read' } : b))
      );
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Gagal menambahkan buku. Coba lagi.');
    } finally {
      setAddingId(null);
    }
  };

  const clearSearch = () => setSearchTerm('');

  // ── skeleton loader ──────────────────────────────────────────────────────
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Genre Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedGenre === genre
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {genre === 'all' ? 'All Genres' : genre}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchBooks}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <p className="text-sm text-gray-600">
          {books.length} buku ditemukan
          {debouncedSearch && (
            <span className="text-gray-400"> untuk &quot;{debouncedSearch}&quot;</span>
          )}
        </p>
      )}

      {/* Book List */}
      <div className="space-y-3">
        {loading ? (
          // Skeleton
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : books.length === 0 ? (
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
          books.map((book) => (
            <div key={book.id} className="relative">
              {/* Clickable card → detail page */}
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <BookCard book={book} variant="discover" />
              </div>

              {/* Status badge / Add button */}
              {book.status === 'want-to-read' ? (
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
              ) : (
                <div
                  className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {book.status === 'reading' ? 'reading' : 'read'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseLibrary;