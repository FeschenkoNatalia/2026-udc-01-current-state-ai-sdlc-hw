<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Instructions

## 1. Stack and Versions
- **Framework**: Next.js (version 16.2.7)
- **Libraries**: React (version 19.2.4), React DOM (version 19.2.4)
- **Language**: TypeScript (version ^5), @types/node (^20)
- **Styling**: Tailwind CSS (version ^4) utilizing @tailwindcss/postcss
- **Linting**: ESLint (version ^9) configured with eslint-config-next (16.2.7)
- **Package Manager**: npm

## 2. Commands
- **dev**: `npm run dev` (Starts the local Next.js development server)
- **build**: `npm run build` (Compiles and creates an optimized production build)
- **test**: `npm run lint` (Runs ESLint static code analysis; no separate testing framework is configured)

## 3. Conventions
- **Naming**: UI components and page files must strictly use `PascalCase` (e.g., `UserProfile.tsx`). Custom hooks must use `camelCase` and start with the mandatory `use` prefix (e.g., `useAuth.ts`).
- **Structure**: Adhere strictly to the Next.js routing structure. Extract reusable UI components into a dedicated `components/` directory to separate UI logic from page routes.
- **Coding Style**: Write clean, declarative functional components using React hooks. Use Tailwind CSS v4 utility classes exclusively for styling, avoiding inline styles entirely.
- **TypeScript**: Always strictly define explicit types or interfaces for component props using TypeScript v5 capabilities. The use of the `any` type is completely prohibited.

## 4. Guardrails
- **Configuration Files**: Never modify or alter root configuration files, including `tsconfig.json`, Tailwind CSS configuration setups, ESLint profiles, or environment variables (`.env`, `.env.local`).
- **Third-Party Dependencies**: Do not install any new npm packages into `dependencies` or `devDependencies` without explicit developer permission. Work strictly with what is available in `package.json`.
- **Rendering Directives**: Do not introduce `"use client"` or `"use server"` directives into components unless structurally necessary (e.g., when browser APIs, state, or hooks like `useEffect` are mandatory). Default to Server Components where applicable.

