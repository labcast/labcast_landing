# Labcast landing

The public waitlist website for [Labcast](https://labcast.ai), a product in development that handles live broadcast production from phone cameras. Static Astro pages, prepared for Netlify hosting and Netlify Forms.

## Development

Nix supplies Node.js 26, Corepack, the pinned pnpm, Git, and the GitHub CLI. Entering the shell prepares locked dependencies. `direnv allow` can load the same shell through `.envrc`.

```sh
nix develop
pnpm dev
pnpm verify
pnpm preview
```

`verify` checks Astro/TypeScript and builds into `dist/`. Run `pnpm format` after editing and `pnpm format:check` for a formatting check. The supported TypeScript major remains 6. GSAP ScrollTrigger powers the scroll-controlled story; the Astro framework and existing package conventions are preserved.

## Project structure

- `src/content.ts`: shared copy, audience descriptions, FAQ, domain, contact email, and signup wording version.
- `src/pages`: homepage, optional follow-up, privacy, credits, and 404.
- `src/components`: page sections and the illustrated scroll story.
- `src/layouts/Page.astro`: metadata, local fonts, and shared document layout.
- `src/styles`: global foundations and section styles.
- `src/scripts`: menu, scroll animation, form handling, and optional details.
- `src/assets`: three prepared photos and eight original cartoon illustrations. Astro generates responsive WebP renditions.
- `public`: brand artwork, discovery files, and font licenses.
- `docs`: verification, asset provenance, and deployment handoff.

The source research lives beside this repository at `../research/`: `website.md`, `graphics.md`, and `prompt.md`. The website clearly distinguishes planned capabilities and product visualizations from actual product evidence.

## Netlify

Use the existing repository settings:

- Base directory: repository root.
- Build command: `pnpm run verify`.
- Publish directory: `dist`.
- Node version: `.node-version`; package manager: `package.json`.

Netlify installs dependencies with the committed lockfile. Static output needs no server adapter. Production metadata uses `https://labcast.ai`; set `SITE_URL` only if changing the primary domain, and update the static sitemap/robots destination at the same time.

The website defines two forms: **waitlist** (email first) and **details** (optional follow-up). Enable Netlify form detection before deploying. There is no separate signup database or newsletter service.

The JavaScript checks that Netlify processed the form before accepting a successful HTTP response. Netlify removes `data-netlify` during registration; if the attribute remains, the page explains that this preview cannot save submissions. This prevents a static preview's HTTP 200 from becoming a false success. Without JavaScript, the forms retain native POST behavior and the follow-up page uses neutral wording.

Local response simulations validate the browser behavior, not Netlify storage. Follow [the deployment checklist](docs/deployment.md) before promoting the public waitlist.

## Operations

Public contact and list removal requests use **hello@labcast.ai**, supplied by the founder. Its mailbox delivery still needs to be checked before launch. No email messages are sent automatically by this website. Configure team notifications in Netlify separately; newsletters, double opt-in, and automated unsubscribes are not implemented.

The only browser storage is a temporary, tab-scoped signup handoff to the optional details page. No advertising or analytics scripts are included. Source/campaign labels, when present, accompany form submissions. Use form exports and the documented process for deduplication and qualified-demand reporting.

## Verification and provenance

- [Checks and evidence](docs/checks.md)
- [Deployment and waitlist operations](docs/deployment.md)
- [Storyboard and motion direction](docs/storyboard.md)
- [Creative assets](docs/assets.md)
- [Illustration prompts](docs/prompts.md)
- [Selected image source manifest](docs/assets.json)

The existing GitHub check workflow runs repository verification. The original template's MIT license is retained in `LICENSE`; font licenses accompany the served assets. Stock photography is credited separately.

### Mobile Safari checks

Portrait phones keep the seven animated chapters even below 700px browser height. All devices use native document scrolling and the original sticky header. Reduced motion, no JavaScript, and short landscape layouts retain every scene.

`docs/qa/safari.cjs` checks the iPhone 15 Pro Max profile in WebKit, including expanded-toolbar heights, scene fit, menu anchors, reduced motion, and no-JavaScript fallback. Run it with Playwright/WebKit available in `NODE_PATH` and optional `LABCAST_BASE_URL`. The 659px case substitutes a 59px top safe area in served CSS; these engine checks do not reproduce Safari's native status bar UI.
