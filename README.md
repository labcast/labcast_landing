# Labcast landing

The single-page public website for [Labcast](https://labcast.ai), an event broadcasting product in development. Built with Astro and deployed as static files on Netlify.

## Development

Nix supplies Node.js 26, Corepack, the pinned pnpm, Git, and the GitHub CLI. Entering the shell automatically installs the locked project dependencies. Nothing needs to be installed globally.

```sh
nix develop
pnpm dev
```

`direnv allow` can load the same shell through `.envrc`. The first startup downloads the tools and packages; later startups reuse the caches. CI uses this same flake. `.node-version` selects the Node major for both Nix and Netlify; `package.json` selects pnpm.

```sh
pnpm verify
pnpm preview
```

`verify` checks Astro and TypeScript, then builds the site into `dist/`. TypeScript 6 is the latest major supported by the current Astro checker; Astro explicitly rejects TypeScript 7.

## Editing

- `src/content.ts`: public copy, questions, navigation, and the production domain.
- `src/pages/index.astro`: the order of the sections; the only HTML page.
- `src/components`: one component per section, plus the illustrated production preview.
- `src/layouts/Page.astro`: shared HTML, metadata, and local font imports.
- `src/styles/global.css`: colors, typography, reset, and shared base rules.
- `src/styles/page.css`: shared layout primitives and common responsive rules.
- `src/styles/<section>.css`: each section's own styles and breakpoints, imported by its component.
- `src/styles/studio.css`: production preview styles.
- `src/scripts`: menu, camera selection, and form confirmation behavior.
- `public`: favicon, social preview, and robots file.

Use `pnpm format` after editing. Keep product claims aligned with the actual development stage.

## Netlify

Import this GitHub repository into Netlify. Use these repository settings:

- Base directory: repository root.
- Build command: `pnpm run verify`.
- Publish directory: `dist`.
- Node version: read from `.node-version`.
- Package manager: read from `package.json`.

Netlify installs dependencies automatically; `PNPM_FLAGS` requires the committed lockfile. The site uses static output and does not need the Netlify server adapter. Production metadata uses `https://labcast.ai`; set `SITE_URL` only when changing the primary domain. Set `labcast.ai` as the primary domain in Netlify and configure its DNS there.

The enquiry form uses Netlify Forms. Enable form detection in Netlify before deploying, verify the `pilot` form appears after deployment, and configure submission notifications for the team. The form returns to the same page after a successful submission. Local Astro servers do not process form submissions. Browser form checks do not verify Netlify delivery; send one real test enquiry after deployment.

## GitHub

The `Check` workflow checks all supported Nix shells, then runs `nix develop --command pnpm verify` for pull requests and pushes to `main`. Dependabot checks npm packages and GitHub Actions weekly. Update Nix tools with `nix flake update`; update project packages with `pnpm update --latest`, retaining the TypeScript major supported by `@astrojs/check`.

## Content

The site describes planned capabilities and clearly labels the production illustration as a concept preview. It does not claim a released product, customers, or live integrations. No visitor analytics or third-party scripts are included. Fonts are served locally.

The original template's MIT license is retained in `LICENSE`.

Validation results and the checks to complete after deployment are recorded in [docs/checks.md](docs/checks.md).
