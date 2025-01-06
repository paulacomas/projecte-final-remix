// routes/admin/books/edit.$id.tsx
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import BookForm from "~/components/BookFormAdmin";
import Modal from "~/components/Modal";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;

  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const response = await fetch(`http://localhost/api/books/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Incluyendo el token en el header
    },
  });

  if (!response.ok) {
    throw new Error("Libro no encontrado");
  }

  const book = await response.json();
  return book.data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const opinion = formData.get("opinion");
  const review = formData.get("review");
  const gender = formData.get("gender");
  const author = formData.get("author");
  const image_book = formData.get("image_book");

  if (!title || !description || !gender || !author) {
    return json(
      { error: "All required fields must be filled." },
      { status: 400 }
    );
  }

  const updatedBook = {
    title,
    description,
    opinion,
    review: Number(review),
    gender,
    author,
    image_book, // Puede ser un string de la imagen o un File si fue subida
  };

  const response = await fetch(`http://localhost/api/admin/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedBook),
  });

  if (!response.ok) {
    return json({ error: "Error updating book" }, { status: 500 });
  }

  const flashMessage = "Libro editado con éxito.";
  const cookie = await flashMessageCookie.serialize(flashMessage);

  // Redirigir con el mensaje flash
  return redirect("/admin/books", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

export default function EditBook() {
  const book = useLoaderData();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  function closeHandler() {
    // No volem navegar amb Link en aquest cas ("navigate programmatically")No fem servir Link perquè
    navigate("..");
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  // Lógica para manejar el éxito de la acción
  const handleSuccess = () => {
    setSuccessMessage("Libro actualizado exitosamente.");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Editar Libro</h1>
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {successMessage}
        </div>
      )}
      <Modal onClose={closeHandler}>
        <BookForm book={book} />
      </Modal>
      <button
        onClick={() => navigate("/admin/books")}
        className="text-gray-600 hover:underline mt-4"
      >
        Volver a la lista de libros
      </button>
    </div>
  );
}
