import { LoaderFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  Outlet,
  useSearchParams,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import BookFilters from "~/components/BookFilters";
import BooksTable from "~/components/BooksTable";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";
import { fetchBooks, fetchCurrentUser } from "~/data/data";
import { Book } from "~/data/types";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("No token found");
  }
  const userCurrent = await fetchCurrentUser(token);
  if (userCurrent.rol !== "admin") {
    throw new Error("You don't have permission");
  }
  const url = new URL(request.url);

  const title = url.searchParams.get("title") || "";
  const user = url.searchParams.get("user") || "";
  const category = url.searchParams.get("category") || "";
  try {
    const response = await fetchBooks();

    const data = await response.json();
    let books = data.data;

    if (title) {
      books = books.filter((book: { title: string }) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (user) {
      books = books.filter((book: { user: { name: string } }) =>
        book.user.name.toLowerCase().includes(user.toLowerCase())
      );
    }

    if (category) {
      books = books.filter(
        (book: { gender: string }) =>
          book.gender.toLowerCase() === category.toLowerCase()
      );
    }

    return books;
  } catch (error) {
    throw new Error("Error fectching books");
  }
};

export default function AdminBooks() {
  const books = useLoaderData<Book[]>();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Fantasy",
    "Romance",
    "Terror",
    "Action",
    "Other",
  ];

  const updateUrlWithFilters = (
    newTitle: string,
    newUser: string,
    newCategory: string,
    newPage: number
  ) => {
    const queryParams = new URLSearchParams();
    if (newTitle) queryParams.set("title", newTitle);
    if (newUser) queryParams.set("user", newUser);
    if (newCategory) queryParams.set("category", newCategory);
    if (newPage) queryParams.set("page", newPage.toString());

    navigate(`?${queryParams.toString()}`);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateUrlWithFilters(newTitle, user, category, 1);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUser = e.target.value;
    setUser(newUser);
    updateUrlWithFilters(title, newUser, category, 1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    updateUrlWithFilters(title, user, newCategory, 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 ">
        <Navigation />
        <div className="flex justify-between items-center mb-4 p-6">
          <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Books
          </h1>
          <Link
            to="/books/add"
            className="py-2 px-4 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
          >
            Add New Book
          </Link>
        </div>

        <BookFilters
          title={title}
          user={user}
          category={category}
          categories={categories}
          onTitleChange={handleTitleChange}
          onUserChange={handleUserChange}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />

        <Notification
          successMessage={successMessage ?? undefined}
          errorMessage={errorMessage ?? undefined}
        />

        {books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          <BooksTable books={books} />
        )}

        <Outlet />
      </div>
    </>
  );
}
