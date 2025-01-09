// routes/admin/reviews/edit/$id.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import { addReply } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import ResponseForm from "~/components/ResponseEditForm";

export const action: ActionFunction = async ({ request, params }) => {
  const bookId = params.id;
  const commentId = params.commentId as string;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("Authentication token not found");
  }
  const formData = await request.formData();
  const response = formData.get("content");
  if (typeof response !== "string") {
    const errorUrl = `/books/details/${bookId}?error=Invalid%20response%20content`;
    return redirect(errorUrl);
  }
  const responseFetch = await addReply(commentId, response as string, token);

  if (!responseFetch.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20posting%20the%20reply`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Reply%20posted%20successfully`;
  return redirect(successUrl);
};

export default function AddReview() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ResponseForm reply={undefined} />
    </Modal>
  );
}
