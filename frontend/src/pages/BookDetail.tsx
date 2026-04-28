import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, FileText, Tag, CheckCircle, BookMarked, Clock, Plus, Trash2 } from 'lucide-react';
import { getBookById, updateBook, Book } from '../services/api';

const STATUS_MAP = {
    'read': { label: 'Read', color: 'bg-green-100 text-green-700' },
    'reading': { label: 'Reading', color: 'bg-blue-100 text-blue-700' },
    'want-to-read': { label: 'Want to read', color: 'bg-gray-100 text-gray-700' },
} as const;

const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchBook = async () => {
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
        fetchBook();
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

    // Tambah ke My Library
    const handleAddToLibrary = () => handleStatusChange('want-to-read');

    // Hapus dari My Library → reset status ke null
    const handleRemoveFromLibrary = async () => {
        if (!book) return;
        try {
            setUpdating(true);
            setShowRemoveConfirm(false);
            await updateBook(book.id, { status: null });
            setBook({ ...book, status: null as unknown as Book['status'] });
        } catch {
            setError('Gagal menghapus dari library. Coba lagi.');
        } finally {
            setUpdating(false);
        }
    };

    const isInLibrary = book && book.status !== null && book.status !== undefined;

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
                <div className="px-4 py-6 space-y-4 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-52 bg-gray-200 rounded-2xl" />
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col items-center justify-center px-4">
                <p className="text-red-500 mb-4">{error || 'Buku tidak ditemukan.'}</p>
                <button onClick={() => navigate(-1)} className="text-blue-500 underline text-sm">Kembali</button>
            </div>
        );
    }

    const statusInfo = book.status ? STATUS_MAP[book.status] : null;

    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
            {/* Sticky Header */}
            <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Detail Buku</h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Badge Status */}
                    {statusInfo && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                    )}

                    {/* Tombol hapus dari library (hanya jika sudah ada) */}
                    {isInLibrary && (
                        <button
                            onClick={() => setShowRemoveConfirm(true)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                            title="Hapus dari My Library"
                            disabled={updating}
                        >
                            <Trash2 size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                        </button>
                    )}
                </div>
            </div>

            {/* Dialog konfirmasi hapus */}
            {showRemoveConfirm && (
                <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 bg-black/40">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Trash2 size={18} className="text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Hapus dari My Library?</p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Buku masih tersedia di Browse Library.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRemoveConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleRemoveFromLibrary}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                {/* Stats */}
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
                        <div className="flex items-center justify-center mb-1">
                            <Tag size={14} className="text-purple-400" />
                        </div>
                        <p className="text-xs text-gray-500 truncate">{book.genre || '-'}</p>
                    </div>
                </div>

                {/* Belum di library: CTA Tambah */}
                {!isInLibrary && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-800">Belum ada di My Library</p>
                            <p className="text-xs text-blue-500 mt-0.5">Tambahkan untuk mulai melacak bacaanmu</p>
                        </div>
                        <button
                            disabled={updating}
                            onClick={handleAddToLibrary}
                            className="flex items-center gap-1.5 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
                        >
                            {updating
                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <Plus size={15} />
                            }
                            Add
                        </button>
                    </div>
                )}

                {/* Sudah di library: Ubah status */}
                {isInLibrary && (
                    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-700">Ubah Status Bacaan</p>
                        {(
                            [
                                { status: 'want-to-read' as const, label: 'Want to Read', Icon: Clock, color: 'border-gray-300 text-gray-700 hover:bg-gray-50' },
                                { status: 'reading' as const, label: 'Reading', Icon: BookMarked, color: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
                                { status: 'read' as const, label: 'Read', Icon: CheckCircle, color: 'border-green-300 text-green-700 hover:bg-green-50' },
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
                                {book.status === status && <span className="ml-auto text-xs text-gray-400">Aktif</span>}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookDetail;
