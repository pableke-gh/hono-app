# Copilot Instructions for hono-app

## Project Overview
- This is a Node.js/TypeScript web application with a modular architecture.
- Main app logic is in `src/`, with subfolders for components, controllers, DAO (data access), layouts, routes, and more.
- Frontend assets (JS, CSS, images) are in `src/public/`.
- Views are in `views/`, organized by feature/module.

## Key Patterns & Structure
- **Components**: Reusable UI in `src/components/` (e.g., `Alerts.tsx`, `Buttons.tsx`).
- **Controllers**: Route logic in `src/controllers/` (e.g., `admin.tsx`, `login.tsx`).
- **DAO**: Data access split by backend (`src/dao/sqlite/`, `src/dao/supabase/`).
- **Layouts**: Page templates in `src/layouts/`.
- **Routes**: Route definitions in `src/routes/`.
- **Types**: Shared TypeScript types in `types/`.
- **Lib**: Utilities and mailer in `src/lib/`.
- **i18n**: Language files in `src/i18n/`.

## Developer Workflows
- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (see `README.md`)
- **Open app**: [http://localhost:3000](http://localhost:3000)
- **Tests**: See `tests/` for test files (run with your preferred Node.js test runner)
- **Build config**: See `tsconfig.json`, `gulpfile.js` for build details

## Project Conventions
- Use TypeScript for all new code (see `types/` for shared types)
- Organize features by folder (e.g., `views/presto/`, `src/controllers/`)
- Use `.tsx` for React-like components, `.js` for logic/utilities
- Data access is abstracted via DAOs; do not access DB directly from controllers
- Internationalization via `src/i18n/`
- Static assets (CSS, images) in `src/public/`

## Integration Points
- **Database**: SQLite and Supabase supported (see `src/dao/`)
- **Mailer**: `src/lib/mailer.js`
- **i18n**: `src/i18n/`

## Examples
- Add a new page: create a view in `views/`, controller in `src/controllers/`, and route in `src/routes/`
- Add a new DAO: implement in `src/dao/sqlite/` or `src/dao/supabase/` and register in `src/dao/factory.js`

## References
- `README.md` for quickstart
- `tsconfig.json`, `gulpfile.js` for build details
- `src/dao/factory.js` for DAO registration

---
For questions, follow the structure of existing files and prefer composition over duplication. When in doubt, check similar modules for patterns.
