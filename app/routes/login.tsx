import React, { useState } from "react";
import Layout from "../components/Layout";
import { Form } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const message = new URLSearchParams(location.search).get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Aquí obtenemos el mensaje de error del backend
        throw new Error(errorData.message || "Login failed"); // Manejamos el error correctamente
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      if (data.user.rol === "admin") {
        navigate("/admin/books"); // Redirigir a admin/books si es "user"
      } else {
        navigate("/"); // Redirigir a la página principal para otros roles
      }
    } catch (err: any) {
      // Mostrar un mensaje de error más detallado
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Layout />
      <main className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
            >
              Login
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
