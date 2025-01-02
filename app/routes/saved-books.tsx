import React, { useState, useEffect } from "react";
import BooksList from "~/components/books";
import Navigation from "~/components/Layout";

export default function SavedBooksPage() {
  const [savedBooks, setSavedBooks] = useState<any[]>([]); // List of saved books IDs and details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch saved books (just the book IDs and metadata)
        const res = await fetch("http://localhost/api/saved-books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch saved books");
        }

        const savedBooksData = await res.json();

        // Fetch detailed information for each book based on the book_id
        const booksDetails = await Promise.all(
          savedBooksData.data.map(async (savedBook: any) => {
            const bookRes = await fetch(
              `http://localhost/api/books/${savedBook.book_id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!bookRes.ok) {
              throw new Error(
                `Failed to fetch details for book ID: ${savedBook.book_id}`
              );
            }
            const bookData = await bookRes.json();
            console.log(bookData);
            return bookData.data; // Return book data with full details
          })
        );

        setSavedBooks(booksDetails); // Set the detailed books
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved books:", error);
        setLoading(false);
      }
    };

    fetchSavedBooks();
  }, []);

  if (loading) {
    return <div>Loading saved books...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <div>
        {/* Pass the savedBooks directly */}
        <BooksList books={savedBooks} />
      </div>
    </div>
  );
}
