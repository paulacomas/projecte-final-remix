import { LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import BooksTable from "~/components/BooksTable";
import Navigation from "~/components/Layout";
import { fetchBooks } from "~/data/data"; // Asume que tienes un servicio para obtener libros
import { flashMessageCookie } from "~/helpers/cookies"; // Importar la cookie

// Loader para obtener los libros
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const books = await fetchBooks();

    // Leer la cookie para obtener el mensaje flash
    const cookieHeader = request.headers.get("Cookie");
    const flashMessage = cookieHeader
      ? await flashMessageCookie.parse(cookieHeader)
      : null;

    return json({ books: books.data, flashMessage });
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return json({ error: "No se pudieron obtener los libros." });
  }
};

export default function AdminBooks() {
  const { books, error, flashMessage } = useLoaderData();

  // Usar un estado para controlar si mostrar el mensaje flash
  const [showFlashMessage, setShowFlashMessage] = useState<boolean>(false);

  // Manejar el efecto después de la carga
  useEffect(() => {
    if (flashMessage) {
      setShowFlashMessage(true); // Mostrar el mensaje flash

      // Establecer el temporizador para ocultarlo después de 3 segundos
      const timer = setTimeout(() => {
        setShowFlashMessage(false); // El mensaje se elimina después de 3 segundos
      }, 3000);

      // Limpiar el temporizador cuando el componente se desmonte
      return () => clearTimeout(timer);
    }
  }, [flashMessage]); // Dependencia en `flashMessage` para ejecutar el efecto cuando cambie

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>

      <h1 className="text-2xl font-bold mb-4 m-4 p-4">Gestionar Libros</h1>
      <div className="flex gap-4 mb-4 m-4 p-4">
        <Link
          to="/books/add"
          className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          Agregar Nuevo Libro
        </Link>
      </div>

      {/* Mostrar el mensaje flash si existe */}
      {showFlashMessage && flashMessage && (
        <div className="p-4 bg-green-200 text-green-800 rounded-md mb-4">
          {flashMessage}
        </div>
      )}

      {books.length === 0 ? (
        <p>No hay libros disponibles.</p>
      ) : (
        <BooksTable books={books} />
      )}

      {/* Aquí agregamos el Outlet para las rutas hijas */}
      <Outlet />
    </div>
  );
}
