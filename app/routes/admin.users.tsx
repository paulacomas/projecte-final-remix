// routes/admin/users/index.tsx
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, Outlet, json } from "@remix-run/react";
import UsersTable from "~/components/UsersTable";
import Navigation from "~/components/Layout";
import { fetchUsers } from "~/data/data"; // Supongamos que tienes un servicio para obtener usuarios
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";
import { useEffect, useState } from "react";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  try {
    const users = await fetchUsers(token);
    const cookieHeader = request.headers.get("Cookie");
    const flashMessage = cookieHeader
      ? await flashMessageCookie.parse(cookieHeader)
      : null;
    return json({ users: users.data.users, flashMessage }); // Retorna los usuarios para la vista
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { error: "No se pudieron obtener los usuarios." };
  }
}

export default function AdminUsers() {
  const { users, error, flashMessage } = useLoaderData();
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
    return <div className="p-4 text-red-500">{data.error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>

      <h1 className="text-2xl font-bold mb-4 m-4 p-4">Gestionar Usuarios</h1>
      {showFlashMessage && flashMessage && (
        <div className="p-4 bg-green-200 text-green-800 rounded-md mb-4">
          {flashMessage}
        </div>
      )}
      {users.length === 0 ? (
        <p>No hay usuarios disponibles.</p>
      ) : (
        <UsersTable users={users} /> // Componente de tabla para mostrar usuarios
      )}
      <Outlet />
    </div>
  );
}
