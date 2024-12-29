import { Link } from "@remix-run/react";
import Layout from "./Layout";

interface Book {
  id: string;
  title: string;
  description: string;
  image_book: string;
}

interface BooksListProps {
  books: Book[];
}

export default function BooksList({ books }: BooksListProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Layout />
        </nav>
      </header>
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Books List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col"
            >
              <img
                src={book.image_book}
                alt={book.title}
                className="h-48 w-full object-cover mb-4 rounded-lg"
              />
              <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-700">{book.description}</p>
              <Link
                to={`/books/${book.id}`}
                className="mt-auto text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
