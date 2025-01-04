import { addReview, deleteReview, updateReview } from "~/data/data";
import { Review } from "../types";
import { useNotifications } from "~/contexts/NotificationContext";
export const handleAddReview = async (
  formData: FormData, // FormData desde el formulario
  bookId: string, // ID del libro donde se agregará el comentario
  token: string
) => {
  const reviewContent = formData.get("content") as string;
  const reviewRating = Number(formData.get("rating"));

  try {
    const reviewData = { content: reviewContent, rating: reviewRating };
    const addedReview = await addReview(bookId, reviewData, token);
    console.log(addedReview);
    return addedReview;
  } catch (error) {
    return error;
  }
};

export const handleEditReviewSubmit = async (
  formData: FormData,
  token: string
) => {
  console.log("review" + formData);
  const updatedContent = formData.get("content") as string;
  const updatedRating = Number(formData.get("rating"));
  const reviewtId = formData.get("commentId") as string;

  const reviewData = { content: updatedContent, rating: updatedRating };

  try {
    const updatedReview = await updateReview(reviewtId, reviewData, token);
    if (!updatedReview.ok) {
      return null;
    }
    return updatedReview;
  } catch (error) {
    return error;
  }
};

export const handleDeleteReview = async (
  reviewId: string,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await deleteReview(reviewId, token);
    setBook((prevBook) => ({
      ...prevBook!,
      reviews: prevBook!.reviews.filter((review) => review.id !== reviewId),
    }));
  } catch (error) {
    setError("Error deleting the review");
  }
};

export const handleEditReview = (
  reviewId: string,
  content: string,
  rating: number,
  setEditReview: React.Dispatch<React.SetStateAction<Review | null>>,
  setIsReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditReview({ id: reviewId, content, rating });
  setIsReviewModalOpen(true); // Abrimos el modal de edición
};
