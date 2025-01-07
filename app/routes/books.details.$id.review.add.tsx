// routes/admin/reviews/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { addReview, fetchReviews } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const bookId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const comment = formData.get("content");
  const score = formData.get("rating");
  const reviewData = { content: comment, rating: score };
  const response = await addReview(bookId, reviewData, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20al%20añadir%20la%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Review%20añadida%20correctamente`;
  return redirect(successUrl);
};

export default function AddReview() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Modal>
      <ReviewForm review={undefined} />
    </Modal>
  );
}
