// routes/admin/books/delete.$id.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { deleteReplyAdmin, fetchCurrentUser } from "~/data/data";
import {getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  if (!id) {
    throw new Error("No id found");
  }
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("No token found");
  }
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }

  const response = await deleteReplyAdmin(id, token);

  if (!response.ok) {
    const errorUrl = `/admin/responses?error=Error%20deleting%20the%20response`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/responses?success=Response%20deleted%20successfully`;
  return redirect(successUrl);
};
