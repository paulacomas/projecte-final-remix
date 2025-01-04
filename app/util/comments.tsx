import { addComment, deleteComment, updateComment } from "~/data/data";
import { Comment } from "../types";
import { comment } from "postcss";

export const handleAddComment = async (
  formData: FormData, // FormData desde el formulario
  bookId: string, // ID del libro donde se agregará el comentario
  token: string
) => {
  const commentContent = formData.get("content") as string; // Obtiene el contenido del comentario

  try {
    const addedComment = await addComment(bookId, commentContent, token); // Llama a la función para agregar el comentario

    return addedComment;
  } catch (error) {
    return error;
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
  commentId: string,
  newContent: string,
  token: string
) => {
  try {
    const updatedComment = await updateComment(commentId, newContent, token);
    return updatedComment;

    // const formattedUpdatedComments: Comment = {
    //   id: updatedComment.data.id,
    //   user_id: updatedComment.data.user_id,
    //   book_id: updatedComment.data.book_id,
    //   content: updatedComment.data.content,
    //   created_at: updatedComment.data.created_at,
    //   updated_at: updatedComment.data.updated_at,
    // };

    // setBook((prevBook) => {
    //   if (!prevBook) return prevBook;
    //   return {
    //     ...prevBook,
    //     comments: prevBook.comments.map((comment) =>
    //       comment.id === editComment.id
    //         ? { ...comment, ...formattedUpdatedComments }
    //         : comment
    //     ),
    //   };
    // });

    // setIsCommentModalOpen(false);
  } catch (error) {
    console.log(error);
    //setError("Error updating the comment");
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
