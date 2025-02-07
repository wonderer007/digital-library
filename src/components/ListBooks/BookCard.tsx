import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { BookSubjects } from './BookSubjects';
import { BookMetadata } from './BookMetadata';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <div
      key={book.id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {book.metadata.title}
            </h3>
            <p className="text-gray-600 mb-4">by {book.metadata.author}</p>
            
            <BookSubjects subjects={book.metadata.subjects || []} />
            
            <BookMetadata
              gutenbergId={book.gutenberg_id.toString()}
              releaseDate={book.metadata.releaseDate || ''}
              downloads={book.metadata.downloads || 0}
              language={book.metadata.language || ''}
            />
          </div>
          <Link
            to={`/books/${book.gutenberg_id}`}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <BookOpen size={20} />
            Read
          </Link>
        </div>
      </div>
    </div>
  );
}; 