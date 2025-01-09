// components/ReviewForm.tsx
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  validateReviewContent,
  validateReviewRating,
} from "~/util/validations";

interface ReviewFormProps {
  review: {
    id: number;
    comment: string;
    score: number;
  };
}

export default function ReviewForm({ review }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(review?.score || 0);
  const [error, setError] = useState<string | null>(null);
  const handleStarClick = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    const rating = formData.get("rating") as string;

    const validationErrorContent = validateReviewContent(content);
    if (validationErrorContent) {
      setError(validationErrorContent);
      return;
    }

    const validationError = validateReviewRating(Number(rating));
    if (validationError) {
      setError(validationError);
      return;
    }

    e.currentTarget.submit();
  };
  return (
    <Form method="post" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h2 className="text-2xl font-bold mb-4">
        {review ? "Edit Review" : "Add Review"}
      </h2>
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

      <input type="hidden" name="rating" value={rating} />

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={review?.comment || ""}
          className="w-full p-2 border border-gray-300 rounded"
          rows={5}
        ></textarea>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Save
        </button>
        <Link
          to=".."
          className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancel
        </Link>
      </div>
    </Form>
  );
}
