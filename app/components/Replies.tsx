import React, { useState } from "react";
import { Form, Link } from "@remix-run/react";

interface Reply {
  id: string;
  user: {
    id: string;
    name: string;
  };
  response: string;
}

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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </Link>
                <Form method="post" action={`response/delete/${reply.id}`}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={(e) => {
                      if (
                        !window.confirm(
                          "¿Estás seguro de que deseas eliminar esta respuesta?"
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Eliminar
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
