import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoggedInNavigation() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      console.log(token);

      const res = await fetch("http://localhost/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to log out");
      }

      // Eliminar el token del almacenamiento local
      localStorage.removeItem("token");
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirigir al login
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Link to="/" className="text-blue-500 font-bold">
        Dashboard
      </Link>
      <div>
        <Link to="/my-books" className="text-lg font-semibold  mr-4">
          My Books
        </Link>
        <Link
          to="/books/add"
          className="text-green-500 font-medium hover:underline mr-4"
        >
          Publish Book
        </Link>
        <Link to="#" className="text-gray-600 mr-4">
          Profile
        </Link>
        <Link to="#" className="text-gray-600 mr-4">
          Settings
        </Link>
        <button onClick={handleLogout} className="text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}
