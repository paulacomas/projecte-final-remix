import { useEffect, useState } from "react";
import { useParams, useNavigate, redirect, json, Form } from "@remix-run/react";
import Layout from "../components/Layout";
import {
  fetchBookDetails,
  fetchCurrentUser,
  deleteBook,
  updateBook,
} from "../data/data"; // Importar la función updateBook
import Modal from "../components/Modal"; // Importar el Modal
import { getAuthTokenFromCookie, sessionStorage } from "~/helpers/cookies";
import { ActionFunction, LoaderFunction } from "@remix-run/node";

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

export const loader: LoaderFunction = async ({ request, params }) => {
  // Obtener las cookies de la solicitud
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  // Si no se encuentra el token, redirigir al login
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

export const action: ActionFunction = async ({ request, params }) => {
  const formData = new URLSearchParams(await request.text());
  const token = await getAuthTokenFromCookie(request.headers.get("Cookie"));

  if (!token) {
    return redirect("/login"); // Redirigir si no hay token
  }

  try {
    if (formData.get("action") === "delete") {
      await deleteBook(params.id, token);
      return redirect("/"); // Después de eliminar, redirigir al inicio
    } else if (formData.get("action") === "update") {
      await updateBook(params.id, formData, token);
      return redirect(`/books/${params.id}`);
    }
  } catch (error) {
    return json({ error: "Error processing the action" }, { status: 500 });
  }
};

export default function BookDetailPage() {
  const { id } = useParams(); // Obtener el bookId desde los parámetros de la URL
  const navigate = useNavigate(); // Hook para redirigir al usuario
  const [book, setBook] = useState<BookDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Estado para el usuario logueado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir o cerrar el modal

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
        const bookData = await fetchBookDetails(id, token); // Usamos la función para obtener los detalles del libro
        setBook(bookData);

        const userData = await fetchCurrentUser(token); // Usamos la función para obtener los datos del usuario
        setCurrentUser(userData);
      } catch (error) {
        setError("Error fetching book details or user data");
        navigate("/login?message=Invalid%20or%20expired%20token");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleSaveChanges = async (formData: FormData) => {
    const token = localStorage.getItem("token");

    if (!book || !token) return;

    try {
      // Llamar a la función updateBook desde data.ts
      const updatedBook = await updateBook(book.id, formData, token);

      // Actualizar el estado con el libro actualizado
      setBook({
        ...updatedBook, // Usamos el libro actualizado que recibimos del servidor
      });

      setIsModalOpen(false); // Cerrar el modal
    } catch (error) {
      setError("Error updating the book");
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
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Book
            </button>

            {/* Formulario de eliminación */}
            <Form method="PUT" action={`/books/${book.id}`}>
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

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveChanges}
          bookTitle={book.title}
          bookAuthor={book.author}
          bookDescription={book.description}
          bookOpinion={book.opinion}
          bookReview={book.review}
          bookGender={book.gender}
          bookImageBook={book.image_book} // Pasar la URL de la imagen
        />

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
