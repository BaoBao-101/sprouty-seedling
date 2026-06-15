import { createFileRoute } from "@tanstack/react-router";

import { MemoryTreePage } from "../pages-sprouty/MemoryTreePage.jsx";

export const Route = createFileRoute("/_authenticated/tree")({
  head: () => ({ meta: [{ title: "Memory Tree — Sprouty" }] }),
  component: MemoryTreePage,
});