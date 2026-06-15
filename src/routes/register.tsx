import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error JSX
import { RegisterPage } from "../pages-sprouty/RegisterPage.jsx";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Sprouty" }] }),
  component: RegisterPage,
});