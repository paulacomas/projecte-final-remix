import React, { useState, useEffect } from "react";
import {
  validateReviewContent,
  validateReviewRating,
} from "../util/validations"; // Asegúrate de que la ruta sea correcta
import { FaStar } from "react-icons/fa"; // Importar FaStar de react-icons

interface AddReviewFormProps {
  bookId: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => void; // Cambié para recibir FormData
  reviewData?: { content: string; rating: number }; // Recibe los datos de la reseña si es edición
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  bookId,
  onClose,
  onSubmit,
  reviewData,
}) => {
  const [content, setContent] = useState<string>(reviewData?.content || "");
  const [rating, setRating] = useState<number>(reviewData?.rating || 0); // Se inicializa en 0
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (reviewData) {
      setContent(reviewData.content);
      setRating(reviewData.rating);
    }
  }, [reviewData]);

  const handleStarClick = (index: number) => {
    const newRating = index + 1; // Los índices empiezan desde 0, pero la calificación es de 1 a 5
    setRating(newRating); // Se actualiza directamente en el estado
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar contenido de la reseña
    const contentError = validateReviewContent(content);
    if (contentError) {
      setError(contentError);
      return;
    }

    // Validar calificación
    const ratingError = validateReviewRating(rating);
    if (ratingError) {
      setError(ratingError);
      return;
    }

    setError(""); // Limpiar error si la validación es exitosa

    // Crear FormData para enviar
    const formData = new FormData();
    formData.append("content", content);
    formData.append("rating", String(rating)); // Se asegura de que el rating se agregue como string

    onSubmit(formData); // Llamamos a onSubmit con el FormData
  };

  return (
    <form onSubmit={handleSubmit}>
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
          Rating
        </label>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleStarClick(index)}
              className={`w-8 h-8 ${
                index < rating ? "text-blue-500" : "text-gray-300"
              }`}
            >
              <FaStar />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">{rating} / 5</p>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
    </form>
  );
};

export default AddReviewForm;
