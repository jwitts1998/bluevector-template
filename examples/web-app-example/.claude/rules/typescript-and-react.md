---
description: TypeScript and React conventions for CollabDocs
paths: ["**/*.{ts,tsx}"]
alwaysApply: false
---

# TypeScript & React Conventions

## TypeScript

- Use strict mode (`"strict": true` in tsconfig)
- Prefer `interface` over `type` for object shapes
- Use explicit return types on exported functions
- Avoid `any`; use `unknown` and narrow with type guards

## React Components

- Use functional components exclusively
- Extract reusable logic into custom hooks (`use` prefix)
- Colocate component styles (Styled Components or Tailwind classes)
- Keep components under 200 lines; extract sub-components when larger

## State Management (Redux Toolkit)

- Define slices in `features/<name>/slice.ts`
- Use `createAsyncThunk` for async operations
- Select state with typed selectors (`useAppSelector`)
- Dispatch with typed dispatch (`useAppDispatch`)

## Naming

- **Components**: PascalCase (`DocumentEditor.tsx`)
- **Hooks**: camelCase with `use` prefix (`useDocument.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_DOCUMENT_SIZE`)
