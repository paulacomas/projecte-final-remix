import { Form, Link } from "@remix-run/react";

interface Review {
  id: number;
  user: {
    name: string;
  };
  book: {
    title: string;
  };
  rating: number;
  content: string;
}

interface ReviewsTableProps {
  reviews: Review[];
}

const ReviewsTable = ({ reviews }: ReviewsTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">ID</th>
            <th className="text-left p-2 border border-gray-300">Usuario</th>
            <th className="text-left p-2 border border-gray-300">Libro</th>
            <th className="text-left p-2 border border-gray-300">Puntuación</th>
            <th className="text-left p-2 border border-gray-300">Contenido</th>
            <th className="text-left p-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="p-2 border border-gray-300">{review.id}</td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/profile/${review.user.name}`}
                  className="text-blue-500 hover:underline"
                >
                  {review.user.name}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/books/details/${review.book.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {review.book.title}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">{review.score}</td>
              <td className="p-2 border border-gray-300">{review.comment}</td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/admin/reviews/edit/${review.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Editar
                </Link>
                <Form
                  method="post"
                  action={`/admin/reviews/delete/${review.id}`}
                  className="inline"
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      if (
                        !window.confirm(
                          "¿Estás seguro de que deseas eliminar esta reseña?"
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

export default ReviewsTable;
