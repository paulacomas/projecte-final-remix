import { LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, Outlet, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import BooksTable from "~/components/BooksTable";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";
import { fetchBooks, fetchCurrentUser } from "~/data/data"; // Asume que tienes un servicio para obtener libros
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies"; // Importar la cookie

// Loader para obtener los libros
export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("No tienes permiso");
  }
  try {
    const books = await fetchBooks();

    return json({ books: books.data });
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return json({ error: "No se pudieron obtener los libros." });
  }
};

export default function AdminBooks() {
  const { books, error } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

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

      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

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
