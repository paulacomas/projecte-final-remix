import React, { useState, useEffect } from "react";
import BooksList from "~/components/books";
import Navigation from "~/components/Layout";

import { json, LoaderFunction } from "@remix-run/node";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import Notification from "~/components/Notification";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    throw new Error("No token found");
  }

  try {
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
        return bookData.data; // Return book data with full details
      })
    );

    return json({ savedBooks: booksDetails });
  } catch (error) {
    console.error("Error fetching saved books:", error);
    throw new Error("Error fetching saved books");
  }
};

export default function SavedBooksPage() {
  const { savedBooks } = useLoaderData(); // Obtén los datos cargados por el loader
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <div>
        {/* Pasa los savedBooks al componente BooksList */}
        <BooksList books={savedBooks} />
      </div>
      <Outlet />
    </div>
  );
}
