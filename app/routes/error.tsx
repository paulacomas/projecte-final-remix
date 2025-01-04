// src/pages/error.tsx
import React from "react";
import { useLocation } from "react-router-dom";

// Tipo de estado que estamos esperando en `location`
interface LocationState {
  error: string;
}

const ErrorPage: React.FC = () => {
  // Obtener el estado de la ubicación (el error)
  const location = useLocation();
  const error =
    (location.state as LocationState)?.error || "An unknown error occurred.";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-700">{error}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
