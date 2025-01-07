import { LoaderFunction } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  Outlet,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import CommentsTable from "~/components/CommentsTable";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";
import { fetchComments, fetchCurrentUser } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("No tienes permiso");
  }
  try {
    const comments = await fetchComments(token);
    return json({ comments: comments.data }); // Retorna los usuarios para la vista
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { error: "No se pudieron obtener los usuarios." };
  }
}

export default function AdminComments() {
  const { comments, error } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

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
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      {comments.length === 0 ? (
        <p>No hay comments disponibles.</p>
      ) : (
        <CommentsTable comments={comments} /> // Componente de tabla para mostrar usuarios
      )}
      <Outlet />
    </div>
  );
}
