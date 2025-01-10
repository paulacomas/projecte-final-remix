import { useState } from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BooksList from "../components/books";
import BookFilters from "~/components/BookFilters";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";

import type { LoaderFunction } from "@remix-run/node";
import { FaArrowRight } from "react-icons/fa";
import { fetchBooks } from "~/data/data";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const title = url.searchParams.get("title") || "";
  const user = url.searchParams.get("user") || "";
  const category = url.searchParams.get("category") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const limit = 16;
  const offset = (page - 1) * limit;

  try {
    const response = await fetchBooks();
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
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

    const totalBooks = books.length;
    const totalPages = Math.ceil(totalBooks / limit);
    books = books.slice(offset, offset + limit);

    return {
      books,
      page,
      totalPages,
    };
  } catch (error) {
    throw new Error("Error fectching books");
  }
};

export default function Index() {
  const navigate = useNavigate();
  const { books, page, totalPages } = useLoaderData();
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success") || undefined;
  const errorMessage = searchParams.get("error") || undefined;

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

  const goToNextPage = () => {
    if (page < totalPages) {
      updateUrlWithFilters(title, user, category, page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      updateUrlWithFilters(title, user, category, page - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div>
        <div className="container mx-auto p-4 pt-0">
          <Notification
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 my-6 rounded-lg shadow-lg">
            <div className="container mx-auto flex items-center justify-between px-4 md:px-10">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-3xl font-bold leading-tight">
                    Discover the Best Books
                  </h2>
                  <p className="text-lg mt-2">
                    Explore the most popular and highly rated books by our
                    community.
                  </p>
                </div>
                <Link
                  to="/books/ranking"
                  className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-700 font-bold rounded-md shadow-md hover:bg-gray-100 transition-all flex items-center space-x-2"
                >
                  <span>See Book Rankings</span>
                  <FaArrowRight className="h-5 w-5 text-blue-700" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-20">
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
          </div>
        </div>

        <BooksList books={books} currentUserId={undefined} />

        <div className="flex justify-center space-x-4 mt-8 bg-gray-200 py-4 ">
          <button
            onClick={goToPreviousPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
