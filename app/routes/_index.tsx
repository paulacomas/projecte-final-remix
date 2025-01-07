import { useState, useEffect } from "react";
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BooksList from "../components/books"; // Asegúrate de importar correctamente el componente BooksList
import BookFilters from "~/components/BookFilters";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";

export async function loader({ request }) {
  const url = new URL(request.url);

  // Obtener los parámetros de búsqueda de la URL (query params)
  const title = url.searchParams.get("title") || "";
  const user = url.searchParams.get("user") || "";
  const category = url.searchParams.get("category") || "";
  const page = parseInt(url.searchParams.get("page") || "1"); // Página actual, por defecto es la 1

  const limit = 16; // Número de productos por página
  const offset = (page - 1) * limit; // Calcular el índice de inicio según la página

  try {
    const response = await fetch("http://localhost/api/books", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
    const data = await response.json();
    let books = data.data; // Todos los libros

    // Filtrar los libros en el servidor antes de devolverlos
    if (title) {
      books = books.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (user) {
      books = books.filter((book) =>
        book.user.name.toLowerCase().includes(user.toLowerCase())
      );
    }

    if (category) {
      books = books.filter(
        (book) => book.gender.toLowerCase() === category.toLowerCase()
      );
    }

    // Paginar los libros
    const totalBooks = books.length; // Total de libros filtrados
    const totalPages = Math.ceil(totalBooks / limit); // Calcular el número total de páginas
    books = books.slice(offset, offset + limit); // Seleccionar solo los libros para la página actual

    return {
      books,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    redirect("/error", {
      state: { error: "Error fetching books" },
    });
    return [];
  }
}

export default function Index() {
  const navigate = useNavigate();
  const { books, page, totalPages } = useLoaderData(); // Libros, página actual y total de páginas cargados desde el loader
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const categories = ["Fiction", "Non-Fiction", "Science", "Art"]; // Esto puede venir de tu API si es necesario

  // Función para actualizar la URL con los filtros
  const updateUrlWithFilters = (newTitle, newUser, newCategory, newPage) => {
    const queryParams = new URLSearchParams();
    if (newTitle) queryParams.set("title", newTitle);
    if (newUser) queryParams.set("user", newUser);
    if (newCategory) queryParams.set("category", newCategory);
    if (newPage) queryParams.set("page", newPage);

    // Actualizamos la URL sin recargar la página
    navigate(`?${queryParams.toString()}`);
  };

  // Manejar los cambios en los filtros
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateUrlWithFilters(newTitle, user, category, 1); // Reiniciar a la página 1
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUser = e.target.value;
    setUser(newUser);
    updateUrlWithFilters(title, newUser, category, 1); // Reiniciar a la página 1
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    updateUrlWithFilters(title, user, newCategory, 1); // Reiniciar a la página 1
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Los filtros ya se aplican cuando se actualiza la URL
  };

  // Navegar a la siguiente página
  const goToNextPage = () => {
    if (page < totalPages) {
      updateUrlWithFilters(title, user, category, page + 1);
    }
  };

  // Navegar a la página anterior
  const goToPreviousPage = () => {
    if (page > 1) {
      updateUrlWithFilters(title, user, category, page - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <div>
        <BookFilters
          title={title}
          user={user}
          category={category}
          categories={categories}
          onTitleChange={handleTitleChange}
          onUserChange={handleUserChange}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        {/* Mostrar la lista de libros filtrados */}
        <BooksList books={books} />

        {/* Paginación */}
        <div className="flex justify-center space-x-4 mt-8 bg-gray-200 py-4 ">
          <button
            onClick={goToPreviousPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="flex items-center">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
