import { useEffect, useState } from "react";
import { Link, useParams } from "@remix-run/react";
import {
  deleteUser,
  fetchCurrentUser,
  fetchUserById,
  updateUser,
} from "../data/data";
import Layout from "../components/Layout";
import ProfileEditForm from "~/components/ProfileEditForm";
import { unstable_createMemoryUploadHandler } from "@remix-run/node";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  bio?: string;
  image_profile?: string;
  books?: Array<{
    id: string;
    title: string;
    author: string;
    gender: string;
    image_book: string;
    user_id: string;
  }>;
}

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Track the current logged-in user ID

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const userData = await fetchUserById(id, token);
        const currentUser = await fetchCurrentUser(token); // Pass the user ID to the utility function
        setUser(userData);
        setCurrentUserId(currentUser.id); // Store current user ID
      } catch (error) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleEditSubmit = async (updatedUser: Partial<User>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const updatedUserData = await updateUser(id, updatedUser, token);
      setUser(updatedUserData.data);
      console.log(updatedUserData.data);
      setIsEditing(false); // Close the modal after updating
    } catch (error) {
      setError("Error updating profile.");
    }
  };
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete) {
      try {
        await deleteUser(token); // Llamamos a la función deleteUser
        localStorage.removeItem("token");
        alert("Account deleted successfully!");
        window.location.href = "/"; // Redirigir a la página principal o login después de eliminar
      } catch (error) {
        setError("Error deleting account.");
      }
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!user) return <div>User not found.</div>;

  // Check if the current user is the same as the profile being viewed
  console.log(user.id, currentUserId);
  const isCurrentUserProfile = currentUserId === user.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Layout />
        </nav>
      </header>
      <main className="container mx-auto py-8 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6 p-6">
            {/* Display user avatar if available */}
            {user.image_profile ? (
              <img
                src={`${user.image_profile}`} // Assuming profile image path
                alt={`${user.name}'s Avatar`}
                className="h-24 w-24 rounded-full mr-4"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-300 mr-4"></div>
            )}

            <div>
              <h2 className="text-3xl font-semibold">
                {user.name} {user.surname}
              </h2>
              <p className="text-lg text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">Age: {user.age}</p>
              <p className="text-sm text-gray-600">
                School Year: {user.school_year}
              </p>
            </div>
          </div>

          {/* Display the books the user has published */}
          {user.books && user.books.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-2">Books Published</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {user.books.map((book) => (
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
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDeleteAccount}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </main>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
            <ProfileEditForm
              user={user}
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
