import React from "react";
import { Form } from "@remix-run/react";

interface BookActionsProps {
  bookId: string;
  isOwner: boolean;
  onEdit: () => void;
}

const BookActions: React.FC<BookActionsProps> = ({
  bookId,
  isOwner,
  onEdit,
}) => {
  if (!isOwner) return null;

  return (
    <div className="flex space-x-4 mb-8">
      <button
        onClick={onEdit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Edit Book
      </button>
      <Form method="POST" action={`/books/${bookId}`}>
        <input type="hidden" name="action" value="delete" />
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Book
        </button>
      </Form>
    </div>
  );
};

export default BookActions;
