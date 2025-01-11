// components/ReviewForm.tsx
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { ValidationErrors } from "~/data/types";

interface ReviewFormProps {
  review?: {
    id: string;
    comment: string;
    score: number;
  };
}

export default function ReviewForm({ review }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(review?.score || 0);
  const validationErrors = useActionData<ValidationErrors>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  const handleStarClick = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
  };

  return (
    <Form method="post">
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
              aria-label={`Set rating to ${index + 1} star${
                index === 0 ? "" : "s"
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
      {validationErrors && (
        <ul className="mb-4 list-inside list-disc text-red-500">
          {Object.values(validationErrors).map((error: string) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800"
        >
          {isSubmitting ? "Saving..." : "Save"}
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
