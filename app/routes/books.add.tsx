import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "~/contexts/NotificationContext";
import {
  validateTitle,
  validateDescription,
  validateAuthor,
  validateGender,
  validateReview,
} from "../util/validations"; // Importar las funciones de validación

export default function PublishBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    opinion: "",
    review: "",
    gender: "",
    author: "",
    image_book: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        image_book: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleError = validateTitle(formData.title);
    const descriptionError = validateDescription(formData.description);
    const authorError = validateAuthor(formData.author);
    const genderError = validateGender(formData.gender);
    const reviewError = validateReview(formData.review);

    if (
      titleError ||
      descriptionError ||
      authorError ||
      genderError ||
      reviewError
    ) {
      setError(
        titleError ||
          descriptionError ||
          authorError ||
          genderError ||
          reviewError
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to publish a book.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value as string | Blob);
      });

      const response = await fetch("http://localhost/api/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to publish the book");
      }

      const data = await response.json();
      setSuccessMessage("Book published successfully!");
      addNotification("Book published successfully!", "success");

      navigate(`/books/details/${data.data.id}`); // Redirigir al detalle del libro

      setFormData({
        title: "",
        description: "",
        opinion: "",
        review: "",
        gender: "",
        author: "",
        image_book: null,
      });
    } catch (error) {
      console.error("Error publishing book:", error);
      addNotification("Error publishing the book. Please try again.", "error");
      setError("Error publishing the book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Layout />
        </nav>
      </header>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Publish a Book</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={255}
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={1000}
              className="w-full h-32 border-gray-300 rounded-lg shadow-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Opinion (optional)
            </label>
            <textarea
              name="opinion"
              value={formData.opinion}
              onChange={handleChange}
              maxLength={500}
              className="w-full h-32 border-gray-300 rounded-lg shadow-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Review (optional)
            </label>
            <select
              name="review"
              value={formData.review}
              onChange={handleChange}
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            >
              <option value="">Select a rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a gender</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Fantasy">Fantasy</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Book Image (optional)
            </label>
            <input
              type="file"
              name="image_book"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,image/gif,image/svg"
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}
