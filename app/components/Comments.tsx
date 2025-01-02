import React, { useState } from "react";

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
  onEdit: (commentId: string, response: string) => void;
  onDelete: (commentId: string) => void;
  onReplyEdit: (replyId: string, response: string) => void;
  onReplyDelete: (replyId: string) => void;
  onReplyAdd: (
    commentId: string,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  bookUserid,
  currentUserId,
  onEdit,
  onDelete,
  onReplyEdit,
  onReplyDelete,
  onReplyAdd,
}) => {
  const [openComment, setOpenComment] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<Reply | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

  const toggleReplies = (commentId: string) => {
    setOpenComment(openComment === commentId ? null : commentId);
  };

  const openReplyModal = (commentId: string) => {
    setActiveCommentId(commentId);
    setEditingReply(null);
    setReplyContent("");
    setModalOpen(true);
  };

  const openEditReplyModal = (reply: Reply) => {
    setEditingReply(reply);
    setReplyContent(reply.response);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCommentId(null);
    setEditingReply(null);
    setReplyContent("");
  };

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingReply) {
      onReplyEdit(editingReply.id, replyContent);
    } else if (activeCommentId) {
      onReplyAdd(activeCommentId, e);
    }
    closeModal();
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
                className="text-blue-500 hover:underline"
              >
                {openComment === comment.id ? "Hide Replies" : "Show Replies"}
              </button>
              <button
                onClick={() => openReplyModal(comment.id)}
                className="text-green-500 hover:underline"
              >
                Reply
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-2">{comment.content}</p>

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

          {openComment === comment.id && (
            <div className="mt-4 ml-6">
              <h3 className="text-xl font-semibold">Replies</h3>
              {comment.responses.map((reply) => (
                <div
                  key={reply.id}
                  className="border-t border-gray-300 mt-2 pt-2"
                >
                  <p className="text-gray-600">
                    {reply.user.name}: {reply.response}
                  </p>
                  {(reply.user.id === currentUserId ||
                    currentUserId === bookUserid) && (
                    <div className="mt-2 flex space-x-4">
                      <button
                        onClick={() => openEditReplyModal(reply)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onReplyDelete(reply.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">
              {editingReply ? "Edit Reply" : "Add Reply"}
            </h2>
            <form onSubmit={handleReplySubmit} className="flex flex-col">
              <textarea
                name="response"
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="p-2 border rounded-lg mb-4"
                placeholder="Write your reply here..."
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {editingReply ? "Save Changes" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
