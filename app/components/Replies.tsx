import React from "react";
import { Form, Link } from "@remix-run/react";
import { Reply } from "~/data/types";

interface RepliesProps {
  replies: Reply[];
  commentId: string;
  bookUserid: string;
  currentUserId: string;
}

const Replies: React.FC<RepliesProps> = ({
  replies,
  commentId,
  bookUserid,
  currentUserId,
}) => {
  return (
    <div className="mt-4 ml-6">
      <h3 className="text-xl font-semibold">Replies</h3>
      {replies.length > 0 ? (
        replies.map((reply) => (
          <div key={reply.id} className="border-t border-gray-300 mt-2 pt-2">
            <p className="text-gray-600">
              {reply.user.name}: {reply.response}
            </p>
            {(reply.user.id === currentUserId ||
              currentUserId === bookUserid) && (
              <div className="mt-2 flex space-x-4">
                <Link
                  to={`response/edit/${reply.id}`}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900"
                >
                  Edit
                </Link>
                <Form method="post" action={`response/delete/${reply.id}`}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900"
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
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-2">No replies yet</p>
      )}
    </div>
  );
};
export default Replies;
