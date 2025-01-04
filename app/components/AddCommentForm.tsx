import React, { useState, useEffect } from "react";

interface AddCommentFormProps {
  bookId: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  commentData?: { content: string }; // Recibe los datos del comentario si es edición
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  bookId,
  onClose,
  onSubmit,
  commentData,
}) => {
  const [content, setContent] = useState<string>(commentData?.content || "");

  useEffect(() => {
    if (commentData) {
      setContent(commentData.content);
    }
  }, [commentData]);

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Comment Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {commentData ? "Update Comment" : "Add Comment"}
        </button>
      </div>
    </form>
  );
};

export default AddCommentForm;
