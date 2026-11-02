# Creative assets

The founder approved the new cartoon illustrations and requested a full-screen opening with text over the artwork, followed by an Apple-style scroll story. The current public message is **“Your phones. One big show.”**: Labcast turns the phones you already have into one live broadcast and switches angles, adds replays and graphics for you. Public development-history messaging has been removed.

## Visual system

The website uses the Labcast app's design system: ADR 0021 in the mobile repository (`labcast/docs/decisions/0021-design-system.md`). Its light tokens are defined once as CSS custom properties in `src/styles/global.css`: canvas `#F6F4EE`, surface `#FFFFFF`, alternate surface `#EBE8DF`, text `#111111`/`#52525B`/`#71717A`, ink `#111111`, lime `#E2FF66`, coral `#FF5733`, cobalt `#2563EB` and amber `#F59E0B`. Geometry follows the same ADR: 2.5px outlines, 14/10/6px card/button/badge radii, 4px and 2.5px zero-blur hard shadows, a 2.5px press translation and the −2° lime headline badge. The page background is plain. Space Grotesk 700 (display), Inter 400/600 (body) and JetBrains Mono 700 (labels) come from `@fontsource` packages, latin subsets only; their OFL licenses are in `public/licenses/`. No weight 800 is synthesized.

The mark is the app's thick L silhouette with the coral dot (`src/assets/mark.svg`, the same path as `app/src/components/brand.tsx`). `Mark.astro` renders it alone or as the app's brand tile: lime square, ink outline and hard shadow, beside the lowercase `labcast` wordmark. `public/logo.svg` and `favicon.svg` match the app's splash export; `logo-mono.svg` is the one-colour silhouette. PNG icons are rendered from `logo.svg` with Nixpkgs librsvg 2.62.3 (`rsvg-convert`); `apple-touch-icon.png` uses the opaque app-icon composition, because iOS applies its own mask.

## Illustrations

Four original project illustrations were produced with the built-in image generation tool and visually inspected: the camera crew, basketball action, cheering spectators, and viewers at home. They share characters, a fictional event, and an editorial cartoon art style. Files are saved in `src/assets/crew.png`, `action.png`, `reaction.png`, and `viewers.png`; archival copies are in `../research/assets/illustrations/`. They are AI-generated artwork, not Pexels photography or actual product output. The public credits page explains this distinction. Exact prompts and mode are in [prompts.md](prompts.md).

Astro generates responsive WebP variants at 480, 800, 1200, and 1536 pixels, plus small camera-view thumbnails. Original multi-megabyte PNGs are source assets, not direct browser downloads.

## Photography

The audience cards retain licensed Pexels photography. `assets.json` records originals, creators, checksums, and preparation. The full acquired library and license records remain in `../research/assets/`.

| Placement        | Source                    | Creator          |
| ---------------- | ------------------------- | ---------------- |
| Streamers        | `src/assets/streamer.jpg` | Angel Moranchel  |
| Event organizers | `src/assets/audience.jpg` | Matheus Bertelli |
| Sports clubs     | `src/assets/game.jpg`     | Alex Khoury      |

These illustrate possible uses; no customer relationship or endorsement is implied. Public credits link creators, original sources, and the Pexels license. Audience photos load lazily and reserve space before loading.

## Motion and remaining assets

[The storyboard](storyboard.md) defines the seven chapters and visual continuity. `Studio.astro`, `studio.ts`, and `studio.css` implement them with GSAP ScrollTrigger. Scrolling controls progression and reversal; it has no automatic timer or player UI. Reduced motion, no JavaScript, and short landscape windows show all chapters in normal document flow. The story supersedes the earlier looping-photo treatment and the older cartoon production desk.

The old workflow and benefits grids have been consolidated into the story. The site also includes form feedback, audience preference links, metadata, favicon, editable social SVG and 1200 × 630 PNG, privacy, credits, and an optional signup follow-up. The origin section is intentionally absent. Reference-site screenshots remain research-only. Original event filming, verified product footage, and future campaign production remain separate work.

### Event marquee

Four additional original illustrations show gaming streams, live music, product demonstrations, and hackathons. Together with the existing sports art they form the five-card marquee. Files: `src/assets/gaming.png`, `music.png`, `demo.png`, and `hackathon.png`. The original PNGs are archived under `../research/assets/illustrations/`; Astro serves small WebP renditions. See [marquee-prompts.md](marquee-prompts.md) for exact built-in generation prompts.

### Search and sharing assets

`public/social.svg` is a self-contained 1200×630 composition using the existing crew illustration, the embedded Space Grotesk, Inter and JetBrains Mono subsets, and the brand tile. `public/social.png` is its Chrome-rendered sharing version. The card shows the brand, phone-camera broadcast promise, and waitlist CTA. The square brand assets are `favicon-48.png`, `favicon-96.png`, `apple-touch-icon.png` (180px), and `logo.png` (512px); all derive from the current vector mark. `site.image` in `src/content.ts` owns the shared image URL, dimensions, and alt text. Open Graph/Twitter tags reference that image; homepage organization data references the 512px logo. No customer logos, ratings, or unsupported product offers are added to structured data.

## Interface icons

`src/components/Icon.astro` inlines unmodified Google Material Symbols (Outlined, 24px) paths: arrow_forward, arrow_back, check, add, share, menu, close and replay. They match the Android icon set of the Labcast app; SF Symbols are not used on the web. Source: [google/material-design-icons](https://github.com/google/material-design-icons) at commit `10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7`, `symbols/web/<name>/materialsymbolsoutlined/<name>_24px.svg`. License: Apache 2.0, saved as `public/licenses/material-symbols.txt` and credited on the credits page. No icon font or runtime package is added. `public/icon-192.png` is a direct 192px render of `logo.svg` for the browser manifest.
