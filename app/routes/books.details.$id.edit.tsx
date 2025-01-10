// routes/admin/books/edit.$id.tsx
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import BookForm from "~/components/BookFormAdmin";
import Modal from "~/components/Modal";
import { fetchCurrentUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { validateBook } from "~/util/validations";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;

  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const response = await fetch(`http://localhost/api/books/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Book not found");
  }

  const book = await response.json();

  if (!token) {
    throw new Error("Authentication token not found");
  }
  const user = await fetchCurrentUser(token);
  console.log(user);

  if (book.data.user_id !== user.id) {
    throw new Error("You do not have permission to edit this book");
  }

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

  const updatedBook = {
    title,
    description,
    opinion,
    review: Number(review),
    gender,
    author,
    image_book,
  };

  try {
    // Validem les dades abans de fer la mutació
    validateBook(updatedBook);
  } catch (error) {
    // En aquest cas ens volem assegurar que l'usuari vegi els errors que han provocat aquest error de validació
    return error;
  }

  const response = await fetch(`http://localhost/api/books/${id}`, {
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

  if (!response.ok) {
    const errorUrl = `/books/details/${id}?error=Error%20editing%20the%20book`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${id}?success=Book%20edited%20successfully`;
  return redirect(successUrl);
};

export default function EditBook() {
  const book = useLoaderData<{
    id: number;
    title: string;
    description: string;
    opinion: string;
    gender: string;
    review: string;
    image_book: string;
    author: string;
  }>();
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <Modal onClose={closeHandler}>
      <BookForm book={book} />
    </Modal>
  );
}
