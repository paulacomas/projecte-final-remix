import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CommentEditForm from "~/components/CommentForm";
import Modal from "~/components/Modal";
import { fetchComments, fetchCurrentUser } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const commentId = params.commentId;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const comments = await fetchComments(token);
  const comment = comments.data.find((c: any) => c.id === Number(commentId));

  const user = await fetchCurrentUser(token);
  console.log(user);

  if (comment.user_id !== user.id) {
    throw new Error("No tienes permiso para editar este comentario");
  }

  if (!comment) {
    throw new Response("Comentario no encontrado", { status: 404 });
  }

  return comment;
};

export const action: ActionFunction = async ({ request, params }) => {
  const commentId = params.commentId;
  const bookId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const content = formData.get("content");

  const response = await fetch(`http://localhost/api/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorUrl = `/books/details/${bookId}?error=Error%20al%20editar%20el%20comentario`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Comentario%20editado%20correctamente`;
  return redirect(successUrl);
};

export default function EditComment() {
  const comment = useLoaderData();

  return (
    <div>
      <Modal>
        <CommentEditForm comment={comment} />
      </Modal>
    </div>
  );
}
