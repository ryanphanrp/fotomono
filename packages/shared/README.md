# @rp/shared

Shared utilities, functions, and constants for the fotomono monorepo.

## Features

- **Utilities**: Common utility functions like `cn()` for class merging, formatting helpers
- **Constants**: Application-wide constants for API, pagination, file uploads, etc.

## Usage

```typescript
import { cn, formatDate, DEFAULT_PAGE_SIZE } from "@rp/shared";

// Merge CSS classes
const className = cn("text-base", isActive && "font-bold");

// Format dates
const formatted = formatDate(new Date());

// Use constants
const pageSize = DEFAULT_PAGE_SIZE;
```

## Structure

```
src/
├── utils/          # Utility functions
│   ├── cn.ts       # Class name merging
│   └── format.ts   # Formatting helpers
├── constants/      # Application constants
│   └── index.ts
└── index.ts        # Main exports
```
