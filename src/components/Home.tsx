import { useState, useEffect } from 'react';
import { BookSearch } from './BookSearch';
import { ListBooks } from './ListBooks';
import { Book } from '../types';
import { supabase } from '../lib/supabase';
import { Pagination } from './Pagination';

export function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const booksPerPage = 5;

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
      <div className="w-full max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Library</h2>
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center py-8 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          <ListBooks books={books} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
} 