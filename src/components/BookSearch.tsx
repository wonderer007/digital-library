import React, { useState } from 'react';
import { Search, BookPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BookMetadata } from '../types';

interface BookSearchProps {
  onBookSaved: () => void;
}

export function BookSearch({ onBookSaved }: BookSearchProps) {
  const [bookId, setBookId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [metaData, setMetaData] = useState<BookMetadata | null>(null);
  const [error, setError] = useState('');
  const [showAllMetadata, setShowAllMetadata] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    setMetaData(null)
    e.preventDefault();
    if (!bookId.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('search_book', {
        body: { book_id: bookId }
      });
      
      if (error) throw error;
      setMetaData(data);
    } catch (err) {
      setError('Failed to fetch book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!metaData) return;
    
    setSaveState('loading');
    setError('');
    
    try {
      const { error, status } = await supabase
        .from('books')
        .insert({
          metadata: metaData,
          gutenberg_id: bookId
        });

      if (error) {
        if(status == 409)
          setError('Book already exist in library');
        else
          setError(error.message);
        setSaveState('idle');
      }
      else {
      setSaveState('success');
      onBookSaved();
      setBookId('');
      setMetaData(null);
      setBookId('');
      setSaveState('idle');
      setTimeout(() => {
      }, 5000);
      }
    } catch (err) {
      setError('Failed to save book. Please try again. ');
      setSaveState('idle');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={bookId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setBookId(value);
                }}
                placeholder="Enter Project Book ID"
                pattern="[0-9]*"
                inputMode="numeric"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11"
                disabled={loading}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 relative">
            {error}
            <button
              onClick={() => setError('')}
              className="absolute top-2 right-2 text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {metaData && (
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl text-gray-800 mb-2">
                  {metaData.title}
                </h2>
                <p className="text-gray-600">by {metaData.author}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saveState !== 'idle'}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:opacity-50"
              >
                {saveState === 'loading' ? (
                  <>
                    Saving...
                  </>
                ) : saveState === 'success' ? (
                  <>
                    Saved to Library
                  </>
                ) : (
                  <>
                    <BookPlus size={20} />
                    Save to Library
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {metaData.releaseDate && (
                <div>
                  <span className="text-gray-600">Release Date:</span>
                  <span className="ml-2">{metaData.releaseDate}</span>
                </div>
              )}
              {metaData.downloads && (
                <div>
                  <span className="text-gray-600">Downloads:</span>
                  <span className="ml-2">{metaData.downloads}</span>
                </div>
              )}
              {metaData.language && (
                <div>
                  <span className="text-gray-600">Language:</span>
                  <span className="ml-2">{metaData.language}</span>
                </div>
              )}
            </div>
            
            {metaData.summary && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-gray-700">
                  {metaData.summary.length > 600 
                    ? `${metaData.summary.slice(0, 600)}...` 
                    : metaData.summary}
                </p>
              </div>
            )}

            <div className="mb-4">
              <button
                onClick={() => setShowAllMetadata(!showAllMetadata)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {showAllMetadata ? 'Show Less' : 'Show More'}
              </button>
              
              {showAllMetadata && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {Object.entries(metaData)
                    .filter(([key]) => !['title', 'summary', 'language', 'downloads', 'releaseDate', 'author'].includes(key))
                    .map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="ml-2">
                            {Array.isArray(value) 
                              ? value.join(', ') 
                              : String(value)}
                          </span>
                        </div>
                      )
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}