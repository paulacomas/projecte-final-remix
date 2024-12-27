import { Link, useLoaderData } from "@remix-run/react";

export async function loader({ params }: { params: { id: string } }) {
  const response = await fetch(`http://localhost/api/books/${params.id}`);
  if (!response.ok) {
    throw new Response("Book not found", { status: 404 });
  }
  const data = await response.json();
  return data.book;
}

export default function BookDetails() {
  const book = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
        <img
          src={book.image_book}
          alt={book.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
        <p className="text-gray-700">{book.description}</p>
        <p className="text-gray-500 mt-4">Author: {book.author}</p>
      </main>
    </div>
  );
}

function Navigation() {
  return (
    <nav className="flex justify-between items-center">
      <div className="text-xl font-bold">My Bookshelf</div>
      <ul className="flex space-x-4">
        <li>
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/books"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Books
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
