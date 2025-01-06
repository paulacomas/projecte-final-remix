import { Form } from "@remix-run/react";

interface CommentFormProps {
  reply?: {
    response: string;
    user_id: number;
    book_id: number;
  };
}

export default function ResponseForm({ reply }: CommentFormProps) {
  return (
    <Form method="post">
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700">
          Contenido
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={reply?.response || ""}
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
        <a
          href="/admin/responses"
          className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancelar
        </a>
      </div>
    </Form>
  );
}
