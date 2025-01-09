import React, { useState } from "react";
import Layout from "../components/Layout";
import { Form, useLocation } from "@remix-run/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "~/components/Notification";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      if (data.user.rol === "admin") {
        navigate("/admin/books");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Layout />
      <main className="flex flex-col items-center justify-center flex-1 py-12">
        <Notification
          successMessage={successMessage || undefined}
          errorMessage={errorMessage || undefined}
        />
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white rounded py-2 hover:bg-blue-800"
            >
              Login
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
