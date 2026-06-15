import { createFileRoute } from "@tanstack/react-router";

import { VIPPage } from "../pages-sprouty/VIPPage.jsx";

export const Route = createFileRoute("/super")({
  head: () => ({ meta: [{ title: "VIP — Sprouty" }] }),
  component: VIPPage,
});