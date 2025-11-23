# Shared Packages

This directory contains shared packages that are used across the fotomono monorepo.

## Package Overview

### [@rp/tsconfig](./tsconfig)
Shared TypeScript configurations for consistent compiler settings across all packages and apps.

**Available Configurations:**
- `base.json` - Base configuration for all TypeScript projects
- `library.json` - Configuration for library packages (extends base)
- `react-library.json` - Configuration for React library packages
- `nextjs.json` - Configuration for Next.js applications

**Usage:**
```json
{
  "extends": "@rp/tsconfig/library.json",
  "compilerOptions": {
    // Your custom options
  }
}
```

### [@rp/shared](./shared)
Shared utilities, helper functions, and application-wide constants.

**Features:**
- **Utilities**: `cn()` for Tailwind class merging, formatting helpers
- **Constants**: API, pagination, file upload, and date format constants

**Usage:**
```typescript
import { cn, formatDate, DEFAULT_PAGE_SIZE } from "@rp/shared";

const className = cn("text-base", isActive && "font-bold");
const formatted = formatDate(new Date());
```

### [@rp/ui](./ui)
Shared React UI components built with ShadUI primitives and Radix UI.

**Components:**
- Button - Versatile button with variants (default, destructive, outline, etc.)
- Card - Card container with header, content, and footer
- Checkbox - Accessible checkbox component
- DropdownMenu - Feature-rich dropdown menu
- Input - Styled form input
- Label - Form label component
- Skeleton - Loading skeleton
- Toaster - Toast notifications

**Usage:**
```tsx
import { Button, Card, CardHeader, CardTitle } from "@rp/ui";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <Button variant="default">Click me</Button>
    </Card>
  );
}
```

## Workspace Packages

### [@fotomono/api](./api)
Business logic and tRPC procedures for the application.

### [@fotomono/auth](./auth)
Better-Auth configuration and authentication utilities.

### [@fotomono/db](./db)
Drizzle schema and database queries for Supabase PostgreSQL.

## Adding a New Package

1. Create a new directory in `packages/`
2. Add a `package.json` with appropriate exports
3. Add a `tsconfig.json` extending from `@rp/tsconfig`
4. Implement your package
5. Update this README

## Package Dependencies

All shared packages follow these principles:

- **@rp/tsconfig**: No dependencies (pure TypeScript configs)
- **@rp/shared**: Minimal dependencies (clsx, tailwind-merge)
- **@rp/ui**: Depends on @rp/shared, Radix UI primitives, and next-themes

## Development

When working with packages:

1. **Install dependencies**: `bun install` from the root
2. **Build packages**: `bun run build` (handled by Turborepo)
3. **Type check**: `bun run check-types`
4. **Format code**: `bun run check` (runs Biome)

## Migration Guide

### Migrating from Local Components to @rp/ui

**Before:**
```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

**After:**
```typescript
import { Button } from "@rp/ui";
import { cn } from "@rp/shared";
```

### Migrating TypeScript Configs

**Before:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    // ... many options
  }
}
```

**After:**
```json
{
  "extends": "@rp/tsconfig/library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Benefits

1. **Code Reuse**: Share components and utilities across apps
2. **Consistency**: Uniform TypeScript configs and UI components
3. **Maintainability**: Single source of truth for shared code
4. **Type Safety**: Full TypeScript support across all packages
5. **Performance**: Reduced bundle size through shared dependencies
