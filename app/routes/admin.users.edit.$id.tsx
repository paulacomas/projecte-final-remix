// routes/admin/users/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import UserForm from "~/components/UserForm";
import {
  fetchCurrentUser,
  fetchUserById,
  updateUser,
  updateUserAdmin,
} from "~/data/data";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const userCurrent = await fetchCurrentUser(token);
  if (userCurrent.rol !== "admin") {
    throw new Error("No tienes permiso");
  }
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

  const response = await updateUserAdmin(params.id, updatedUser, token);

  if (!response.ok) {
    const errorUrl = `/admin/users?error=Error%20al%20actualizar%20el%20usuario`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/users?success=Usuario%20editado%20correctamente`;
  return redirect(successUrl);
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
