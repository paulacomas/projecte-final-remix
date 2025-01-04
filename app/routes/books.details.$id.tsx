import { useEffect, useState } from "react";
import { useParams, useNavigate, redirect, json, Form } from "@remix-run/react";
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
import Modal from "../components/Modal";
import Reviews from "~/components/Reviews";
import Comments from "~/components/Comments";
import AddReviewForm from "~/components/AddReviewForm";
import AddCommentForm from "~/components/AddCommentForm";
import EditBookForm from "~/components/EditBookForm";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import {
  handleAddComment,
  handleDeleteComment,
  handleEditComment,
  handleEditCommentSubmit,
} from "~/util/comments";
import {
  handleAddReview,
  handleDeleteReview,
  handleEditReview,
  handleEditReviewSubmit,
} from "~/util/reviews";
import { handleSaveChanges } from "~/util/BookDetails";
import {
  handleAddReply,
  handleEditReply,
  handleReplyDelete,
} from "~/util/Reply";
import { BookDetails, Review, User } from "~/data/types";
import { useNotifications } from "~/contexts/NotificationContext";

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
  const { addNotification } = useNotifications();

  if (!token) {
    return redirect("/login");
  }

  if (actionType === "delete") {
    try {
      await deleteBook(params.id, token);
      return redirect("/");
    } catch (error) {
      addNotification("Error deleting the book!", "error");
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
  const [savedBooks, setSavedBooks] = useState<Set<string>>(new Set());
  const { addNotification } = useNotifications();

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
      } catch (e) {
        setError("Error fetching book details or user data");
        navigate("/error", {
          state: { error: "Error fetching book details or user data" },
        });
      }

      const fetchSavedBooks = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await getSavedBooks(token);
            const savedBookIds = response.data.map(
              (book: { book_id: string }) => book.book_id
            );
            setSavedBooks(new Set(savedBookIds));
          }
        } catch (error) {
          console.error("Error fetching saved books:", error);
          navigate("/error", {
            state: { error: "Error fetching saved books" },
          });
        }
      };

      fetchSavedBooks();
    };

    fetchData();
  }, [id, navigate]);

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
        addNotification("Product saved successfully!", "success");
      }
    } catch (error: any) {
      console.error("Error toggling save book:", error.message);
      navigate("/error", {
        state: { error: "Error toggling save book" },
      });
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
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Book
            </button>
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
                onSubmit={
                  editReview
                    ? (event) =>
                        handleEditReviewSubmit(
                          event,
                          editReview,
                          setBook,
                          setError,
                          setIsReviewModalOpen
                        )
                    : (event) =>
                        handleAddReview(
                          event,
                          book.id,
                          setBook,
                          setError,
                          setIsReviewModalOpen
                        )
                }
              />
            </Modal>
          )}

          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <EditBookForm
                book={book} // Asegúrate de pasar el libro a editar
                onCancel={() => setIsModalOpen(false)} // Cerrar el modal
                onSubmit={(updatedBookData: any) => {
                  handleSaveChanges(
                    updatedBookData, // Pasar los datos actualizados del libro
                    book, // Pasar el libro actual
                    setBook, // Pasar el setter de estado para actualizar el libro
                    setError, // Pasar el setter de estado para los errores
                    setIsModalOpen // Pasar el setter de estado para cerrar el modal
                  );
                }} // Función para manejar el envío del formulario
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
                  editComment
                    ? (event) =>
                        handleEditCommentSubmit(
                          event,
                          editComment,
                          setBook,
                          setError,
                          setIsCommentModalOpen
                        )
                    : (event) =>
                        handleAddComment(
                          event,
                          book.id,
                          setBook,
                          setError,
                          setIsCommentModalOpen
                        )
                }
              />
            </Modal>
          )}

          {book.reviews && (
            <Reviews
              reviews={book.reviews}
              bookUserid={book.user_id}
              currentUserId={currentUser?.id || ""}
              onEdit={(reviewId: string, content: string, rating: number) =>
                handleEditReview(
                  reviewId,
                  content,
                  rating,
                  setEditReview,
                  setIsReviewModalOpen
                )
              }
              onDelete={(reviewId: string) =>
                handleDeleteReview(reviewId, setBook, setError)
              }
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
              onEdit={(commentId: string, content: string) =>
                handleEditComment(
                  commentId,
                  content,
                  setEditComment,
                  setIsCommentModalOpen
                )
              }
              onDelete={(commentId: string) =>
                handleDeleteComment(commentId, setBook, setError)
              }
              onReplyAdd={(
                commentId: string,
                event: React.FormEvent<HTMLFormElement>
              ) => handleAddReply(commentId, event, setBook, setError)}
              onReplyEdit={(replyId: string, updatedResponse: string) =>
                handleEditReply(replyId, updatedResponse, setBook, setError)
              }
              onReplyDelete={(replyId: string) =>
                handleReplyDelete(replyId, setBook, setError)
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
