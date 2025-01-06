import { LoaderFunction } from "@remix-run/node";
import { json, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/Layout";
import RepliesTable from "~/components/RepliesTable";
import { fetchReplies } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  try {
    const replies = await fetchReplies(token);
    const cookieHeader = request.headers.get("Cookie");
    const flashMessage = cookieHeader
      ? await flashMessageCookie.parse(cookieHeader)
      : null;
    return json({ replies: replies.data, flashMessage });
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    return { error: "No se pudieron obtener las respuestas." };
  }
}

export default function AdminReplies() {
  const { replies, error, flashMessage } = useLoaderData();
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
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <h1 className="text-2xl font-bold mb-4 m-4 p-4">Gestionar Replies</h1>
      {showFlashMessage && flashMessage && (
        <div className="p-4 bg-green-200 text-green-800 rounded-md mb-4">
          {flashMessage}
        </div>
      )}
      {replies.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <RepliesTable replies={replies} />
      )}
      <Outlet />
    </div>
  );
}
