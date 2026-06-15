## Goal

Replace the current Lovable starter with the Sprouty app from the uploaded ZIP, adapting it to run on this project's TanStack Start + Tailwind v4 stack. Keep Firebase (Auth, Firestore, Storage) and the existing Firebase Cloud Functions (Gemini + Stripe) as-is — the user owns and deploys those separately.

## Scope summary of the source app

- React 19 + Vite + Tailwind v4 (compatible)
- `react-router-dom` v7 with 8 pages: Landing, Login, Register, Dashboard, MemoryTree, Plants, Workshop, VIP
- 3 React contexts: Auth, Plant, Memory
- Firebase SDK (`firebase` v12) initialized in `src/lib/firebase.js`
- Gemini client wrapper in `src/lib/gemini.js` (calls Cloud Functions)
- i18next (`src/i18n/`) with locale files
- UI primitives in `src/components/ui/` (Btn, Card, Modal, Toast, Badge, ProgressBar, Skeleton)
- Mock data, utilities (compress, currency, storage, stripe), custom hooks
- Custom fonts: Fredoka One, Nunito (loaded via `<link>` in index.html)
- Custom animations stylesheet

## Plan

1. **Wipe starter routes/content**
   - Delete `src/routes/index.tsx` placeholder body and the example server fn (`src/lib/api/example.functions.ts`); keep `__root.tsx`, `router.tsx`, `start.ts`, `server.ts`, `lib/error-page.ts`, `lib/error-capture.ts`, `lib/lovable-error-reporting.ts`, `lib/config.server.ts`, `hooks/use-mobile.tsx`, `lib/utils.ts`, and all `components/ui/*` (shadcn) intact — Sprouty's UI primitives go under a separate folder so nothing conflicts.

2. **Copy Sprouty source verbatim under new paths**
   - `src/components/sprouty/*` ← Sprouty's `src/components/*` (Nav, ChatWidget, ErrorBoundary, ActivateKitModal, FloatingLeaf, LanguageSwitcher)
   - `src/components/sprouty/ui/*` ← Sprouty's `src/components/ui/*` (kept separate from shadcn)
   - `src/contexts/*`, `src/data/*`, `src/hooks/*` (merge — keep existing `use-mobile.tsx`), `src/i18n/*`, `src/lib/firebase.js`, `src/lib/gemini.js`, `src/utils/*`, `src/styles/animations.css`
   - `public/*` ← Sprouty `public/*`

3. **Convert routing from react-router-dom to TanStack Router file routes**
   - Create one file per page under `src/routes/`:
     - `index.tsx` → LandingPage
     - `login.tsx`, `register.tsx`, `workshop.tsx`, `super.tsx` (VIP), `dashboard.tsx`, `tree.tsx`, `plants.tsx`
   - Add `_authenticated.tsx` pathless layout that gates `dashboard/tree/plants` by reading the Auth context and `redirect()`-ing to `/login` when no user. Move those three routes to `_authenticated.dashboard.tsx`, `_authenticated.tree.tsx`, `_authenticated.plants.tsx`.
   - Add a `$.tsx` catch-all that redirects to `/`.
   - Replace `useNavigate`/`useLocation`/`<Navigate>`/`<Link>` from `react-router-dom` with TanStack equivalents inside the copied Sprouty components (Nav, ChatWidget, pages). The `setPage`/`go` helper in `App.jsx` becomes a small `usePageNav` hook wrapping `useNavigate()`.
   - Each route gets a `head()` with route-specific title + description (Sprouty home title used for `/`).

4. **Move providers into `__root.tsx`**
   - Wrap the existing root `<Outlet />` with `ErrorBoundary` → `AuthProvider` → `PlantProvider` → `MemoryProvider` → `ToastProvider`, and render `<Nav />` + `<ChatWidget />` above the outlet.
   - Add the Google Fonts `<link>` tags via `head()` (Fredoka One, Nunito) so SSR includes them.
   - Import `src/i18n` and `src/styles/animations.css` once in `__root.tsx`.

5. **TypeScript / strict-mode adjustments**
   - Project is strict TS; the copied files are JSX. Allow `.jsx` by leaving `allowJs` settings as needed in `tsconfig.json` (adding `"allowJs": true` and `"checkJs": false` if not already set). No file-by-file rewrite to TS — minimize churn.

6. **Tailwind v4 + global styles**
   - Sprouty uses Tailwind v4 via `@tailwindcss/vite`; this project loads Tailwind through `src/styles.css`. Merge Sprouty's `src/index.css` directives into `src/styles.css` (preserving existing tokens + theme block). Keep all design tokens in `src/styles.css`.

7. **Firebase wiring**
   - Keep `src/lib/firebase.js` as-is; it reads `VITE_FIREBASE_*` from `import.meta.env`. After the port, ask the user to add those env vars (see "Open items" below). Until configured, Firebase calls will no-op/error — Auth context already handles "no user" gracefully so the landing page still renders.
   - Cloud Function URLs in `src/lib/gemini.js` and `src/utils/stripe.js` remain pointing at the user's Firebase project. Optional `VITE_FUNCTIONS_EMULATOR` flag preserved.

8. **Cleanup / things deliberately not ported**
   - The `functions/` folder (Firebase Cloud Functions source) is NOT copied into the project — Lovable doesn't host Firebase Functions. The user continues to deploy that separately. I'll note this in the final summary, not silently drop it.
   - `firebase.json`, `firestore.rules`, `storage.rules`, `.env.example`, `CLAUDE.md`, `DESIGN.md`, `PLANNING.md`, `SECURITY_LOG.md` — not copied (Firebase-CLI / docs artifacts unrelated to the running app). I can copy them to a `docs/` folder if you want them retained.
   - Sprouty's `vite.config.js`, `index.html`, `main.jsx`, `App.jsx`, `eslint.config.js`, `package-lock.json` — replaced by this project's TanStack Start equivalents.

9. **Dependency installs**
   - `bun add firebase i18next react-i18next` (react-router-dom NOT installed — replaced by TanStack Router which is already here).

10. **Verification**
    - Build runs automatically; I'll watch for typecheck/build failures and fix import paths.
    - Drive Playwright against `localhost:8080`: confirm `/` renders the landing page, `/login` and `/register` render forms, and visiting `/dashboard` while logged out redirects to `/login`.
    - Console-check for missing Firebase env vars (expected until user configures them) and confirm no other runtime errors.

## Open items (after the port, separate follow-ups)

- Add `VITE_FIREBASE_*` and `VITE_STRIPE_PUBLISHABLE_KEY` via project env so Firebase initializes against your project. These are publishable client keys; safe to commit but using env keeps environments separable.
- Deploy `functions/` to your Firebase project (unchanged from your existing workflow).

## Technical notes

- TanStack Start enforces file-based routes under `src/routes/`; `react-router-dom`'s `<BrowserRouter>` and `<Routes>` cannot be used. The route gate replaces `ProtectedRoute`.
- Server-side rendering: Auth context uses Firebase's `onAuthStateChanged` which is browser-only. The Auth provider will guard `typeof window !== 'undefined'` before subscribing, matching how Firebase SDK is typically wired in SSR apps, so prerender of public routes (`/`, `/login`, `/register`) doesn't crash.
- `_authenticated` layout uses `beforeLoad` to check auth state from a lightweight client-side store rather than from server context (Firebase has no SSR session here); on the server it simply renders the outlet, and the client `AuthProvider` performs the redirect once hydrated. This avoids `Unauthorized`-style prerender crashes.
