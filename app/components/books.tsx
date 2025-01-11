import React, { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "@remix-run/react";
import { getSavedBooks, saveBook, unsaveBook } from "~/data/data";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import StarRating from "./StarRating";
import { Book } from "~/data/types";

interface BooksListProps {
  books: Book[];
  currentUserId: string | undefined;
}

export default function BooksList({ books, currentUserId }: BooksListProps) {
  const [savedBooks, setSavedBooks] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
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
        navigate(".?success=Book%20unsaved%20successfully");
      } else {
        const response = await saveBook(bookId, token);
        console.log("Save response:", response);
        setSavedBooks((prev) => new Set(prev).add(bookId));
        navigate(".?success=Book%20saved%20successfully");
      }
    } catch (error: any) {
      console.error("Error toggling save book:", error.message);
      navigate(".?error=Error%20saving%20book");
    }
  };

  return (
    <main className="container mx-auto py-8">
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

              {book.opinion && (
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Opinion: </strong> {book.opinion}
                </p>
              )}

              {book.review && (
                <p className="mt-2 text-sm text-gray-700 flex items-center">
                  <strong className="mr-2">Rating:</strong>
                  <StarRating score={book.review} />
                </p>
              )}

              {book.user && (
                <p className="mt-2 text-sm text-gray-700">
                  Published by{" "}
                  <Link
                    to={`/profile/${book.user.id}`}
                    className="text-blue-900 hover:underline"
                  >
                    <strong>{book.user.name}</strong>
                  </Link>
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 justify-between items-center">
                <Link
                  to={`/books/details/${book.id}`}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 text-center w-full sm:w-auto"
                >
                  View Details
                </Link>
                <button
                  onClick={() => toggleSaveBook(book.id)}
                  className={`px-3 py-2 rounded-lg ${
                    savedBooks.has(book.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  } text-center w-full sm:w-auto`}
                  title={savedBooks.has(book.id) ? "Saved" : "Save"}
                >
                  {savedBooks.has(book.id) ? <FaBookmark /> : <FaRegBookmark />}
                </button>

                {currentUserId == book.user_id && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to={`/books/details/${book.id}/edit`}
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 text-center flex-1"
                    >
                      Edit
                    </Link>

                    {/* Botón "Delete" */}
                    <Form method="POST" action={`/books/details/${book.id}`}>
                      <input type="hidden" name="action" value="delete" />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 text-center flex-1"
                        onClick={(e) => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this book?"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available yet.</p>
      )}
    </main>
  );
}
