import { Link } from "@remix-run/react";

interface BookCardProps {
  book: {
    id: number;
    title: string;
    description: string;
    image_book: string;
  };
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
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
  );
}
