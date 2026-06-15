import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { DashboardPage } from "../pages-sprouty/DashboardPage.jsx";

import { useAuth } from "../contexts/AuthContext.jsx";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My Garden — Sprouty" }] }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { user } = useAuth() as { user: unknown };
  const navigate = useNavigate();
  const go = useCallback((p: string) => navigate({ to: p as never }), [navigate]);
  return <DashboardPage user={user} setPage={go} />;
}