import React from "react";
import StarRating from "./StarRating";
import { Form, Link } from "@remix-run/react";

interface Review {
  id: string;
  user?: {
    id: string;
    name?: string;
  };
  score: number;
  comment: string;
}

interface ReviewsProps {
  reviews: Review[];
  bookUserid: string;
  currentUserId: string;
}

const Reviews: React.FC<ReviewsProps> = ({
  reviews,
  bookUserid,
  currentUserId,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
    {reviews.map((review) => (
      <div key={review.id} className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center mb-2">
          <p className="text-lg font-medium">{review.user?.name}</p>
          <div className="ml-4 flex items-center">
            <StarRating score={review.score} />
          </div>
        </div>
        <p className="text-gray-700">{review.comment}</p>

        {(review.user?.id === currentUserId ||
          currentUserId === bookUserid) && (
          <div className="mt-4 flex space-x-4">
            <Link
              to={`review/edit/${review.id}`}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              Edit
            </Link>
            <Form
              method="post"
              action={`review/delete/${review.id}`}
              className="inline"
            >
              <button
                type="submit"
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
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
        )}
      </div>
    ))}
  </div>
);

export default Reviews;
