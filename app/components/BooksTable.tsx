import { Link, Form } from "@remix-run/react";

interface Book {
  id: number;
  title: string;
  description: string;
  opinion: string;
  gender: string;
  review: string;
  image_book: string;
  author: string;
  user: User;
}

interface BooksTableProps {
  books: Book[];
}

const BooksTable = ({ books }: BooksTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      {/* Contenedor con fondo blanco y margen */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">Usuario</th>
            <th className="text-left p-2 border border-gray-300">Título</th>
            <th className="text-left p-2 border border-gray-300">
              Descripción
            </th>
            <th className="text-left p-2 border border-gray-300">Opinión</th>
            <th className="text-left p-2 border border-gray-300">Género</th>
            <th className="text-left p-2 border border-gray-300">Reseña</th>
            <th className="text-left p-2 border border-gray-300">Autor</th>
            <th className="text-left p-2 border border-gray-300">Imagen</th>
            <th className="text-left p-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/profile/${book.user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {book.user.name}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/books/details/${book.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {book.title}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">{book.description}</td>
              <td className="p-2 border border-gray-300">{book.opinion}</td>
              <td className="p-2 border border-gray-300">{book.gender}</td>
              <td className="p-2 border border-gray-300">{book.review}</td>
              <td className="p-2 border border-gray-300">{book.author}</td>
              <td className="p-2 border border-gray-300">
                {book.image_book ? (
                  <img
                    src={book.image_book}
                    alt={book.title}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <span>No imagen</span>
                )}
              </td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/admin/books/edit/${book.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Editar
                </Link>

                {/* Formulario para eliminar el libro */}
                <Form
                  method="post"
                  action={`/admin/books/delete/${book.id}`}
                  className="inline"
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      if (
                        !window.confirm(
                          "¿Estás seguro de que deseas eliminar este libro?"
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTable;
