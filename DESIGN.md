---
name: Remedy
description: A treatment editorial with light and dark modes, personal warmth, and clear next steps.
colors:
  obsidian: "var(--color-background)"
  midnight: "var(--color-surface)"
  cyan: "var(--color-primary)"
  champagne: "var(--color-vip)"
  ivory: "var(--color-text)"
  silver: "var(--color-text-secondary)"
  on-action: "var(--color-on-primary)"
  link: "var(--color-link)"
  divider: "color-mix(in srgb, var(--color-text-secondary) 23%, transparent)"
typography:
  headline:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(48px, 5.4vw, 78px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(37px, 4vw, 55px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "27px"
    fontWeight: 500
    lineHeight: 1.23
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    lineHeight: 1.8
  lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    lineHeight: 1.9
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.025em"
rounded:
  square: "0px"
  control: "2px"
spacing:
  filter-gap: "8px"
  action-gap: "12px"
  control-gap: "16px"
  content-inset: "20px"
  field-gap: "22px"
  row-gap: "24px"
  panel-inset: "35px"
  grid-gap: "40px"
  section-mobile: "44px"
  section-tablet: "56px"
  section-desktop: "72px"
components:
  button-primary:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.on-action}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, var(--color-primary) 78%, var(--color-text))"
    textColor: "{colors.on-action}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "14px 26px"
  button-secondary-hover:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.obsidian}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    height: "44px"
    width: "44px"
  slide-indicator:
    backgroundColor: "transparent"
    height: "44px"
    width: "52px"
  input:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "13px 15px"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.silver}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  filter-selected:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  service-card:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.square}"
  availability-notice:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.square}"
    padding: "20px"
---

# Design System: Remedy

## Overview

**Creative North Star: "Dark Treatment Editorial"**

Remedy pairs the intimacy of treatment photography with the measured typography of an editorial. Dark mode uses deep, cool surfaces and ivory lettering; light mode uses ivory and white surfaces with dark lettering. High-contrast serif headings give the site its expressive voice; small, clear sans-serif controls make browsing and the next action feel straightforward. The photographic hero retains its original dark treatment and spacious dimensions in both modes.

The system uses a compact section rhythm with closely grouped service details and controls. It expresses a premium, calm, welcoming business through actual treatment subjects, fine rules, and restrained champagne details. Preserve the supplied original logo on its light panel. Photography is illustrative context, and equipment visualizations retain their visible disclosure.

**Key Characteristics:**

- Dark tonal surfaces with a single bright action color.
- Bodoni Moda headings balanced by Manrope text and controls.
- Open photographic service entries rather than boxed promotional tiles.
- Rectangular actions, fine rules, and sparse champagne emphasis.
- A calm, controllable image crossfade and explicit interface states.

This is a record of the built system in `src/styles/index.css`, `src/components`, and `src/pages`, checked against the reviewed desktop and mobile captures in `.impeccable/review`. `src/data.js` remains the only editable source of public content, palette, and font choices. `src/main.tsx` exposes its theme as root CSS variables. The frontmatter's color values reference those variables; edit the public palette in `siteData.theme.colors`, then regenerate this record. Preview text in the sidecar is demonstrative, not a public content source.

## Colors

The palette combines cool near-black and midnight blue with warm ivory, silver supporting text, a decisive cyan action, and occasional champagne detail. The frontmatter is a live reference layer over the implementation palette, not a second set of color literals. Sidecar tonal ramps are generated inspection strips, not additional approved interface colors.

### Light mode

The original color names describe the dark baseline; their CSS variables are semantic and remap with the selected mode. `siteData.theme.lightColors` defines ivory background, white raised surfaces, obsidian text, slate secondary text and darker bronze accents. Cyan action backgrounds retain a fixed dark `on-action` label. Light-mode links and focus rings use the darker teal from `theme.lightLink`; control outlines use `theme.lightControlBorder`. Hero text, photo shading, image arrows and over-photo accents use fixed image-specific semantic tokens, preserving contrast independently of page mode. Solid text, links, accents, button labels and control-border pairs are checked in `tests/theme.test.ts`.

### Primary

- **Action Cyan** (`cyan`): filled primary actions, selected category controls, keyboard focus, caret, and active interaction cues. Its label color is Obsidian.

### Secondary

- **Champagne Detail** (`champagne`): fine link underlines, supporting icons, service category metadata, italic emphasis, and form feedback. It is a detail color rather than a filled primary action surface.

### Neutral

- **Obsidian** (`obsidian`): page canvas, dark action labels, dark image disclosures, and photographic shading.
- **Midnight** (`midnight`): consultation and closing surfaces, form fields, asides, and empty or success states. The service preview uses a derived mix of Midnight and Obsidian.
- **Ivory** (`ivory`): headings, foreground text, the logo's light backing, secondary-action hover fill, and image-link arrow panels.
- **Silver** (`silver`): paragraphs, placeholder text, supporting labels, control borders, and the scrollbar thumb.
- **Quiet Divider** (`divider`): a translucent Silver rule separating sections, list entries, navigation, and catalog tools.

**The Action Contrast Rule.** Filled cyan actions use the fixed dark `on-action` label in both themes; preserve this pairing across selected and hover states.

**The Source Palette Rule.** Change public colors only through `siteData.theme` in `src/data.js`: `colors` owns the dark baseline, `lightColors` the light remap, and named semantic fields the light link and border colors. Derived mixes may reference those values; neither documentation previews nor a new component establish another palette source.

Selection is themed with a Champagne background and Obsidian text. Scrollbars use Silver against Obsidian. Focus and text carets use Action Cyan; these browser surfaces belong to the same palette as drawn controls.

## Typography

**Display Font:** Bodoni Moda, with Georgia and serif fallbacks. Normal and italic variable fonts are self-hosted.

**Body Font:** Manrope, with a sans-serif fallback; the variable font is self-hosted.

**Character:** Bodoni Moda supplies fine contrast and a personal editorial voice. Manrope keeps small labels, service facts, paragraphs, and actions clear. There is no separate monospace or decorative label face.

### Hierarchy

- **Headline:** the `headline` role is the shared page-heading ramp. Section headings use the `section` role; both are regular weight with balanced wrapping and slightly tight tracking.
- **Title:** the `title` role is the recurring service title. Longer catalog names wrap naturally; titles are not truncated.
- **Body:** the `body` role is the desktop base, with a paragraph ceiling of (72ch). Actual supporting paragraphs often use a more compact (12–14px) size and (1.8–1.9) line height. Lead paragraphs use the `lead` role.
- **Label:** the `label` role is the primary action style. Navigation and service facts use compact Manrope, with mixed case rather than forced uppercase.
- **Numerals:** prices and contact numbers use tabular figures where alignment matters.

At the mobile breakpoint, body type becomes (14px), standard page headings become (47px), and service titles become (28px). Long-form and form text retain clear separation from compact metadata. Text inputs increase to (16px) on mobile. The home hero has its own larger responsive display treatment; it does not replace the shared heading ramp.

**The Two Voices Rule.** Use Bodoni Moda for expressive headings and Manrope for explanatory text, service facts, and controls.

## Layout

The shared shell centers content within a maximum width of (1240px), with a desktop inset of (56px) per side. The inset becomes (36px) at widths up to (1150px), (24px) up to (900px), (20px) up to (640px), and (16px) up to (360px). Major section spacing follows the three recorded section tokens. Keep related copy, facts, and controls close while allowing larger breaks between sections.

Service browsing uses three columns on desktop, two at the tablet breakpoint, and one on mobile. The desktop service grid has (32px) row gaps and (24px) column gaps; tablet uses (28px / 24px), and mobile uses a (28px) vertical gap. Editorial sections commonly pair a larger heading or image with a supporting text column. The paired layouts stack on mobile without changing reading order. Section padding is 72px on desktop, 56px on tablet, and 44px on mobile. At the user's request, the hero retains its original spacious height and content padding: desktop uses a 790px minimum with height min(900px, 100svh), and mobile uses 850px height with 250px top and 90px bottom content padding (235px top at widths up to 360px).

Navigation switches from a horizontal link row to an explicit menu at widths up to (900px). The booking action remains visible beside the trigger. Inquiry form rows become single-column at the same breakpoint. At widths up to (640px), catalog category buttons become a horizontally scrollable row, search fills the available width, and remaining content grids stack. Use the same shell rather than introducing a separate mobile alignment.

## Elevation & Depth

The system uses no box shadows. Depth comes from Obsidian and Midnight tonal layering, image crops, and fine dividers. Photography receives dark shading where it must support foreground copy; the hero overlay is a legibility device, not a glass surface. Cards remain open and flat. Asides, empty states, and feedback areas have a clear surface or a single boundary without a floating-card treatment.

**The Flat Surface Rule.** Convey hierarchy through tonal surfaces, spacing, and thin rules; recurring containers do not acquire decorative shadows.

The authored motion is a soft image crossfade with exponential ease-out. Image links also have a restrained zoom and saturation response. Motion values, the precise shade treatment, and reduced-motion behavior live in the sidecar and source CSS rather than an unsupported frontmatter group.

## Shapes

The form language is rectangular. Buttons, icon controls, category filters, and fields use the nearly square `control` radius. Photographs, service entries, panels, and small image-arrow backgrounds stay square. Category filters are compact rectangles, not pills. Borders are thin: subtle Silver-derived rules, clearer Silver field outlines, Champagne feedback, and an Ivory-derived secondary-action border.

The original logo is contained at its natural proportions on a light rectangular panel. Never crop, recolor, or replace it with a typeset wordmark. Icons use consistent Lucide SVG linework; arrows connect visual navigation with the text action.

## Components

### Buttons

Clear, compact rectangles with an explicit action label and a directional arrow.

- **Primary:** the `button-primary` token pairs Action Cyan with Obsidian text. Desktop minimum height is (52px); mobile is (50px). Header actions use a denser variant.
- **Secondary:** transparent with Ivory text and an Ivory-derived border. Hover fills the control with Ivory and uses Obsidian text.
- **Hover / Focus:** primary fill lightens through a source-derived mix. Keyboard focus is a (2px) cyan outline with a (5px) offset. Disabled buttons use reduced opacity and a non-interactive cursor; loading adds a small spinner while retaining the action's context.
- **Icon controls:** (44px) square targets, transparent at rest, with a subtle Ivory-derived hover surface and cyan icon.
- **Text links:** a fine Champagne underline, an arrow, and a minimum (44px) target; both text and rule become Cyan on hover.

Booking and inquiry are separate actions with distinct destinations. In the repeated action pair, booking is the filled primary action and inquiry is the outlined secondary action. Contextual service inquiries may use cyan text links or a filled consultation action; route meaning must remain explicit.

### Chips

Category filters are rectangular selection controls with a quiet border and Silver label. Hover strengthens the border to Champagne and the label to Ivory. The selected state uses Cyan with Obsidian text and an explicit `aria-pressed` state. On mobile they scroll horizontally while retaining their minimum (44px) target height.

### Cards / Containers

Service entries behave like an editorial index: an image, metadata, serif title, description, and price/action row. They have no enclosing background, rounded frame, or shadow. The image crop is wider than square, with a small Ivory arrow panel in its lower right corner. Equipment visualizations keep a visible dark disclosure label. Content begins (20px) beneath the image; the bottom row uses flexible space so actions stay aligned across desktop entries.

Midnight asides and empty states use generous internal padding and simple type hierarchy. They should read as a change of surface, not nested cards. Empty catalog and results states explain the situation and provide the next useful action.

### Inputs / Fields

Inquiry fields use a Midnight fill, Ivory text, Silver border and placeholder, the `control` radius, and a minimum (51px) height. Labels sit above fields, with required or optional hints aligned separately. Textareas have a minimum (160px) height and resize vertically. Search is a distinct, transparent underline field with a search icon and a labeled clear control.

Focus uses the shared Cyan outline, and carets are Cyan. Validation uses a Champagne border plus a specific nearby error message; the message carries the meaning. Availability, error, and success messages are visibly distinct states. Unavailable submission stays disabled and presents an alternative contact path. Form checking and submission expose their busy state rather than implying completion.

### Navigation

The header combines the supplied light-backed logo, horizontal navigation, booking action and sun/moon theme toggle in one row. The location/phone utility strip was removed at the user's request. The toggle follows the system until an explicit choice, then remembers the selection in local storage. It preserves current form/page state, supports keyboard operation and names the mode it will switch to. Desktop links use a fine accent underline for hover/current-page state. Mobile navigation uses the selected page theme, retains row dividers and an accessible current-page label. Its trigger exposes expanded state, Escape closes it and returns focus, and route changes close it.

### Slideshow

The photographic slideshow is a calm seven-photo sequence with stationary copy and seven line indicators. The user requested removal of previous, next, pause/play buttons and the numeric counter. Each indicator has an accessible slide label and pressed state; the current line is thicker and Cyan. Selecting an indicator stops automatic playback, which also pauses while the region is hovered or contains focus. Reduced motion disables autoplay and effectively removes transitions. Desktop targets are 52 by 44px with an 8px gap, tablet uses 36px widths, and mobile indicators share a full-width row below the location line with a 44px target height and minimum 24px width. Both page themes retain dark photo shading and ivory text.

### Disclosure & Feedback

Illustrative photography and equipment imagery receive honest, visible disclosure. Inquiry availability and submission feedback use thin Champagne boundaries or Midnight surfaces, icons, and plain text. Keep the action label truthful about the state; an inquiry success is never styled or worded as an appointment confirmation.

## Do's and Don'ts

### Do:

- **Do** use the theme variables sourced from `src/data.js` and preserve Cyan actions with Obsidian labels.
- **Do** pair Bodoni Moda headings with Manrope reading text and controls.
- **Do** preserve the supplied logo on a light, uncropped panel.
- **Do** keep image disclosures, clear focus, reduced-motion behavior, and truthful empty or unavailable states visible.
- **Do** retain separate booking and inquiry destinations and clear action labels.
- **Do** use open service entries, compact section spacing, and fine dividers to organize content.

### Don't:

- **Don't** create another editable public palette or content store in components or documentation.
- **Don't** add decorative shadows, glass panels, or rounded card frames to the flat editorial system.
- **Don't** turn Champagne details into a competing filled primary action color.
- **Don't** treat illustrative imagery as Remedy staff, client results, or evidence of actual equipment.
- **Don't** make automatic motion necessary to understand the content or operate the controls.
