import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  score: number;
}

const StarRating: React.FC<StarRatingProps> = ({ score }) => {
  const totalStars = 5;
  return (
    <div className="flex">
      {Array.from({ length: totalStars }, (_, index) => (
        <FaStar
          key={index}
          className={`w-5 h-5 ${
            index < score ? "text-blue-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
