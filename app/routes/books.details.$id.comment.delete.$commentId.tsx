import { ActionFunction, redirect } from "@remix-run/node";
import { deleteComment, fetchCurrentUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { commentId, id } = params as { commentId: string; id: string };
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    const errorUrl = `/books/details/${id}?error=Authentication%20token%20not%20found`;
    return redirect(errorUrl);
  }
  const user = await fetchCurrentUser(token);
  console.log(user);

  const response = await deleteComment(commentId, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${id}?error=Error%20deleting%20the%20comment`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${id}?success=Comment%20deleted%20successfully`;
  return redirect(successUrl);
};
