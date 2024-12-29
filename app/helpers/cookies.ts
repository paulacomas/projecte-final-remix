import { createCookie } from "@remix-run/node";

// Crear la cookie de sesión con la configuración adecuada
export const authCookie = createCookie("auth_token", {
  httpOnly: true, // Hace que la cookie no sea accesible desde JavaScript
  secure: process.env.NODE_ENV === "production", // Solo se enviará en HTTPS en producción
  sameSite: "lax", // Evita CSRF
});

export const getAuthTokenFromCookie = (cookieHeader: string | null) => {
  // Verificar si tenemos un encabezado de cookies
  if (!cookieHeader) return null;

  // Aquí separamos las cookies por el delimitador '; ' y buscamos la cookie auth_token
  const cookies = cookieHeader.split("; ");
  const authTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("auth_token=")
  );

  if (!authTokenCookie) return null;

  // Extraemos el valor de la cookie
  const authToken = authTokenCookie.split("=")[1];

  return decodeURIComponent(authToken); // Decodificamos el valor de la cookie en caso de que esté codificado
};
