import React, { useState, useEffect } from "react";
import {
  json,
  Link,
  LoaderFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navigation from "~/components/Layout";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request }) => {
  // Obtener los parámetros de búsqueda de la URL
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("name");

  if (!searchQuery) {
    return json({ users: [], errorMessage: "No search query provided" });
  }

  try {
    const cookieHeader = request.headers.get("Cookie");
    const token = await getAuthTokenFromCookie(cookieHeader);

    if (!token) {
      return json({ users: [], errorMessage: "No token found" });
    }

    // Realizar la búsqueda de usuarios por nombre
    const res = await fetch(`http://localhost/api/users?name=${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return json({ users: [], errorMessage: "Error fetching users" });
    }

    const data = await res.json();

    if (data.data.users.data.length > 0) {
      return json({ users: data.data.users.data, errorMessage: null });
    } else {
      return json({ users: [], errorMessage: "No users found" });
    }
  } catch (error) {
    console.error(error);
    return json({ users: [], errorMessage: "Error fetching users" });
  }
};

const UserSearchResults = () => {
  const { users, errorMessage } = useLoaderData(); // Obtenemos los datos cargados por el loader

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <main className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Search Results</h1>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}

          {/* User Results */}
          <div>
            {users.length > 0 ? (
              users.map((user: any) => (
                <div
                  key={user.id}
                  className="p-6 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white flex items-center"
                >
                  {/* Imagen del perfil */}
                  <img
                    src={`${user.image_profile}`} // Assuming profile image path
                    alt={`${user.name}'s Avatar`}
                    className="h-24 w-24 rounded-full mr-6"
                  />

                  {/* Contenedor para el texto */}
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name + " " + user.surname}
                    </p>
                    <p className="text-sm text-gray-600">{user.school_year}</p>
                  </div>

                  {/* Botón para ver perfil */}
                  <Link
                    to={`/profile/${user.id}`}
                    className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSearchResults;
