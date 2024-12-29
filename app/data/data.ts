// data.ts
export const fetchBookDetails = async (bookId: string, token: string) => {
  try {
    const response = await fetch(`http://localhost/api/books/${bookId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch book details: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Regresar los datos del libro
  } catch (error) {
    throw new Error("Error fetching book details");
  }
};

export const fetchCurrentUser = async (token: string) => {
  try {
    const userResponse = await fetch("http://localhost/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      return userData;
    } else {
      throw new Error("Failed to fetch current user data");
    }
  } catch (error) {
    throw new Error("Error fetching user data");
  }
};

export const deleteBook = async (bookId: string, token: string) => {
  try {
    const response = await fetch(`http://localhost/api/books/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the book");
    }
  } catch (error) {
    throw new Error("Error deleting the book");
  }
};

export const updateBook = async (
  bookId: string,
  bookData: {
    title: string;
    description: string;
    opinion: string;
    review: number;
    gender: string;
    author: string;
    image_book: File;
  },
  token: string
) => {
  try {
    const response = await fetch(`http://localhost/api/books/${bookId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error("Failed to update the book");
    }

    const updatedBook = await response.json();
    return updatedBook;
  } catch (error) {
    throw new Error(error.message || "Error updating book");
  }
};
