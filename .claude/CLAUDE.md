# AI Assistant Guidelines for fotomono

This is a **Better-T-Stack** monorepo using modern TypeScript tooling for full-stack development. The project follows strict code quality standards enforced by **Ultracite** (Biome preset).

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **React Query** - Server state management and data fetching

### Backend
- **Hono** - Lightweight, performant web framework
- **tRPC** - End-to-end type-safe APIs
- **Better-Auth** - Modern authentication solution

### Database & Storage
- **Supabase (PostgreSQL)** - Hosted PostgreSQL database
- **Prisma** - Type-safe ORM and database toolkit
- **Upstash Redis** - Serverless Redis for caching
- **Cloudflare R2** - S3-compatible object storage

### DevOps & Monitoring
- **Sentry** - Error tracking and performance monitoring
- **Turborepo** - High-performance build system for monorepos
- **Bun** - Fast all-in-one JavaScript runtime and package manager

## Project Architecture

- **Monorepo Structure**: Turborepo with Bun package manager
- **Frontend**: Next.js 15 (apps/web) with Tailwind v4 and shadcn/ui
- **Backend**: Hono server (apps/server) with tRPC API
- **Packages**:
  - `@fotomono/api`: Business logic and tRPC procedures
  - `@fotomono/auth`: Better-Auth configuration
  - `@fotomono/db`: Prisma schema and database queries (Supabase PostgreSQL)

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

**Next.js 15:**
- Use Next.js `<Image>` component for images
- Use App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components
- Leverage Server Actions for mutations when appropriate
- Use `next/link` for client-side navigation

**React Query:**
- Use `useQuery` for data fetching and caching
- Use `useMutation` for create/update/delete operations
- Configure proper cache invalidation with `queryClient.invalidateQueries`
- Leverage optimistic updates for better UX

**Prisma:**
- Define schema in `packages/db/src/schema/schema.prisma`
- Use `prisma generate` after schema changes
- Use `prisma db push` for development, `prisma migrate` for production
- Leverage Prisma Client's type-safe query API
- Use transactions for related operations

**tRPC:**
- Define procedures in `packages/api/`
- Use proper input validation with Zod schemas
- Leverage type inference for end-to-end type safety
- Use middleware for authentication and logging

**Better-Auth:**
- Configure providers in `packages/auth/`
- Use session management with proper cookie settings
- Implement CSRF protection for mutations
- Validate auth state on both client and server

**Tailwind CSS v4:**
- Use utility classes instead of custom CSS when possible
- Extract repeated patterns into components
- Use `@apply` sparingly - prefer composition
- Leverage Tailwind's design tokens for consistency

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
- **Add a new API endpoint**: Create tRPC procedure in `packages/api/` with Zod input validation
- **Database changes**:
  - Update Prisma schema in `packages/db/src/schema/schema.prisma`
  - Run `bun run db:push` for development or `bun run db:migrate` for production
  - Run `bun run db:generate` to regenerate Prisma Client
- **Frontend component**: Add to `apps/web/components/` or `apps/web/app/`
- **Authentication**:
  - Configure providers in `packages/auth/`
  - Add auth middleware to protected routes
- **Caching with Redis**: Use Upstash Redis for session storage, rate limiting, or data caching
- **File uploads**: Integrate Cloudflare R2 for S3-compatible object storage
- **Error tracking**: Configure Sentry for error monitoring and performance tracking
- **Data fetching**: Use React Query hooks with tRPC for type-safe queries

### Environment Configuration

Environment variables should be configured in:
- `apps/web/.env.local` - Frontend environment variables
- `apps/server/.env` - Backend API keys and secrets

Key services requiring configuration:
- **Supabase**: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **Upstash Redis**: `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`
- **Cloudflare R2**: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- **Sentry**: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- **Better-Auth**: `AUTH_SECRET`, provider-specific keys (Google, GitHub, etc.)

### Before Committing
- Types must pass: `bun run check-types`
- Code must be formatted: Ultracite runs automatically via hooks
- Consider running: `bun run check` for additional validation
- Never commit `.env` files - use `.env.example` for documentation
