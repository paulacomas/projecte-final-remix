import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
interface ValidationErrors {
  [key: string]: string; // Clau string i valor string
}

interface CommentFormProps {
  comment?: {
    content: string;
    user_id: number;
    book_id: number;
  };
}

export default function CommentForm({ comment }: CommentFormProps) {
  const validationErrors = useActionData<ValidationErrors>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <Form method="post">

      <h2 className="text-2xl font-bold mb-4">
        {comment ? "Edit Comment" : "Add Comment"}
      </h2>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={comment?.content || ""}
          className="w-full p-2 border border-gray-300 rounded"
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
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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
