// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteBookAdmin, fetchCurrentUser } from "~/data/data"; // Función para eliminar el libro
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
  const response = await deleteBookAdmin(id, token);

  if (!response.ok) {
    const errorUrl = `/admin/books?error=Error%20al%eliminar%20el%libro`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/books?success=Libro%20eliminado%20correctamente`;
  return redirect(successUrl);
};
