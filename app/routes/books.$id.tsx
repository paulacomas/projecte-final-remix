import { useEffect, useState } from "react";
import { useParams, useNavigate, redirect, json, Form } from "@remix-run/react";
import Layout from "../components/Layout";
import {
  fetchBookDetails,
  fetchCurrentUser,
  deleteBook,
  updateBook,
} from "../data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import Modal from "../components/Modal";

// Tipos para usuarios, comentarios, y detalles del libro
interface User {
  id: string;
  name: string;
}

interface Comment {
  user: User;
  content: string;
}

interface Review {
  user: User;
  rating: number;
  content: string;
}

interface BookDetails {
  id: string;
  title: string;
  author: string;
  description: string;
  gender: string;
  review: number;
  opinion: string;
  image_book: string;
  created_at: string;
  updated_at: string;
  reviews: Review[];
  comments: Comment[];
  user_id: string;
}

// Loader para cargar detalles del libro
export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    return redirect("/login");
  }

  try {
    const book = await fetchBookDetails(params.id, token);
    return json(book);
  } catch (error) {
    return json({ error: "Error fetching book details" }, { status: 500 });
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

  if (actionType === "update") {
    const bookId = params.id;
    const bookData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      opinion: formData.get("opinion") as string,
      review: Number(formData.get("review")),
      gender: formData.get("gender") as string,
      author: formData.get("author") as string,
      image_book: formData.get("image_book") as File | null,
    };

    try {
      await updateBook(bookId, bookData, token);
      return redirect(`/books/${bookId}`);
    } catch (error) {
      return json({ error: "Error updating the book" }, { status: 500 });
    }
  }

  if (actionType === "delete") {
    try {
      await deleteBook(params.id, token);
      return redirect("/");
    } catch (error) {
      return json({ error: "Error deleting the book" }, { status: 500 });
    }
  }

  return null;
};

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No book ID found");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        navigate("/login?message=You%20need%20to%20be%20logged%20in");
        return;
      }

      try {
        const bookData = await fetchBookDetails(id, token);
        setBook(bookData);

        const userData = await fetchCurrentUser(token);
        setCurrentUser(userData);
      } catch (error) {
        setError("Error fetching book details or user data");
        navigate("/login?message=Invalid%20or%20expired%20token");
      }
    };

    fetchData();
  }, [id, navigate]);

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
      <main className="container mx-auto py-8">
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
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Book
            </button>
            <Form method="POST" action={`/books/${book.id}`}>
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

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
            <Form
              method="POST"
              action={`/books/${book.id}`}
              encType="multipart/form-data"
              onSubmit={() => setIsModalOpen(false)}
            >
              <input type="hidden" name="action" value="update" />

              {/* Title */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  defaultValue={book.title}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Author */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="author"
                >
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  defaultValue={book.author}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={book.description}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Opinion */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="opinion"
                >
                  Opinion (optional)
                </label>
                <textarea
                  id="opinion"
                  name="opinion"
                  defaultValue={book.opinion}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Review */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="review"
                >
                  Rating (1 to 5)
                </label>
                <input
                  id="review"
                  name="review"
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={book.review}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="gender"
                >
                  Genre
                </label>
                <input
                  id="gender"
                  name="gender"
                  defaultValue={book.gender}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Subir imagen del libro */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="image_book"
                >
                  Upload Book Image (optional)
                </label>
                <input
                  id="image_book"
                  name="image_book"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/svg"
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Mostrar imagen actual si existe */}
              {book.image_book && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Current Image:</p>
                  <img
                    src={book.image_book}
                    alt="Current Book"
                    className="w-48 h-48 object-cover rounded mt-2"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          </Modal>
        )}

        {book.reviews?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {book.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <p className="text-lg font-medium">{review.user.name}</p>
                  <p className="ml-4 text-sm text-gray-500">
                    {review.rating} / 5
                  </p>
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        )}

        {book.comments?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {book.comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-lg font-medium">{comment.user.name}</p>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
