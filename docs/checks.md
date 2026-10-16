# Checks — 2026-10-16

- Nix development shell supplies Node.js 26.12.0, Corepack 0.36.0, pnpm 12.14.0, Git, and GitHub CLI.
- Shell startup prepares locked project dependencies automatically.
- All declared Nix shells evaluate: Apple Silicon macOS, ARM Linux, and x86 Linux.
- Astro 7.4.0 and TypeScript 6.0.3: zero check errors, warnings, or hints; one static HTML page built.
- TypeScript 7.0.2 is available but explicitly unsupported by the current Astro checker; retain 6.0.3 until that changes.
- Chromium browser checks: camera selection, FAQ expansion, menu opening, Escape dismissal, and navigation closing passed.
- No horizontal overflow at widths 320, 375, 390, 600, 768, 850, 1024, 1440, 1920 pixels.
- Axe WCAG 2 A/AA and 2.1 AA scans: zero violations on desktop and mobile.
- No page errors, missing assets, or third-party network requests during browser checks.
- Mobile navigation remains available with JavaScript disabled.
- Required form validation and a simulated local POST/redirect/confirmation passed.

## Deployment checks remaining

Netlify Forms delivery was not tested locally. Enable form detection in Netlify, deploy, confirm the `pilot` form is detected, configure team notifications, and submit a real test enquiry. DNS and production TLS need checking after connecting `labcast.ai` to the Netlify site.
