import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
// @ts-expect-error JSX
import { WorkshopPage } from "../pages-sprouty/WorkshopPage.jsx";

export const Route = createFileRoute("/workshop")({
  head: () => ({ meta: [{ title: "Workshop — Sprouty" }] }),
  component: WorkshopRoute,
});

function WorkshopRoute() {
  const navigate = useNavigate();
  const go = useCallback((p: string) => navigate({ to: p as never }), [navigate]);
  return <WorkshopPage setPage={go} />;
}