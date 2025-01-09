import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { validateCommentContent } from "~/util/validations";

interface CommentFormProps {
  comment?: {
    content: string;
    user_id: number;
    book_id: number;
  };
}

export default function CommentForm({ comment }: CommentFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    const validationError = validateCommentContent(content);
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
      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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
