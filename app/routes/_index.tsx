import { useLoaderData } from "@remix-run/react";
import BooksList from "../components/books"; // Asegúrate de importar correctamente el componente BooksList

export async function loader() {
  try {
    const response = await fetch("http://localhost/api/books", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default function Index() {
  const books = useLoaderData(); // Los libros cargados por el loader

  return <BooksList books={books} />; // Pasa los datos a BooksList
}
