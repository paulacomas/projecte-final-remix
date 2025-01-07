import { LoaderFunction } from "@remix-run/node";
import { json, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";
import RepliesTable from "~/components/RepliesTable";
import { fetchCurrentUser, fetchReplies } from "~/data/data";
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
    const replies = await fetchReplies(token);
    return json({ replies: replies.data });
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    return { error: "No se pudieron obtener las respuestas." };
  }
}

export default function AdminReplies() {
  const { replies, error } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

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
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      {replies.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <RepliesTable replies={replies} />
      )}
      <Outlet />
    </div>
  );
}
