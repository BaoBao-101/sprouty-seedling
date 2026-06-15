import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error JSX
import { MemoryTreePage } from "../pages-sprouty/MemoryTreePage.jsx";

export const Route = createFileRoute("/_authenticated/tree")({
  head: () => ({ meta: [{ title: "Memory Tree — Sprouty" }] }),
  component: MemoryTreePage,
});