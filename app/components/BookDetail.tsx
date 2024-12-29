// src/components/BookDetail.tsx
import React from "react";

type BookDetailsProps = {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  image_book: string;
};

const BookDetail = ({
  title,
  author,
  description,
  publishedYear,
  image_book,
}: BookDetailsProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          {/* Aquí puedes agregar tu componente de navegación */}
        </nav>
      </header>
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <img
          src={image_book}
          alt={title}
          className="h-48 w-full object-cover mb-4 rounded-lg"
        />
        <p className="text-lg mb-4">
          <strong>Author:</strong> {author}
        </p>
        <p className="text-gray-700 mb-4">{description}</p>
        <p>
          <strong>Published Year:</strong> {publishedYear}
        </p>
      </main>
    </div>
  );
};

export default BookDetail;
