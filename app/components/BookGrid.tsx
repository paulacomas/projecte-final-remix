import BookCard from "./BookCard";

interface BooksGridProps {
  books: {
    id: number;
    title: string;
    description: string;
    image_book: string;
  }[];
}

export default function BooksGrid({ books }: BooksGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
