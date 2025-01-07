import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CommentEditForm from "~/components/CommentForm";
import Modal from "~/components/Modal";
import { fetchComments, fetchCurrentUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const commentId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const comments = await fetchComments(token);
  const comment = comments.data.find((c: any) => c.id === Number(commentId));
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("No tienes permiso");
  }

  if (!comment) {
    throw new Response("Comentario no encontrado", { status: 404 });
  }

  return comment;
};

export const action: ActionFunction = async ({ request, params }) => {
  const commentId = params.id;
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
    const errorUrl = `/admin/comments?error=Error%20al%20actualizar%20el%20comentario`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/comments?success=Comentario%20editado%20correctamente`;
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
