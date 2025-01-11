import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { validateBook } from "../util/validations";
import { addBook } from "~/data/data";
import { Form } from "@remix-run/react";

export default function PublishBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    opinion: "",
    review: "",
    gender: "",
    author: "",
    image_book: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files && e.target.files[0]) {
        setFormData((prev) => ({
          ...prev,
          image_book: e.target.files ? e.target.files[0] : null,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      validateBook(formData);
    } catch (error) {
      setError(error);
      return error;
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

      const response = await addBook(formDataToSend, token);

      if (!response.ok) {
        navigate(`/books/add?error=Error%20publishing%20the%20book`);
        throw new Error("Failed to publish the book");
      }

      const data = await response.json();

      navigate(
        `/books/details/${data.data.id}?success=Book%20published%20successfully`
      );

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
      navigate(`/books/add?error=Error%20publishing%20the%20book`);
      console.error("Error publishing book:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Layout />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Publish a Book
        </h1>
        <Form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={255}
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              className="w-full h-32 border-gray-300 rounded-lg shadow-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="opinion"
              className="block text-gray-700 font-medium mb-2"
            >
              Opinion
            </label>
            <textarea
              name="opinion"
              id="opinion"
              value={formData.opinion}
              onChange={handleChange}
              maxLength={500}
              className="w-full h-32 border-gray-300 rounded-lg shadow-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="review"
              className="block text-gray-700 font-medium mb-2"
            >
              Review
            </label>
            <select
              name="review"
              id="review"
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
              className="block text-gray-700 font-medium mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            >
              <option value="">Select a gender</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Fantasy">Romance</option>
              <option value="Fantasy">Terror</option>
              <option value="Fantasy">Action</option>
              <option value="Fantasy">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-gray-700 font-medium mb-2"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              maxLength={255}
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image_book"
              className="block text-gray-700 font-medium mb-2"
            >
              Book Image
            </label>
            <input
              type="file"
              name="image_book"
              id="image_book"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,image/gif,image/svg"
              className="w-full h-12 border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          {error && (
            <ul className="mb-4 list-inside list-disc text-red-500">
              {Object.values(error).map((error: string) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800"
          >
            Publish
          </button>
        </Form>
      </div>
    </div>
  );
}
