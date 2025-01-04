import { addComment, deleteComment, updateComment } from "~/data/data";
import { Comment } from "../types";

export const handleAddComment = async (
  event: React.FormEvent<HTMLFormElement>,
  bookId: string,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  event.preventDefault(); // Evitar que la página se recargue al enviar el formulario

  const formData = new FormData(event.currentTarget); // Obtiene los datos del formulario
  const commentContent = formData.get("content") as string; // Obtiene el contenido del comentario

  if (!commentContent) {
    setError("Invalid comment content."); // Si no hay contenido, muestra un error
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const addedComment = await addComment(bookId, commentContent, token); // Llama a la función para agregar el comentario

    const formattedComment: Comment = {
      id: addedComment.data.comment.id,
      user: {
        id: addedComment.data.comment.user.id,
        name: addedComment.data.comment.user.name,
      },
      content: addedComment.data.comment.content,
    };

    setBook((prevBook) => {
      if (!prevBook) return prevBook;
      const updatedBook = {
        ...prevBook,
        comments: [...prevBook.comments, formattedComment], // Agrega el nuevo comentario a la lista de comentarios del libro
      };
      return updatedBook;
    });

    setIsCommentModalOpen(false); // Cierra el modal después de agregar el comentario
  } catch (error) {
    setError("Error adding the comment"); // Si ocurre un error, muestra un mensaje de error
  }
};

export const handleEditComment = (
  commentId: string,
  content: string,
  setEditComment: React.Dispatch<React.SetStateAction<Comment | null>>,
  setIsCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditComment({ id: commentId, content });
  setIsCommentModalOpen(true); // Abrimos el modal de edición
};

export const handleEditCommentSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  editComment: Comment | null,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  event.preventDefault();
  const token = localStorage.getItem("token");

  if (!token || !editComment) return;

  const formData = new FormData(event.currentTarget);
  const updatedContent = formData.get("content") as string;

  const commentData = updatedContent;

  try {
    const updatedComment = await updateComment(
      editComment.id,
      commentData,
      token
    );

    const formattedUpdatedComments: Comment = {
      id: updatedComment.data.id,
      user_id: updatedComment.data.user_id,
      book_id: updatedComment.data.book_id,
      content: updatedComment.data.content,
      created_at: updatedComment.data.created_at,
      updated_at: updatedComment.data.updated_at,
    };

    setBook((prevBook) => {
      if (!prevBook) return prevBook;
      return {
        ...prevBook,
        comments: prevBook.comments.map((comment) =>
          comment.id === editComment.id
            ? { ...comment, ...formattedUpdatedComments }
            : comment
        ),
      };
    });

    setIsCommentModalOpen(false);
  } catch (error) {
    setError("Error updating the comment");
  }
};

export const handleDeleteComment = async (
  commentId: string,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await deleteComment(commentId, token);
    setBook((prevBook) => ({
      ...prevBook!,
      comments: prevBook!.comments.filter(
        (comment) => comment.id !== commentId
      ),
    }));
  } catch (error) {
    setError("Error deleting the comment");
  }
};
