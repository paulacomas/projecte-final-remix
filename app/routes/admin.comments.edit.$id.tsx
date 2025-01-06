import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CommentEditForm from "~/components/CommentForm";
import Modal from "~/components/Modal";
import { fetchComments } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const commentId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const comments = await fetchComments(token);
  const comment = comments.data.find((c: any) => c.id === Number(commentId));

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
    throw new Response("Error al actualizar el comentario", { status: 500 });
  }

  return redirect("/admin/comments");
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
