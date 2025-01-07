import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  redirect,
  json,
  Form,
  Link,
  Outlet,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import Layout from "../components/Layout";
import {
  fetchBookDetails,
  fetchCurrentUser,
  deleteBook,
  unsaveBook,
  saveBook,
  getSavedBooks,
} from "../data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import Reviews from "~/components/Reviews";
import Comments from "~/components/Comments";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BookDetails, Review, User } from "~/data/types";
import Notification from "~/components/Notification";

// Loader para cargar detalles del libro
// Loader para cargar detalles del libro
export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    return redirect("/login");
  }

  try {
    const book = await fetchBookDetails(params.id, token);
    const currentUser = await fetchCurrentUser(token);
    const savedBooksResponse = await getSavedBooks(token);

    const savedBookIds = Array.isArray(savedBooksResponse.data)
      ? savedBooksResponse.data.map((book: { book_id: string }) => book.book_id)
      : [];

    return json({ book, currentUser, savedBookIds });
  } catch (error) {
    throw new Error("Error fectching book");
  }
};

// Action para manejar actualizaciones y eliminación de libros
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("action");
  const token = await getAuthTokenFromCookie(request.headers.get("Cookie"));

  if (!token) {
    return redirect("/login");
  }

  if (actionType === "delete") {
    try {
      const response = await deleteBook(params.id, token);
      if (!response.ok) {
        const errorUrl = `/books/details/${params.id}?error=Error%20al%20eliminar%20el%20libro`;
        return redirect(errorUrl);
      }

      const successUrl = `/?success=Libro%20eliminado%20correctamente`;
      return redirect(successUrl);
    } catch (error) {
      return json({ error: "Error deleting the book" }, { status: 500 });
    }
  }

  return null;
};

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { book, currentUser, savedBookIds } = useLoaderData<{
    book: BookDetails;
    currentUser: User;
    savedBookIds: string[];
  }>();
  const [error, setError] = useState<string | null>(null);
  const [savedBooks, setSavedBooks] = useState<Set<string>>(
    new Set(savedBookIds)
  );
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  useEffect(() => {
    // Asegurar que el estado inicial sea un Set
    setSavedBooks(new Set(savedBookIds));
  }, [savedBookIds]);

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
      } else {
        const response = await saveBook(bookId, token);
        console.log("Save response:", response); // Depuración
        setSavedBooks((prev) => new Set(prev).add(bookId));
        navigate(".?success=Libro%20guardado%20correctamente");
      }
    } catch (error: any) {
      console.error("Error toggling save book:", error.message);
      navigate(".?error=Error%20al%20guardar");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  const isOwner = currentUser && book.user_id === currentUser.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Layout />
        </nav>
      </header>
      <main className="container mx-auto py-8 p-6">
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-semibold mb-4">{book.title}</h1>
          <div className="flex items-center mb-6">
            <img
              src={book.image_book}
              alt={book.title}
              className="h-48 w-48 object-cover rounded-lg mr-6"
            />
            <div>
              <p className="text-xl font-medium">{book.author}</p>
              <p className="text-gray-600">{book.gender}</p>
              <p className="text-gray-600">
                {new Date(book.created_at).toLocaleDateString()}
              </p>
              <p className="text-lg text-gray-800 mt-4">{book.description}</p>

              {/* Save button */}
              <div className="mt-4 flex items-center">
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
          </div>
        </div>

        {isOwner && (
          <div className="flex space-x-4 mb-8">
            <Link
              to={`edit`}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Book
            </Link>
            <Form method="POST" action={`/books/details/${book.id}`}>
              <input type="hidden" name="action" value="delete" />
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Book
              </button>
            </Form>
          </div>
        )}
        <div className="mb-8">
          <div className="flex justify-end mb-4">
            <Link
              to={`review/add`}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add review
            </Link>
          </div>
          {book.reviews && (
            <Reviews
              reviews={book.reviews}
              bookUserid={book.user_id}
              currentUserId={currentUser?.id || ""}
            />
          )}
          <div className="flex justify-end mb-4">
            <Link
              to={`comment/add`}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add comment
            </Link>
          </div>
          {book.comments && (
            <Comments
              comments={book.comments}
              bookUserid={book.user_id}
              currentUserId={currentUser?.id || ""}
            />
          )}
        </div>
      </main>
      <Outlet />
    </div>
  );
}
