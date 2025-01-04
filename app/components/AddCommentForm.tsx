import React, { useState, useEffect } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { validateCommentContent } from "../util/validations";
import { fetchBookDetails } from "~/data/data";

interface AddCommentFormProps {
  bookId: string;
  onClose: () => void;
  commentData?: { content: string; id: string };
  onCommentAdded: (newComment: { content: string; id: string }) => void;
  onCommentEdited: (updatedComment: { content: string; id: string }) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  bookId,
  onClose,
  commentData,
  onCommentAdded,
  onCommentEdited,
}) => {
  const [content, setContent] = useState<string>(commentData?.content || "");
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
          if (commentData) {
            // Si es edición, buscar por ID
            targetComment = book.comments.find(
              (comment: any) => comment.id === commentData.id
            );
          } else {
            // Si es nuevo, tomar el último de la lista
            targetComment = book.comments[book.comments.length - 1];
          }

          if (!targetComment) {
            console.error("Comentario no encontrado.");
            return;
          }

          console.log(
            commentData ? "Comentario editado:" : "Comentario agregado:",
            targetComment
          );

          // Llamar a la función correspondiente
          if (commentData) {
            onCommentEdited({
              id: targetComment.id,
              user_id: targetComment.user_id,
              book_id: targetComment.book_id,
              content: targetComment.content,
              created_at: targetComment.created_at,
              updated_at: targetComment.updated_at,
            });
          } else {
            onCommentAdded({
              data: { comment: targetComment, user: targetComment.user },
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
  }, [
    isSubmitted,
    bookId,
    onCommentAdded,
    onCommentEdited,
    onClose,
    commentData,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación del contenido
    const validationError = validateCommentContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true); // Activamos el estado de carga

    // Preparamos los datos para el formulario
    const formData = new FormData();
    formData.append("content", content);
    formData.append("bookId", bookId);
    formData.append("action", commentData ? "edit-comment" : "add-comment");
    if (commentData) formData.append("commentId", commentData.id);

    // Enviar el formulario usando `submit`
    submit(formData, { method: "post" });

    // Simular finalización del submit
    setTimeout(() => {
      setIsSubmitted(true); // Establecer 'isSubmitted' para que el useEffect se ejecute
    }, 1000);
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Comment Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`mt-1 p-2 w-full border rounded-lg ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : commentData
            ? "Update Comment"
            : "Add Comment"}
        </button>
      </div>
    </Form>
  );
};

export default AddCommentForm;
