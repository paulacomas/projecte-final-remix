// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteCommentAdmin } from "~/data/data"; // Función para eliminar el libro
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  // Llamar a la función para eliminar el libro de la base de datos
  await deleteCommentAdmin(id, token);

  // Redirigir con un mensaje flash
  const flashMessage = "Comment eliminado con éxito.";
  const cookie = await flashMessageCookie.serialize(flashMessage);

  // Redirigir con el mensaje flash
  return redirect("/admin/comments", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
