import { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  bookTitle: string;
  bookAuthor: string;
  bookDescription: string;
  bookOpinion: string;
  bookReview: number;
  bookGender: string;
  bookImageBook: string; // Recibe la imagen actual del libro
}

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  bookTitle,
  bookAuthor,
  bookDescription,
  bookOpinion,
  bookReview,
  bookGender,
  bookImageBook, // Imagen recibida del libro
}: ModalProps) => {
  const [title, setTitle] = useState(bookTitle);
  const [author, setAuthor] = useState(bookAuthor);
  const [description, setDescription] = useState(bookDescription);
  const [opinion, setOpinion] = useState(bookOpinion);
  const [review, setReview] = useState(bookReview);
  const [gender, setGender] = useState(bookGender);
  const [imageBook, setImageBook] = useState<File | null>(null); // Estado para la nueva imagen
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Cuando el modal se abre, se asegura que los estados tengan los valores iniciales del libro
    setTitle(bookTitle);
    setAuthor(bookAuthor);
    setDescription(bookDescription);
    setOpinion(bookOpinion);
    setReview(bookReview);
    setGender(bookGender);
    setImageBook(null); // Resetear la imagen cada vez que el modal se abre
  }, [
    isOpen,
    bookTitle,
    bookAuthor,
    bookDescription,
    bookOpinion,
    bookReview,
    bookGender,
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = "Title is required";
    if (!author) newErrors.author = "Author is required";
    if (!description) newErrors.description = "Description is required";
    if (!gender) newErrors.gender = "Genre is required";
    if (review < 1 || review > 5)
      newErrors.review = "Review should be between 1 and 5";

    // Validar tipo de archivo de imagen
    if (imageBook && !imageBook.type.startsWith("image")) {
      newErrors.image_book = "The selected file must be an image.";
    }

    setErrors(newErrors);

    // Si no hay errores, enviar los datos
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("description", description);
      formData.append("opinion", opinion);
      formData.append("review", review);
      formData.append("gender", gender);

      // Si el usuario ha subido una nueva imagen, agregarla a los datos
      if (imageBook) {
        formData.append("image_book", imageBook);
      } else {
        // Si no se ha subido una nueva imagen, mantener la imagen original
        formData.append("image_book", bookImageBook);
      }

      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="author">
              Author
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="opinion">
              Opinion (optional)
            </label>
            <textarea
              id="opinion"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="review">
              Rating (1-5)
            </label>
            <input
              id="review"
              type="number"
              value={review}
              onChange={(e) => setReview(Number(e.target.value))}
              min="1"
              max="5"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.review && (
              <p className="text-red-500 text-sm">{errors.review}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="gender">
              Genre
            </label>
            <input
              id="gender"
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="image_book"
            >
              Book Image (optional)
            </label>
            <input
              id="image_book"
              type="file"
              onChange={(e) =>
                setImageBook(e.target.files ? e.target.files[0] : null)
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
            {imageBook && (
              <img
                src={URL.createObjectURL(imageBook)}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover"
              />
            )}
            {!imageBook && bookImageBook && (
              <img
                src={bookImageBook}
                alt="Current Book Image"
                className="mt-2 h-24 w-24 object-cover"
              />
            )}
            {errors.image_book && (
              <p className="text-red-500 text-sm">{errors.image_book}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
