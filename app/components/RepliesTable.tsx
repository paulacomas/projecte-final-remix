import { Form, Link } from "@remix-run/react";
import { Reply } from "~/data/types";

interface CommentsTableProps {
  replies: Reply[];
}

const RepliesTable = ({ replies }: CommentsTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
              <th className="text-left p-3">Comment</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Reply</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {replies.map((reply, index) => (
              <tr
                key={reply.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3">{reply.comment.content}</td>
                <td className="p-3">
                  <Link
                    to={`/profile/${reply.user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {reply.user.name}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{reply.response}</td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/admin/responses/edit/${reply.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
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
                              "Are you sure you want to delete this reply?"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepliesTable;
