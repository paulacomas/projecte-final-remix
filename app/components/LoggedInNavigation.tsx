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
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=lax;";

      navigate("/login?success=Logged%20out%20successfully");
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
    setErrorMessage(null);
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="flex justify-between items-center p-2 pl-10 pr-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/public/logo.png"
              alt="Books Logo"
              className="w-20 h-20"
            />
          </Link>
        </div>

        <button
          className="md:hidden text-2xl text-gray-600 focus:outline-none ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        <nav className="hidden md:flex gap-8 items-center">
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
          <div className="flex items-center gap-4">
            {searchOpen ? (
              <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-md bg-white">
                <input
                  type="text"
                  placeholder="Search user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none flex-1"
                />
                <button
                  onClick={handleSearch}
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                  Search
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
                <span>Search user</span>
              </button>
            )}
          </div>

          <Link
            to="/my-books"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            My Books
          </Link>
          <Link
            to="/books/add"
            className="text-green-700 font-medium hover:text-green-900 transition"
          >
            Publish Book
          </Link>
          <Link
            to="/saved-books"
            className="text-blue-700 font-medium hover:text-blue-800 transition"
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
          <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-md bg-white">
            <input
              type="text"
              placeholder="Search user"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none flex-1"
            />
            <button
              onClick={handleSearch}
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Search
            </button>
            <button
              onClick={() => setSearchOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
          <Link
            to="/my-books"
            className="text-gray-700 font-medium hover:text-blue-500 transition"
          >
            My Books
          </Link>
          <Link
            to="/books/add"
            className="text-green-700 font-medium hover:text-green-900 transition"
          >
            Publish Book
          </Link>
          <Link
            to="/saved-books"
            className="text-blue-700 font-medium hover:text-blue-900 transition"
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
            className="text-red-700 font-medium hover:underline transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
