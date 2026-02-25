# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start Vite dev server with HMR
bun run build     # TypeScript check + Vite production build (tsc -b && vite build)
bun run lint      # ESLint
bun run preview   # Preview production build locally
```

No test runner is configured yet.

## Architecture

React 19 SPA using TypeScript (strict), Vite, and Tailwind CSS v4. React Compiler is enabled via Babel plugin for automatic memoization.

### Routing

TanStack Router with **file-based routing**. Route files live in `src/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts` — never edit this file manually. Auto code-splitting is enabled.

- `__root.tsx` — root layout (AuthProvider, ErrorBoundary, QueryClient)
- `_authenticated.tsx` — protected layout with sidebar/header; `beforeLoad` guard redirects unauthenticated users
- `_authenticated/` — pages behind auth
- `auth/index.tsx` — public login page with multi-step flow (email → tenant discovery → OAuth/OTP)

### Domain-Driven Data Layer

Each feature domain lives in `src/domains/<domain>/` with three files:

| File | Purpose |
|------|---------|
| `types.ts` | DTOs and request/response shapes |
| `service.ts` | Endpoint schema using `endpoint()` + phantom `t<T>()` helpers |
| `hooks.ts` | React Query hooks that call `api.<domain>.<method>()` |

**Adding a new domain:**
1. Create `src/domains/<name>/types.ts` with DTOs
2. Create `src/domains/<name>/service.ts` — define endpoints using `endpoint({ method, path, request, response })`
3. Create `src/domains/<name>/hooks.ts` — use `api.<name>.<method>.$queryOptions()` for queries, `api.<name>.<method>.$mutationFn()` for mutations
4. Register the schema in `src/domains/index.ts` by adding it to the `schema` object

### Custom API Client (`src/lib/api-client/`)

A from-scratch type-safe HTTP client with:
- Declarative endpoint schemas with phantom types for zero-cost type inference
- Built-in React Query integration via `$queryOptions()` and `$mutationFn()` helpers on every service method
- `$key(params)` for deterministic query key generation
- Token auth with automatic refresh, request deduplication, retry with exponential backoff, middleware chain
- Tag-based cache invalidation

The client is instantiated in `src/domains/index.ts` and exported as `api`.

### Auth

`AuthProvider` (`src/lib/auth.tsx`) manages session state. `useAuth()` provides `user`, `tenant`, `isAuthenticated`, `isLoading`, `logout`. Auth uses cookie-based sessions with token refresh. Supports OAuth (Google/Microsoft) and OTP (email).

### UI

Shadcn/ui (new-york style) with Radix primitives. Components in `src/components/ui/`. Layout shell in `src/components/layout/`. Icons: Lucide React.

Design tokens defined as CSS custom properties in `src/index.css`:
- Primary: `#2161c2`, Accent: `#ffa600`, Destructive: `#e74c3c`
- Fonts: Inter (body), Plus Jakarta Sans (display), JetBrains Mono (mono)

### State Management

No dedicated state library. Server state via TanStack React Query (60s stale time, global error toasts on mutations). Form state via React Hook Form + Zod. Navigation state via TanStack Router.

## Key Conventions

- Path alias: `@/` maps to `src/`
- Environment: `VITE_BACKEND_URL` is the only required env var (validated in `src/lib/env.ts`)
- Forms use React Hook Form with Zod schemas for validation
- Toast notifications via Sonner
- `src/routeTree.gen.ts` is auto-generated — do not edit
