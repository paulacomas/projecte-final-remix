import React, { useState } from "react";
import { Form, Link } from "@remix-run/react";
import Replies from "./Replies";

interface Reply {
  id: string;
  user: {
    id: string;
    name: string;
  };
  response: string;
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  responses: Reply[];
}

interface CommentsProps {
  comments: Comment[];
  bookUserid: string;
  currentUserId: string;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  bookUserid,
  currentUserId,
}) => {
  const [openComment, setOpenComment] = useState<string | null>(null);

  const toggleReplies = (commentId: string) => {
    setOpenComment(openComment === commentId ? null : commentId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-medium">{comment.user.name}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-blue-700 hover:underline"
              >
                {openComment === comment.id ? "Hide Replies" : "Show Replies"}
              </button>
              <Link
                to={`response/add/${comment.id}`}
                className="px-4 py-1 bg-green-700 text-white rounded-lg hover:bg-green-900"
              >
                Add Reply
              </Link>
            </div>
          </div>
          <p className="text-gray-700 mb-2">{comment.content}</p>

          {(comment.user.id === currentUserId ||
            currentUserId === bookUserid) && (
            <div className="mt-4 flex space-x-4">
              <Link
                to={`comment/edit/${comment.id}`}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900"
              >
                Edit
              </Link>
              <Form method="post" action={`comment/delete/${comment.id}`}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900"
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
          )}

          {openComment === comment.id && (
            <Replies
              replies={comment.responses}
              commentId={comment.id}
              bookUserid={bookUserid}
              currentUserId={currentUserId}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
