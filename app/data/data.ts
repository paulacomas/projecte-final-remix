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

export const fetchBooksForUser = async (token: string) => {
  const response = await fetch(`http://localhost/api/my-books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch books for user");
  }

  return response.json();
};

// En data/data.ts

export const addReview = async (
  bookId: string,
  { rating, content }: { rating: number; content: string },
  token: string
) => {
  console.log(bookId, rating, content, token);
  const response = await fetch(`http://localhost/api/books/${bookId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score: rating,
      comment: content,
    }),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return await response.json();
};

export const deleteReview = async (reviewId: string, token: string) => {
  try {
    const response = await fetch(`http://localhost/api/reviews/${reviewId}`, {
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

export const updateReview = async (
  bookId: string,
  { rating, content }: { rating: number; content: string },
  token: string
) => {
  console.log(bookId, rating, content, token);
  const response = await fetch(`http://localhost/api/reviews/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score: rating,
      comment: content,
    }),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return await response.json();
};

export const addComment = async (
  bookId: string,
  content: string,
  token: string
) => {
  console.log(bookId, content, token);
  const response = await fetch(
    `http://localhost/api/books/${bookId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content,
      }),
    }
  );
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return await response.json();
};

export const deleteComment = async (commentId: string, token: string) => {
  try {
    const response = await fetch(`http://localhost/api/comments/${commentId}`, {
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

export const updateComment = async (
  bookId: string,
  content: string,
  token: string
) => {
  console.log(bookId, content, token);
  const response = await fetch(`http://localhost/api/comments/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: content,
    }),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return await response.json();
};

export const addReply = async (
  commentId: string,
  response: string,
  token: string
) => {
  console.log(commentId, response, token);
  const responseFetch = await fetch(
    `http://localhost/api/comments/${commentId}/responses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        response: response,
      }),
    }
  );

  if (!responseFetch.ok) {
    throw new Error("Failed to add review");
  }

  return await responseFetch.json();
};

export const updateReplay = async (
  bookId: string,
  response: string,
  token: string
) => {
  console.log(bookId, response, token);
  const responseFetch = await fetch(
    `http://localhost/api/responses/${bookId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        response: response,
      }),
    }
  );
  console.log(responseFetch);

  if (!responseFetch.ok) {
    throw new Error("Failed to add review");
  }

  return await responseFetch.json();
};

export const deleteReplay = async (commentId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost/api/responses/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the book");
    }
  } catch (error) {
    throw new Error("Error deleting the book");
  }
};

// app/data.ts

export async function fetchUserById(id: string, token: string) {
  try {
    const response = await fetch(`http://localhost/api/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("User not found");
    }
    const userData = await response.json();
    return userData.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user data.");
  }
}

export const updateUser = async (
  id: string,
  updatedUser: Partial<User>,
  token: string
) => {
  try {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json"); // JSON para los datos del usuario

    console.log("Sending the following data:", updatedUser);

    // Enviar los datos del usuario en formato JSON
    const response = await fetch(`http://localhost/api/profile`, {
      method: "PUT",
      body: JSON.stringify(updatedUser), // Datos del usuario en JSON
      headers: headers,
    });

    console.log("Server response:", response);

    if (response.ok) {
      const updatedUserData = await response.json();
      console.log("Updated User Data:", updatedUserData);
      return updatedUserData;
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Error updating profile");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error.message || "Failed to update user.");
  }
};

export const deleteUser = async (token: string) => {
  try {
    const response = await fetch("http://localhost/api/profile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text(); // Get the raw response text

    if (!response.ok) {
      // Log the raw HTML response
      console.error("Error response:", text);
      throw new Error("Failed to delete the account.");
    }

    // Attempt to parse the JSON response
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw new Error(error.message || "Failed to delete user.");
  }
};

export async function getSavedBooks(token: string) {
  const response = await fetch(`http://localhost/api/saved-books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching saved books");
  }
  return await response.json();
}

export async function saveBook(bookId: string, token: string) {
  const response = await fetch(`http://localhost/api/saved-books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ book_id: bookId }),
  });
  if (!response.ok) {
    throw new Error("Error saving book");
  }
  return await response.json();
}

export async function unsaveBook(bookId: string, token: string) {
  const response = await fetch(`http://localhost/api/saved-books/${bookId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error unsaving book");
  }
  return await response.json();
}

export async function fetchBooks() {
  try {
    const res = await fetch("http://localhost/api/books");

    // Verifica si la respuesta es exitosa (código 2xx)
    if (!res.ok) {
      throw new Error(`Failed to fetch books: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    // Maneja cualquier error que ocurra durante la solicitud o en la transformación de la respuesta
    console.error("Error fetching books:", error);
    throw error; // Lanza el error nuevamente para que pueda ser manejado en el lugar donde se llama la función
  }
}

export const deleteBookAdmin = async (bookId: string, token: string) => {
  try {
    const response = await fetch(`http://localhost/api/admin/books/${bookId}`, {
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

export async function fetchUsers(token: string) {
  try {
    const response = await fetch(`http://localhost/api/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener usuarios: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Asume que el API devuelve un array de usuarios
  } catch (error) {
    console.error("Error en fetchUsers:", error);
    throw error;
  }
}

export const updateUserAdmin = async (
  id: string,
  updatedUser: Partial<User>,
  token: string
) => {
  try {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json"); // JSON para los datos del usuario

    console.log("Sending the following data:", updatedUser);

    // Enviar los datos del usuario en formato JSON
    const response = await fetch(`http://localhost/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser), // Datos del usuario en JSON
      headers: headers,
    });

    console.log("Server response:", response);

    if (response.ok) {
      const updatedUserData = await response.json();
      console.log("Updated User Data:", updatedUserData);
      return updatedUserData;
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Error updating profile");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error.message || "Failed to update user.");
  }
};

export const deleteUserAdmin = async (userId: string, token: string) => {
  try {
    const response = await fetch(`http://localhost/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the user");
    }
  } catch (error) {
    throw new Error("Error deleting the user");
  }
};

export async function fetchComments(token: string) {
  try {
    const response = await fetch("http://localhost/api/comments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los comentarios");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchComments:", error);
    return { error: "No se pudieron cargar los comentarios." };
  }
}

export const deleteCommentAdmin = async (commentId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost/api/admin/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to delete the comment");
    }
  } catch (error) {
    throw new Error("Error deleting the comment");
  }
};

export async function fetchReviews(token: string) {
  const response = await fetch("http://localhost/api/reviews", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener las reseñas");
  }

  return response.json();
}

export const deleteReviewAdmin = async (reviewId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost/api/admin/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to delete the review");
    }
  } catch (error) {
    throw new Error("Error deleting the review");
  }
};

export async function fetchReplies(token: string) {
  const response = await fetch("http://localhost/api/responses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener las respuestas");
  }

  return response.json();
}

export const deleteReplyAdmin = async (replyId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost/api/responses/${replyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to delete the response");
    }
  } catch (error) {
    throw new Error("Error deleting the response");
  }
};
