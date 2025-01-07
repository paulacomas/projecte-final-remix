import { useState } from "react";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { fetchCurrentUser, fetchUserById, updateUser } from "~/data/data";
import ProfileEditForm from "~/components/ProfileEditForm";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { flashMessageCookie, getAuthTokenFromCookie } from "~/helpers/cookies";
import Modal from "~/components/Modal";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    return redirect("/login");
  }

  const user = await fetchCurrentUser(token);
  console.log(user.id + params.id);

  if (params.id != user.id) {
    throw new Error("No tienes permiso para editar este libro");
  }

  const userData = await fetchUserById(params.id, token);
  return json({ userData });
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

  const response = await updateUser(params.id, updatedUser, token);

  if (!response.ok) {
    const errorUrl = `/profile/${params.id}?error=Error%20al%20editae%20el%20perfil`;
    return redirect(errorUrl);
  }

  const successUrl = `/profile/${params.id}?success=Perfil%20editado%20correctamente`;
  return redirect(successUrl);
};

export default function EditProfilePage() {
  const { userData } = useLoaderData();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal>
      <ProfileEditForm user={userData} />
    </Modal>
  );
}
