# Coding Rules

## TypeScript

- strict types;
- avoid `any`;
- prefer explicit domain types;
- validate external input.

## React

- small focused components;
- composition over giant components;
- avoid unnecessary state;
- avoid effect for derived values;
- use semantic HTML.

## Next.js

- Server Components by default;
- client boundary only where needed;
- route handlers/server actions chosen intentionally;
- use `next/image`;
- use `next/font`.

## Styling

- Tailwind utility conventions;
- tokens via CSS variables;
- no random hex colors scattered throughout components;
- no huge inline style objects.

## Naming

- Component: PascalCase
- hooks: `useXxx`
- utilities: camelCase
- route folders: kebab-case

## Quality gates

- ESLint
- TypeScript
- production build
