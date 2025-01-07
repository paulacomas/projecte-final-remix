// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteComment, fetchCurrentUser } from "~/data/data"; // Función para eliminar el libro
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { commentId, id } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const user = await fetchCurrentUser(token);
  console.log(user);
  // Llamar a la función para eliminar el libro de la base de datos
  const response = await deleteComment(commentId, token);

  if (!response.ok) {
    const errorUrl = `/books/details/${id}?error=Error%20al%20eliminar%20el%20comentario`;
    return redirect(errorUrl);
  }

  const successUrl = `/books/details/${id}?success=Comentario%20eliminado%20correctamente`;
  return redirect(successUrl);
};
