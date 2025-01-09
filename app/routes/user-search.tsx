import React from "react";
import { json, Link, LoaderFunction, useLoaderData } from "react-router-dom";
import Navigation from "~/components/Layout";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("name");

  if (!searchQuery) {
    return json({ users: [], errorMessage: "No search query provided" });
  }

  try {
    const cookieHeader = request.headers.get("Cookie");
    const token = await getAuthTokenFromCookie(cookieHeader);

    if (!token) {
      throw new Error("No token found");
    }

    const res = await fetch(`http://localhost/api/users?name=${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error fetching users");
    }

    const data = await res.json();

    if (data.data.users.data.length > 0) {
      return json({ users: data.data.users.data, errorMessage: null });
    } else {
      return json({ users: [], errorMessage: "No users found" });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching users");
  }
};

const UserSearchResults = () => {
  const { users, errorMessage } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto py-8 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Search Results</h1>

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}

          <div>
            {users.length > 0 ? (
              users.map((user: any) => (
                <div
                  key={user.id}
                  className="p-6 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white flex items-center"
                >
                  <img
                    src={`${user.image_profile}`}
                    alt={`${user.name}'s Avatar`}
                    className="h-24 w-24 rounded-full mr-6"
                  />

                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name + " " + user.surname}
                    </p>
                    <p className="text-sm text-gray-600">{user.school_year}</p>
                  </div>

                  <Link
                    to={`/profile/${user.id}`}
                    className="ml-auto px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
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
