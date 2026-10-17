# Netlify deployment handoff

The local website is prepared for Netlify. This record does not assert that deployment, DNS, form storage, or mail delivery has been verified.

## Publish-time checks

1. Import or select this repository in the intended Netlify account. Confirm the account's active Forms allowance and billing behavior; this task did not inspect them.
2. Enable form detection before deploying. Use the build settings in the README and `netlify.toml`.
3. Deploy the reviewed build when publication is authorized. Check that both `waitlist` and `details` appear in Forms.
4. Inspect deployed HTML: Netlify should have processed the forms and removed `data-netlify`. The JavaScript intentionally refuses to report acceptance while that attribute is still present.
5. Submit one genuine, controlled test signup through the deployed page. Verify the entry in Netlify, including the version, audience preference, and test campaign/source. Check both accepted and spam views. Remove test entries from reporting.
6. Save optional details and confirm the second entry. Match it to the first by email. Confirm skipping or failing this step leaves the first entry intact.
7. Test native submission with JavaScript disabled. Check the custom `/thanks/` destination. A direct visit to this page is never proof of a saved signup.
8. Configure owner notifications if wanted and verify their delivery. Team notifications do not implement visitor welcome emails or a newsletter.
9. Confirm `hello@labcast.ai` is monitored and accepts mail. Test a removal request and establish who handles replies. Review the implemented privacy notice against the actual team process.
10. Connect `labcast.ai`, check HTTPS, canonical URLs, sitemap, robots, social preview, and 404 behavior. If changing the production domain, update all fixed metadata destinations.
11. Review the actual deployed page on an ordinary phone and in the social browsers used for promotion. Local Chrome emulation does not establish Safari or in-app compatibility.

## Forms and consent

| Form       | Fields                                                         | Meaning                                                                                                               |
| ---------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `waitlist` | email, signup-version, source, campaign, audience, honeypot    | Request to receive Labcast product and early-access updates.                                                          |
| `details`  | email, signup-version, role[], event, access-contact, honeypot | Optional context, with a separate opt-in to early-access follow-up. This does not itself add someone to the waitlist. |

Version `2026-10-16` refers to the signup wording: “By joining, you agree to receive Labcast updates.” The adjacent note promises free signup, occasional updates, and the ability to leave. Keep a record of future wording changes and change the version when that offer changes.

Both forms use URL-encoded POST requests, with native form definitions available to Netlify. The shared request code rejects non-success HTTP responses and times out after 15 seconds. On uncertain failure, it says acceptance could not be confirmed rather than promising nothing was saved.

The initial UI prevents repeated clicks while a request is pending. Netlify may retain repeated entries. Deduplicate the operational contact list; do not pretend the browser has a globally unique subscriber database.

## Reviewing the list

Assign a named team owner before promotion. Review incoming entries and spam during launch. Export entries only to a controlled team location.

For reporting, trim email whitespace and apply one documented matching policy, review suspected duplicates, and retain the original address. Do not automatically strip plus tags or dots; those transformations are provider-specific. Associate optional details with an accepted signup by the same address. Preserve later opt-out requests. Multiple contacts from a club are people, not necessarily multiple buying organizations.

Use the research definitions for relevant role and real or recurring need. Missing optional details mean unknown fit, not a rejection. Honor explicit access-contact permission when inviting an early-access conversation.

Netlify's “Verified” label concerns spam handling. It is not proof of email ownership. Report retained, non-spam, deduplicated entries as accepted contacts; report email-confirmed contacts only after an actual confirmation process exists.

## Email and removal

The first version uses on-page confirmation. It does not promise that a welcome email has been sent. Product updates require a separately managed sending process and a reliable opt-out procedure.

Removal requests go to hello@labcast.ai. Stop promotional contact, remove unnecessary waitlist details from the operational list and Netlify entries, and retain only what is needed to avoid resubscribing the address accidentally. Include a clear removal route in every future update. Do not send campaigns before this workflow and the sender identity are ready.

## Measurement

The website captures sanitized `utm_source` and `utm_campaign` labels with signup and stores an explicit audience choice when a visitor uses an audience CTA. It does not collect full referrer URLs or add third-party analytics.

Netlify exports can support accepted signup counts and optional qualification. Visit-to-signup conversion rates cannot be claimed without a defined visitor measurement source. A copy-link click is not a referred signup; personal referral tracking is intentionally absent from this version.

## Content and media

The scroll-controlled broadcast story uses original device graphics and generated editorial cartoon illustrations. It illustrates the planned workflow, not actual product output. The public page intentionally omits hackathon, prototype, and pilot messaging. Keep development history in internal records. Original event footage and campaign films remain separate work in the graphics brief.

Research screenshots are not part of the public bundle. Only selected licensed photo derivatives, original graphics, and licensed fonts are shipped. See `assets.md` and `assets.json`.

## Planned broadcast destinations

The founder added Twitch, YouTube, TikTok, and Instagram to the intended direct-streaming experience. This website implements the positioning and illustration, not those product integrations. The scene labels them planned and the FAQ says platform support, simultaneous streaming, and account eligibility will be confirmed before early access.

YouTube documents [streaming across platforms](https://support.google.com/youtube/answer/16404722?hl=en-GB), including account and encoder setup. Twitch’s [terms](https://www.twitch.tv/p/terms-of-service) make simultaneous broadcasting conditional on its guidelines. TikTok’s [LIVE troubleshooting](https://support.tiktok.com/en/log-in-troubleshoot/troubleshooting/issues-with-tiktok-live) confirms that creator eligibility matters. These sources do not establish a working Labcast integration. Instagram integration access and all four end-to-end product connections remain to be validated by the product team. No universal “every platform, every account” guarantee is published.

## Observed production state — October 16, 2026

`https://labcast.ai/` responds with the Labcast page over valid HTTPS, and `https://www.labcast.ai/` redirects to it. GoDaddy DNS resolves the apex to `75.2.60.5` and `www` to `labcastai.netlify.app`. The Powered by Netlify script was absent from fresh responses for both production hostnames after the project setting changed. After form detection was enabled and production redeployed, both live form definitions were processed (`data-netlify` removed). Actual submission storage and notifications still require the owner checks above. The saved local Netlify login belongs to a different team and cannot administer this project.

Sharing uses standard Open Graph/Twitter cards and a public 1200×630 image. Homepage organization/site JSON-LD and public PNG icons support search identity. Slack and other messaging services cache previews; Google chooses search appearance and needs to crawl the site. After release, submit `https://labcast.ai/sitemap.xml` and inspect the homepage in the owner's Google Search Console account. Search Console ownership verification and actual platform previews have not been performed.
