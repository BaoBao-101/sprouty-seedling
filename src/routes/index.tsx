import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { LandingPage } from "../pages-sprouty/LandingPage.jsx";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const go = useCallback(
    (path: string) => {
      navigate({ to: path as never });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate],
  );
  return <LandingPage setPage={go} />;
}