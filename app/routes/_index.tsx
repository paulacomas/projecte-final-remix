import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import BooksList from "../components/books"; // Asegúrate de importar correctamente el componente BooksList
import BookFilters from "~/components/BookFilters";
import Navigation from "~/components/Layout";

export async function loader() {
  try {
    const response = await fetch("http://localhost/api/books", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data; // Retornar todos los libros
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default function Index() {
  const allBooks = useLoaderData(); // Todos los libros cargados por el loader
  const [filteredBooks, setFilteredBooks] = useState(allBooks); // Libros filtrados
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Fiction", "Non-Fiction", "Science", "Art"]; // Esto puede venir de tu API si es necesario

  // Filtrar libros cuando los filtros cambian
  useEffect(() => {
    const applyFilters = () => {
      let filtered = allBooks;

      if (title) {
        filtered = filtered.filter((book) =>
          book.title.toLowerCase().includes(title.toLowerCase())
        );
      }

      if (user) {
        filtered = filtered.filter((book) =>
          book.user.name.toLowerCase().includes(user.toLowerCase())
        );
      }

      if (category) {
        filtered = filtered.filter(
          (book) => book.gender.toLowerCase() === category.toLowerCase()
        );
      }

      setFilteredBooks(filtered);
    };

    applyFilters(); // Aplicar los filtros al cargar o cambiar cualquiera de los estados
  }, [title, user, category, allBooks]); // Dependencias para volver a aplicar filtros cuando cambian los valores
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    // Los filtros ya se aplican automáticamente en el useEffect
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

        {/* Mostrar la lista de libros filtrados */}
        <BooksList books={filteredBooks} />
      </div>
    </div>
  );
}
