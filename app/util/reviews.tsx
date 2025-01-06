import { addReview, deleteReview, updateReview } from "~/data/data";
import { Review } from "../types";
export const handleAddReview = async (
  formData: FormData,
  bookId: string,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const token = localStorage.getItem("token");
  const reviewContent = formData.get("content") as string;
  const reviewRating = Number(formData.get("rating"));

  console.log(reviewRating);
  if (!reviewContent || reviewRating < 1 || reviewRating > 5) {
    setError("Invalid review content or rating.");
    return;
  }

  try {
    const reviewData = { content: reviewContent, rating: reviewRating };
    const addedReview = await addReview(bookId, reviewData, token);

    const formattedReview: Review = {
      id: addedReview.data.id,
      user: {
        id: addedReview.data.review.user.id,
        name: addedReview.data.review.user.name,
      },
      user_id: addedReview.data.review.user_id,
      book_id: addedReview.data.review.book_id,
      score: addedReview.data.review.score,
      comment: addedReview.data.review.comment,
    };

    setBook((prevBook) => {
      const updatedBook = {
        ...prevBook!,
        reviews: [...prevBook!.reviews, formattedReview],
      };
      return updatedBook;
    });

    setIsReviewModalOpen(false);
  } catch (error) {
    setError("Error adding the review");
  }
};

export const handleEditReviewSubmit = async (
  formData: FormData,
  editReview: Review | null,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const token = localStorage.getItem("token");
  if (!token || !editReview) return;

  const updatedContent = formData.get("content") as string;
  const updatedRating = Number(formData.get("rating"));

  const reviewData = { content: updatedContent, rating: updatedRating };

  try {
    const updatedReview = await updateReview(editReview.id, reviewData, token);

    const formattedUpdatedReview: Review = {
      id: updatedReview.data.id,
      user_id: updatedReview.data.user_id,
      book_id: updatedReview.data.book_id,
      score: updatedReview.data.score,
      comment: updatedReview.data.comment,
      created_at: updatedReview.data.created_at,
      updated_at: updatedReview.data.updated_at,
    };

    setBook((prevBook) => {
      if (!prevBook) return prevBook;
      return {
        ...prevBook,
        reviews: prevBook.reviews.map((review) =>
          review.id === editReview.id
            ? { ...review, ...formattedUpdatedReview }
            : review
        ),
      };
    });

    setIsReviewModalOpen(false);
  } catch (error) {
    setError("Error updating the review");
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
