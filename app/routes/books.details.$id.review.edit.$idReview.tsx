// routes/admin/reviews/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { fetchCurrentUser, fetchReviews } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const reviewId = params.idReview;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const reviews = await fetchReviews(token);
  const review = reviews.data.find((r: any) => r.id === Number(reviewId));
  const user = await fetchCurrentUser(token);
  console.log(user);

  if (review.user_id !== user.id) {
    throw new Error("No tienes permiso para editar este libro");
  }

  if (!review) {
    throw new Response("Reseña no encontrada", { status: 404 });
  }

  return review;
};

export const action: ActionFunction = async ({ request, params }) => {
  const reviewId = params.idReview;
  const bookId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const comment = formData.get("content");
  const score = formData.get("rating");

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
    const errorUrl = `/books/details/${bookId}?error=Error%20al%20editar%20la%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Review%20editada%20correctamente`;
  return redirect(successUrl);
};

export default function EditReview() {
  const review = useLoaderData();

  return (
    <Modal>
      <ReviewForm review={review} />
    </Modal>
  );
}
