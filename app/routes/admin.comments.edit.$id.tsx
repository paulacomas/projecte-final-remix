import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import CommentEditForm from "~/components/CommentForm";
import Modal from "~/components/Modal";
import { fetchComments, fetchCurrentUser, updateComment } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { validateCommentContent } from "~/util/validations";

export const loader: LoaderFunction = async ({ request, params }) => {
  const commentId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const comments = await fetchComments(token);
  const comment = comments.data.find(
    (c: { id: number; content: string; userId: number }) =>
      c.id === Number(commentId)
  );
  const user = await fetchCurrentUser(token);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }

  if (!comment) {
    throw new Response("Comment not found", { status: 404 });
  }

  return comment;
};

export const action: ActionFunction = async ({ request, params }) => {
  const commentId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const content = formData.get("content");

  try {
    validateCommentContent(content);
  } catch (error) {
    return error;
  }

  const response = await updateComment(commentId, content, token);

  if (!response.ok) {
    const errorUrl = `/admin/comments?error=Error%20updating%20the%20comment`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/comments?success=Comment%20updated%20successfully`;
  return redirect(successUrl);
};

export default function EditComment() {
  const comment = useLoaderData() as {
    content: string;
    user_id: number;
    book_id: number;
  };

  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <div>
      <Modal
        onClose={closeHandler}
        titleId="Edit comment"
      >
        <CommentEditForm comment={comment} />
      </Modal>
    </div>
  );
}
