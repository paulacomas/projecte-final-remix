import { Outlet } from "@remix-run/react";
import Navigation from "~/components/Layout";

export default function AppLayout(): JSX.Element {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}
