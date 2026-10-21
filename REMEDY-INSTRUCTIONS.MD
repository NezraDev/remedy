# REMEDY — Website Build Instructions

## 1. Your role and objective

Act as a senior frontend engineer, UI/UX designer, and website developer. Build a complete, responsive website for **Remedy**, a skincare, body-contouring, and aesthetic-services business in Harlingen, Texas.

The website must feel **modern, premium, calm, polished, and VIP**, with clear service information and an easy path to either book through Square or send an inquiry. Make it welcoming to the business's full audience. Let professional treatment imagery, thoughtful typography, and generous spacing establish the visual character.

Implement the working website, integrations, configuration, and documentation. Deliver a project ready for Netlify deployment. Work through routine design and implementation choices independently. Continue building when business assets or credentials are missing, using honest fallbacks and recording those missing items in the handoff.

## 2. Scope and technology

Use:

- React with TypeScript.
- A required **single `src/data.js` content module** consumed by React components and pages.
- Vite for local development and production builds.
- Tailwind CSS for styling, using a setup compatible with the installed version.
- React Router, or an equivalent React routing approach suited to the project.
- Netlify hosting and Netlify Functions.
- Resend for sending inquiry notifications from a server-side function.
- Square for appointment availability, scheduling, booking confirmation, and any booking payments.

Inspect the existing project before making changes. Reuse a compatible structure when present, keep unrelated files intact, and avoid adding unnecessary dependencies. Pin compatible package versions in the lockfile and use the official documentation when implementing integrations.

This scope includes the marketing website, service catalog, Square booking integration, and inquiry-email flow. A custom payment processor, patient portal, account system, medical intake system, or custom scheduling database is outside this scope.

### Required data.js approach

**Use `src/data.js` as the single source of truth for all editable public website content and brand colors.** Export a named `siteData` object from this plain JavaScript ES module. Pages and reusable components must import this object and render its values instead of hardcoding business copy, prices, image paths, navigation labels, or repeated contact details in JSX.

Keep the module organized into clear keys:

| Key | Editable information |
| --- | --- |
| `theme` | The six approved palette values and their semantic names |
| `business` | Name, public description, phone, address, timezone, approved hours, and public links |
| `branding` | Logo asset paths, alternative logo version, and accessible labels |
| `navigation` | Header/footer navigation labels and route targets |
| `actions` | Shared Book Now, Inquire Now, phone, and Square-link labels and destinations |
| `pages` | Route-specific headings, introductions, body copy, empty states, and 404 content |
| `hero` | Stable headline/copy, slide image objects, alt text, dimensions, focal points, and slideshow settings |
| `serviceCategories` | Stable category IDs, names, ordering, and descriptions |
| `services` | All 28 service records, with stable IDs, structured pricing, durations, and safe public descriptions |
| `results` | Approved before-and-after photo pairs, treatment descriptions, related service IDs, and verified session/time details |
| `faqs` | Question/answer records with stable IDs |
| `featuredServiceIds` | References to existing service IDs for home-page features; do not duplicate service objects |
| `featuredResultIds` | Optional references to approved result IDs for a home-page preview linking to the dedicated gallery |
| `booking` | Square destination, optional supported embed configuration, instructions, and fallback text |
| `inquiry` | Public field labels, help text, contact-method options, validation text, and submission messages |
| `footer` | Footer copy, legal-link labels, and copyright information |
| `privacy` | Approved public privacy content and its publication status |
| `seo` | Site-level and per-route titles, descriptions, and approved social-sharing asset paths |

Required implementation rules:

1. Keep the filename exactly `data.js`. Do not replace it with `data.ts`, split editable content into separate `business.ts`/`services.ts` files, or create competing content stores.
2. Keep the module pure and serializable: plain objects, arrays, strings, numbers, booleans, and `null`; no JSX, React components, browser APIs, network requests, or initialization side effects.
3. Keep React layout, interaction logic, validation logic, and reusable formatting functions in their appropriate components or utilities. The data module defines content and configuration.
4. Render repeated content from arrays using stable IDs for React keys. Resolve categories, service selections, and featured placements by ID so a single edit updates every relevant view.
5. Store image paths and image metadata in this module. Store the actual image files in the assets/public directory and reference them from the data.
6. Define palette HEX values once in `siteData.theme.colors`. Derive CSS custom properties from those values at application initialization or build time. Reference the properties from styles and statically discoverable Tailwind classes; do not construct classes such as `bg-${color}` at runtime.
7. Configure TypeScript to consume the JavaScript module cleanly, using appropriate JavaScript import support and JSDoc or declarations for type checking. Keep type definitions free of duplicate content values.
8. Treat everything in this client-imported file as public, including records with a hidden/review publication status. Keep unsupported original claims, internal source summaries, and review notes in `CONTENT-REVIEW.md`, outside the browser content module.
9. Keep Resend secrets, sender/recipient settings, and server-only configuration in server environment variables. Never store visitor submissions, private customer data, or credentials in `data.js` or local storage.
10. Have the inquiry server validate service IDs against the same pure public module, or a generated allowlist derived from it, instead of maintaining a separate handwritten service list. Server validation remains authoritative.
11. Use consistent numeric pricing, preferably `priceAmountCents` as an integer or `null`, plus `currency`, `priceLabel`, and a pricing/status field where needed. Use a shared formatter and preserve the special handling of zero-dollar, variable-price, and rebooking entries.
12. Make content updates by editing `src/data.js` and rebuilding/redeploying the site. Document this workflow clearly. Square changes are not automatically synchronized unless a real integration is explicitly implemented.

For example, a services page should read the shared data rather than maintain its own catalog:

```js
import { siteData } from "../data.js";

const visibleServices = siteData.services.filter(
  (service) => service.publishStatus === "published"
);

const heading = siteData.pages.services.heading;
```

Populate the complete content object during implementation. The final website must be complete, with page copy, slideshow assets/fallbacks, and all supplied service records represented; do not leave empty example arrays as the delivered result.

## 3. Business information and source boundaries

### Supplied business details

| Field | Supplied value |
| --- | --- |
| Business name | Remedy |
| Business type | Skincare, body contouring, and aesthetic services |
| Address | 1221 N 77 Sunshine Strip, Harlingen, TX 78550, United States |
| Phone | (956) 226-0328 |
| Telephone link | `tel:+19562260328` |
| Booking website | <https://remedy956.square.site/> |
| Referenced home page | <https://remedy956.square.site/home> |
| Business timezone | `America/Chicago` |
| Inquiry recipient email | Not supplied; configure on the server |

Supplied About statement:

> Licensed & certified personnel offering radio frequency skin tightening, body sculpting, lymphatic treatments & curve enhancements.

Preserve this statement as supplied business material. Do not infer staff names, medical credentials, license types, certification authorities, or regulatory approval from it. Use neutral public copy if the qualification wording has not been approved for publication.

### Source status

The supplied reference capture is dated **October 21, 2026**. It is a partial capture, not a full transcription of the Square website. The indexed root-page title was “Appointments.” Address, phone, service categories, and hours in that capture came from third-party listings; their presence in the brief does not establish that they are current.

Use this brief as the development content source. Make public business information editable in `src/data.js` and record confirmation needs in `CONTENT-REVIEW.md`. If checking the live site reveals a conflict, record both versions and their sources rather than silently replacing data or guessing.

### Unconfirmed hours

The supplied third-party listing reports:

| Day | Reported hours |
| --- | --- |
| Monday–Thursday | 6:00 AM–7:00 PM |
| Friday | 6:00 AM–2:00 PM |
| Saturday | 7:00 AM–12:00 PM |
| Sunday | Closed |

Another listing reportedly differs. Preserve these as unconfirmed source data. Until approved, show a simple invitation to check Square or call for current availability instead of publishing these as confirmed hours. Interpret any requested appointment times in the business timezone, not the developer's timezone.

## 4. Brand and visual direction

### Required palette

| Color | HEX | Role |
| --- | --- | --- |
| Obsidian | `#080D13` | Main background, navigation, and footer |
| Midnight blue | `#12202D` | Cards, menus, forms, and raised surfaces |
| Electric cyan | `#10BFEA` | Primary actions, links, and selected details |
| Champagne | `#C8AF80` | Sparse VIP accents and premium details |
| Soft ivory | `#F6F3ED` | Headings, body copy, and light wordmark |
| Silver gray | `#A5AFBB` | Supporting descriptions, captions, and secondary text |

Define the palette once in `siteData.theme.colors` inside `src/data.js`. Generate or apply reusable CSS custom properties from that data. The following shows the resulting token names and values; it is a reference, not a second independently maintained palette:

```css
:root {
  --color-background: #080D13;
  --color-surface: #12202D;
  --color-primary: #10BFEA;
  --color-vip: #C8AF80;
  --color-text: #F6F3ED;
  --color-text-secondary: #A5AFBB;
  --color-on-primary: var(--color-background);
  --color-control-border: var(--color-text-secondary);
}
```

Map these derived tokens into the Tailwind setup appropriate to the installed version. Any necessary additional semantic feedback colors must also be defined centrally in `siteData.theme`, with their contrast checked.

### Application rules

- Let obsidian and midnight blue dominate page surfaces.
- Use cyan as the main action color. Primary buttons need **obsidian text on cyan**.
- Use champagne for a few intentional accents, such as a membership label or fine rule.
- Use ivory for primary text and gray for supporting copy at full opacity.
- Maintain visible borders for controls: obsidian and midnight blue alone are too close in brightness to define every field boundary.
- Pair selected states and feedback with text, underlines, icons, or another non-color cue.
- Recheck actual contrast over photographs, gradients, and translucent layers.
- Keep glow and gradients subtle. Establish the premium character through composition, typography, photography, and spacing.

Useful solid-color contrast references: ivory on obsidian is approximately `17.60:1`; gray on midnight blue is `7.44:1`; obsidian on cyan is `8.97:1`. Ivory on cyan is only `1.96:1`, so do not use it for button labels.

### Typography, spacing, and components

- Choose a refined display face for headings and a readable sans-serif for body copy, or a cohesive single-family system with a clear hierarchy. Use no more than two font families.
- Use generous section spacing, readable line lengths, consistent alignment, and a restrained spacing scale.
- Establish consistent buttons, fields, border treatments, corner shapes, and focus indicators.
- Build a clear, useful page composition with varied sections; use cards where their grouping helps visitors compare services.
- Keep copy specific to Remedy and its supplied offerings. Avoid filler text, invented accolades, unsupported superlatives, and fabricated scarcity.
- Keep mobile navigation simple and make “Book Now” easy to find.

### Logo

The supplied logo has black lettering, a blue silhouette, and blue floral elements on white. Use a transparent version with an ivory wordmark on dark backgrounds while preserving the blue artwork, when an approved asset is available.

If only the original is available, present it in a deliberate light logo area with correct proportions and clear space. Use a clean crop without screenshot margins. Do not invert the entire logo, distort it, or recreate an inaccurate substitute. If the logo asset is absent from the project, use a simple Remedy text fallback and document the asset needed.

## 5. Site structure and navigation

Create these routes with a shared header and footer:

| Route | Purpose |
| --- | --- |
| `/` | Home, hero slideshow, service discovery, and key calls to action |
| `/about` | About Remedy and its approach |
| `/services` | Searchable or filterable service catalog |
| `/before-and-after` | Dedicated Before & After page with paired client photos and treatment descriptions |
| `/faq` | Practical questions about inquiries, consultation, and booking |
| `/contact` | Contact details, location, and inquiry entry point |
| `/booking` | Square booking integration and direct booking fallback |
| `/inquiry` | General or service-specific inquiry form |
| `/privacy` | Privacy information reflecting the implemented inquiry flow; business review required |
| Unmatched paths | Useful 404 page with navigation back to Home, Services, and Booking |

Keep the primary navigation focused on Home, About, Services, **Before & After**, FAQ, and Contact, with a prominent “Book Now” action. Keep Before & After accessible from both desktop and mobile navigation. Packages, memberships, rebooking, and training may be service categories or supporting sections. Add standalone pages for them only when their supplied content warrants it.

Maintain a consistent distinction between **booking an appointment** and **asking a question** throughout the site.

## 6. Home page and hero slideshow

### Hero requirements

- Build a polished, full-width hero with **three or four relevant treatment or consultation images**.
- Add the requested dark gradient at the top so navigation remains legible. Add localized shading behind text if needed.
- Keep the headline, supporting copy, and calls to action stable while the images change.
- Use a concise headline related to skincare and body contouring, with welcoming copy that does not promise treatment outcomes.
- Include the exact CTA labels **“Book Now”** and **“Inquire Now.”**
- “Book Now” leads to `/booking` and the Square flow. “Inquire Now” leads to `/inquiry` and the form.
- Use thoughtful portrait crops on phones and wider crops on desktop. Set focal points so faces and treatment context remain visible.

### Slideshow behavior

- Provide accessible previous, next, and pause/play controls with clear labels and visible focus.
- If autoplay is enabled, use a calm interval of about six to eight seconds.
- Pause autoplay on hover, keyboard focus within the slideshow, or manual interaction. A deliberate user pause must persist until the user resumes it.
- Under `prefers-reduced-motion`, disable autoplay and animated transitions while keeping manual controls available.
- Keep controls independent of the booking buttons. Do not move keyboard focus when slides change or repeatedly announce automatic changes.
- Make the first image available immediately, reserve image dimensions, and avoid layout shifts. Load later slides efficiently without delaying the first useful render.

### Supporting home sections

Follow the hero with a short Remedy introduction, a curated service overview, a consultation entry point, and a closing booking/inquiry section. Include a package or membership feature only when its availability and terms are approved. Show authentic client reviews only if approved review content is actually supplied; otherwise omit that section.

When approved photo pairs are available, an optional compact Before & After preview may link to `/before-and-after`. Keep the complete photo gallery on its dedicated page and reference its records by ID instead of duplicating them in the home-page data.

## 7. Other page requirements

### About

Explain Remedy's supplied service focus and consultation approach. Present real facility, staff, or treatment imagery when provided. Do not invent a founder story, years of experience, staff biographies, qualifications, or awards.

### Services

- Organize the catalog into useful categories such as Facial & Skin, Body Contouring, Wellness, Packages, Rebooking, and Training, based on confirmed service information.
- Keep uncertain entries unclassified or under a general category until reviewed.
- Show the service name, supplied price or honest pricing label, listed duration when available, and a short factual description.
- Include “Book Now” and “Inquire Now” actions where appropriate.
- Carry the selected service into the inquiry form through a stable service ID. Deep-link to a specific Square service only when its real booking URL or identifier is available.
- Support keyboard-accessible filtering and a useful empty state if search/filter controls are included.
- Keep internal source notes and review flags out of public-facing cards.

### Before & After — dedicated photo page

Use **“Before & After”** as the navigation label and page title, with the supporting heading **“A Closer Look at Client Progress.”** Use `/before-and-after` as the route and `siteData.pages.results` for the page copy. This is a separate page from the services catalog and the home hero slideshow.

Use this introduction when approved client photo pairs are available:

> Explore before-and-after photos from Remedy treatments, with details about the service and treatment journey. Each comparison shows an individual client's progress. Results vary from person to person.

#### Photo presentation

- Render each case as a paired comparison with visible **Before** and **After** labels. Show Before on the left and After on the right on larger screens; keep labels and comparison order clear when stacking on phones.
- Use two separate image records for each case, rather than treating unrelated photos as a pair. If only an approved combined comparison image is provided, retain its original labeling and present it clearly without inventing a missing image.
- Show a short case title, related service name, and a concise description under each comparison. Include session count or elapsed time only when supplied and verified for that specific case.
- Preserve the photos' proportions and keep the relevant treatment area visible. Prefer consistent framing and full-image display with neutral surrounding space when needed. Do not stretch images or crop away information in a way that changes the apparent outcome.
- Use descriptive alt text for each image, identifying its Before or After role and the treatment area without identifying the client unnecessarily.
- Keep labels, descriptions, and image pairs usable without hover or dragging. A comparison slider is optional; if added, it must have a labeled keyboard-operable control and the same context available without interaction.
- Publish authentic Remedy client photos only when the business has permission to use them. Do not generate, retouch, beautify, or use stock images as evidence of treatment results. Keep approval records and private client information outside the public data module.
- Add a restrained closing section with **“Book Now”** and **“Inquire Now”**, following the existing booking and inquiry flows. Service-specific inquiry links should preserve the related service ID.

#### Description guidance

Write one or two factual sentences for each case describing what treatment is shown and any confirmed session/time context. Avoid invented measurements, guaranteed outcomes, unsupported medical claims, or implying that one client's experience is typical.

Use this as an editorial template, replacing only the details supported by the actual case and omitting any unknown clause:

> This comparison shows [treatment name] focused on [treatment area]. The photos document the client's appearance before treatment and after [verified session count or time interval]. Individual results vary.

Do not publish bracketed placeholders. If no case details are supplied, request them in the handoff and keep that case unpublished rather than guessing its treatment or timeline.

#### data.js content model

Store the gallery in `siteData.results` as an array. Each record should include a stable `id`, `title`, `serviceId`, `treatmentArea`, `description`, separate `before` and `after` image objects (`src`, `alt`, `width`, `height`), nullable `sessionCount`, nullable `elapsedTimeLabel`, and `publishStatus`. If the approved source is one combined image, support an explicit `combinedImage` field instead of fake split-image paths. Resolve treatment names and inquiry links from the existing service ID. Store page headings, intro, labels, empty-state text, and CTAs in `siteData.pages.results` and shared action data.

Only publish complete, approved image pairs or an approved clearly labeled combined comparison. No before-and-after photo assets have been supplied in this brief. Implement the page and data model now; keep `siteData.results` empty until real approved records are available. In that state, display:

> Our before-and-after gallery is being prepared. Contact Remedy to learn more about available treatments and discuss your goals.

Keep the page useful with Services, Book Now, and Inquire Now links. Do not show broken images, fabricated cases, or development placeholders. Add a route-specific title and description, such as **“Before & After | Remedy Harlingen”**, using only truthful available content.

### FAQ

Provide concise answers to questions supported by this brief, including how to book through Square, how to inquire about a service, consultation availability, variable pricing, and existing-package rebooking. Use accessible accordions or native disclosure elements.

Do not invent cancellation fees, refund rules, preparation instructions, contraindications, treatment eligibility, downtime, guaranteed outcomes, or policies for minors. Direct visitors to contact Remedy for treatment-specific suitability questions and record missing policy answers in the handoff.

### Contact

Include the supplied phone, address, a directions link, and a clear inquiry action. Keep phone and map links functional. A map can be a lightweight optional enhancement; provide a directions link even if a map fails. Do not fabricate coordinates or publish an invented email address.

### Privacy and policies

Draft concise privacy content that accurately describes the information this implementation collects and its use of Resend, Netlify, and Square. Do not invent retention periods, legal guarantees, or business policies. Mark the draft for business review in project documentation, and treat approval of the public privacy text as a launch dependency. Do not collect inquiry data in a live production flow before the applicable notice is ready.

## 8. Service catalog — preserve all 28 entries

The following table organizes the **user-supplied catalog snapshot**, with descriptions summarized for this prompt. It does not claim that prices or descriptions are currently verified on Square. Preserve all 28 service records in `siteData.services`, with stable IDs, supplied names, raw price values, listed durations, and safe public descriptions. Retain original quotations, unapproved description summaries, conflicting source details, and review notes in `CONTENT-REVIEW.md`. A record withheld from display is still inspectable in the public JavaScript bundle, so do not put private review material into it.

The user's later service list has been merged into this catalog without adding duplicate records. It explicitly labels Micro dax, Jade Laser Rebook, Pelvic Floor Chair Rebook, and Return Client Rebook as **Free**. It also supplies the previously missing **55-minute** duration for Return Client Rebook. Preserve these newer supplied details. The earlier $100.00 / 45-minute Plasma pen entry remains because its omission from the later list is not an instruction to remove it. The merged catalog still contains **28 distinct records**.

Currency is USD. A listed duration is an appointment-listing value; do not assume it represents an entire package. Missing values remain missing.

| ID | Service name as supplied | Price | Listed duration | Supplied description or source notes |
| --- | --- | --- | --- | --- |
| 01 | Micro dax | Free | 1 hr 30 mins | Latest supplied listing explicitly says Free; numeric price is $0.00. No description supplied. Do not invent treatment details or eligibility terms. |
| 02 | 6 RemFace Sessions | $925.00 | 1 hr | Facial-muscle treatment; source describes a nonsurgical face lift, painless and relaxing, and calls it a client favorite. Six-session package. |
| 03 | 911 cavilipo | $222.00 | 1 hr | Source description says two hours of ultrasonic cavitation, which conflicts with the listed duration. |
| 04 | Flex Sculpt 4 Sessions Two areas | $450.00 | 1 hr | Four sessions covering two areas. No additional description supplied. |
| 05 | Flex Sculpt One session Two Areas | $125.00 | 1 hr | Source says “build muscle tighten and smooth skin.” |
| 06 | Pemf bed | $55.00 | 45 mins | No description supplied. |
| 07 | Plasma pen | Price varies | 30 mins | No description supplied. Keep separate from entry 08. |
| 08 | Plasma pen | $100.00 | 45 mins | No description supplied. Keep separate from entry 07. |
| 09 | Roller | Price varies | 30 mins | No description supplied. |
| 10 | Teen camp | Price varies | 55 mins | No description, age range, eligibility, or consent terms supplied. |
| 11 | CONSULTATION | $80.00 | 1 hr 15 mins | Discuss client goals, target areas, treatment options, and previews of recommended services. |
| 12 | Double Chin Treatment BUY ONE GET ONE | $350.00 | 1 hr | Source describes breaking down stubborn fat in the double-chin area. Promotion availability and BOGO terms are not supplied. |
| 13 | Curve Enhancement Laser Lipo & Muscle Sculpting | $150.00 | 55 mins | Source calls it a “Peach emergency session,” focused on smoothing, shaping, lifting, and building the glutes. |
| 14 | Jade Laser Single Session | $150.00 | 55 mins | Source says “Laser lipolysis FDA approved for any area!” This regulatory claim is unverified and must not be published without substantiation. |
| 15 | Pelvic Floor Chair Rebook | Free | 30 mins | Latest supplied listing explicitly says Free; numeric price is $0.00. Source description: “Emsella chair.” Existing-client rebooking entry; do not imply that an entire treatment package is free. |
| 16 | Jade Laser Rebook | Free | 55 mins | Latest supplied listing explicitly says Free; numeric price is $0.00. Existing-client rebooking entry; no description supplied. |
| 17 | 2026 Diamond Membership | $6,000.00 | 1 hr | Source describes “unlimited services” through weekly one-hour sessions during 2026. Includes cavitation, radio frequency, laser lipo, lymphatic treatments, infrared sauna, pressotherapy, muscle sculpting, LED Therapy, Velashape, Emsella, Jade Laser, curve enhancement, muscle sculpting with RF, and EMS. Several services may be performed in the same session. Terms and current availability require confirmation. |
| 18 | Pelvic Floor Chair Package 6 Sessions | $925.00 | 55 mins | Six-session package for pelvic-floor treatment. Source describes it as fast, simple, painless, and positively reviewed, and mentions a Valentine's gift. These promotional claims are not independently verified. |
| 19 | Body Contouring Party for 4 people | $925.00 | 3 hrs | Price covers four people; source lists an additional $175 for a fifth person. Visitors are instructed to state their requested date and time when booking. Source describes treatment previews involving cavitation, Emsculpt, Emsella, and Velashape, claims exercise equivalence and collagen/inch-reduction effects, and claims over $3,000 of services. Claims and party terms require confirmation. |
| 20 | 6 V Shape Sessions (One Area) | $450.00 | 30 mins | Six V Shape sessions covering one area. |
| 21 | Pelvic Floor Chair | $220.00 | 45 mins | Source describes pelvic-floor strengthening and enthusiastic client feedback, including “undeniable results” for men and women. Do not use that outcome promise without substantiation. |
| 22 | Muscle Sculpting Treatment | $300.00 | 45 mins | Source claims 20,000 muscle contractions for muscle building and fat burning, and lists abdomen, arms, thighs, and buttocks. Treat numerical and outcome claims as unverified. |
| 23 | 911 Session | $222.00 | 1 hr | Source description says a two-hour ultrasonic lipo session. Keep separate from entry 03 and flag the duration conflict. |
| 24 | Ultrasonic Cavitation & Radio frequency Training & Certification | $450.00 | 6 hrs | Hands-on and theory training covering the science, contraindications, and further purchasing availability. Source says payment secures placement. Do not invent accreditation or legal scope of practice. |
| 25 | Single session of Laserlipo & Cavilipo | $100.00 | 50 mins | Source calls it the most effective treatment for removing fat from target areas. Do not publish the comparative efficacy claim without support. |
| 26 | 5 sessions Cavilipo w Rf w 5 Laserlipo | $450.00 | 55 mins | Source mentions consultation and treatment, with claims about proven effectiveness for weight loss, inch reduction, and skin tightening. Confirm package structure and avoid unsupported efficacy claims. |
| 27 | Curve Enhancement | $80.00 | 45 mins | Source describes use on the breast or buttock area to add fullness. Use discreet, professional imagery and confirm the treatment description. |
| 28 | Return Client Rebook | Free | 55 mins | Latest supplied listing provides Free ($0.00) and 55 minutes. Source: “Use this option to rebook after purchasing a package.” Keep this eligibility context with the rebooking option. |

### Catalog integrity rules

1. Preserve all 28 entries in the data layer, including entries withheld from public promotion pending review.
2. Keep the two Plasma pen entries separate with unique internal IDs. Disambiguate public labels by confirmed duration or pricing, without inventing treatment differences.
3. Keep both 911 entries separate until the owner confirms whether they are duplicates. Do not resolve the one-hour/two-hour conflict by guessing.
4. Preserve an explicit **Free** label when the user-supplied listing provides it. For entries 01, 15, 16, and 28, use `priceAmountCents: 0` and `priceLabel: "Free"`. Keep existing-client/package context visible for rebooking options and do not imply that an entire paid package is free. For any future entry with only a numeric zero and no explicit Free label, do not infer free treatment; use an appropriate pricing-confirmation label until clarified.
5. Show “Price varies” only where supplied. For missing prices, use “Contact for details” rather than `$0.00`.
6. Preserve the year in the 2026 Diamond Membership. Keep it out of promotional placements until availability, end date, and weekly limits are approved. Disable expired promotion placements using the business timezone.
7. Clarify “unlimited” against the weekly one-hour limit before publishing membership terms.
8. Keep the double-chin BOGO offer and seasonal gift language out of promotion blocks until availability and terms are confirmed.
9. Do not invent descriptions, package savings, discounts, treatment instructions, certification credentials, or service eligibility.
10. Do not publish unsupported FDA approval, guaranteed results, painless-treatment promises, exercise-equivalence claims, or medical/weight-loss outcome claims. Record source claims in a review document and use factual, neutral public copy.
11. Keep rebooking options and training distinct from first-time treatment discovery.
12. When incorporating later service lists, match existing entries using normalized names together with price, duration, and package/rebooking context. Merge new details into a matching stable ID instead of adding another record. A repeated name with a different price or duration can be a distinct variant. Do not delete earlier variants merely because they are absent from an additional list.

Public service fields in `siteData.services` should include `id`, `slug`, `sourceName`, `displayName`, `categoryId`, `priceAmountCents`, `priceLabel`, `pricingStatus`, `currency`, `listedDurationMinutes`, `publicDescription`, `sessionCount`, `areaCount`, `image`, `bookingUrl`, `publishStatus`, and `promotionEndDate`. Use `null` where information is missing; for example, $925.00 is `92500` cents, a supplied $0.00 is `0`, and an unknown/variable numeric price is `null`. Keep source summaries and review notes in the review document, not in these public records.

## 9. Booking flow and Square integration

Use <https://remedy956.square.site/> as the supplied booking destination. Every “Book Now” action must lead into a working booking path.

- Build a dedicated `/booking` page with clear instructions and the supported Square booking integration.
- Prefer the actual embed/widget code or booking-flow URL generated from the business's Square dashboard. Square documents this under Online Booking > Channels. See [Square's official online-booking guide](https://squareup.com/help/us/en/article/5355-set-up-online-booking-with-square-appointments).
- The supplied root URL is a booking destination; it does not establish that the entire site can run in an iframe. Do not fabricate embed code or promise unsupported inline behavior.
- If a permitted inline integration is available, make it responsive, give any iframe an accessible title, and keep a visible direct link alongside it.
- Always offer **“Open booking in Square”** using the supplied URL, including when scripts, browser restrictions, or an embed prevent inline booking. Do not rely on detecting a cross-origin iframe's internal error page to reveal this fallback.
- If official embed configuration is missing, deliver a polished booking page with the working direct link and document how to add the official integration later.
- Do not scrape Square availability, invent service identifiers, or simulate a calendar with fictional open slots.
- Square remains responsible for final service selection, current prices, availability, payment, and appointment confirmation.
- Never treat a page load, inquiry submission, or preferred-time request as a confirmed appointment.

## 10. Inquiry form and Resend email flow

### Form fields

Include:

- Full name — required.
- Email — required.
- Phone — optional, required only if the visitor requests a phone response.
- Service of interest — optional, populated from stable catalog IDs, with a general-inquiry choice.
- Preferred contact method — email or phone.
- Message — required.
- Preferred date/time — optional and explicitly labeled as a request in `America/Chicago`, with no promise of availability.
- A clear acknowledgement that the details will be used to respond to the inquiry, with a privacy link.
- A hidden honeypot or equivalent lightweight spam control.

Keep it a general inquiry form. Ask visitors to leave out medical records, detailed health history, payment-card data, and sensitive documents. Do not add file uploads or a medical questionnaire.

### User experience

- Prefill service interest when arriving from a service card, and handle unknown query values safely.
- Use visible labels, suitable input types and autocomplete attributes, accessible validation messages, and clear required indicators.
- Provide idle, submitting, success, and error states.
- Prevent accidental duplicate submits while a request is pending. Preserve input on failure and offer a meaningful retry.
- Announce results accessibly. Only show success after the server receives an accepted send response from Resend; do not claim inbox delivery or an appointment confirmation.
- Use a message such as: “Your inquiry has been sent. Remedy will contact you using the details provided. This is not an appointment confirmation.”
- If email configuration is unavailable, show an honest unavailable state with the phone and Square booking alternatives. Do not simulate a successful send.

### Server implementation

Submit to a same-origin Netlify Function such as `/.netlify/functions/send-inquiry`. Keep all email-provider credentials and recipient configuration on the server. Netlify Functions run server-side request handlers alongside the site; use the [official Functions documentation](https://docs.netlify.com/build/functions/overview/) for the chosen handler format.

Server-only configuration:

```dotenv
RESEND_API_KEY=
INQUIRY_FROM_EMAIL=
INQUIRY_TO_EMAIL=
SITE_ORIGIN=
```

The Resend setup requires an API key and a verified sending domain. Use its [official Node.js guide](https://resend.com/docs/send-with-nodejs). The destination and approved sender are not provided in this brief: document these configuration values without inventing addresses.

Implementation requirements:

- Accept only the intended request method and supported content type, with bounded request size and field lengths.
- Validate input again on the server, including required fields, email format, contact method, and service ID allowlisting.
- Reject unexpected recipient/sender fields. The client must not choose arbitrary email recipients.
- Use a verified business-domain address as `from`, a server-configured business address as `to`, and the validated visitor email as `reply-to`.
- Keep secrets out of frontend code, committed files, public configuration, and all `VITE_` variables.
- Escape user content in HTML emails and include a readable plain-text alternative. Prevent header injection.
- Handle provider errors and return appropriate validation, throttling, configuration, and send-failure responses without exposing internal details.
- Use a stable request identifier and provider idempotency where supported to avoid duplicate sends on retries. Do not log message bodies or unnecessary personal information.
- Add server-enforced abuse protection suitable for deployment. A frontend delay or honeypot alone is insufficient; document platform/rate-limit configuration and avoid relying on process memory across serverless instances.
- Use a same-origin policy and validate configured origins as an additional check, while recognizing this does not replace abuse protection.
- Send the business notification as the required email flow. An automated visitor acknowledgement is optional and must be separately documented and protected against abuse if implemented.

## 11. Photography and media

Use images that genuinely match each service category and its treatment context. Appropriate directions include facial-care portraits, professional consultation, tasteful body-contouring treatment scenes, and calm treatment-room details.

- Prefer approved Remedy assets. Otherwise use properly licensed images and record their sources and license information.
- Do not present stock subjects as Remedy's staff or clients, or stock equipment as equipment the business owns.
- Avoid mismatched device photos when the actual treatment equipment has not been confirmed.
- Do not fabricate before-and-after images, testimonials, or treatment results. Use actual approved comparison photos on the dedicated `/before-and-after` page according to its photo and description requirements.
- Keep pelvic-floor and curve-enhancement imagery discreet, respectful, and professionally relevant.
- Use meaningful alt text for informative images and empty alt text for decoration.
- Optimize dimensions and formats, set width/height or aspect ratios, and provide responsive sources. Load the first hero image eagerly; lazy-load below-the-fold media and defer third-party booking scripts where appropriate.
- If final assets are missing, keep the page complete with a tasteful neutral fallback and document the outstanding assets. Keep development notes out of the public UI.

## 12. Responsive behavior, accessibility, and performance

- Design mobile-first and verify representative widths around 360 px, 768 px, 1024 px, and 1440 px, with basic usability down to 320 px.
- Prevent horizontal overflow, clipped headings, overlapping buttons, and obstructed form controls.
- Use semantic landmarks, one clear primary heading per route, logical heading order, and a skip link.
- Make menus, filters, accordions, slideshow controls, forms, and booking actions usable by keyboard with visible focus.
- Close the mobile menu appropriately, handle Escape, and restore focus when applicable. Avoid focus traps outside an intentional modal.
- Use readable text sizes and touch targets appropriate for phones.
- Respect reduced-motion preferences and avoid scroll effects that delay access to content.
- Give every route a relevant page title and ensure client-side navigation manages focus or announces route changes appropriately.
- Maintain layout stability, avoid unnecessary render work, and defer nonessential third-party scripts.
- Provide a functional reduced-feature experience if media or the Square integration cannot load.

## 13. Search and local business presentation

- Add route-specific titles, concise descriptions, social-sharing metadata, and a favicon based on an approved brand asset.
- Use the business name and Harlingen location naturally in relevant copy.
- Keep name, address, phone, and business links consistent across the site.
- Add canonical URLs, sitemap entries, and robots configuration using the actual deployment domain when known; do not ship a fabricated production domain.
- Add appropriate local-business structured data using only confirmed fields. Omit unconfirmed hours, ratings, medical credentials, and invented coordinates.
- Do not generate fake reviews, aggregate ratings, search rankings, or service guarantees.

## 14. Project organization and deployment

Keep the code maintainable, with shared components and the required single content file. A suitable structure is:

```text
src/
  data.js
  components/
    Header.tsx
    Footer.tsx
    HeroSlideshow.tsx
    ServiceCard.tsx
    BeforeAfterPair.tsx
    InquiryForm.tsx
    SquareBooking.tsx
  pages/
  utils/
  styles/
netlify/
  functions/
    send-inquiry.ts
public/
  images/
netlify.toml
.env.example
README.md
CONTENT-REVIEW.md
```

Adapt component filenames to the project where appropriate, while keeping the required `src/data.js` content entry point. Include scripts for local development, build, preview, type checking, linting, and the meaningful checks used. In the README, identify the keys to edit for services, prices, hours, hero images, before-and-after pairs and their descriptions, FAQs, colors, navigation, and SEO; explain that these edits require a rebuild/redeploy.

Configure Netlify with the actual build command, publish directory, and function directory. Use `dist` as the publish directory for the standard Vite build. Configure SPA route handling so direct visits and refreshes work, without swallowing function endpoints or asset requests. Follow [Netlify's rewrite guidance](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).

Document local development of both the frontend and the inquiry function, using Netlify's local tooling or an equivalent explicitly configured setup. Provide a blank `.env.example`, ignore secret files, and document environment-variable setup for local, preview, and production contexts. Keep preview email tests directed to an approved test inbox.

Set appropriate security headers and scope third-party permissions to the actual Square/asset integrations. Verify that content-security rules allow the real integration rather than disabling it or using a blanket permissive policy.

The deployment handoff must explain install/build steps, Netlify configuration, Resend domain and environment setup, where to add Square's official embed code, how to update content, and which items need owner confirmation. Deliver deployable files; do not claim that the site is deployed unless a real deployment has been completed and verified.

## 15. Verification and acceptance criteria

Before handing over the implementation, run and report the production build, type checks, lint checks, and focused functional checks. Test the form endpoint with mocks where credentials are absent; send a real test email only to an approved test recipient when configured.

Confirm that:

- [ ] Required routes, navigation, phone links, and directions links work.
- [ ] Desktop and mobile layouts remain readable without horizontal overflow.
- [ ] Hero images match the business, retain readable overlays, and crop well on phones.
- [ ] Slideshow previous/next/pause, keyboard interactions, focus handling, and reduced-motion behavior work.
- [ ] Both hero CTAs lead to the intended booking or inquiry flow.
- [ ] Before & After is a separate route linked from desktop/mobile navigation, with its title, introduction, and treatment-description layout.
- [ ] Before-and-after content comes from `siteData.results`; related services resolve by ID, and Before/After labels remain clear on phones and with keyboard navigation.
- [ ] The gallery uses only approved real cases, omits unsupported session/time claims, and shows an honest empty state when photos are unavailable.
- [ ] All 28 service entries exist in `siteData.services` in `src/data.js`, with distinct IDs and preserved supplied price/duration values.
- [ ] Pages and components consume public copy, images, navigation, contact information, and service data from `src/data.js`.
- [ ] Editing one service record updates its catalog card, featured placements, inquiry options, and server service-ID validation without editing component content.
- [ ] Palette values originate in `siteData.theme.colors`; derived CSS tokens and Tailwind styles use that same source.
- [ ] The public module contains no secrets, inquiry submissions, private source notes, or duplicated page-specific service lists.
- [ ] Duplicate, ambiguous, zero-dollar, promotional, and rebooking entries follow the catalog integrity rules.
- [ ] The later service list is merged without duplicate additions; all four explicitly supplied Free labels are retained, and Return Client Rebook shows 55 minutes.
- [ ] Service inquiry links preselect the correct service, and invalid IDs are handled safely.
- [ ] The Square direct link remains visible and usable with or without a working embed.
- [ ] No inquiry or page-load action is presented as a confirmed appointment.
- [ ] Valid inquiries, invalid input, duplicate submits, provider failures, and missing configuration produce honest, accessible states.
- [ ] Server-side validation, fixed recipients, secret handling, and abuse controls are implemented and documented.
- [ ] No keys or private server configuration appear in the frontend build.
- [ ] Deep-link refreshes and the inquiry endpoint work under the Netlify configuration.
- [ ] Unsupported claims, fake reviews, invented policies, and expired promotions are absent from public copy.
- [ ] Missing business approvals, assets, credentials, and integration details are listed in `CONTENT-REVIEW.md`.

Capture representative desktop and mobile views for visual review when the available environment supports it. Report what was actually verified and identify any checks that still require owner credentials or a live deployment.

## 16. Required handoff

Deliver:

1. The complete working React/Tailwind project and Netlify configuration.
2. The server-side Resend inquiry function and a safe configuration example.
3. The Square booking page with supported integration when configured and an always-available direct-link fallback.
4. A complete `src/data.js` module exporting `siteData` for all editable public content and brand colors, including all 28 service records and the Before & After page/gallery data model.
5. A README with local setup, email testing, build, deployment, and a practical guide to editing `src/data.js`.
6. A content-review document covering unconfirmed contact details/hours, service ambiguities, credentials, promotions, privacy copy, images, and missing assets.
7. A concise completion report describing the implemented experience, actual validation results, and remaining launch dependencies.

Build a coherent Remedy website that visitors can understand, navigate, and use. Make the premium atmosphere visible in the design and keep the booking, pricing, and inquiry behavior truthful.
