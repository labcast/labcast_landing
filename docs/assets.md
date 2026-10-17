# Creative assets

The founder approved the new cartoon illustrations and requested a full-screen opening with text over the artwork, followed by an Apple-style scroll story. The current public message is **“You bring the cameras. Labcast handles the broadcast.”** Labcast gets the credit for processing camera feeds, selecting shots, replays, commentary, and graphics. Camera guidance is optional and secondary. Public development-history messaging has been removed.

## Visual system

Cream `#f5f3eb`, ink `#191b17`, orange `#ff623b`, lime `#dfff7f`, and supporting cobalt/peach form the visual system. Manrope Variable and IBM Plex Mono are served locally with their licenses in `public/licenses/`. The current mark is a thick, fully rounded L paired with an oversized circular live dot. The primary version uses ink and orange; the same shape works in one color. It replaces the rejected angular and flask concepts. There are no sharp corners, outlines, or fine details. The authoritative source is `src/assets/mark.svg`; `Mark.astro` imports it. Standalone `public/logo.svg` (ink/orange), `public/logo-mono.svg` (one color), the favicon, and social artwork carry the same shape. It appears in navigation, motion, closing poster, and footer.

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

### Streaming platform marks

Local SVG path data in `src/platforms.ts`, rendered by `Platform.astro`. Twitch, YouTube, TikTok, and Instagram come from the pinned [Simple Icons 16.0.0 release](https://github.com/simple-icons/simple-icons/tree/16.0.0/icons). Original filenames: `twitch.svg`, `youtube.svg`, `tiktok.svg`, `instagram.svg`. The CC0 license is saved at `public/licenses/simple-icons.txt`; public credits link it. Brand ownership is unchanged. These identify planned destinations, not verified integrations or Labcast social accounts. SVGs inherit the surrounding ink color and have adjacent readable names; decorative paths are hidden from assistive technology.

### Search and sharing assets

`public/social.svg` is a self-contained 1200×630 composition using the existing crew illustration, locally licensed Manrope, and the current logo. `public/social.png` is its browser-rendered sharing version. The card shows the brand, phone-camera broadcast promise, and waitlist CTA. The square brand assets are `favicon-48.png`, `favicon-96.png`, `apple-touch-icon.png` (180px), and `logo.png` (512px); all derive from the current vector mark. `site.image` in `src/content.ts` owns the shared image URL, dimensions, and alt text. Open Graph/Twitter tags reference that image; homepage organization data references the 512px logo. No customer logos, ratings, or unsupported product offers are added to structured data.

## Interface icons

`src/components/Icon.astro` contains original 24px SVG paths for actions, back navigation, checks, disclosure, copying, replay, and the mobile menu. They use one stroke width and inherit the text color. The brand platform icons remain separately sourced as documented above. `public/icon-192.png` is a direct 192px render of the existing SVG favicon for the browser manifest.
