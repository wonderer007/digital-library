import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Book } from '../../types';

interface BookContentProps {
  book: Book;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
}

export function BookContent({ book, currentPage, setCurrentPage, pageSize }: BookContentProps) {
  if (!book.content || book.content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-600 py-8 space-y-2">
        <AlertCircle size={24} className="text-yellow-500" />
        <p className="text-lg font-medium">Book content is loading...</p>
        <p className="text-xs text-gray-500">Please wait and reload the page if this persists.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(book.content.length / pageSize);
  const currentText = book.content.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      <div className="prose max-w-none text-center">
        <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
          {currentText}
        </pre>
      </div>
      
      <div className="flex items-center justify-between border-t pt-4 mt-8">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
          Previous Page
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Next Page
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
} 