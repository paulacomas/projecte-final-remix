import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
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

export const loader: LoaderFunction = async ({ params, request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await fetchUserById(params.id, token); // Cargar datos del usuario
  const currentUser = await fetchCurrentUser(token); // Obtener datos del usuario actual

  if (!userData || !currentUser) {
    throw new Error("Error fectching user");
  }

  return json({ userData, currentUser });
};

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, currentUser } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const isCurrentUserProfile = currentUser.id === userData.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Layout />
        </nav>
      </header>
      <main className="container mx-auto py-8 p-6">
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6 p-6">
            {/* Display user avatar if available */}
            {userData.image_profile ? (
              <img
                src={`${userData.image_profile}`} // Assuming profile image path
                alt={`${userData.name}'s Avatar`}
                className="h-24 w-24 rounded-full mr-4"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-300 mr-4"></div>
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

          {/* Display the books the user has published */}
          {userData.books && userData.books.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-2">Books Published</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userData.books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
                  >
                    <img
                      src={`${book.image_book}`} // Assuming book image path
                      alt={book.title}
                      className="h-48 w-full object-cover rounded-md mb-4"
                    />
                    <h4 className="text-lg font-medium">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-sm text-gray-500">{book.gender}</p>

                    <div className="mt-4 flex justify-between">
                      {/* Botón View Details para todos los usuarios */}
                      <Link
                        to={`/books/details/${book.id}`} // Use 'to' instead of 'href' for Remix's Link component
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Edit Profile button if it's the current user's profile */}
          {isCurrentUserProfile && (
            <div className="mt-6">
              <Link
                to={`edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </Link>
              <Form method="post" action={`delete`} className="inline">
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={(e) => {
                    if (
                      !window.confirm(
                        "¿Estás seguro de que deseas eliminar esta cuenta?"
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
        </div>
      </main>
      <Outlet />
    </div>
  );
}
