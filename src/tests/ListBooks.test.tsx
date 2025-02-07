import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ListBooks } from '../components/ListBooks/';
import mockBooks from '../mocks/books.json';

const WithRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ListBooks', () => {
  it('renders empty state when no books are provided', () => {
    render(<ListBooks books={[]} />, { wrapper: WithRouter });

    expect(screen.getByText('Your library is empty')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Search and add your favorite books to start building your library. You can also analyze books with AI to get more insights!'
      )
    ).toBeInTheDocument();
  });

  it('renders list of books when books are provided', () => {
    render(<ListBooks books={mockBooks} />, { wrapper: WithRouter });

    mockBooks.forEach((book) => {
      expect(screen.getByText(book.metadata.title)).toBeInTheDocument();
      expect(screen.getByText(`by ${book.metadata.author}`)).toBeInTheDocument();
    });
  });

  it('renders book details correctly', () => {
    render(<ListBooks books={[mockBooks[0]]} />, { wrapper: WithRouter });

    const book = mockBooks[0];

    expect(screen.getByText(book.metadata.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${book.metadata.author}`)).toBeInTheDocument();

    expect(screen.getByText(`ID: ${book.gutenberg_id}`)).toBeInTheDocument();
    expect(screen.getByText(book.metadata.language)).toBeInTheDocument();
    expect(screen.getByText(book.metadata.downloads.toString())).toBeInTheDocument();

    book.metadata.subjects.slice(0, 3).forEach((subject) => {
      expect(screen.getByText(subject)).toBeInTheDocument();
    });

    if (book.metadata.subjects.length > 3) {
      expect(
        screen.getByText(`+${book.metadata.subjects.length - 3} more`)
      ).toBeInTheDocument();
    }

    const readLink = screen.getByRole('link', { name: /read/i });
    expect(readLink).toBeInTheDocument();
    expect(readLink).toHaveAttribute('href', `/books/${book.gutenberg_id}`);
  });
});
