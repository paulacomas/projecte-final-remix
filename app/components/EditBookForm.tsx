import React, { useState } from "react";

interface EditBookFormProps {
  book: {
    id: string;
    title: string;
    author: string;
    description: string;
    opinion?: string; // Nuevo campo para opinión
    review?: number; // Nuevo campo para review (calificación)
    gender: string; // Nuevo campo para género
    image_book?: string; // Nuevo campo para la imagen
  };
  onCancel: () => void;
  onSubmit: (updatedBook: {
    id: string;
    title: string;
    author: string;
    description: string;
    opinion?: string;
    review?: number;
    gender: string;
    image_book?: File | null;
  }) => void;
}

const EditBookForm: React.FC<EditBookFormProps> = ({
  book,
  onCancel,
  onSubmit,
}) => {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description);
  const [opinion, setOpinion] = useState(book.opinion || "");
  const [review, setReview] = useState(book.review || 1);
  const [gender, setGender] = useState(book.gender);
  const [imageBook, setImageBook] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Enviar los datos al controlador onSubmit, incluyendo todos los campos
    onSubmit({
      id: book.id,
      title,
      author,
      description,
      opinion,
      review,
      gender,
      image_book: imageBook,
    });
  };

  const handleCancel = () => {
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setOpinion(book.opinion || "");
    setReview(book.review || 1);
    setGender(book.gender);
    setImageBook(null); // Limpiar la imagen si es necesario
    onCancel(); // Llamamos a onCancel para cerrar el modal
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageBook(event.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h1 className="text-3xl font-semibold mb-4">Editar libro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Autor
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          ></textarea>
        </div>
        <div className="mt-4">
          <label
            htmlFor="opinion"
            className="block text-sm font-medium text-gray-700"
          >
            Opinión
          </label>
          <textarea
            id="opinion"
            name="opinion"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          ></textarea>
        </div>
        <div className="mt-4">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700"
          >
            Calificación (1 a 5)
          </label>
          <input
            type="number"
            id="review"
            name="review"
            min="1"
            max="5"
            value={review}
            onChange={(e) => setReview(Number(e.target.value))}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Género
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="image_book"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen del libro
          </label>
          <input
            type="file"
            id="image_book"
            name="image_book"
            onChange={handleImageChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
