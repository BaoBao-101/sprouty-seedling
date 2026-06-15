import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "../contexts/AuthContext.jsx";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = useAuth() as { user: unknown };
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) navigate({ to: "/login", replace: true });
  }, [user, navigate]);
  if (!user) return null;
  return <Outlet />;
}