import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchCurrentUser } from "~/data/data";

export default function LoggedInNavigation() {
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
          Dashboard
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
          {/* Formulario de búsqueda */}
          <div className="flex items-center gap-4 mb-4">
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
            <button
              onClick={() => setSearchOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <Link to="/my-books" className="text-lg font-semibold">
            My Books
          </Link>
          <Link
            to="/books/add"
            className="text-green-500 font-medium hover:underline"
          >
            Publish Book
          </Link>
          <Link
            to="/saved-books"
            className="text-blue-500 font-medium hover:underline"
          >
            Saved Books
          </Link>
          {currentUser && currentUser.id && (
            <Link to={`/profile/${currentUser.id}`} className="text-gray-600">
              Profile
            </Link>
          )}
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
        {/* Links de navegación */}
        <div className="flex items-center gap-4">
          {/* Ícono de búsqueda */}
          {searchOpen ? (
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-md bg-white">
              <input
                type="text"
                placeholder="Buscar usuario"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none flex-1"
              />
              <button
                onClick={handleSearch}
                className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              >
                Buscar
              </button>
              <button
                onClick={() => setSearchOpen(false)} // Cierra la barra al hacer clic
                className="text-gray-500 hover:text-red-500"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
            >
              <FontAwesomeIcon icon={faSearch} size="lg" />
              <span>Search Users</span>
            </button>
          )}

          <Link to="/my-books" className="text-lg font-semibold">
            My Books
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            to="/books/add"
            className="text-green-500 font-medium hover:underline"
          >
            Publish Book
          </Link>
          <Link
            to="/saved-books"
            className="text-blue-500 font-medium hover:underline"
          >
            Saved Books
          </Link>
          {currentUser && currentUser.id && (
            <Link to={`/profile/${currentUser.id}`} className="text-gray-600">
              Profile
            </Link>
          )}
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
