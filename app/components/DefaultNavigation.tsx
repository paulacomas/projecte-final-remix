import React from "react";
import { Link } from "react-router-dom";

export default function DefaultNavigation() {
  return (
    <div className="flex justify-between items-center">
      <Link to="/" className="text-blue-500 font-bold">
        Home
      </Link>
      <div>
        <Link to="/register" className="text-gray-600 mr-4">
          Register
        </Link>
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </div>
    </div>
  );
}
