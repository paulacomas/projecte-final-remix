// routes/admin/users/edit/$id.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import UserForm from "~/components/UserForm";
import { fetchCurrentUser, fetchUserById, updateUserAdmin } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("No token found");
  }
  const userCurrent = await fetchCurrentUser(token);
  if (userCurrent.rol != "admin") {
    throw new Error("You don't have permission");
  }
  if (!params.id) {
    throw new Error("User ID is required");
  }
  const user = await fetchUserById(params.id, token);
  if (!user) throw new Error("User not found");
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

  if (!params.id) {
    throw new Error("User ID is required");
  }
  if (!token) {
    throw new Error("token is required");
  }
  const response = await updateUserAdmin(params.id, updatedUser, token);

  if (!response.ok) {
    const errorUrl = `/admin/users?error=Error%20updating%20user`;
    return redirect(errorUrl);
  }

  const successUrl = `/admin/users?success=User%20updated%20successfully`;
  return redirect(successUrl);
};

export default function EditUser() {
  const user = useLoaderData() as {
    name: string;
    surname: string;
    email: string;
    age: number;
    school_year: string;
    rol: string;
    image_profile: string | null;
  };
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }
  return (
    <Modal onClose={closeHandler}>
      <UserForm user={user} />
    </Modal>
  );
}
