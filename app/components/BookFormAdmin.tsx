import { Form, useNavigate } from "@remix-run/react";

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
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/admin/books");
  };

  return (
    <Form method="post">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={book.title}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={book.description}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="opinion" className="block text-gray-700">
          Opinión
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
          Género
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
          Reseña (1 a 5)
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
          Autor
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
      <div className="mb-4 flex justify-between">
        <button
          type="button"
          onClick={handleCancel}
          className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </div>
    </Form>
  );
}
