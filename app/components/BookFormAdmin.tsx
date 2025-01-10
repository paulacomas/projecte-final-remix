import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
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
  const validationErrors = useActionData<ValidationErrors>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

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
          Genre
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
