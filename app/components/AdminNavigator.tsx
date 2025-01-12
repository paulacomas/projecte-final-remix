import React, { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { FaBars, FaTimes } from "react-icons/fa";
import { logout } from "~/data/data";

export default function AdminNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login?success=Logged%20out%20successfully");
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="flex justify-between items-center p-2 pl-10 pr-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Books Logo"
              className="w-20 h-20"
            />
          </Link>
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            List of books
          </Link>
        </div>

        <button
          className="md:hidden text-2xl text-gray-600 focus:outline-none ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú principal */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            to="/admin/books"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Books
          </Link>
          <Link
            to="/admin/users"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/comments"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Comments
          </Link>
          <Link
            to="/admin/reviews"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Reviews
          </Link>
          <Link
            to="/admin/responses"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Responses
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-700 font-medium hover:underline transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Menú desplegable móvil */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } md:hidden bg-white border-t shadow-md`}
      >
        <nav className="flex flex-col gap-4 p-4">
          <Link
            to="/admin/books"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Books
          </Link>
          <Link
            to="/admin/users"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/comments"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Comments
          </Link>
          <Link
            to="/admin/reviews"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Reviews
          </Link>
          <Link
            to="/admin/responses"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            Manage Responses
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-700 font-medium hover:underline transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
