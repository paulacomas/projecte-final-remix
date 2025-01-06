import React, { useState, useEffect } from "react";
import { validateCommentContent } from "../util/validations"; // Asegúrate de que la ruta sea correcta

interface AddCommentFormProps {
  bookId: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  commentData?: { content: string }; // Recibe los datos del comentario si es edición
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  bookId,
  onClose,
  onSubmit,
  commentData,
}) => {
  const [content, setContent] = useState<string>(commentData?.content || "");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (commentData) {
      setContent(commentData.content);
    }
  }, [commentData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateCommentContent(content); // Llamar a la función de validación
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(""); // Limpiar error si la validación es exitosa
    onSubmit(event); // Llamar al handler de submit
  };

  return (
    <form onSubmit={handleSubmit}>
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
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
          disabled={!content.trim()}
          className={`px-4 py-2 ${
            !content.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
          } text-white rounded-lg hover:bg-blue-600`}
        >
          {commentData ? "Update Comment" : "Add Comment"}
        </button>
      </div>
    </form>
  );
};

export default AddCommentForm;
