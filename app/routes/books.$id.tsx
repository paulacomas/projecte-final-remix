import { useEffect, useState } from "react";
import { useParams, useNavigate, redirect, json, Form } from "@remix-run/react";
import Layout from "../components/Layout";
import {
  fetchBookDetails,
  fetchCurrentUser,
  deleteBook,
  updateBook,
  addReview,
  deleteReview,
  updateReview,
  addComment,
  deleteComment,
  updateComment,
} from "../data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import Modal from "../components/Modal";
import Reviews from "~/components/Reviews";
import Comments from "~/components/Comments";
import AddReviewForm from "~/components/AddReviewForm";
import { comment } from "postcss";
import AddCommentForm from "~/components/AddCommentForm";
import EditBookForm from "~/components/EditBookForm";

// Tipos para usuarios, comentarios, y detalles del libro
interface User {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  user?: {
    id: number;
    name: string;
  };
  user_id?: number; // Asegúrate de agregar esta propiedad si debe existir
  book_id?: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}

interface Review {
  id: string;
  user?: {
    id: number;
    name: string;
  };
  user_id?: number; // Asegúrate de agregar esta propiedad si debe existir
  book_id?: number;
  score: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null); // Estado para la reseña a editar
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [editComment, setEditComment] = useState<Comment | null>(null);

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

  const handleSaveChanges = async (updatedBook: {
    id: string;
    title: string;
    author: string;
    description: string;
    opinion?: string;
    review?: number;
    gender: string;
    image_book?: File | null;
  }) => {
    const token = localStorage.getItem("token");

    if (!updatedBook || !token) return;

    try {
      const updatedData = {
        title: updatedBook.title,
        description: updatedBook.description,
        opinion: updatedBook.opinion,
        review: updatedBook.review,
        gender: updatedBook.gender,
        author: updatedBook.author,
        image_book: updatedBook.image_book,
      };

      const result = await updateBook(updatedBook.id, updatedData, token);
      console.log(result);
      setBook(result.data);
      setIsModalOpen(false);
    } catch (error) {
      setError("Error updating the book");
    }
  };

  const handleAddComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!book || !token) return;

    const formData = new FormData(event.currentTarget);
    const commentContent = formData.get("content") as string;

    // Validación antes de enviar
    if (!commentContent) {
      setError("Invalid comment content.");
      return;
    }

    try {
      const commentData = commentContent; // Preparamos el comentario
      const addedComment = await addComment(book.id, commentData, token); // Usamos la función de agregar comentario
      console.log(addedComment);

      const formattedComment: Comment = {
        id: addedComment.data.comment.id,
        user: {
          id: addedComment.data.comment.user.id,
          name: addedComment.data.comment.user.name,
        },
        content: addedComment.data.comment.content, // Guardamos el contenido del comentario
      };

      // Actualizamos los comentarios en el estado, manteniendo las reseñas intactas
      setBook((prevBook) => {
        if (!prevBook) return prevBook; // Evita errores si no hay libro
        const updatedBook = {
          ...prevBook,
          comments: [...prevBook.comments, formattedComment], // Actualizamos la lista de comentarios
        };
        console.log(updatedBook);
        return updatedBook;
      });
      setIsCommentModalOpen(false); // Cerramos el modal
    } catch (error) {
      setError("Error adding the comment");
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditComment({ id: commentId, content });
    setIsCommentModalOpen(true); // Abrimos el modal de edición
  };

  const handleEditCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !editComment) return;

    const formData = new FormData(event.currentTarget);
    const updatedContent = formData.get("content") as string;
    console.log("updating...");
    // Preparamos los datos del comentario que se va a actualizar
    const commentData = updatedContent;

    try {
      const updatedComment = await updateComment(
        editComment.id,
        commentData,
        token
      ); // Cambiar a la función de actualización de comentario

      const formattedUpdatedComments: Comment = {
        id: updatedComment.data.id,
        user_id: updatedComment.data.user_id, // Aquí no accedemos a 'user'
        book_id: updatedComment.data.book_id,
        content: updatedComment.data.content,
        created_at: updatedComment.data.created_at,
        updated_at: updatedComment.data.updated_at,
      };

      console.log("Formatted Updated Review:", formattedUpdatedComments);

      // Actualizamos el estado del libro con la reseña editada
      setBook((prevBook) => {
        if (!prevBook) return prevBook; // Si no hay un libro, no hacer nada
        return {
          ...prevBook,
          comments: prevBook.comments.map((comment) =>
            comment.id === editComment.id
              ? { ...comment, ...formattedUpdatedComments } // Reemplazamos la reseña con la actualizada
              : comment
          ),
        };
      });

      setIsCommentModalOpen(false);
    } catch (error) {
      setError("Error updating the comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await deleteComment(commentId, token); // Cambiar a la función de eliminar comentario
      setBook((prevBook) => ({
        ...prevBook!,
        comments: prevBook!.comments.filter(
          (comment) => comment.id !== commentId
        ),
      }));
    } catch (error) {
      setError("Error deleting the comment");
    }
  };

  const handleAddReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!book || !token) return;

    const formData = new FormData(event.currentTarget);
    const reviewContent = formData.get("comment") as string;
    const reviewRating = Number(formData.get("score"));

    // Validación antes de enviar
    if (!reviewContent || reviewRating < 1 || reviewRating > 5) {
      setError("Invalid review content or rating.");
      return;
    }

    try {
      const reviewData = { content: reviewContent, rating: reviewRating };
      const addedReview = await addReview(book.id, reviewData, token);

      // Asegurarnos de que la reseña tenga el formato correcto
      const formattedReview: Review = {
        id: addedReview.data.id, // Usamos el ID retornado
        user: {
          id: addedReview.data.review.user.id,
          name: addedReview.data.review.user.name,
        },
        user_id: addedReview.data.review.user_id, // Usamos el user_id dentro de review
        book_id: addedReview.data.review.book_id, // Usamos el book_id dentro de review
        score: addedReview.data.review.score, // Usamos score en vez de rating
        comment: addedReview.data.review.comment, // Usamos comment en vez de content
      };

      setBook((prevBook) => {
        // Aseguramos que las reseñas estén bien formateadas
        const updatedBook = {
          ...prevBook!,
          reviews: [...prevBook!.reviews, formattedReview],
        };
        console.log("Updated Book after adding review:", updatedBook);
        return updatedBook;
      });

      setIsReviewModalOpen(false);
    } catch (error) {
      setError("Error adding the review");
    }
  };

  const handleEditReview = (
    reviewId: string,
    content: string,
    rating: number
  ) => {
    setEditReview({ id: reviewId, content, rating });
    setIsReviewModalOpen(true); // Abrimos el modal de edición
  };

  const handleEditReviewSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !editReview) return;

    const formData = new FormData(event.currentTarget);
    const updatedContent = formData.get("comment") as string;
    const updatedRating = Number(formData.get("score"));

    // Preparamos los datos de la reseña que se va a actualizar
    const reviewData = { content: updatedContent, rating: updatedRating };

    try {
      // Actualizamos la reseña usando la función de actualización correspondiente
      const updatedReview = await updateReview(
        editReview.id,
        reviewData,
        token
      );

      // Verificamos que los datos estén presentes
      if (!updatedReview || !updatedReview.data) {
        console.error("La respuesta de la API no contiene los datos esperados");
        setError("Error updating the review: Invalid response data");
        return;
      }

      // Creamos el formato de la reseña actualizada (sin 'user')
      const formattedUpdatedReview: Review = {
        id: updatedReview.data.id,
        user_id: updatedReview.data.user_id, // Aquí no accedemos a 'user'
        book_id: updatedReview.data.book_id,
        score: updatedReview.data.score,
        comment: updatedReview.data.comment,
        created_at: updatedReview.data.created_at,
        updated_at: updatedReview.data.updated_at,
      };

      console.log("Formatted Updated Review:", formattedUpdatedReview);

      // Actualizamos el estado del libro con la reseña editada
      setBook((prevBook) => {
        if (!prevBook) return prevBook; // Si no hay un libro, no hacer nada
        return {
          ...prevBook,
          reviews: prevBook.reviews.map((review) =>
            review.id === editReview.id
              ? { ...review, ...formattedUpdatedReview } // Reemplazamos la reseña con la actualizada
              : review
          ),
        };
      });

      // Cerramos el modal
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error during review update:", error);
      setError("Error updating the review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await deleteReview(reviewId, token); // Asegúrate de tener una función para eliminar reseñas
      setBook((prevBook) => ({
        ...prevBook!,
        reviews: prevBook!.reviews.filter((review) => review.id !== reviewId),
      }));
    } catch (error) {
      setError("Error deleting the review");
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
              onClick={() => {
                setIsModalOpen(true);
              }}
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
        <div className="mb-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditReview(null); // Reset the edit review state when adding a new review
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Review
            </button>
          </div>

          {isReviewModalOpen && (
            <Modal onClose={() => setIsReviewModalOpen(false)}>
              <h2 className="text-xl font-semibold mb-4">
                {editReview ? "Edit Review" : "Add Review"}
              </h2>
              <AddReviewForm
                bookId={book.id}
                reviewData={editReview} // Pasa los datos de la reseña a editar
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={editReview ? handleEditReviewSubmit : handleAddReview}
              />
            </Modal>
          )}

          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <EditBookForm
                book={book} // Asegúrate de pasar el libro a editar
                onCancel={() => setIsModalOpen(false)} // Cerrar el modal
                onSubmit={handleSaveChanges} // Función para manejar el envío del formulario
              />
            </Modal>
          )}

          {isCommentModalOpen && (
            <Modal onClose={() => setIsCommentModalOpen(false)}>
              <h2 className="text-xl font-semibold mb-4">
                {editComment ? "Edit Comment" : "Add Comment"}
              </h2>
              <AddCommentForm
                bookId={book.id}
                commentData={editComment || null} // Pasa los datos de la reseña a editar
                onClose={() => setIsCommentModalOpen(false)}
                onSubmit={
                  editComment ? handleEditCommentSubmit : handleAddComment
                }
              />
            </Modal>
          )}

          {book.reviews && (
            <Reviews
              reviews={book.reviews}
              bookUserid={book.user_id}
              currentUserId={currentUser?.id || ""}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          )}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditComment(null); // Reset the edit review state when adding a new review
                setIsCommentModalOpen(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Comment
            </button>
          </div>

          {book.comments && (
            <Comments
              comments={book.comments}
              bookUserid={book.user_id}
              currentUserId={currentUser?.id || ""}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          )}
        </div>
      </main>
    </div>
  );
}
