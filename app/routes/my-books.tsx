import {
  json,
  redirect,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import BooksList from "~/components/books";
import { fetchBooksForUser, fetchCurrentUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import Navigation from "../components/Layout";
import Notification from "~/components/Notification";
import { Book } from "~/data/types";

interface LoaderData {
  books: Book[];
  userId: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    return redirect("/login");
  }

  try {
    const booksResponse = await fetchBooksForUser(token);
    const userResponse = await fetchCurrentUser(token);

    return json({
      books: booksResponse.data,
      userId: userResponse.id,
    });
  } catch (error) {
    throw new Error("Error fectching books or user data");
  }
};

export default function MyBooks() {
  const { books, userId } = useLoaderData<LoaderData>();
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
        <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          My Books
        </h1>
        <BooksList books={books} currentUserId={userId} />{" "}
      </div>
    </div>
  );
}
