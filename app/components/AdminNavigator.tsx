import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchCurrentUser } from "~/data/data";

export default function AdminNavigation() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const userData = await fetchCurrentUser(token);
        setCurrentUser(userData);
      } catch (error) {
        throw new Error("Error fectching user");
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

      localStorage.removeItem("token");
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      navigate("/login?success=Logout%20hecho%20correctamente");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setErrorMessage("Please enter a search query");
      return;
    }

    navigate(`/user-search?name=${searchQuery}`);
    setSearchOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-2 bg-white">
      {/* Contenedor de la barra de navegación */}
      <div className="flex items-center gap-4 w-full justify-between md:w-auto">
        {/* Enlace de Dashboard */}
        <Link
          to="/"
          className="text-blue-500 font-bold text-xl sm:text-lg md:text-xl"
        >
          Books
        </Link>

        {/* Botón para abrir el menú en dispositivos móviles */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menú desplegable en dispositivos móviles */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } absolute top-16 left-0 right-0 bg-white md:hidden p-4`}
      >
        <div className="flex flex-col gap-4">
          {/* Opciones de gestión */}
          <Link to="/admin/books" className="text-lg font-semibold">
            Gestionar Libros
          </Link>
          <Link to="/admin/users" className="text-lg font-semibold">
            Gestionar Usuarios
          </Link>
          <Link to="/adimin/comments" className="text-lg font-semibold">
            Gestionar Comentarios
          </Link>
          <Link to="/admin/reviews" className="text-lg font-semibold">
            Gestionar Reseñas
          </Link>
          <Link to="/admin/replys" className="text-lg font-semibold">
            Gestionar Respuestas
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menú de navegación siempre visible en pantallas grandes */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex gap-4">
          {/* Opciones de gestión */}
          <Link to="/admin/books" className="text-lg font-semibold">
            Gestionar Libros
          </Link>
          <Link to="/admin/users" className="text-lg font-semibold">
            Gestionar Usuarios
          </Link>
          <Link to="/admin/comments" className="text-lg font-semibold">
            Gestionar Comentarios
          </Link>
          <Link to="/admin/reviews" className="text-lg font-semibold">
            Gestionar Reseñas
          </Link>
          <Link to="/admin/responses" className="text-lg font-semibold">
            Gestionar Respuestas
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
