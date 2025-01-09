import React from "react";
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
        return bookData.data;
      })
    );

    return json({ savedBooks: booksDetails });
  } catch (error) {
    console.error("Error fetching saved books:", error);
    throw new Error("Error fetching saved books");
  }
};

export default function SavedBooksPage() {
  const { savedBooks } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="container mx-auto py-12">
        <Notification
          successMessage={successMessage ?? undefined}
          errorMessage={errorMessage ?? undefined}
        />
        {/* Pasa los savedBooks al componente BooksList */}
        <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Saved books
        </h1>
        <BooksList books={savedBooks} currentUserId={undefined} />
      </div>
      <Outlet />
    </div>
  );
}
