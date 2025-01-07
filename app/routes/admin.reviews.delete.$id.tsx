// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteReviewAdmin, fetchCurrentUser } from "~/data/data"; // Función para eliminar el libro
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("No tienes permiso");
  }

  // Llamar a la función para eliminar el libro de la base de datos
  const response = await deleteReviewAdmin(id, token);

  if (!response.ok) {
    const errorUrl = `/admin/reviews?error=Error%20al%20eliminar%20la%20review`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/reviews?success=Review%20eliminada%20correctamente`;
  return redirect(successUrl);
};
