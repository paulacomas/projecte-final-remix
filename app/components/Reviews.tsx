import React from "react";

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
  currentUserId: string; // Añadir el ID del usuario autenticado
  onEdit: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
}

const Reviews: React.FC<ReviewsProps> = ({
  reviews,
  bookUserid,
  currentUserId,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
    {reviews.map((review) => (
      <div key={review.id} className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center mb-2">
          <p className="text-lg font-medium">{review.user?.name}</p>
          <p className="ml-4 text-sm text-gray-500">{review.score} / 5</p>
        </div>
        <p className="text-gray-700">{review.comment}</p>

        {(review.user?.id === currentUserId ||
          currentUserId === bookUserid) && (
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => onEdit(review.id, review.comment, review.score)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review.id)}
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

export default Reviews;
