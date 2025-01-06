// routes/admin/users/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import UserForm from "~/components/UserForm";
import { fetchUserById, updateUser } from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const user = await fetchUserById(params.id, token);
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

export const action: ActionFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const formData = await request.formData();
  const updatedUser = {
    name: formData.get("name"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    age: parseInt(formData.get("age") as string, 10),
    school_year: formData.get("school_year"),
    rol: formData.get("rol"),
    image_profile: formData.get("image_profile"),
  };

  await updateUser(params.id, updatedUser, token);
  const flashMessage = "user editado con éxito.";
  const cookie = await flashMessageCookie.serialize(flashMessage);

  // Redirigir con el mensaje flash
  return redirect("/admin/users", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

export default function EditUser() {
  const user = useLoaderData();
  const navigate = useNavigate();

  function closeHandler() {
    // No volem navegar amb Link en aquest cas ("navigate programmatically")No fem servir Link perquè
    navigate("..");
  }
  return (
    <Modal onClose={closeHandler}>
      <UserForm user={user} />
    </Modal>
  );
}
