import { useState, useEffect } from 'react';
import { BookSearch } from './BookSearch';
import { ListBooks } from './ListBooks';
import { Book } from '../types';
import { supabase } from '../lib/supabase';
import { getPageNumbers } from '../utils/pagination';

export function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const booksPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { count, error: countError } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw countError;
      }

      setTotalCount(count || 0);

      const { data, error } = await supabase
        .from('books')
        .select('id, gutenberg_id, metadata, created_at')
        .range((currentPage - 1) * booksPerPage, currentPage * booksPerPage - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSaved = () => {
    fetchBooks();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / booksPerPage);

  return (
    <>
      <BookSearch onBookSaved={handleBookSaved} />
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
        </div>
      ) : (
        <>
          <ListBooks books={books} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 hover:bg-blue-700"
                aria-label="Previous page"
              >
                ←
              </button>
              
              {getPageNumbers(currentPage, totalPages).map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-2">
                    {page}
                  </span>
                )
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 hover:bg-blue-700"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
} 