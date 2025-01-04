// En AddReviewForm.tsx

import React, { useState, useEffect } from "react";
import { Form, useSubmit } from "react-router-dom";
import { fetchBookDetails } from "~/data/data";

interface AddReviewFormProps {
  bookId: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  reviewData?: { content: string; rating: number };
  onReviewAdded: (newReview: { content: string; rating: number }) => void;
  onReviewEdited: (updatedReview: { content: string; rating: number }) => void; // Recibe los datos de la reseña si es edición
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  bookId,
  onClose,
  reviewData,
  onReviewAdded,
  onReviewEdited,
}) => {
  const [content, setContent] = useState<string>(reviewData?.content || "");
  const [rating, setRating] = useState<number>(reviewData?.rating || 1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitted) {
      const fetchUpdatedComments = async () => {
        const token = localStorage.getItem("token");
        try {
          const book = await fetchBookDetails(bookId, token);

          // Buscar el comentario actualizado o agregado
          let targetComment;
          if (reviewData) {
            // Si es edición, buscar por ID
            targetComment = book.reviews.find(
              (review) => review.id === reviewData.id
            );
          } else {
            // Si es nuevo, tomar el último de la lista
            targetComment = book.reviews[book.reviews.length - 1];
          }

          if (!targetComment) {
            console.error("Comentario no encontrado.");
            return;
          }

          console.log(
            reviewData ? "Comentario editado:" : "Comentario agregado:",
            targetComment
          );

          // Llamar a la función correspondiente
          if (reviewData) {
            onReviewEdited({
              id: targetComment.id,
              user_id: targetComment.user_id,
              book_id: targetComment.book_id,
              score: targetComment.score,
              comment: targetComment.comment,
              created_at: targetComment.created_at,
              updated_at: targetComment.updated_at,
            });
          } else {
            onReviewAdded({
              data: { review: targetComment, user: targetComment.user },
            });
          }
        } catch (error) {
          console.error(
            "Error al obtener los comentarios actualizados:",
            error
          );
        } finally {
          setLoading(false); // Restablecer el estado de carga
          onClose(); // Cerrar el modal después de obtener los comentarios
        }
      };

      fetchUpdatedComments();
    }
  }, [isSubmitted, bookId, onReviewAdded, onReviewEdited, onClose, reviewData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación del contenido
    // const validationError = validateCommentContent(content);
    // if (validationError) {
    //   setError(validationError);
    //   return;
    // }

    setLoading(true); // Activamos el estado de carga

    // Preparamos los datos para el formulario
    const formData = new FormData();
    formData.append("content", content);
    formData.append("rating", rating);
    formData.append("bookId", bookId);
    formData.append("action", reviewData ? "edit-review" : "add-review");
    if (reviewData) formData.append("commentId", reviewData.id);

    // Enviar el formulario usando `submit`
    submit(formData, { method: "post" });

    // Simular finalización del submit
    setTimeout(() => {
      setIsSubmitted(true); // Establecer 'isSubmitted' para que el useEffect se ejecute
    }, 1000);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Review Content
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Rating (1-5)
        </label>
        <input
          type="number"
          id="score"
          name="score"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {reviewData ? "Update Review" : "Add Review"}
        </button>
      </div>
    </Form>
  );
};

export default AddReviewForm;
