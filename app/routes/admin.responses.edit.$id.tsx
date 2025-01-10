import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import ResponseForm from "~/components/ResponseEditForm";
import { fetchCurrentUser, fetchReplies } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { validateCommentContent } from "~/util/validations";

export const loader: LoaderFunction = async ({ request, params }) => {
  const replyId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  const replies = await fetchReplies(token);
  const reply = replies.data.find(
    (c: { id: number }) => c.id === Number(replyId)
  );
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }

  if (!reply) {
    throw new Response("REPLY not found", { status: 404 });
  }

  return reply;
};

export const action: ActionFunction = async ({ request, params }) => {
  const responseId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  const formData = await request.formData();
  const response = formData.get("content");

  try {
    validateCommentContent(response);
  } catch (error) {
    return error;
  }

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
    const errorUrl = `/admin/responses?error=Error%20updating%20the%20response`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/responses?success=Response%20updated%20successfully`;
  return redirect(successUrl);
};

export default function EditResponse() {
  const reply = useLoaderData() as {
    response: string;
    user_id: number;
    book_id: number;
  };
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <div>
      <Modal onClose={closeHandler}>
        <ResponseForm reply={reply} />
      </Modal>
    </div>
  );
}
