# secret-project
SafeOps prototype workspace (Scaffolded monorepo)

This repository is scaffolded as a pnpm monorepo for the SafeOps project.

Packages
- `apps/web` — Next.js frontend (TypeScript)
- `apps/api` — Express backend (TypeScript) with Prisma
- `libs/types` — Shared TypeScript interfaces

Quick dev (after installing dependencies):

```bash
# install dependencies (requires pnpm)
pnpm install

# run dev mode for all workspaces in parallel
pnpm dev
```

If you prefer `npm` or `yarn`, update the workflow accordingly.
