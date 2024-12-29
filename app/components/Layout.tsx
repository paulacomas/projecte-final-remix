import React, { useState, useEffect } from "react";
import DefaultNavigation from "./DefaultNavigation";
import LoggedInNavigation from "./LoggedInNavigation";

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="container mx-auto p-4">
      {isLoggedIn ? <LoggedInNavigation /> : <DefaultNavigation />}
    </nav>
  );
}
