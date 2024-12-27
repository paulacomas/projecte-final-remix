import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "~/components/Layout";

type FormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirmation: string;
  age: string;
  school_year: string;
  image_profile: File | null;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    password: "",
    password_confirmation: "",
    age: "",
    school_year: "",
    image_profile: null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as any);
    });

    try {
      const res = await fetch("http://localhost/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.data.token);
      navigate("/");
    } catch (error) {
      setError("Error registering user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Layout />

      <main className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Form onSubmit={handleSubmit} method="post">
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Surname Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Surname
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Age Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* School Year Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                School Year
              </label>
              <input
                type="text"
                name="school_year"
                value={formData.school_year}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Profile Image Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                name="image_profile"
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Register
              </button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
