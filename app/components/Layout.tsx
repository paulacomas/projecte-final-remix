import React, { useState, useEffect } from "react";
import DefaultNavigation from "./DefaultNavigation";
import LoggedInNavigation from "./LoggedInNavigation";
import AdminNavigation from "./AdminNavigator";
import { fetchUserRole } from "~/data/data";

export default function Navigation() {
  const [userRole, setUserRole] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const getUserRole = async () => {
        const role = await fetchUserRole(token);
        setUserRole(role);
      };

      getUserRole();
    } else {
      setUserRole("guest");
    }
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
