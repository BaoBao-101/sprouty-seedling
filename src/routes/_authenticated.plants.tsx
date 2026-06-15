import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error JSX
import { PlantsPage } from "../pages-sprouty/PlantsPage.jsx";

export const Route = createFileRoute("/_authenticated/plants")({
  head: () => ({ meta: [{ title: "Plant Buddies — Sprouty" }] }),
  component: PlantsPage,
});