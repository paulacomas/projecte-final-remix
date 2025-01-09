// components/BookFormAdmin.tsx
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import {
  validateTitle,
  validateDescription,
  validateGender,
  validateAuthor,
  validateReview,
} from "~/util/validations"; // Importamos las funciones de validación

interface BookFormProps {
  book: {
    id: number;
    title: string;
    description: string;
    opinion: string;
    gender: string;
    review: string;
    image_book: string;
    author: string;
  };
}

export default function BookFormAdmin({ book }: BookFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);

    let validationError = validateTitle(formData.get("title") as string);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateDescription(
      formData.get("description") as string
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateGender(formData.get("gender") as string);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateAuthor(formData.get("author") as string);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateReview(formData.get("review") as string);
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
          Genre
        </label>
        <input
          type="text"
          id="gender"
          name="gender"
          defaultValue={book.gender}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="review" className="block text-gray-700">
          Review (1 to 5)
        </label>
        <input
          type="number"
          id="review"
          name="review"
          min="1"
          max="5"
          defaultValue={book.review}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

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

      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
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
