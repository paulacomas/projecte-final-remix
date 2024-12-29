import { useState } from "react";

// Custom hook para manejar el token de autenticación
export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const setAuthToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const removeAuthToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    token,
    setAuthToken,
    removeAuthToken,
  };
};
