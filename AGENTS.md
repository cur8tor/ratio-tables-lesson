# AGENTS.md

## Cursor Cloud specific instructions

This is a purely client-side Vite + React 19 + TypeScript + Tailwind CSS single-page app. No backend, no database, no persistence.

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (serves at http://localhost:5173) |
| Lint | `npm run lint` |
| Build | `npm run build` (runs `tsc -b && vite build`) |
| Preview prod build | `npm run preview` |

### Notes

- `npm run lint` exits non-zero due to pre-existing React Compiler memoization warnings in `src/App.tsx` and a setState-in-effect warning in `src/components/steps/StepTableStarter.tsx`. These are known issues in the existing code, not regressions.
- There are no automated tests configured (no test runner or test scripts in `package.json`).
- The project uses npm (lockfile: `package-lock.json`).
