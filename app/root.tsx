import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import Notification from "./components/Notification";
import { NotificationProvider } from "./contexts/NotificationContext";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  console.log("ErrorBoundary");
  const error = useRouteError();

  let title = "An error occurred";
  let message = "Something went wrong. Please try again later.";

  if (isRouteErrorResponse(error)) {
    // Errors de resposta HTTP (404, 500, etc.)
    title = error.statusText;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    // Errors inesperats (excepcions)
    message = error.message;
  }

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="mb-6 text-lg">{message}</p>
        <Link
          to=".."
          className="rounded bg-white px-4 py-2 font-medium text-indigo-600 hover:bg-gray-200"
        >
          Back to safety
        </Link>
      </main>
    </Layout>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <div>
        {/* Global notification component */}
        <Notification />
        {/* Your main app content */}
        <Outlet />
      </div>
    </NotificationProvider>
  );
}
