import { Star, BookOpen, Clock, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    rating: number;
    pages: number;
    genre: string;
    status: 'read' | 'reading' | 'want-to-read';
}

interface BookCardProps {
    book: Book;
    variant?: 'default' | 'compact' | 'library' | 'discover';
    onStatusChange?: (bookId: number, newStatus: Book['status']) => void;
}

const STATUS_OPTIONS: { value: Book['status']; label: string }[] = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'read', label: 'Read' },
];

const statusStyle = (status: Book['status']) => {
    switch (status) {
        case 'read': return 'bg-green-100 text-green-700';
        case 'reading': return 'bg-blue-100 text-blue-700';
        case 'want-to-read': return 'bg-gray-100 text-gray-600';
    }
};

const statusLabel = (status: Book['status']) => {
    switch (status) {
        case 'read': return 'Read';
        case 'reading': return 'Reading';
        case 'want-to-read': return 'Want to Read';
    }
};

// ── Status Dropdown ─────────────────────────────────────────────────────────
const StatusDropdown = ({
    book,
    onStatusChange,
}: {
    book: Book;
    onStatusChange?: (bookId: number, newStatus: Book['status']) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = async (newStatus: Book['status']) => {
        if (newStatus === book.status || !onStatusChange) { setOpen(false); return; }
        setLoading(true);
        setOpen(false);
        try {
            await onStatusChange(book.id, newStatus);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setOpen((o) => !o)}
                disabled={loading}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${statusStyle(book.status)} disabled:opacity-60`}
            >
                {loading ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        {statusLabel(book.status)}
                        <ChevronDown size={10} />
                    </>
                )}
            </button>

            {open && (
                <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[130px] overflow-hidden">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${opt.value === book.status ? 'font-semibold text-blue-600' : 'text-gray-700'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── BookCard ─────────────────────────────────────────────────────────────────
const BookCard = ({ book, variant = 'default', onStatusChange }: BookCardProps) => {

    if (variant === 'compact') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="text-blue-500" size={32} />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1">
                        <span className="text-xs font-medium text-gray-700">{book.rating}★</span>
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-gray-600">{book.author}</p>
                </div>
            </div>
        );
    }

    if (variant === 'library') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="aspect-[3/4] bg-gradient-to-br from-green-100 to-blue-100 relative rounded-t-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="text-green-500" size={28} />
                    </div>
                </div>
                <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-gray-500">{book.author}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-400">
                            <Star size={10} className="text-yellow-400 mr-0.5" />
                            {book.rating}
                        </div>
                        <StatusDropdown book={book} onStatusChange={onStatusChange} />
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'discover') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
                <div className="flex space-x-3">
                    <div className="w-16 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="text-purple-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                {book.genre}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                                <Star size={14} className="text-yellow-400 mr-1" />
                                {book.rating}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex space-x-4">
                <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-blue-500" size={28} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center mb-2">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-700">{book.rating}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {book.pages} pages
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;