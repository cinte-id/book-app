import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBooks, searchBooks } from "@/services/bookService";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import { useDebounce } from "@/hooks/useDebounce";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch books with filters
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', selectedGenre, debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch) {
        return await searchBooks(debouncedSearch);
      }
      return await getBooks({ 
        genre: selectedGenre === 'all' ? undefined : selectedGenre 
      });
    },
  });

  // Extract unique genres from books
  const genres = books 
    ? [...new Set(books.map(b => b.genre).filter(Boolean) as string[])]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-2">Browse Library</h1>
          <p className="text-gray-600">Discover and explore your book collection</p>
        </div>
        
        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                onSearch={setSearchQuery} 
                value={searchQuery}
              />
            </div>
            <GenreFilter 
              genres={genres} 
              onFilterChange={setSelectedGenre}
              currentGenre={selectedGenre}
            />
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading books. Please try again.</p>
          </div>
        ) : books && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} variant="library" />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedGenre !== 'all' 
                ? 'No books found matching your criteria.' 
                : 'No books in your library yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;