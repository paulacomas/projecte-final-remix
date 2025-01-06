// routes/admin/books/delete.$id.tsx
import { ActionFunction, json, redirect } from "@remix-run/node";
import { deleteReviewAdmin } from "~/data/data"; // Función para eliminar el libro
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);

  // Llamar a la función para eliminar el libro de la base de datos
  await deleteReviewAdmin(id, token);

  // Redirigir con un mensaje flash
  const flashMessage = "Review eliminado con éxito.";
  const cookie = await flashMessageCookie.serialize(flashMessage);

  // Redirigir con el mensaje flash
  return redirect("/admin/reviews", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
