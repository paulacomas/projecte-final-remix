// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteReplyAdmin } from "~/data/data"; // Función para eliminar el libro
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id, responseId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  // Llamar a la función para eliminar el libro de la base de datos
  const response = await deleteReplyAdmin(responseId, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${id}?error=Error%20al%20eliminar%20la%20respuesta`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${id}?success=Respuesta%20eliminada%20correctamente`;
  return redirect(successUrl);
};
