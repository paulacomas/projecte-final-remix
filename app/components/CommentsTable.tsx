import { Form, Link } from "@remix-run/react";
import { Comment } from "~/data/types";

interface CommentsTableProps {
  comments: Comment[];
}

const CommentsTable = ({ comments }: CommentsTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Book</th>
              <th className="text-left p-3">Content</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr
                key={comment.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3">{comment.id}</td>
                <td className="p-3">
                  <Link
                    to={`/profile/${comment.user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {comment.user.name}
                  </Link>
                </td>
                <td className="p-3">
                  <Link
                    to={`/books/details/${comment.book.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {comment.book.title}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{comment.content}</td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/admin/comments/edit/${comment.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
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
                              "Are you sure you want to delete this comment?"
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

export default CommentsTable;
