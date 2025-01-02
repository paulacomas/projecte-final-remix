import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "~/data/data";

export default function LoggedInNavigation() {
  const [currentUser, setCurrentUser] = useState<any | null>(null); // Ajusta el tipo según tu estructura de datos
  const [searchQuery, setSearchQuery] = useState(""); // Para almacenar el valor del input de búsqueda
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Para manejar el error de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user from the API
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const userData = await fetchCurrentUser(token);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

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

  const handleSearch = () => {
    if (!searchQuery) {
      setErrorMessage("Please enter a search query");
      return;
    }

    // Redirigir a la nueva vista con los resultados de búsqueda
    navigate(`/user-search?name=${searchQuery}`);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-blue-500 font-bold">
          Dashboard
        </Link>

        {/* Campo de búsqueda de usuario */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar usuario"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Mensaje de error si no se encuentra el usuario */}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <div>
        <Link to="/my-books" className="text-lg font-semibold mr-4">
          My Books
        </Link>
        <Link
          to="/books/add"
          className="text-green-500 font-medium hover:underline mr-4"
        >
          Publish Book
        </Link>
        <Link
          to="/saved-books"
          className="text-blue-500 font-medium hover:underline mr-4"
        >
          Saved Books
        </Link>

        {/* Solo muestra el enlace de Profile si el usuario actual existe */}
        {currentUser && currentUser.id && (
          <Link
            to={`/profile/${currentUser.id}`}
            className="text-gray-600 mr-4"
          >
            Profile
          </Link>
        )}
        <button onClick={handleLogout} className="text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}
