import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, FileText, Tag, CheckCircle, BookMarked, Clock } from 'lucide-react';
import { getBookById, updateBook, Book } from '../services/api';

const STATUS_MAP = {
    'read': { label: 'Sudah Dibaca', color: 'bg-green-100 text-green-700' },
    'reading': { label: 'Sedang Dibaca', color: 'bg-blue-100 text-blue-700' },
    'want-to-read': { label: 'Ingin Dibaca', color: 'bg-gray-100 text-gray-700' },
};

const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await getBookById(Number(id));
                setBook(res.data);
            } catch {
                setError('Buku tidak ditemukan.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleStatusChange = async (newStatus: Book['status']) => {
        if (!book) return;
        try {
            setUpdating(true);
            const res = await updateBook(book.id, { status: newStatus });
            setBook(res.data);
        } catch {
            setError('Gagal mengubah status. Coba lagi.');
        } finally {
            setUpdating(false);
        }
    };

    // ── loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
                <div className="px-4 py-6 space-y-4 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-48 bg-gray-200 rounded-2xl" />
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    // ── error ─────────────────────────────────────────────────────────────────
    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col items-center justify-center px-4">
                <p className="text-red-500 mb-4">{error || 'Buku tidak ditemukan.'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 underline text-sm"
                >
                    Kembali
                </button>
            </div>
        );
    }

    const statusInfo = STATUS_MAP[book.status] ?? STATUS_MAP['want-to-read'];

    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center space-x-3 border-b border-gray-100 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">Detail Buku</h1>
            </div>

            <main className="px-4 py-6 space-y-6 pb-24">
                {/* Cover */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-52 flex items-center justify-center">
                    {book.cover ? (
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="h-full object-contain rounded-2xl"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    ) : (
                        <BookOpen className="text-purple-400" size={64} />
                    )}
                </div>

                {/* Title & Author */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">{book.title}</h2>
                    <p className="text-gray-500 mt-1">by {book.author}</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star size={14} className="text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-800">{book.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">Rating</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <FileText size={14} className="text-blue-400" />
                            <span className="text-sm font-semibold text-gray-800">{book.pages}</span>
                        </div>
                        <p className="text-xs text-gray-500">Halaman</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <Tag size={14} className="text-purple-400" />
                        </div>
                        <p className="text-xs text-gray-500 truncate">{book.genre || '-'}</p>
                    </div>
                </div>

                {/* Current Status */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500 mb-2">Status saat ini</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>

                {/* Change Status */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">Ubah Status Bacaan</p>

                    {(
                        [
                            { status: 'want-to-read' as const, label: 'Ingin Dibaca', Icon: Clock, color: 'border-gray-300 text-gray-700 hover:bg-gray-50' },
                            { status: 'reading' as const, label: 'Sedang Dibaca', Icon: BookMarked, color: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
                            { status: 'read' as const, label: 'Sudah Dibaca', Icon: CheckCircle, color: 'border-green-300 text-green-700 hover:bg-green-50' },
                        ] as const
                    ).map(({ status, label, Icon, color }) => (
                        <button
                            key={status}
                            disabled={updating || book.status === status}
                            onClick={() => handleStatusChange(status)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors
                ${book.status === status ? 'opacity-40 cursor-default' : color}
                ${updating ? 'opacity-60 cursor-wait' : ''}`}
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{label}</span>
                            {book.status === status && (
                                <span className="ml-auto text-xs text-gray-400">Aktif</span>
                            )}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BookDetail;