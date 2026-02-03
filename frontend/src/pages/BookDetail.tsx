import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookDetail, deleteBook } from "@/services/bookService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, BookOpen, User, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookDetail(Number(id)),
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (bookId: number) => deleteBook(bookId),
    onSuccess: () => {
      toast.success("Book deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['books'] });
      navigate('/browse');
    },
    onError: () => {
      toast.error("Failed to delete book. Please try again.");
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(Number(id));
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500 mb-4">Book not found</p>
        <Button onClick={() => navigate('/browse')}>
          Back to Browse
        </Button>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'reading':
        return 'bg-blue-100 text-blue-800';
      case 'want-to-read':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/browse')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-md">
                {book.cover ? (
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BookOpen className="h-20 w-20" />
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 space-y-6">
              {/* Title & Author */}
              <div>
                <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                <div className="flex items-center text-xl text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  {book.author}
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(book.rating || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  {book.rating ? book.rating.toFixed(1) : '0.0'} / 5.0
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Genre</p>
                  <p className="font-semibold text-lg">{book.genre || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Pages</p>
                  <p className="font-semibold text-lg">{book.pages || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                    {book.status?.replace('-', ' ').toUpperCase() || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleEdit}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Book
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Book
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{book.title}" from your library.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;