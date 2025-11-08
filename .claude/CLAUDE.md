# AI Assistant Guidelines for fotomono

This is a **Better-T-Stack** monorepo using TypeScript, Next.js, Hono, tRPC, Drizzle ORM, and Better-Auth. The project follows strict code quality standards enforced by **Ultracite** (Biome preset).

## Project Architecture

- **Monorepo Structure**: Turborepo with Bun package manager
- **Frontend**: Next.js (apps/web) with TailwindCSS and shadcn/ui
- **Backend**: Hono server (apps/server) with tRPC API
- **Packages**:
  - `@fotomono/api`: Business logic and tRPC procedures
  - `@fotomono/auth`: Better-Auth configuration
  - `@fotomono/db`: Drizzle ORM schema and queries (PostgreSQL)

## Key Commands

- `bun run dev` - Start all apps in development
- `bun run dev:web` - Frontend only (http://localhost:3001)
- `bun run dev:server` - Backend only (http://localhost:3000)
- `bun run check` - Run Biome linting/formatting
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio

## Code Quality Tools

**Ultracite** is configured to automatically format code on file save via `.claude/settings.json` hooks.

- **Format code**: `npx ultracite fix`
- **Check for issues**: `npx ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `npx ultracite fix` before committing to ensure compliance.

---

## AI Assistant Workflow Guidelines

When working on this project, follow these practices:

### File Operations
- **Always read files before editing** - Never assume file structure
- **Use specific file paths** - Leverage the monorepo structure
- **Prefer editing over rewriting** - Use the Edit tool to modify existing files

### Code Changes
1. **Understand the context** - Read relevant files in the monorepo package
2. **Follow the architecture** - Respect separation between apps and packages
3. **Type safety first** - Ensure TypeScript types are correct
4. **Test your changes** - Run `bun run check-types` to verify
5. **Format automatically** - Ultracite runs on Edit/Write via hooks

### Monorepo Navigation
- Frontend code: `apps/web/`
- Backend code: `apps/server/`
- Database schema: `packages/db/src/schema/`
- Auth logic: `packages/auth/`
- API procedures: `packages/api/`

### Common Tasks
- **Add a new API endpoint**: Create tRPC procedure in `packages/api/`
- **Database changes**: Update schema in `packages/db/src/schema/`, then run `bun run db:push`
- **Frontend component**: Add to `apps/web/components/` or `apps/web/app/`
- **Authentication**: Modify `packages/auth/`

### Before Committing
- Types must pass: `bun run check-types`
- Code must be formatted: Ultracite runs automatically via hooks
- Consider running: `bun run check` for additional validation
