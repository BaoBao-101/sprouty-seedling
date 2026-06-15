import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "../pages-sprouty/LoginPage.jsx";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Sprouty" }] }),
  component: LoginPage,
});