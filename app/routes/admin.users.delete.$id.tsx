import { ActionFunction, redirect } from "@remix-run/node";
import { deleteUserAdmin, fetchCurrentUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  if (!id) {
    throw new Error("User ID is required");
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
  console.log(id);
  const response = await deleteUserAdmin(id, token);

  if (!response.ok) {
    const errorUrl = `/admin/users?error=Error%20deleting%20user`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/users?success=User%20deleted%20successfully`;
  return redirect(successUrl);
};
