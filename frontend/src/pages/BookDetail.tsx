import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import HeaderNav from "../components/HeaderNav";
import { books } from "../data/dummyData";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = books.find(b => b.id === Number(id));

  if (!book) {
    return <div className="p-4 text-center text-gray-500">Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <HeaderNav activeTab="library" />

      <main className="px-4 py-6 space-y-5">
        
        {/* Back */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-500 transition"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>

        {/* Cover */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <img 
            src={book.cover} 
            alt={book.title}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {book.title}
          </h2>
          <p className="text-gray-500 text-sm">by {book.author}</p>
        </div>

        {/* Meta Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-500" size={16} />
            <span>{book.rating}</span>
          </div>

          <div>
            📄 {book.pages} pages
          </div>

          <div>
            📚 {book.genre}
          </div>

          <div>
            📌 {book.status}
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition">
          Add to My Library
        </button>

      </main>
    </div>
  );
};

export default BookDetail;