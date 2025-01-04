import React, { useState, useEffect } from "react";
import { validateCommentContent } from "../util/validations";
import { Form } from "@remix-run/react";

interface AddCommentFormProps {
  bookId: string;
  onClose: () => void;
  onSubmit: (content: string) => void; // Cambiado para pasar solo el contenido del comentario
  commentData?: { content: string }; // Recibe los datos del comentario si es edición
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  bookId,
  onClose,
  onSubmit,
  commentData,
}) => {
  const [content, setContent] = useState<string>(commentData?.content || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (commentData) {
      setContent(commentData.content);
    }
  }, [commentData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones usando el archivo util
    const validationError = validateCommentContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Si pasa las validaciones, limpia el error y envía los datos
    setError(null);
    onSubmit(content);
  };

  return (
    <Form onSubmit={handleSubmit}>
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
        >
          {commentData ? "Update Comment" : "Add Comment"}
        </button>
      </div>
    </Form>
  );
};

export default AddCommentForm;
