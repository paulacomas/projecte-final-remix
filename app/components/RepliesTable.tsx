import { Form, Link } from "@remix-run/react";

interface Reply {
  id: number;
  user: {
    name: string;
  };
  comment: {
    id: string;
    content: string;
  };
  content: string;
}

interface CommentsTableProps {
  replies: Reply[];
}

const RepliesTable = ({ replies }: CommentsTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">Commentari</th>
            <th className="text-left p-2 border border-gray-300">Usuario</th>
            <th className="text-left p-2 border border-gray-300">Resposta</th>
            <th className="text-left p-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {replies.map((reply) => (
            <tr key={reply.id}>
              <td className="p-2 border border-gray-300">
                {reply.comment.content}
              </td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/profile/${reply.user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {reply.user.name}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">{reply.response}</td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/admin/responses/edit/${reply.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Editar
                </Link>
                <Form
                  method="post"
                  action={`/admin/responses/delete/${reply.id}`}
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

export default RepliesTable;
