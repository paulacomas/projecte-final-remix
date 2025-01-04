import { addReply, deleteReplay, updateReplay } from "~/data/data";

export const handleAddReply = async (
  commentId: string,
  event: React.FormEvent<HTMLFormElement>,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  event.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return;

  const formData = new FormData(event.currentTarget);
  const replyContent = formData.get("response") as string;

  if (!replyContent) {
    setError("Reply content is required.");
    return;
  }

  try {
    const addedReply = await addReply(commentId, replyContent, token); // Función que agregarás en tu API.
    setBook((prevBook) => {
      if (!prevBook) return prevBook;
      const updatedComments = prevBook.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment, // Asegúrate de agregar las respuestas al comentario correspondiente
            responses: [...(comment.responses || []), addedReply.data], // Agregamos la respuesta
          };
        }
        return comment;
      });

      return { ...prevBook, comments: updatedComments };
    });
  } catch (error) {
    setError("Error adding the reply.");
  }
};

export const handleEditReply = async (
  replyId: string,
  updatedResponse: string,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // Call your API to edit the reply in the database
    const updatedReply = await updateReplay(replyId, updatedResponse, token); // editReply is your API function.

    setBook((prevBook) => {
      const updatedComments = prevBook.comments.map((comment) => {
        const updatedReplies = comment.responses.map((reply) =>
          reply.id === replyId
            ? { ...reply, response: updatedResponse } // Update the reply in the state
            : reply
        );
        return { ...comment, responses: updatedReplies };
      });
      return { ...prevBook, comments: updatedComments };
    });
  } catch (error) {
    setError("Error editing the reply.");
  }
};

// Handle deleting a reply
export const handleReplyDelete = async (
  replyId: string,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // Call your API to delete the reply from the database
    await deleteReplay(replyId, token); // deleteReply is your API function.

    setBook((prevBook) => {
      const updatedComments = prevBook.comments.map((comment) => {
        const updatedReplies = comment.responses.filter(
          (reply) => reply.id !== replyId // Filter out the deleted reply from the state
        );
        return { ...comment, responses: updatedReplies };
      });
      return { ...prevBook, comments: updatedComments };
    });
  } catch (error) {
    setError("Error deleting the reply.");
  }
};
