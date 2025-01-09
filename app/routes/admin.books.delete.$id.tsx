// routes/admin/books/delete.$id.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { deleteBookAdmin, fetchCurrentUser } from "~/data/data"; // Función para eliminar el libro
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  if (!id) {
    throw new Error("Book ID is required");
  }
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }

  const response = await deleteBookAdmin(id, token);

  if (!response.ok) {
    const errorUrl = `/admin/books?error=Error%20deleting%20the%20book`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/books?success=Book%20deleted%20successfully`;
  return redirect(successUrl);
};
