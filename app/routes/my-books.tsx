import {
  json,
  redirect,
  LoaderFunction,
  useLoaderData,
} from "@remix-run/react";
import Layout from "../components/Layout";
import BooksList from "~/components/Books";
import { fetchBooksForUser, fetchCurrentUser } from "~/data/data"; // Assuming fetchCurrentUser is available
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import Navigation from "../components/Layout";

interface Book {
  id: string;
  title: string;
  author: string;
  gender: string;
  image_book: string;
}

interface User {
  id: string;
}

interface LoaderData {
  books: Book[];
  userId: string; // We'll include userId in the loader data
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    return redirect("/login");
  }

  try {
    const booksResponse = await fetchBooksForUser(token); // Fetch books for the user
    const userResponse = await fetchCurrentUser(token); // Fetch current user data

    return json({
      books: booksResponse.data, // Books data
      userId: userResponse.id, // User ID
    });
  } catch (error) {
    return json(
      { error: "Error fetching books or user data" },
      { status: 500 }
    );
  }
};

export default function MyBooks() {
  const { books, userId } = useLoaderData<LoaderData>(); // Get both books and userId from the loader

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <div>
        <BooksList books={books} currentUserId={userId} />{" "}
      </div>
    </div>
  );
}
