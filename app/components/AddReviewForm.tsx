// En AddReviewForm.tsx

import React, { useState, useEffect } from "react";

interface AddReviewFormProps {
  bookId: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  reviewData?: { content: string; rating: number }; // Recibe los datos de la reseña si es edición
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  bookId,
  onClose,
  onSubmit,
  reviewData,
}) => {
  const [content, setContent] = useState<string>(reviewData?.content || "");
  const [rating, setRating] = useState<number>(reviewData?.rating || 1);

  useEffect(() => {
    if (reviewData) {
      setContent(reviewData.content);
      setRating(reviewData.rating);
    }
  }, [reviewData]);

  return (
    <form onSubmit={onSubmit}>
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
    </form>
  );
};

export default AddReviewForm;
