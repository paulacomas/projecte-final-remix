import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CommentEditForm from "~/components/CommentForm";
import Modal from "~/components/Modal";
import ResponseForm from "~/components/ResponseEditForm";
import { fetchComments, fetchCurrentUser, fetchReplies } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const replyId = params.responseId;
  const bookId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const replies = await fetchReplies(token);
  const reply = replies.data.find((c: any) => c.id === Number(replyId));
  const user = await fetchCurrentUser(token);
  console.log(user);

  if (reply.user_id !== user.id) {
    throw new Error("No tienes permiso para editar este libro");
  }

  if (!reply) {
    throw new Response("RESPUESTA no encontrado", { status: 404 });
  }

  return reply;
};

export const action: ActionFunction = async ({ request, params }) => {
  const responseId = params.responseId;
  const bookId = params.id;
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
    const errorUrl = `/books/details/${bookId}?error=Error%20al%20editar%20la%20respuesta`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${bookId}?success=Respuesta%20editada%20correctamente`;
  return redirect(successUrl);
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
