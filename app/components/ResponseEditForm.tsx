import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { ValidationErrors } from "~/data/types";

interface CommentFormProps {
  reply?: {
    response: string;
    user_id: number;
    book_id: number;
  };
}

export default function ResponseForm({ reply }: CommentFormProps) {
  const validationErrors = useActionData<ValidationErrors>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <Form method="post">
      <h2 className="text-2xl font-bold mb-4">
        {reply ? "Edit Reply" : "Add Reply"}
      </h2>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={reply?.response || ""}
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
