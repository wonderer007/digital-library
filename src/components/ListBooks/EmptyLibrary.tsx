import { BookOpen } from 'lucide-react';

export const EmptyLibrary = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 text-center">
      <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Your library is empty</h2>
      <p className="text-gray-600">
        Search and add your favorite books to start building your library. You can also analyze books with AI to get more insights!
      </p>
    </div>
  );
}; 