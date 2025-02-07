import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Book } from '../../types';
import { BookMetadata } from './BookMetadata';
import { BookContent } from './BookContent';
import { BookAnalysis } from './BookAnalysis';

type TabType = 'metadata' | 'content' | 'analysis';

export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('metadata');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2500;
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('gutenberg_id', id)
          .single();

        if (error || !data) {
          navigate('/');
          return;
        }
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 text-lg">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Library
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-800">{book.metadata.title}</h1>
        <p className="text-xl text-gray-600 mt-2">by {book.metadata.author}</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              currentTab === 'metadata'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setCurrentTab('metadata')}
          >
            Book Information
          </button>
          <button
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              currentTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setCurrentTab('content')}
          >
            Read Book
          </button>
          <button
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              currentTab === 'analysis'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setCurrentTab('analysis')}
          >
            Text Analysis
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {currentTab === 'metadata' ? (
          <BookMetadata book={book} />
        ) : currentTab === 'content' ? (
          <BookContent
            book={book}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
          />
        ) : (
          <BookAnalysis book={book} />
        )}
      </div>
    </div>
  );
}