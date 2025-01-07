// routes/admin/reviews/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import ReviewForm from "~/components/ReviewForm";
import Modal from "~/components/Modal";
import { addComment, addReply, addReview, fetchReviews } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";
import CommentForm from "~/components/CommentForm";
import ResponseForm from "~/components/ResponseEditForm";

export const action: ActionFunction = async ({ request, params }) => {
  const bookId = params.id;
  const commentId = params.commentId;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const response = formData.get("content");
  const responseFetch = await addReply(commentId, response, token);

  if (!responseFetch.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20al%20añadir%20la%20respuesta`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Respuesta%20añadida%20correctamente`;
  return redirect(successUrl);
};

export default function AddReview() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Modal>
      <ResponseForm reply={undefined} />
    </Modal>
  );
}
