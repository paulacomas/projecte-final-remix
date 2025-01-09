import { ActionFunction, redirect } from "@remix-run/node";
import { deleteReview } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { idReview, id } = params as { idReview: string; id: string };
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    const errorUrl = `/books/details/${id}?error=Authentication%20token%20is%20missing`;
    return redirect(errorUrl);
  }

  const response = await deleteReview(idReview, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${id}?error=Error%20deleting%20the%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${id}?success=Review%20successfully%20deleted`;
  return redirect(successUrl);
};
