// app/components/BooksList.tsx
import React, { useState } from "react";
import { Form } from "@remix-run/react";
import Modal from "./Modal";
import EditBookForm from "./EditBookForm";
import Navigation from "./Layout";
import { updateBook } from "~/data/data";

interface Book {
  id: string;
  title: string;
  author: string;
  gender: string;
  image_book: string;
  user_id: string; // Propietario del libro
}

interface BooksListProps {
  books: Book[];
  currentUserId: string; // ID del usuario actual
}

export default function BooksList({ books, currentUserId }: BooksListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Abrir el modal de edición para el libro seleccionado
  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // Cerrar el modal de edición
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleFormSubmit = async (updatedBook) => {
    const token = localStorage.getItem("token");
    try {
      // Verificar que el ID está presente en updatedBook
      if (!updatedBook.id) {
        console.error("No se encontró el ID del libro");
        return;
      }
      console.log(updatedBook);
      // Aquí puedes manejar la lógica de actualización, por ejemplo, hacer una solicitud a tu API
      const response = await updateBook(updatedBook.id, updatedBook, token);
      console.log(response);

      if (response) {
        console.log("Libro actualizado correctamente");
        // Redirigir o hacer cualquier otra acción después de actualizar
        handleModalClose(); // Cerrar el modal después de la actualización
      } else {
        console.error("Error al actualizar el libro");
      }
    } catch (error) {
      console.error("Hubo un error al enviar los datos", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto p-4">
          <Navigation />
        </nav>
      </header>
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Books List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <img
                src={book.image_book}
                alt={book.title}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">{book.gender}</p>

              <div className="mt-4 flex justify-between">
                {/* Botón View Details para todos los usuarios */}
                <a
                  href={`/books/${book.id}`}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  View Details
                </a>

                {/* Mostrar botones Edit y Delete solo si el usuario actual es el propietario */}
                {currentUserId === book.user_id && (
                  <div className="flex space-x-2">
                    {/* Botón Editar */}
                    <button
                      onClick={() => handleEditClick(book)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    {/* Formulario de eliminación */}
                    <Form method="POST" action={`/books/${book.id}`}>
                      <input type="hidden" name="action" value="delete" />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Mostrar modal de edición si está abierto */}
          {isModalOpen && selectedBook && (
            <Modal onClose={handleModalClose}>
              <EditBookForm
                book={selectedBook}
                onClose={handleModalClose}
                onCancel={handleModalClose}
                onSubmit={handleFormSubmit} // Cerrar modal después de la edición
              />
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}
