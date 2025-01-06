import { redirect } from "@remix-run/node";
import { ActionFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";
import UserForm from "~/components/UserForm";
import { createUser } from "~/data/data"; // Supongamos que tienes esta función para guardar usuarios en la base de datos
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  const formData = await request.formData();

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value as any);
  });

  try {
    await createUser(formDataToSend, token); // Guardar el nuevo usuario en la base de datos
    return redirect("/admin/users"); // Redirigir a la lista de usuarios tras un envío exitoso
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return {
      error: "Hubo un problema al agregar el usuario. Intenta de nuevo.",
    };
  }
};

export default function AdminUsersAdd() {
  const navigate = useNavigate();

  return (
    <Modal>
      <UserForm />
    </Modal>
  );
}
