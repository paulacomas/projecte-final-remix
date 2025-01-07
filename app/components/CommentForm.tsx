import { Form, Link } from "@remix-run/react";

interface CommentFormProps {
  comment?: {
    content: string;
    user_id: number;
    book_id: number;
  };
}

export default function CommentForm({ comment }: CommentFormProps) {
  return (
    <Form method="post">
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">
          Contenido
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={comment?.content || ""}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar
        </button>
        <Link
          to=".."
          className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancelar
        </Link>
      </div>
    </Form>
  );
}
