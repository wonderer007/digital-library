import { Book } from '../../types';
import { BookCard } from './BookCard';
import { EmptyLibrary } from './EmptyLibrary';

interface ListBooksProps {
  books: Book[];
}

export const ListBooks = ({ books }: ListBooksProps) => {
  return books.length === 0 ? (
    <EmptyLibrary />
  ) : (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="grid gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};