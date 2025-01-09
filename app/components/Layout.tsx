import React, { useState, useEffect } from "react";
import DefaultNavigation from "./DefaultNavigation";
import LoggedInNavigation from "./LoggedInNavigation";
import AdminNavigation from "./AdminNavigator";

export default function Navigation() {
  const [userRole, setUserRole] = useState("loading");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.rol || "user");
        } else {
          setUserRole("guest");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("guest");
      }
    };

    fetchUserRole();
  }, []);

  if (userRole === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <nav>
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
