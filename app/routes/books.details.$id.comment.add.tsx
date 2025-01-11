// routes/admin/reviews/edit/$id.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import { addComment } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import CommentForm from "~/components/CommentForm";
import { validateCommentContent } from "~/util/validations";

export const action: ActionFunction = async ({ request, params }) => {
  const bookId = params.id;
  if (!bookId) {
    throw new Error("book id is required");
  }
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("token is required");
  }
  const formData = await request.formData();
  const comment = formData.get("content") as string;
  try {
    validateCommentContent(comment);
  } catch (error) {
    return error;
  }
  const response = await addComment(bookId, comment, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20publishing%20the%20comment`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Comment%20published%20successfully`;
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
      titleId="Add comment"
    >
      <CommentForm comment={undefined} />
    </Modal>
  );
}
