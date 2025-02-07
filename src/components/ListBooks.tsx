import { Book, Clock, BookOpen, Download, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SavedBook } from '../types';

interface ListBooksProps {
  books: SavedBook[];
}

export const ListBooks = ({ books }: ListBooksProps) => {
  if (books.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 text-center">
        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Your library is empty</h2>
        <p className="text-gray-600">
          Search and add your favorite books to start building your library. You can also analyze books with AI to get more insights!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="grid gap-4">
        {books.map((book) => (
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
                  
                  {book.metadata.subjects && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.metadata.subjects.slice(0, 3).map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                      {book.metadata.subjects.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{book.metadata.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Book size={16} />
                      ID: {book.gutenberg_id}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      Release Date: {new Date(book.metadata.releaseDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={16} />
                      {book.metadata.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Languages size={16} />
                      {book.metadata.language}
                    </span>
                  </div>
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
        ))}
      </div>
    </div>
  );
};