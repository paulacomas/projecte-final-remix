import React, { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "@remix-run/react";
import Modal from "./Modal";
import EditBookForm from "./EditBookForm";
import Navigation from "./Layout";
import { getSavedBooks, saveBook, unsaveBook, updateBook } from "~/data/data";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useNotifications } from "~/contexts/NotificationContext";

interface Book {
  id: string;
  title: string;
  author: string;
  gender: string;
  image_book: string;
  user_id: string;
  user?: {
    id: string;
    name: string;
  };
}

interface BooksListProps {
  books: Book[];
  currentUserId: string;
}

export default function BooksList({ books, currentUserId }: BooksListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [savedBooks, setSavedBooks] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Fetch saved books for the user
    const fetchSavedBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await getSavedBooks(token);
          const savedBookIds = response.data.map(
            (book: { book_id: string }) => book.book_id
          );
          setSavedBooks(new Set(savedBookIds));
        }
      } catch (error) {
        console.error("Error fetching saved books:", error);
      }
    };

    fetchSavedBooks();
  }, []);

  const toggleSaveBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login?message=You%20need%20to%20be%20logged%20in");
        console.error("No token found");
        return;
      }

      const isSaved = savedBooks.has(bookId);

      if (isSaved) {
        await unsaveBook(bookId, token);
        setSavedBooks((prev) => {
          const updated = new Set(prev);
          updated.delete(bookId);
          return updated;
        });
        navigate(".?success=Libro%20unsaved%20correctamente");
      } else {
        const response = await saveBook(bookId, token);
        console.log("Save response:", response); // Depuración
        setSavedBooks((prev) => new Set(prev).add(bookId));
        navigate(".?success=Libro%20guardado%20correctamente");
      }
    } catch (error: any) {
      console.error("Error toggling save book:", error.message);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 pl-6">Books List</h1>

      {/* Verificar si hay libros */}
      {books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <img
                src={book.image_book}
                alt={book.title}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">{book.gender}</p>

              {book.user && (
                <p className="mt-2 text-sm text-gray-700">
                  Published by{" "}
                  <Link
                    to={`/profile/${book.user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {book.user.name}
                  </Link>
                </p>
              )}

              <div className="mt-4 flex justify-between">
                <Link
                  to={`/books/details/${book.id}`}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  View Details
                </Link>
                {currentUserId === book.user_id && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/books/details/${book.id}/edit`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <Form method="POST" action={`/books/details/${book.id}`}>
                      <input type="hidden" name="action" value="delete" />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                )}
                {/* Icono de guardar */}
                <button
                  onClick={() => toggleSaveBook(book.id)}
                  className={`px-3 py-2 rounded-lg ${
                    savedBooks.has(book.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  title={savedBooks.has(book.id) ? "Saved" : "Save"}
                >
                  {savedBooks.has(book.id) ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay libros aún.</p> // Mensaje si no hay libros
      )}
    </main>
  );
}
