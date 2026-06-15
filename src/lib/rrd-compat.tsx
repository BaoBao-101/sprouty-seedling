import { useCallback, useMemo } from "react";
import {
  Link as TsLink,
  Navigate as TsNavigate,
  useNavigate as useTsNavigate,
  useLocation as useTsLocation,
  useParams as useTsParams,
  type LinkComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

// Compat shim: a small subset of react-router-dom v6/v7 API mapped onto
// TanStack Router so the imported Sprouty source can keep its existing imports.
// Wired in via vite.config.ts: `react-router-dom` → this file.

type NavOpts = { replace?: boolean; state?: unknown };
type NavTo = string | number | { pathname?: string; search?: string; hash?: string };

export function useNavigate() {
  const nav = useTsNavigate();
  return useCallback(
    (to: NavTo, opts: NavOpts = {}) => {
      if (typeof to === "number") {
        if (typeof window !== "undefined") window.history.go(to);
        return;
      }
      const target = typeof to === "string" ? to : (to.pathname ?? "/") + (to.search ?? "") + (to.hash ?? "");
      nav({ to: target as never, replace: opts.replace, state: opts.state as never });
    },
    [nav],
  );
}

export function useLocation() {
  const loc = useTsLocation();
  const search = (loc as { searchStr?: string }).searchStr ?? "";
  return {
    pathname: loc.pathname,
    search: search ? (search.startsWith("?") ? search : `?${search}`) : "",
    hash: loc.hash ?? "",
    state: (loc as { state?: unknown }).state,
    key: (loc as { key?: string }).key ?? "default",
  };
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string> | ((p: URLSearchParams) => URLSearchParams | Record<string, string>), opts?: NavOpts) => void] {
  const loc = useTsLocation();
  const nav = useTsNavigate();
  const searchStr = (loc as { searchStr?: string }).searchStr ?? "";
  const params = useMemo(() => new URLSearchParams(searchStr), [searchStr]);

  const setParams = useCallback(
    (next: URLSearchParams | Record<string, string> | ((p: URLSearchParams) => URLSearchParams | Record<string, string>), opts: NavOpts = {}) => {
      const value = typeof next === "function" ? next(params) : next;
      const sp = value instanceof URLSearchParams ? value : new URLSearchParams(value);
      const search: Record<string, string> = {};
      sp.forEach((v, k) => {
        search[k] = v;
      });
      nav({ to: loc.pathname as never, search: search as never, replace: opts.replace });
    },
    [nav, params, loc.pathname],
  );

  return [params, setParams];
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTsParams({ strict: false }) as T;
}

export const Link = TsLink as unknown as (props: Omit<LinkComponentProps, "to"> & { to: string; replace?: boolean; state?: unknown; children?: ReactNode }) => ReactNode;

export const Navigate = TsNavigate as unknown as (props: { to: string; replace?: boolean; state?: unknown }) => ReactNode;

export function BrowserRouter({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
export function Routes({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
export function Route(): null {
  return null;
}
export function Outlet(): null {
  return null;
}
export function NavLink(props: Omit<LinkComponentProps, "to"> & { to: string; children?: ReactNode }) {
  return <Link {...(props as unknown as Parameters<typeof Link>[0])} />;
}