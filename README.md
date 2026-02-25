# divi-front

A React 19 application

## Tech Stack

- **React 19** with React Compiler
- **Vite 7** for blazing fast development
- **TanStack Router** for type-safe file-based routing
- **TanStack Query** for server state management
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** component library
- **Zod v4** for schema validation
- **React Hook Form** for form management

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components (sidebar, header)
│   └── auth/        # Authentication components
├── domains/         # Domain-specific logic
│   └── auth/        # Auth services, hooks, types
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
│   └── api-client/  # Type-safe API client
├── routes/          # File-based routes (TanStack Router)
│   ├── auth/        # Authentication pages
│   └── _authenticated/ # Protected routes
└── types/           # TypeScript type definitions
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:8080` |

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
