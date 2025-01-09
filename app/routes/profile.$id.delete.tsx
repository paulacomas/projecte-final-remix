// routes/admin/books/delete.$id.tsx
import { ActionFunction,redirect } from "@remix-run/node";
import { deleteUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  if (!token) {
    const errorUrl = `/profile/${id}?error=Invalid%20token`;
    return redirect(errorUrl);
  }

  const response = await deleteUser(token);

  if (!response.ok) {
    const errorUrl = `/profile/${id}?error=Error%20deleting%20the%20account`;
    return redirect(errorUrl);
  }

  const successUrl = `/login?success=Account%20deleted%20successfully`;
  return redirect(successUrl);
};
