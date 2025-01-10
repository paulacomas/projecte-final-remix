import { useState, useEffect } from "react";
import {
  Link,
  json,
  useLoaderData,
  Outlet,
  Form,
  useSearchParams,
} from "@remix-run/react";
import { fetchUserById, fetchCurrentUser } from "~/data/data";
import Layout from "~/components/Layout";
import { LoaderFunction } from "@remix-run/node";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import Notification from "~/components/Notification";
import BooksList from "~/components/books";
import { User } from "~/data/types";

export const loader: LoaderFunction = async ({ params, request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!params.id) {
    throw new Error("User ID is required");
  }
  const userData = await fetchUserById(params.id, token);
  const currentUser = await fetchCurrentUser(token);

  if (!userData || !currentUser) {
    throw new Error("Error fectching user");
  }

  return json({ userData, currentUser });
};

export default function ProfilePage() {
  const { userData, currentUser } = useLoaderData<{
    userData: User;
    currentUser: User;
  }>();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  const isCurrentUserProfile = currentUser.id === userData.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <Layout />
      <main className="container mx-auto py-8 p-6">
        <Notification
          successMessage={successMessage ?? undefined}
          errorMessage={errorMessage ?? undefined}
        />
        <div className="bg-white p-6 rounded-lg shadow-md relative">
          <div className="flex flex-col sm:flex-row items-center mb-6 p-6">
            {/* Display user avatar if available */}
            {userData.image_profile ? (
              <img
                src={`${userData.image_profile}`} // Assuming profile image path
                alt={`${userData.name}'s Avatar`}
                className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-4"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-300 mb-4 sm:mb-0 sm:mr-4"></div>
            )}

            <div>
              <h2 className="text-3xl font-semibold">
                {userData.name} {userData.surname}
              </h2>
              <p className="text-lg text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-600">Age: {userData.age}</p>
              <p className="text-sm text-gray-600">
                School Year: {userData.school_year}
              </p>
            </div>
          </div>

          {isCurrentUserProfile && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center mt-6 sm:mt-8 sm:absolute sm:top-4 sm:right-4 space-y-4 sm:space-y-0 sm:space-x-2 pr-4">
              <Link
                to={`edit`}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                Edit Profile
              </Link>
              <Form method="post" action={`delete`} className="inline">
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                  onClick={(e) => {
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this account?"
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete Account
                </button>
              </Form>
            </div>
          )}

          {/* Display the books the user has published */}
          {userData.books && userData.books.length > 0 && (
            <div>
              <p className="text-4xl font-extrabold p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Books published
              </p>
              <BooksList
                books={userData.books}
                currentUserId={currentUser.id}
              />
            </div>
          )}
        </div>
      </main>
      <Outlet />
    </div>
  );
}
