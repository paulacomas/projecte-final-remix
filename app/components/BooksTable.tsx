import { Link, Form } from "@remix-run/react";
import { Book } from "~/data/types";
import StarRating from "./StarRating";

interface BooksTableProps {
  books: Book[];
}

const BooksTable = ({ books }: BooksTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <div className=" max-w-full overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Description</th>
              <th className="text-left p-3">Opinion</th>
              <th className="text-left p-3">Gender</th>
              <th className="text-left p-3">Review</th>
              <th className="text-left p-3">Author</th>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr
                key={book.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3">
                  <Link
                    to={`/profile/${book.user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {book.user.name}
                  </Link>
                </td>
                <td className="p-3">
                  <Link
                    to={`/books/details/${book.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {book.title}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{book.description}</td>
                <td className="p-3 text-gray-600">{book.opinion}</td>
                <td className="p-3 text-gray-600">{book.gender}</td>
                <td className="p-3 text-gray-600"><StarRating score={book.review} /></td>
                <td className="p-3 text-gray-600">{book.author}</td>
                <td className="p-3">
                  {book.image_book ? (
                    <img
                      src={book.image_book}
                      alt={book.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No image</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/admin/books/edit/${book.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/books/delete/${book.id}`}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-500 hover:underline"
                        onClick={(e) => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this book?"
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

export default BooksTable;
