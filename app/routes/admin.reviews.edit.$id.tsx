// routes/admin/reviews/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { fetchReviews } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const reviewId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const reviews = await fetchReviews(token);
  const review = reviews.data.find((r: any) => r.id === Number(reviewId));

  if (!review) {
    throw new Response("Reseña no encontrada", { status: 404 });
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
    throw new Response("Error al actualizar la reseña", { status: 500 });
  }

  return redirect("/admin/reviews");
};

export default function EditReview() {
  const review = useLoaderData();

  return (
    <Modal>
      <ReviewForm review={review} />
    </Modal>
  );
}
