# @rp/tsconfig

Shared TypeScript configurations for the fotomono monorepo.

## Available Configurations

- `base.json` - Base configuration for all TypeScript projects
- `library.json` - Configuration for library packages (extends base)
- `react-library.json` - Configuration for React library packages (extends library)
- `nextjs.json` - Configuration for Next.js applications

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@rp/tsconfig/library.json",
  "compilerOptions": {
    // Your custom options
  }
}
```
