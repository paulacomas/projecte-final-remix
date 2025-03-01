import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { ValidationErrors } from "~/data/types";

interface BookFormProps {
  book: {
    id: string;
    title: string;
    description: string;
    opinion: string;
    gender: string;
    review: number;
    image_book: string;
    author: string;
  };
}

export default function BookFormAdmin({ book }: BookFormProps) {
  const [review, setReview] = useState<number>(book?.review || 0);
  const validationErrors = useActionData<ValidationErrors>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const handleStarClick = (index: number) => {
    const newReview = index + 1;
    setReview(newReview);
  };

  return (
    <Form method="post">
      <h2 className="text-2xl font-bold mb-4">
        {book ? "Edit Book" : "Add Book"}
      </h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={book.title}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={book.description}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="opinion" className="block text-gray-700">
          Opinion
        </label>
        <textarea
          id="opinion"
          name="opinion"
          defaultValue={book.opinion}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gender" className="block text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          defaultValue={book.gender || ""}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select a gender</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Romance">Romance</option>
          <option value="Terror">Terror</option>
          <option value="Action">Action</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <input type="hidden" name="review" value={review} />

      <div className="mb-4">
        <label htmlFor="author" className="block text-gray-700">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          defaultValue={book.author}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="review"
          className="block text-sm font-medium text-gray-700"
        >
          Review
        </label>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleStarClick(index)}
              className={`w-8 h-8 ${
                index < review ? "text-blue-500" : "text-gray-300"
              }`}
              aria-label={`Set rating to ${index + 1} star${
                index === 0 ? "" : "s"
              }`}
            >
              <FaStar />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">{review} / 5</p>
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
          className="py-2 px-4 bg-blue-700 text-white rounded hover:bg-blue-800"
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
