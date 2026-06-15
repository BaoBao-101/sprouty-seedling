## Prerequisite
Upload a ZIP export of the private `BaoBao-101/sprouty` repository in this chat. This keeps the repository private and avoids sharing credentials or access tokens.

## Implementation plan
1. Inspect the uploaded archive for its framework, dependencies, routes, assets, environment-variable requirements, and any backend integrations.
2. Verify the archive contains no nested `.git` directory, then copy the application source into this project while preserving the Lovable-compatible TanStack Start runtime files where required.
3. Adapt incompatible routing, styling, configuration, and package usage to the supported React 19 / TanStack Start / Tailwind v4 stack without changing Sprouty’s intended UI or behavior.
4. Install the repository’s required dependencies and migrate all local assets into the project.
5. Restore page metadata, error/not-found handling, responsive behavior, and any required environment configuration without embedding private credentials.
6. Run targeted checks and verify the primary user flow in the live preview.

## Expected result
The current placeholder app is fully replaced by Sprouty, with the private source remaining private and the app running in Lovable.