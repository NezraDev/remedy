# Verification

Performed October 21, 2026, in the local Windows checkout. This documents actual local checks; it does not certify a live deployment.

## Passed

- `npm run build`: TypeScript check and Vite production build; per-route static metadata generated successfully. Latest output: 352.42 KB JavaScript (106.96 KB gzip) and 43.12 KB CSS (9.18 KB gzip), before hosting compression.
- `npm run lint`: zero errors or warnings.
- `npm test`: nine passing catalog/server/theme tests, including 28 stable records, distinct service images, Free prices, Return Client duration, local media existence, Chicago-date expiration, theme contrast, configuration/privacy gating, request validation, allowlisting, escaping, fixed recipients, idempotency and provider failures.
- `npm run test:browser`: eight passing Playwright suites in headless Microsoft Edge. All ten route states were loaded at 320, 360, 768, 1024 and 1440 px in light and dark modes. Each had one H1, the Remedy logo and no document horizontal overflow. No browser page errors were recorded; all 28 displayed service images loaded.
- Browser checks covered filters/empty state, service inquiry preselection and unknown IDs, Free rebooking cards, the Square fallback, empty gallery, mobile navigation and focus restoration, slideshow controls/reduced motion and line animation, form validation and mocked retries, theme persistence, and the chatbot's full FAQ list and delayed replies. A focused chat check confirms the panel fits at 320 px, has no "See all questions" control, waits three seconds, and gives the contact-Remedy fallback for an unanswered question.
- Desktop (1440 px) and mobile (390 px) home and catalog screenshots were captured with fonts/media loaded in both themes. The open 320 px chatbot view is `.impeccable/review/chatbot-mobile.png`.
- Both Netlify functions independently bundled successfully with esbuild for Node, in addition to TypeScript checking.
- Local frontend/function development adapter ran at `http://127.0.0.1:8888`; inquiry status returned `200 {"available":false}`, and an unknown function returned a real JSON 404.
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities after removing the unnecessary Netlify CLI dependency. The README explains optional external CLI use and the included equivalent local adapter.
- All 63 shipped JPEGs passed the raster-provenance scan. Local media total approximately 9.2 MB. Stock origins/licenses and all fourteen expanded generated-illustration prompts are recorded.
- Static route HTML titles contain no unresolved content placeholders. Canonical URLs and sitemap are deliberately omitted until an actual domain is configured.
- Independent Impeccable finish review: **ship**, no material fixes. The reviewer opened all four current screenshots and reviewed the public content model, service imagery, core interactions, pinned brief and direction contract. No comp-fidelity or computed-contrast certification is claimed.

## Review limits and remaining deployment checks

The design detector ran once in degraded regex mode because its parser modules were unavailable. It returned no regex findings, but did not evaluate computed contrast/custom properties/selectors. Its stale comp-state warning was corrected by recording the actual code-led session; no persistent workflow preference was stored and no comp-fidelity claim is made. Screenshots and actual browser checks supplement this limited detector run.

No production Netlify deployment was performed. CDN SPA/static rewrites, deployed security headers, real function origins and platform edge rate limiting require staging verification. No real email was sent; Resend acceptance/errors were mocked. Verify a real notification only with the approved sender and test recipient. Square's direct destination is supplied; no dashboard-generated embed or current availability was fabricated. No automatic accessibility scanner or manual assistive-technology certification was performed.

Business approvals and settings are in `CONTENT-REVIEW.md`. Inquiry submission remains disabled until both privacy approval checks and server configuration are ready. Approved before-and-after cases remain outstanding by design.

## Requested spacing refinement

Removed the location/phone utility strip and replaced slideshow previous/next/pause controls and the counter with three keyboard-operable line indicators. Clicking an indicator selects its image and stops autoplay; reduced motion and hover/focus pausing remain supported. Section spacing is now 72/56/44px across desktop/tablet/mobile, with tighter page, grid, consultation, and footer gaps. A follow-up restores only the hero's original height and content padding. The existing browser suite checks the line indicators, restored mobile hero dimensions, and compact spacing in the following section.

## Image expansion and appearance toggle

Added 19 distinct images (five licensed stock photographs and fourteen labeled illustrative assets), producing 28 distinct service-image assignments. Hero slides expanded from three to seven distinct treatment photographs. All media and responsive variants remain local in public/images, with exact prompts/credits and embedded provenance. There are now 63 shipping JPEGs totaling about 9.2 MB.

The header now offers light/dark mode. It follows the OS preference until an explicit choice is made, saves that choice across reloads/navigation, ignores invalid stored modes, and preserves current form values when switched. Light mode remaps surface, text, link and focus colors while retaining the photo hero's dark overlay. Only the theme preference is stored; inquiry details remain unstored.

Validation: production build and TypeScript check, lint, nine unit/server tests, and all six browser suites passed. The new contrast test checks readable text, accents, links, action labels and control boundaries in both palettes. Browser route/overflow coverage runs at 320, 360, 768, 1024 and 1440px in both modes, checks all displayed images and uniqueness, seven manual slide indicators, theme persistence/system preference and input preservation. Desktop/mobile home and catalog captures were taken in both themes. All 63 rasters pass the provenance scan. No production deployment or real email was performed.

The scoped mechanical design scan found one indicator-height animation warning, resolved by removing that height transition, and 93 existing typography-ramp advisories. Text sizes were preserved under this request; the scan is not a computed-contrast certification. Light-mode focus/carets and success feedback use the contrast-tested teal semantic role, including focus inside mobile navigation.


## Latest catalog update

The owner-supplied service list is reflected in `src/data.js`; all 28 records are published with distinct local images. The membership and double-chin offer are included, and the two 911 duration discrepancies are clear on their cards.

The site-wide chat lists 24 client FAQs and answers from that list and the published service catalog. It shows a typing indicator and waits 3,000 ms before every answer; unmatched questions ask the client to contact Remedy. Messages stay in page memory and are not transmitted or saved. The open mobile view is captured at `.impeccable/review/chatbot-mobile.png`.

After this update, `npm run build`, `npm run lint`, `npm test`, and all eight browser suites passed. Browser coverage checks the 24 client question prompts, no overflow at 320 px, the contact-Remedy fallback, the Remedy logo, the 0.65-second slide fade and indicator reveal, and the configured three-second chat delay.
