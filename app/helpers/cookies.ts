import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("auth_token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export const getAuthTokenFromCookie = (cookieHeader: string | null) => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split("; ");
  const authTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("auth_token=")
  );

  if (!authTokenCookie) return null;

  const authToken = authTokenCookie.split("=")[1];

  return decodeURIComponent(authToken);
};
