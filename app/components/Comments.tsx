import React from "react";
interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
}

interface CommentsProps {
  comments: Comment[];
  bookUserid: string;
  currentUserId: string; // Añadir el ID del usuario autenticado
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  bookUserid,
  currentUserId,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-semibold mb-4">Comments</h2>
    {comments.map((comment) => (
      <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center mb-2">
          <p className="text-lg font-medium">{comment.user.name}</p>
        </div>
        <p className="text-gray-700">{comment.content}</p>

        {(comment.user.id === currentUserId ||
          currentUserId === bookUserid) && (
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => onEdit(comment.id, comment.content)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default Comments;
