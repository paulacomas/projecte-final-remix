import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { fetchCurrentUser, fetchReviews } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { validateReviewInput } from "~/util/validations";
interface Review {
  id: number;
  comment: string;
  score: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const reviewId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("No token found");
  }
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }
  const reviews = await fetchReviews(token);

  const review = reviews.data.find((r: Review) => r.id === Number(reviewId));

  if (!review) {
    throw new Response("Review not found", { status: 404 });
  }

  return review;
};

export const action: ActionFunction = async ({ request, params }) => {
  const reviewId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const comment = formData.get("content");
  const score = formData.get("rating");

  const updatedReview = {
    comment,
    score,
  };

  try {
    validateReviewInput(updatedReview);
  } catch (error) {
    return error;
  }

  const response = await fetch(`http://localhost/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score, comment }),
  });
  console.log(response);

  if (!response.ok) {
    const errorUrl = `/admin/reviews?error=Error%20updating%20the%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/reviews?success=Review%20successfully%20updated`;
  return redirect(successUrl);
};

export default function EditReview() {
  const review = useLoaderData<Review>();
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ReviewForm review={review} />
    </Modal>
  );
}
