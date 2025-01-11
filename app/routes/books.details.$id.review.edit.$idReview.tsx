import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { fetchCurrentUser, fetchReviews, updateReview } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { validateReviewInput } from "~/util/validations";
import { Review, ReviewEdit } from "~/data/types";

export const loader: LoaderFunction = async ({ request, params }) => {
  const reviewId = params.idReview;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const reviews = await fetchReviews(token);

  const review = reviews.data.find(
    (r: ReviewEdit) => r.id === Number(reviewId)
  );
  const user = await fetchCurrentUser(token);
  console.log(user);

  if (review.user_id !== user.id && review.book.user_id !== user.id) {
    throw new Error("You do not have permission to edit this review");
  }

  if (!review) {
    throw new Response("Review not found", { status: 404 });
  }

  return review as { id: number; comment: string; score: number };
};

export const action: ActionFunction = async ({ request, params }) => {
  const reviewId = params.idReview;
  const bookId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const comment = formData.get("content");
  const score = formData.get("rating");

  const review = { comment, score };

  try {
    validateReviewInput(review);
  } catch (error) {
    return error;
  }

  const response = await updateReview(
    reviewId,
    {
      rating: score,
      content: comment,
    },
    token
  );

  if (!response.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20editing%20the%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Review%20successfully%20edited`;
  return redirect(successUrl);
};

export default function EditReview() {
  const review = useLoaderData<Review>();
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler} titleId="Edit review">
      <ReviewForm review={review} />
    </Modal>
  );
}
