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

Makefile shortcuts

You can use the included `Makefile` to simplify common tasks:

```bash
# install all workspace deps
make install

# generate Prisma client
make generate

# start both web + api in dev (runs pnpm workspace dev)
make dev

# start single service
make dev-api
make dev-web

# stop dev servers (best-effort)
make stop

# health check for API
make health
```

If you prefer `npm` or `yarn`, update the workflow accordingly.
