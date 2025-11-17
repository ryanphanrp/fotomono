# @rp/ui

Common UI components package with shared React components and ShadUI primitives.

## Features

- **ShadUI Components**: Pre-built, accessible UI components based on Radix UI
- **Type-safe**: Full TypeScript support
- **Customizable**: Built with Tailwind CSS and class-variance-authority
- **Dark Mode**: Supports theming via next-themes

## Components

- `Button` - Versatile button component with variants
- `Card` - Card container with header, content, and footer
- `Checkbox` - Accessible checkbox component
- `DropdownMenu` - Feature-rich dropdown menu
- `Input` - Styled form input
- `Label` - Form label component
- `Skeleton` - Loading skeleton component
- `Toaster` - Toast notification component

## Usage

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

## Dependencies

This package depends on:
- `@rp/shared` - For the `cn()` utility function
- Radix UI primitives
- Tailwind CSS (should be configured in your app)
- next-themes (for theming support)
