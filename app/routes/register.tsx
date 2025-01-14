import React, { useState } from "react";
import { Form } from "@remix-run/react";
import { useNavigate } from "react-router-dom";
import Layout from "~/components/Layout";
import { validateUserRegister } from "~/util/validations";

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

const courses = [
  "1ESO",
  "2ESO",
  "3ESO",
  "4ESO",
  "1BACH",
  "2BACH",
  "1CICLES",
  "2CICLES",
  "3CICLES",
];

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

    try {
      validateUserRegister(formData);
    } catch (error) {
      setError(error);
      return error;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as any);
    });

    try {
      const res = await fetch("http://localhost/api/register", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Layout />

      <main className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <Form onSubmit={handleSubmit} method="post">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="surname" className="block text-gray-700">
                Surname
              </label>
              <input
                type="text"
                name="surname"
                id="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password_confirmation"
                className="block text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="school_year" className="block text-gray-700">
                School Year
              </label>
              <select
                id="school_year"
                name="school_year"
                value={formData.school_year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Image Field */}
            <div className="mb-4">
              <label htmlFor="image_profile" className="block text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                id="image_profile"
                name="image_profile"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {error && (
              <ul className="mb-4 list-inside list-disc text-red-500">
                {Object.values(error).map((error: string) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}

            <div className="mb-4">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-700 text-white rounded hover:bg-blue-800"
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
