import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CommentEditForm from "~/components/CommentForm";
import Modal from "~/components/Modal";
import ResponseForm from "~/components/ResponseEditForm";
import { fetchComments, fetchReplies } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const replyId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const replies = await fetchReplies(token);
  const reply = replies.data.find((c: any) => c.id === Number(replyId));

  if (!reply) {
    throw new Response("RESPUESTA no encontrado", { status: 404 });
  }

  return reply;
};

export const action: ActionFunction = async ({ request, params }) => {
  const responseId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const response = formData.get("content");

  const responseFetch = await fetch(
    `http://localhost/api/responses/${responseId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ response }),
    }
  );

  if (!responseFetch.ok) {
    throw new Response("Error al actualizar el comentario", { status: 500 });
  }

  return redirect("/admin/responses");
};

export default function EditResponse() {
  const reply = useLoaderData();

  return (
    <div>
      <Modal>
        <ResponseForm reply={reply} />
      </Modal>
    </div>
  );
}
