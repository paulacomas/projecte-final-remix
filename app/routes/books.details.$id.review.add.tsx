// routes/admin/reviews/edit/$id.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { addReview } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { validateReviewInput } from "~/util/validations";

export const action: ActionFunction = async ({ request, params }) => {
  const bookId = params.id;
  if (!bookId) {
    throw new Error("Book ID is required");
  }
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("token is required");
  }
  const formData = await request.formData();
  const comment = formData.get("content");
  const score = formData.get("rating");
  const reviewData = { comment: comment as string, score: Number(score) };
  const input = { comment, score };
  try {
    validateReviewInput(input);
  } catch (error) {
    return error;
  }
  const response = await addReview(bookId, reviewData, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20publishing%20the%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Review%20successfully%20published`;
  return redirect(successUrl);
};

export default function AddReview() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal
      onClose={closeHandler}
      titleId="Add review"
    >
      <ReviewForm review={undefined} />
    </Modal>
  );
}
