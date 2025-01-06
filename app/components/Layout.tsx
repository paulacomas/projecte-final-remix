import React, { useState, useEffect } from "react";
import DefaultNavigation from "./DefaultNavigation";
import LoggedInNavigation from "./LoggedInNavigation";
import AdminNavigation from "./AdminNavigator";

export default function Navigation() {
  const [userRole, setUserRole] = useState("loading"); // Estados: 'loading', 'guest', 'user', 'admin'

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token en la cabecera
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.rol || "user"); // Asigna el rol devuelto por el backend
        } else {
          setUserRole("guest"); // Si no está autenticado o hay error, es 'guest'
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("guest"); // Si hay un fallo, por defecto es 'guest'
      }
    };

    fetchUserRole();
  }, []);

  if (userRole === "loading") {
    return <div>Loading...</div>; // Muestra un indicador de carga mientras se obtiene el rol
  }

  return (
    <nav className="container mx-auto p-4">
      {userRole === "admin" ? (
        <AdminNavigation />
      ) : userRole === "user" ? (
        <LoggedInNavigation />
      ) : (
        <DefaultNavigation />
      )}
    </nav>
  );
}
