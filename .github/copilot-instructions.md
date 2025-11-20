# NODE CMS Frontend - GitHub Copilot Instructions

## Project Overview

This is a **Next.js 15 application** for "NODE CMS" using **React 19**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui components**, featuring a **User Frontend** and a separate **Admin Panel**.

---

## Architecture & Tech Stack

### Core Technologies

- **Next.js 15** with App Router (`src/app/` directory structure)
- **React 19** with TypeScript for component development
- **Bun** as package manager (use `bun` commands, not npm/yarn)
- **Tailwind CSS 4** with **shadcn/ui** component library
- **Radix UI** primitives for complex components
- **Lucide React** for icons

### Key Dependencies

- `axios` — API communication with custom instance
- `js-cookie` — session management
- `zustand` — state management
- `react-hook-form` & `zod` — form and schema validation

---

## Project Structure Patterns

### Component Organization

- `/src/components/ui/` — shadcn/ui base components (Button, Table, etc.)
- `/src/components/admin/` — Components specific to the admin panel
- `/src/lib/` — Utilities (`utils.ts` for `cn()` function, `axiosinstance.ts`)
- `/src/services/` — API layer (`authUtils.ts`, `http.ts` for typed requests)
- `/src/hooks/` — Custom hooks (e.g., `use-mobile.ts`)
- `/src/services/state/` — Zustand state management

---

## Development Conventions

### Component Patterns

1. **"use client" directive** must be used for interactive components
2. **TypeScript-first** — define proper types/interfaces, use Zod schemas
3. **shadcn/ui consistency** — extend existing UI components rather than creating new ones
4. **Export-first** — export components/functions at the top, export fake/mock data at the bottom

### API Integration

- Use typed `requests` object from `/src/services/network/http.ts`
- Automatic token injection via axios interceptors
- Support both **admin (`adminToken`)** and **user (`token`)** authentication
- Fetch API data using `src/hooks/useAsync.ts` hook inside pages/components
- Use `fetch` for server actions
- Environment variable: `NEXT_PUBLIC_APP_ROOT_API` for base URL

### Styling Approach

- **Tailwind-first** with utility classes
- Use `cn()` utility for conditional class merging
- Mobile-first responsive design with Tailwind breakpoints

### Extra Considerations

- Avoid creating unnecessary files for small problems
- Do not add extra docs or examples without approval
- Keep components small, focused on a single responsibility
- Avoid unnecessary re-renders and complexity

---

## Development Workflow

### Scripts

- `bun dev` — start development server
- `bun build` — create production build
- `bun check` — TypeScript type checking without emit
- `bun lint` — run ESLint checks

### File Creation Guidelines

- Prefer using existing **shadcn/ui** components
- Add new UI components to `/src/components/ui/`
- API services should reside in `/src/services/api/` with proper TypeScript types
- Maintain consistency with established patterns for TypeScript typing and shadcn/ui usage

---

> **Note for GitHub Copilot:**  
> When generating code, follow these patterns strictly. Keep TypeScript-first, modular, and aligned with shadcn/ui and Tailwind CSS practices. Avoid introducing unnecessary complexity or unused files.
