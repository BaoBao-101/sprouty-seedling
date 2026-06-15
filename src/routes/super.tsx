import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error JSX
import { VIPPage } from "../pages-sprouty/VIPPage.jsx";

export const Route = createFileRoute("/super")({
  head: () => ({ meta: [{ title: "VIP — Sprouty" }] }),
  component: VIPPage,
});