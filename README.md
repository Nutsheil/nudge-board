# Nudgeboard

Two-package monorepo: NestJS backend + React/Vite frontend.

## Stack

**Backend:** NestJS 11 · Prisma 7 · PostgreSQL · Passport JWT · Zod
**Frontend:** React 19 · Vite · TypeScript · MUI 9 + Emotion · Redux Toolkit + RTK Query · react-router 7 · react-hook-form · Zod

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Setup

```bash
# install root tooling (husky, lint-staged)
npm install

# install each package
npm --prefix backend install
npm --prefix frontend install
```

Create env files:

**`backend/.env`**
```
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/nudgeboard
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:3000
```

Both sides validate env vars at startup with Zod and fail fast on missing/invalid values.

Run migrations:

```bash
npm --prefix backend run db:migrate
```

## Running

From the repo root:

```bash
npm run dev:backend    # NestJS on :3000 (watch mode)
npm run dev:frontend   # Vite on :5173
```

Or from each package directly.

## Git hooks

Managed by [husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged), installed at the repo root.

- **pre-commit** — ESLint with `--fix --max-warnings=0` on staged files only.
- **pre-push** — `tsc --noEmit` for both packages.

Hooks activate automatically after `npm install` in the root (via the `prepare` script).

## Project structure

```
nudgeboard/
├── backend/          NestJS app
├── frontend/         React + Vite app
├── .husky/           git hooks
└── package.json      root: dev shortcuts, husky, lint-staged
```
