// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteUserAdmin, fetchCurrentUser } from "~/data/data"; // Función para eliminar el libro
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
  console.log(id);
  // Llamar a la función para eliminar el libro de la base de datos
  const response = await deleteUserAdmin(id, token);

  if (!response.ok) {
    const errorUrl = `/admin/users?error=Error%20al%20eliminar%20el%20usuario`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/users?success=usuario%20eliminado%20correctamente`;
  return redirect(successUrl);
};
