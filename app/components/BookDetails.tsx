import React from "react";
import Navigation from "./Layout";

interface BookDetailsProps {
  book: {
    title: string;
    author: string;
    description: string;
    gender: string;
    review: number;
    image_book: string;
    created_at: string;
  };
}

const BookDetails: React.FC<BookDetailsProps> = ({ book }) => (
  <div className=" bg-gray-100">
    <header className="bg-white shadow">
      <nav className="container mx-auto p-4">
        <Navigation />
      </nav>
    </header>
    <main className="container mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-semibold mb-4">{book.title}</h1>
        <div className="flex items-center mb-6">
          <img
            src={book.image_book}
            alt={book.title}
            className="h-48 w-48 object-cover rounded-lg mr-6"
          />
          <div>
            <p className="text-xl font-medium">{book.author}</p>
            <p className="text-gray-600">{book.gender}</p>
            <p className="text-gray-600">
              {new Date(book.created_at).toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-800 mt-4">{book.description}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default BookDetails;
