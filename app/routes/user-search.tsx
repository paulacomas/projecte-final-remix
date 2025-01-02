import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "~/components/Layout";

const UserSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]); // Almacena los usuarios encontrados
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Para manejar los errores

  useEffect(() => {
    // Obtener el parámetro de búsqueda 'name' de la URL
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("name");

    if (searchQuery) {
      // Hacer la búsqueda de usuarios por nombre
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost/api/users?name=${searchQuery}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            if (data.data.users.data.length > 0) {
              setUsers(data.data.users.data);
            } else {
              setErrorMessage("No users found");
            }
          } else {
            setErrorMessage("Error fetching users");
          }
        } catch (error) {
          setErrorMessage("Error fetching users");
          console.error(error);
        }
      };

      fetchUsers();
    }
  }, [location]);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`); // Redirige al perfil del usuario al hacer clic
  };

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
            {console.log("users" + users)}
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
                  <button
                    onClick={() => handleUserClick(user.id)}
                    className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    View Profile
                  </button>
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
