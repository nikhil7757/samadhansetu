# Repository Guidelines & Operational Rules

## 1. Comprehensive Frontend UI Overhauls

When the user requests a complete redesign or provides standalone code (HTML/CSS/JS or new framework templates) to replace the frontend UI:

1. **Synchronize All Resolution Vectors**:
   - Never stop at creating an isolated `/preview.html` or secondary file.
   - Update **every** active entrypoint serving the root path:
     - `frontend/index.html`
     - Root static HTML file (`ironforge.html` or equivalent)
     - `frontend/public/` static mirrors
     - Framework router landing components (e.g., `Landing.tsx` or `App.tsx`)
2. **Safe Preservation**:
   - Always back up the existing application before replacing it (e.g., `Landing.civic.tsx`, `index.civic.html`). Never delete or overwrite functional complex code unrecoverably.
3. **SPA Bridge / Fallback**:
   - If an existing client-side router is active, ensure the root route (`/`) renders the new design or seamlessly transfers window control to the new HTML entrypoint to prevent stale React Router caches from presenting old interfaces.

## 2. Deployment Build Resilience (Ponytail Principle)

1. **Zero-Dependency Static Packaging**:
   - When shifting to a static or CDN-driven frontend, decouple `npm run build` from brittle devDependencies (`tsc -b`, heavy bundlers, or uninstalled plugins).
   - Use a lightweight, portable standard library Node script (`build.js` using `fs.cpSync` / `fs.copyFileSync`) so production builds (Vercel, Cloudflare, Netlify) succeed in milliseconds.
2. **Never Let Silent Build Failures Mask UI Updates**:
   - Verify that production deployment pipelines succeed and do not stall on stale build caches.
