# Verification — October 16, 2026

This record covers the local Labcast waitlist website. It does not establish live Netlify storage, mailbox delivery, production performance, or working broadcast-platform integrations.

## Build

- `nix develop --command pnpm verify`: Astro and TypeScript pass with zero errors, warnings, or hints; five static routes built.
- `nix flake check --all-systems --no-build`: all three declared shells evaluate (Apple Silicon macOS, ARM Linux, x86 Linux).
- GSAP 3.15.0 was added for scroll-driven motion. The existing Astro, TypeScript, Nix, and pnpm conventions remain.
- Original illustrations are retained as PNG sources; the build serves responsive WebP derivatives.

## Browser verification

Local Google Chrome driven by Playwright; desktop 1440 × 1000 and phone 390 × 844, plus intermediate layouts. Evidence and reproducible scripts:

| Record                                                                        | Coverage                                                                                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [preview/checks.json](preview/checks.json) / [qa/browser.cjs](qa/browser.cjs) | 17 checks covering metadata, forms, menus, FAQ, public copy, responsive widths, fallback behavior, images, and browser errors.              |
| [preview/edges.json](preview/edges.json) / [qa/edges.cjs](qa/edges.cjs)       | Six additional checks covering routes, doubled desktop base text, request timeout, network failure, denied storage, and resource responses. |
| [preview/story.json](preview/story.json) / [qa/story.cjs](qa/story.cjs)       | All seven scenes at two viewports; reverse scroll, stationary holds, pinning, changed reduced-motion preference, and short-window fallback. |
| [storyboard.html](storyboard.html)                                            | Desktop and mobile captures for every feature, plus the full-screen opening.                                                                |

No horizontal overflow at 320, 375, 390, 600, 768, 850, 1024, 1440, or 1920 pixels. Route checks also cover 320, 390, 768, and 1440 pixels. Axe WCAG 2 A/AA and 2.1 AA scans report zero violations in six page/viewport combinations. No JavaScript errors or third-party browser requests were observed. These automated results complement visual review; they do not certify every accessibility behavior or browser.

The scroll story has native forward/reverse scrolling and readable holds. Its first-frame exposure does not require clicking Play. All seven features remain in normal document flow with reduced motion, no JavaScript, and short landscape windows. A screen-reader transcript exposes the entire narrative when visual scenes are pinned. There is no progress bar or timer. Menu keyboard handling and visible focus remain available.

## Form evidence

Both static Netlify forms are present: `waitlist` and optional `details`. An unprocessed preview refuses to claim a saved submission. Tests simulate Netlify’s form transformation and HTTP responses to verify validation, URL encoding, attribution, accepted states, retained input after errors, retry, duplicate-submit prevention, timeout, and private email handoff. A test changes the visible email while a request is pending and confirms the submitted email remains authoritative.

Optional details preserve the initial signup and respect the separate `access-contact` permission. Direct or refreshed visits to `/thanks/` do not fabricate success. Blocked storage leaves signup usable; denied clipboard access exposes a share link. No welcome email, newsletter, or automated unsubscribe is claimed.

## Loading and responsiveness

[preview/performance.json](preview/performance.json) records cold-cache local samples with 150 ms simulated latency, 1.6 Mbps download, and 4× CPU slowdown. The mobile sample is about 2.1 seconds LCP with CLS about 0.003; the desktop sample is about 5.2 seconds LCP with CLS about 0.004. The added illustrations and entrance motion increase loading cost under this slow connection. Loading performance needs further optimization and rechecking on the actual host. No field percentile or field INP has been measured. Scripted interaction samples are not field INP.

The hero has loading priority, feature images use responsive sizes and low priority, and remaining frames are warmed as the story enters view. The original artwork is not downloaded directly. Local measurements do not establish Netlify CDN behavior or Safari/in-app browser results.

## Reproducing browser checks

The QA scripts use Playwright and `@axe-core/playwright` from a separate test environment. They do not add browser tooling to the website’s production dependencies. Set `NODE_PATH` to that environment’s `node_modules`, `LABCAST_BASE_URL` to a running local build, and optionally `LABCAST_CHROME` to the installed browser. `LABCAST_QA_OUTPUT` can override `docs/preview`.

Run `node docs/qa/browser.cjs`, `node docs/qa/edges.cjs`, and `node docs/qa/story.cjs`. Run `node docs/qa/performance.cjs` separately from other browser work to avoid competing for CPU. Review the screenshots, not only the JSON results.

## Publication checks remaining

See [deployment.md](deployment.md). Before promotion, verify Netlify form detection and a genuine retained submission, spam handling, notifications if enabled, mailbox delivery to `hello@labcast.ai`, DNS, HTTPS, and actual devices. No deployment, DNS changes, outreach, or paid services were performed. Twitch, YouTube, TikTok, and Instagram are presented as planned destinations, not verified product integrations.

## Event marquee and comic treatment revision

The updated build passes Astro/TypeScript checks across 25 files. Browser/form checks, six automated accessibility scans, all nine responsive widths, and the seven-scene desktop/mobile scroll checks were repeated after the revision and pass. [preview/showcase.json](preview/showcase.json) records seven additional checks: compact signup spacing, full-width unboxed placement, automatic movement without controls, hover/focus pause, all five bubbles over a complete 35-second loop, no empty loop seam, unclipped bubble top edges, offscreen suspension, and reduced-motion/no-JavaScript lists. Four new original illustrations are recorded in [marquee-prompts.md](marquee-prompts.md) and the asset manifest.

### Quieter composition and separate event section

The comic texture is now at half strength, card shadows are 4px, and rotation is 0.5°. Desktop/mobile browser sampling confirmed only one bubble visible during transitions, no clipping, and no horizontal overflow. The marquee is now a separate section below the hero, replacing the green audience strip; its full-loop checks were repeated successfully. The desktop headline and signup are vertically centered together, with responsive browser captures at 1440×1000, 1440×800, and 390×844. Astro/TypeScript and the static build pass. The previous performance samples describe the earlier marquee-in-hero composition.

### Stopped-scroll transition fix

Replaced scroll-scrubbed opacity crossfades with chapter selection plus a 480ms timed crossfade. The incoming scene fades over a fully opaque previous scene; there is no wipe. Scene actions finish independently after entry, so a stopped scroll cannot leave overlapping translucent headings or artwork. Rapid reversals cancel and settle the preceding fade before displaying the requested chapter. The pin now starts at the sticky element itself, accounting for the section border.

`qa/story.cjs` passes seven checks, including 24 stopped-boundary samples across desktop and mobile, rapid direction changes, fourteen scene captures, stationary holds, changed reduced-motion preferences, and the short-window fallback. Every stopped sample has exactly one visible, fully opaque, unclipped scene. See `preview/transition-hold-1440.png` and `preview/transition-hold-390.png`. No browser errors or horizontal overflow were observed.

### One gesture per chapter — superseded

The earlier version of `qa/chapters.cjs` recorded six passing gesture checks (superseded by the native-scroll revision below): a large entry scroll reaches scene one, six large wheel gestures visit every remaining scene in sequence, lingering momentum cannot advance again, reverse gestures preserve order, both ends release the page, small trackpad deltas form one step, keyboard navigation moves one scene, reduced motion removes interception, and a long phone swipe moves only one chapter. No browser errors were observed. The build and TypeScript checks pass across 26 files.

### Native scrolling, persistent broadcast, and brand refresh — October 16, 2026

Supersedes the one-gesture lock above, following the founder's explicit preference for native scrolling. Removed `chapters.ts` and all story wheel/touch/keyboard interception. Each chapter has one viewport of reading space. A persistent broadcast image remains stationary and opaque across chapters 1–4; artwork-source changes and feature overlays fade on their own timelines. Captions fade sequentially, without overlapping headlines. The page uses illustrated media, not videos.

- `qa/chapters.cjs`: seven passing checks covering unblocked small wheel movements, large movements exiting both ends, native phone swipes, and repeated samples of persistent-image opacity/position and caption separation at 1440px and 390px.
- `qa/story.cjs`: seven passing checks, 14 scene captures, all boundary holds, rapid direction changes, reduced-motion changes, and short-screen fallback. No browser errors.
- `qa/browser.cjs`: 17 passing checks including form behavior and static fallbacks; no overflow at nine widths from 320px to 1920px; six axe scans with zero violations. No JavaScript errors or external browser requests. Automated scans do not replace manual accessibility review.
- Original play-flask silhouette replaces the former frame/play symbol in navigation, feature art, closing poster, footer, favicon, and social assets. `public/logo.svg` is the standalone export.
- Local Simple Icons SVGs identify the four planned streaming destinations; source and license are recorded in `assets.md` and public credits.
- Closing poster, FAQ styling, and footer were inspected in desktop and mobile screenshots (`closing-*`, `footer-*`, `platforms-*`).

Apple reference inspection and the resulting motion decisions are recorded in `storyboard.md`. Historical performance measurements above predate this refresh; no new performance benchmark is claimed. The Netlify deployment and live form storage remain unverified in this local-only revision.

### Logo replacement — October 16, 2026

The founder rejected the flask direction. It is superseded by an original geometric mark: three upright feed shapes join one outgoing band across a diagonal cut. Six vector directions were compared before refining this composition. Updated the shared SVG component, standalone logo, favicon, social SVG/PNG, and closing motion name. `preview/brand.png` shows the mark with the wordmark, reversed, in ink, and at 16/24/32/48px. Header, closing, and footer were captured at 1440px and 390px; no horizontal overflow or browser errors were observed. This revision changes brand artwork only, with the closing mark held upright during its gentle floating motion.

### Rounded logo revision — October 16, 2026

Supersedes the angular mark above. Compared four rounded directions and selected a thick rounded L with an oversized live dot. The primary version uses an orange dot, while broadcast badges retain a single-color mark. Updated all shared placements, the favicon, and social artwork. Added `public/logo-mono.svg` alongside the primary `public/logo.svg`. The refreshed `preview/brand.png` includes primary, reversed, monochrome, and 16/24/32/48px samples. Desktop and mobile header/closing/footer checks passed without overflow or browser errors.

### Mobile safe areas and sharing metadata — October 16, 2026

Added `viewport-fit=cover`, safe-area header padding, and an opaque extension above the sticky header to cover content during Safari toolbar movement and elastic scrolling. Header height is shared by the hero, chapter viewport, and anchor spacing; centered containers respect landscape safe areas.

Validation: `pnpm verify` passes across 27 Astro files and five routes. Header position, menu behavior, chapter/header alignment, and overflow were checked in Chrome and WebKit at 390×844, 844×390, and 1440×1000. Additional Chrome checks substituted 47px top and 59px landscape safe-area values in served CSS. These are browser-engine and simulated-inset checks; physical iPhone Safari toolbar behavior still needs device confirmation. The standard browser suite passed all 17 checks, with zero overflow at nine widths and zero violations in six axe scans.

SEO/sharing: refreshed the 1200×630 PNG/SVG card with the current logo and crew illustration; added 48/96px PNG favicons, a 180px Apple touch icon, and a 512px logo. Added homepage `Organization` and `WebSite` JSON-LD, descriptive title/description, complete image metadata and alt text for Open Graph/Twitter cards, and large-image preview permission. Generated HTML for all five routes was parsed: canonical/image URLs agree, JSON-LD parses, and thanks/404 keep `noindex`. PNG signatures and dimensions were verified. Actual Slack unfurling and Google indexing cannot be inferred from local checks.

Production observations during this revision: HTTPS at `labcast.ai` returns the Labcast page, `www.labcast.ai` redirects to it, and the Netlify badge script is no longer injected on either production hostname. The initial GoDaddy response was observed during the DNS transition. The live forms still contained `data-netlify` when checked; automatic form detection must be enabled in the correct Netlify project and a new deploy processed before signup storage is considered available. No live form submissions were sent.

### Safari portrait story and stationary top frame — October 16, 2026

Reproduced the reported static-story behavior in the iPhone 15 Pro Max WebKit profile: the existing 700px height gate enabled the story at 430×739 and disabled it at 430×699/659. Removed that gate for portrait phones and added compact chapter layouts. All seven animated chapters and clock-completed fades remain; reduced-motion and no-JavaScript fallbacks are preserved.

On touch devices, the header now lives outside a native page scroller. The outer document stays at scroll position zero with a solid paper background, avoiding moving artwork in Safari's status-bar sampling area. The header stays fixed, and both GSAP stories share the page scroller. Desktop retains document scrolling. No wheel/swipe interception or gesture cooldown is added.

`qa/safari.cjs` passed all chapters forward/reverse, no copy/art overlap or clipping, header position, and menu anchors at 430×739, 699, 659, and 580. The 659px repeat also passed with a simulated 59px top inset. Reduced motion and no-JavaScript checks passed. `qa/chapters.cjs` passed all seven checks, including a real Chromium touch gesture inside the new scroller; the standard browser suite passed 17 checks and six axe scans without violations. These are WebKit/Chromium and simulated-inset checks, not physical iPhone Safari chrome verification.

The prior PNG export fault was corrected in PR #2 by rendering directly from SVG with Sharp. Production bytes for the 96px icon, Apple icon, and 512px logo matched the corrected local files. Production HTTPS, metadata, absence of the Netlify badge, and processed form definitions were verified; no live form submissions were sent.

### Restore native document scrolling — October 16, 2026

Supersedes the inner scroller above. The founder reported severe scene vibration on the physical iPhone after that change and requested the original scrolling behavior with no further motion changes. Removed the page scroller, stationary outer document, and GSAP scroller override; restored native document scrolling and the original sticky header. Kept the portrait height correction and compact scene sizing, so short portrait phones still receive the animated story. The fade timelines and persistent broadcast artwork are unchanged.

The production WebKit check also exposed intermittent first-entry pin positioning with the inner scroller and simulated safe-area CSS. Preview checks had passed; those results did not establish physical-device smoothness.

After restoring document scrolling, `qa/safari.cjs` passed all seven chapters forward/reverse at 430×739, 699, 659 (simulated 59px inset), and 580, plus menu anchors, reduced motion, no JavaScript, and no page errors. `pnpm verify` passes.

### Consistent controls and browser appearance — October 16, 2026

Replaced action arrows, checkmarks, replay glyphs, and FAQ/menu symbols with one original SVG icon component. The mobile menu has a 44px ink/lime toggle that transitions to a close icon and a separate, numbered navigation panel. Opening it does not resize the sticky header or change story geometry. Escape returns focus; selecting a link, clicking outside, moving focus outside, and resizing to desktop close the panel. Safari button colors are explicit. Primary controls, links, FAQ disclosure, fields, and selected options have short press/focus/hover transitions; reduced motion disables them.

Mobile scene rows share caption/artwork tracks with CSS subgrid, replacing the stretched first row. The persistent broadcast remains aligned through feature scenes. WebKit checks at 550×1000 and 430×932 measured a 20px caption-to-art gap in the streaming chapter. All seven chapters pass forward/reverse and fit checks at the four shorter iPhone sizes, including simulated safe-area padding.

Added a browser-mode web manifest, 192px app icon, application name, Apple home-screen title, and explicit light color scheme. The existing theme color and touch icon remain. No service worker, offline cache, standalone mode, or install prompt was added. Safari toolbar sampling is controlled by the browser; physical toolbar color cannot be established by WebKit automation. See [the WebKit explanation](https://bugs.webkit.org/show_bug.cgi?id=301756#c2). The footer includes the bottom safe area. The outer document canvas matches the dark footer, while the body retains its paper background, so bottom overscroll reveals ink instead of a light strip.

Validation: Astro/TypeScript/build and formatting pass; the browser suite passes 17 checks, nine widths without overflow, and six axe scans without violations. Seven chapter checks pass, including persistent artwork alignment, native wheel movement, and a native phone gesture. WebKit menu checks pass for ink color, unchanged header height, open/close, Escape focus, outside click, manifest and icon responses, and tall-window spacing. No page errors.
