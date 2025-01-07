// routes/admin/users/index.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  Outlet,
  json,
  useSearchParams,
} from "@remix-run/react";
import UsersTable from "~/components/UsersTable";
import Navigation from "~/components/Layout";
import { fetchCurrentUser, fetchUsers } from "~/data/data"; // Supongamos que tienes un servicio para obtener usuarios
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";
import { useEffect, useState } from "react";
import Notification from "~/components/Notification";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("No tienes permiso");
  }
  try {
    const users = await fetchUsers(token);
    return json({ users: users.data.users }); // Retorna los usuarios para la vista
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
}

export default function AdminUsers() {
  const { users, error } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");
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
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      {users.length === 0 ? (
        <p>No hay usuarios disponibles.</p>
      ) : (
        <UsersTable users={users} /> // Componente de tabla para mostrar usuarios
      )}
      <Outlet />
    </div>
  );
}
