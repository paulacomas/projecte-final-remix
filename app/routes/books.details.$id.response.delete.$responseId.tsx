import { ActionFunction, redirect } from "@remix-run/node";
import { deleteReplyAdmin } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id, responseId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!responseId) {
    throw new Error("id required");
  }
  if (!token) {
    throw new Error("token required");
  }

  const response = await deleteReplyAdmin(responseId, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${id}?error=Error%20deleting%20the%20reply`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${id}?success=Reply%20deleted%20successfully`;
  return redirect(successUrl);
};
