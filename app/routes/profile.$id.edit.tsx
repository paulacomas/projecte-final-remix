import { useState } from "react";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { fetchCurrentUser, fetchUserById, updateUser } from "~/data/data";
import ProfileEditForm from "~/components/ProfileEditForm";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import Modal from "~/components/Modal";
import { validateUser } from "~/util/validations";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    return redirect("/login");
  }

  const user = await fetchCurrentUser(token);
  console.log(user.id + params.id);

  if (params.id != user.id) {
    throw new Error("You do not have permission to edit this profile");
  }

  if (!params.id) {
    throw new Error("User ID is missing");
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
    age: formData.get("age"),
    school_year: formData.get("school_year"),
    rol: formData.get("rol"),
    image_profile: formData.get("image_profile"),
  };

  try {
    validateUser(updatedUser);
  } catch (error) {
    return error;
  }

  if (!params.id) {
    throw new Error("User ID is missing");
  }
  if (!token) {
    throw new Error("token is missing");
  }
  const response = await updateUser(params.id, updatedUser, token);

  if (!response.ok) {
    const errorUrl = `/profile/${params.id}?error=Error%20editing%20profile`;
    return redirect(errorUrl);
  }

  const successUrl = `/profile/${params.id}?success=Profile%20successfully%20edited`;
  return redirect(successUrl);
};

export default function EditProfilePage() {
  const { userData } = useLoaderData();
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ProfileEditForm user={userData} />
    </Modal>
  );
}
