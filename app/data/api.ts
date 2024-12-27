import { redirect } from "@remix-run/react";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function login({ email, password }: any) {
  // 1. Comprovem si l'usuari existeix
  const response = await fetch("http://localhost/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log(response);

  if (response.ok) {
    const { token } = await response.json();
    const session = await sessionStorage.getSession();
    session.set("token", token);
    return redirect("/books", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  }
}
