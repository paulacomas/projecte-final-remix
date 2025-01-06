import { LoaderFunction } from "@remix-run/node";
import { Form, json, Link, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import CommentsTable from "~/components/CommentsTable";
import Navigation from "~/components/Layout";
import { fetchComments } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  try {
    const comments = await fetchComments(token);
    const cookieHeader = request.headers.get("Cookie");
    const flashMessage = cookieHeader
      ? await flashMessageCookie.parse(cookieHeader)
      : null;
    return json({ comments: comments.data, flashMessage }); // Retorna los usuarios para la vista
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { error: "No se pudieron obtener los usuarios." };
  }
}

export default function AdminComments() {
  const { comments, error, flashMessage } = useLoaderData();
  const [showFlashMessage, setShowFlashMessage] = useState<boolean>(false);
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
  }, [flashMessage]);

  if (error) {
    return <div className="text-red-500">{data.error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>

      <h1 className="text-2xl font-bold mb-4 m-4 p-4">Gestionar Comments</h1>
      {showFlashMessage && flashMessage && (
        <div className="p-4 bg-green-200 text-green-800 rounded-md mb-4">
          {flashMessage}
        </div>
      )}
      {comments.length === 0 ? (
        <p>No hay comments disponibles.</p>
      ) : (
        <CommentsTable comments={comments} /> // Componente de tabla para mostrar usuarios
      )}
      <Outlet />
    </div>
  );
}
