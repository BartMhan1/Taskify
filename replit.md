# Taskify

A full-stack task management web app — organize, prioritize, and get things done.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000/8080)
- `pnpm --filter @workspace/taskify run dev` — run the frontend (port 22180)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Recharts, wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Auth: JWT stored in localStorage as `taskify_token`

## Where things live

- `artifacts/taskify/` — React+Vite frontend (previewPath: `/`)
- `artifacts/api-server/` — Express API server (previewPath: `/api`)
- `lib/db/src/schema/` — Drizzle ORM schema (users.ts, tasks.ts)
- `lib/api-spec/openapi.yaml` — OpenAPI 3.0 spec (source of truth for API contract)
- `lib/api-client-react/` — Generated React Query hooks + custom-fetch with localStorage token injection

## Architecture decisions

- JWT in localStorage (not cookies) — injected into every fetch via `custom-fetch.ts`
- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks
- All settings tabs are client-side state within a single `/settings` route
- Drizzle push for dev migrations, manual SQL for production

## Product

- **Landing page** — marketing page with device mockup, features, CTA, footer
- **Auth** — login/register with SVG illustrations, JWT auth
- **Dashboard** — stats cards, recent tasks, donut chart, upcoming deadlines
- **My Tasks** — full CRUD with filters, search, sort, pagination, add-task sidebar panel
- **Today** — daily focus with schedule timeline, "due soon" section
- **Completed** — streaks, progress donut chart, achievements/badges
- **Calendar** — monthly grid with task pills, today's tasks panel
- **Statistics** — area charts, pie charts, productivity insights (Recharts)
- **Settings** — 9 tabs: Profile, Account, Notifications, Appearance, Preferences, Privacy, Data/Export, Integrations, About

## Demo account

- Email: `aarav.sharma@example.com`
- Password: `Password123`
- 15 pre-seeded tasks across Work, Personal, Learning categories

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- When adding new routes, update both `lib/api-spec/openapi.yaml` and run codegen
- Custom-fetch auto-injects `taskify_token` from localStorage — no manual auth header needed in frontend code
- The `zod/v4` import path (not `zod`) is used throughout per workspace catalog

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
