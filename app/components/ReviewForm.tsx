// components/ReviewForm.tsx
import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

interface ReviewFormProps {
  review: {
    id: number;
    content: string;
    rating: number;
  };
}

export default function ReviewForm({ review }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(review?.score || 0); // Se inicializa en 0
  const handleStarClick = (index: number) => {
    const newRating = index + 1; // Los índices empiezan desde 0, pero la calificación es de 1 a 5
    setRating(newRating); // Se actualiza directamente en el estado
  };

  return (
    <Form method="post">
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

      {/* Campo oculto para enviar la puntuación */}
      <input type="hidden" name="rating" value={rating} />

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">
          Contenido
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={review?.comment || ""}
          className="w-full p-2 border border-gray-300 rounded"
          rows={5}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Guardar
      </button>
    </Form>
  );
}
