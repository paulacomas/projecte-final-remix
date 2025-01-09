import React from "react";
import { Link } from "react-router-dom";

export default function DefaultNavigation() {
  return (
    <header className="bg-white shadow-md w-full">
      <div className="flex justify-between items-center p-2 pl-10 pr-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/public/logo.png"
              alt="Books Logo"
              className="w-24 h-24"
            />
          </Link>

          <button
            className="md:hidden text-2xl text-gray-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          <div className="flex gap-8 items-center">
            <Link
              to="/register"
              className="text-gray-600 font-medium hover:text-blue-700 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline transition"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>

      <div className="md:hidden bg-white border-t shadow-md">
        <nav className="flex flex-col gap-4 p-4">
          <Link
            to="/register"
            className="text-gray-600 font-medium hover:text-blue-700 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="text-blue-700 font-medium hover:underline transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
