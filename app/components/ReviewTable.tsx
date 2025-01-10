import { Form, Link } from "@remix-run/react";
import { Review } from "~/data/types";

interface ReviewsTableProps {
  reviews: Review[];
}

const ReviewsTable = ({ reviews }: ReviewsTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Book</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3">Content</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={review.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3">{review.id}</td>
                <td className="p-3">
                  <Link
                    to={`/profile/${review.user.name}`}
                    className="text-blue-500 hover:underline"
                  >
                    {review.user.name}
                  </Link>
                </td>
                <td className="p-3">
                  <Link
                    to={`/books/details/${review.book.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {review.book.title}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{review.score}</td>
                <td className="p-3 text-gray-600">{review.comment}</td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/admin/reviews/edit/${review.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/reviews/delete/${review.id}`}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-500 hover:underline"
                        onClick={(e) => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this review?"
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

export default ReviewsTable;
