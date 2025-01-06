import { Form, Link } from "@remix-run/react";

interface Comment {
  id: number;
  user: {
    name: string;
  };
  book: {
    title: string;
  };
  content: string;
}

interface CommentsTableProps {
  comments: Comment[];
}

const CommentsTable = ({ comments }: CommentsTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">ID</th>
            <th className="text-left p-2 border border-gray-300">Usuario</th>
            <th className="text-left p-2 border border-gray-300">Libro</th>
            <th className="text-left p-2 border border-gray-300">Contenido</th>
            <th className="text-left p-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td className="p-2 border border-gray-300">{comment.id}</td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/profile/${comment.user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {comment.user.name}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/books/details/${comment.book.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {comment.book.title}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">{comment.content}</td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/admin/comments/edit/${comment.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Editar
                </Link>
                <Form
                  method="post"
                  action={`/admin/comments/delete/${comment.id}`}
                  className="inline"
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      if (
                        !window.confirm(
                          "¿Estás seguro de que deseas eliminar este comentario?"
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

export default CommentsTable;
