# Remedy

Responsive React/TypeScript + Vite + Tailwind CSS website, prepared for Netlify. The supplied brief is preserved in `REMEDY-INSTRUCTIONS.MD`. All 28 service records are in **`src/data.js`**. All photos, illustrations, logos, and fonts are self-hosted under **`public/`**.

## Local development

Use Node 22.12+ (Node 24 is also supported) and npm.

```sh
npm ci
npm run dev
```

The frontend serves on the URL printed by Vite. To run the frontend **and** both inquiry endpoints together:

```sh
cp .env.example .env
npm run dev:full
```

Open **http://127.0.0.1:8888**. This explicitly configured development adapter uses Vite middleware and the same inquiry handler as Netlify, without needing a Netlify account or CLI. It does not emulate Netlify's distributed rate limiting, security headers, CDN rewrites, or deployment environment. For official Netlify emulation, install Netlify CLI separately and run `netlify dev`; `netlify.toml` supplies port 8888 and the Vite target port 5173. The CLI is intentionally excluded from the application lockfile because its current transitive packages have upstream advisories.

```sh
npm run typecheck
npm run lint
npm test
npm run test:browser
npm run build
npm run preview
```

Browser tests use installed Microsoft Edge in headless mode. On another system, install Playwright Chromium with `npx playwright install chromium`, then remove `channel: 'msedge'` from `playwright.config.ts`. Server tests mock Resend; browser tests mock inquiry responses. **No test sends an email or books an appointment.**

## Editing content

Edit the named `siteData` export in **`src/data.js`**, then rebuild and redeploy. It is a pure public JavaScript module, also imported by server-side service validation. Keep it free of secrets and customer information.

| Change | Key |
| --- | --- |
| Services, image assignments, prices in cents, listed durations | `services` |
| Categories, order, and names | `serviceCategories` |
| Home featured services | `featuredServiceIds` (existing IDs only) |
| Business phone, address, availability wording and timezone | `business` |
| Dark brand colors, light palette, and accessible link/control colors | `theme.colors`, `theme.lightColors`, `theme.lightLink`, `theme.lightControlBorder` |
| Appearance default and toggle labels | `theme.defaultMode`, `theme.labels` |
| Logo and accessible name | `branding` |
| Navigation and shared actions | `navigation`, `actions` |
| Headings and page content | `pages` |
| Hero copy, slides, crops, alt text, timing | `hero` |
| FAQ page and chatbot question/answer copy | `faqs` |
| Chat title, prompts, response delay and unanswered-question fallback | `chatbot` |
| Inquiry labels, help and messages | `inquiry` |
| Approved comparison cases | `results` |
| Optional featured comparison references | `featuredResultIds` |
| Privacy notice and review status | `privacy` |
| Route titles, descriptions, sharing image, real domain | `seo` |
| Footer text | `footer` |

TypeScript consumes this JavaScript module through `allowJs`; image and gallery record types live in `src/types.ts`. CSS custom properties are initialized from `siteData.theme`; Tailwind semantic colors resolve to those properties. Do not add a second palette or service list. JSX handles presentation and interactions rather than business content.

All 28 entries are retained and displayed. The 2026 Diamond Membership uses the owner-supplied weekly one-hour terms; confirm current availability with Remedy. The two Plasma pen variants and both 911 entries remain separate. Free rebooking listings retain their package context; Micro dax retains its supplied Free price. Promotions with an approved `promotionEndDate` stop displaying after that date in **America/Chicago**. Hidden records are still public bundle content; keep private notes in `CONTENT-REVIEW.md`.

Images are referenced by local `/images/...` paths. All 28 service records now have distinct images. Ambiguous services use general skincare, consultation or learning context rather than invented equipment or eligibility. Generated illustrations carry visible labels. The hero has seven distinct treatment photographs with line indicators. Read `ASSET-SOURCES.md` for sources and the complete service-to-image map, and `ASSET-PROMPTS.md` / `ASSET-PROMPTS-EXPANDED.md` for exact generation prompts. Replace these with approved Remedy photos as available. Stock or generated images must never enter the results gallery.

The header's sun/moon button switches the whole site between light and dark modes. The initial mode follows the device setting; an explicit choice is saved under `remedy-theme` in local storage and remembered across navigation and reloads. Only this display preference is stored, never inquiry data. If storage is blocked, switching still works for the current page. Light mode retains ivory surfaces, dark text, cyan actions with dark labels, and darker teal links/focus rings for contrast. The photographic hero keeps its dark overlay and ivory text in both modes. Theme changes preserve open forms and current page state.

The Remedy chat is a local, curated assistant rather than a connection to an AI service. It lists all FAQ questions in the chat and answers from that list and the currently published service catalog, including each service's listed price and duration. Unmatched questions receive a short prompt to contact Remedy. Answers appear after the configured 3,000 ms delay. Edit question keywords and answers under `faqs`, and the prompts, welcome message, and delay under `chatbot`. Chat text remains in page memory only and is not transmitted or saved.

## Before & After gallery

`siteData.results` is deliberately empty until authentic, approved Remedy comparisons are available. The complete dedicated route and `BeforeAfterPair` renderer are implemented. Add a record conforming to `Result` in `src/types.ts`: stable ID, title, existing service ID, treatment area, short factual description, two image objects with role-specific alt text and original dimensions, nullable verified session count and elapsed-time label, and publication status. An approved, already-labeled combined image can use `combinedImage` with null `before` and `after`. Incomplete or review-status cases do not render. Preserve proportions and do not retouch treatment evidence. Store permissions and private client records outside this repository and public data.

## Square booking

The `/booking` page always offers the supplied **https://remedy956.square.site/** destination. Square owns service selection, current prices, availability, payments, and confirmation. No fake calendar or service identifiers are used. Catalog changes are **not** synchronized to Square.

The brief did not include dashboard-generated widget configuration. `siteData.booking.embedUrl` remains null. If Square provides a supported, reviewed iframe booking URL, place it there; the component accepts Square domains, adds a title, and retains the direct link. Do not iframe the root website on assumption. If Square supplies a script-based widget instead, add its exact reviewed integration in `src/components/SquareBooking.tsx` and narrow the CSP in `netlify.toml` to the actual required script/frame domains. Confirm responsive behavior and the fallback afterward.

Official reference: [Square online booking guide](https://squareup.com/help/us/en/article/5355-set-up-online-booking-with-square-appointments).

## Inquiry email configuration

The form sends to `/.netlify/functions/send-inquiry`. The companion `inquiry-status` endpoint reports availability without exposing settings. Sending is disabled until **both** privacy checks and all server settings are ready:

1. Review and approve the notice in `siteData.privacy.sections`; change `privacy.status` from `draft` to `approved` and rebuild.
2. Create a Resend API key and verify a business sending domain.
3. Set these **server-only** variables in Netlify for each intended context:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `INQUIRY_FROM_EMAIL` | Plain email address on the verified business domain |
| `INQUIRY_TO_EMAIL` | Approved business recipient; use an approved test inbox for previews |
| `SITE_ORIGIN` | Exact HTTPS website origin, no trailing slash/path |
| `PRIVACY_APPROVED` | Literal `true`, after business approval |

For local development use `.env` and `SITE_ORIGIN=http://127.0.0.1:8888`. Never put secrets into `VITE_` variables or `src/data.js`. Preview origins must match the actual preview host; do not reuse the production origin blindly. Missing settings or unapproved privacy content show phone and Square alternatives, not a simulated successful send.

The server enforces POST/JSON, a 16 KiB streaming body limit, strict field types/allowlist, bounded lengths, required contact details, service IDs from the shared catalog, consent, honeypot, request UUID and exact same-origin checks. Phone is required for a requested phone reply. The visitor cannot set sender or recipient. Messages are HTML-escaped and include plain text. Resend receives the validated visitor email as `reply_to`, plus a stable idempotency key combining request UUID and content digest. Retrying unchanged content reuses the key; changing it creates a new request. No message bodies or visitor details are logged or saved to browser storage. Success means provider acceptance, not inbox delivery or booking confirmation. No visitor autoresponder is implemented.

`send-inquiry.ts` exports a Netlify **platform rate limit of five requests per IP/domain per 60 seconds**. It does not rely on serverless process memory. Confirm that the deployment's Netlify plan/runtime applies this config; verify a real 429 on staging before enabling public submission. If unavailable, configure equivalent edge/distributed rate limiting before launch. Origin checks and a honeypot are additional controls, not substitutes. The form handles Netlify 429 responses even if the response body is not JSON.

Provider references: [Netlify Functions](https://docs.netlify.com/build/functions/api/), [Resend Node guide](https://resend.com/docs/send-with-nodejs), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Deploy to Netlify

Connect the repository. `netlify.toml` specifies:

- Build: `npm run build`
- Publish: `dist`
- Functions: `netlify/functions`, bundled with esbuild
- Node: 22
- Static route HTML and SPA fallback, with missing image/font/build assets returning 404
- Restricted security headers, local media/fonts, and Square frame origins

Set the approved production origin in `siteData.seo.siteUrl`, then rebuild to emit canonical URLs, sharing URLs and `sitemap.xml`. Without it the build omits fabricated domain references; `robots.txt` is still generated. Per-route static HTML provides title/description metadata on direct requests. Local-business structured data omits unconfirmed contact details until `business.structuredDataContactApproved` is set true after review. Hours, credentials, ratings, and coordinates are never invented.

After deploying, verify direct-route refreshes, genuine asset 404s, security headers, both function paths, origin checks, distributed throttling, Square handoff, and a test email **only to an approved test recipient**. No hosting account, production domain or live Resend credentials were supplied, so this repository has not been deployed and no real email was sent.

See **`CONTENT-REVIEW.md`** for remaining business approvals and **`VERIFICATION.md`** for actual checks.
