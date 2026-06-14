---
name: Nudgeboard
description: A clear, fast kanban workspace for small teams — a control surface in graphite with a single coral signal.
colors:
  signal-coral: "#f0502e"
  coral-light: "#ff6a47"
  coral-deep: "#d83e1e"
  slate: "#3f3f46"
  graphite-ink: "#18181b"
  graphite-2: "#52525b"
  graphite-3: "#71717a"
  canvas: "#fafafa"
  surface: "#ffffff"
  card: "#f4f4f5"
  hairline: "#e4e4e7"
  danger: "#dc2626"
  amber: "#d97706"
  green: "#16a34a"
  sky: "#0284c7"
typography:
  display:
    fontFamily: "Geist Variable, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Geist Variable, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Variable, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist Variable, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Variable, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "3px"
  md: "12px"
  lg: "15px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.signal-coral}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "6px 16px"
  button-primary-xl:
    backgroundColor: "{colors.signal-coral}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "14px 28px"
  button-outlined:
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.md}"
    padding: "6px 16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.md}"
  pill:
    backgroundColor: "{colors.card}"
    textColor: "{colors.graphite-2}"
    rounded: "{rounded.md}"
---

# Design System: Nudgeboard

## 1. Overview

**Creative North Star: "The Control Surface"**

Nudgeboard is a precise instrument for getting work moving, not a console to be
administered. Everything the user needs is within reach, nothing extraneous is
on screen, and every action returns immediate, legible feedback. The system
earns trust the way Linear and Raycast do: through restraint, speed, and sharp
interaction detail rather than decoration. A fluent user of Trello, Notion, or
Linear should feel at home on first contact.

The palette is **graphite with a single coral signal**. Surfaces are calm,
near-neutral graphite; hierarchy comes from type scale and weight, not from
boxes inside boxes or color. Signal Coral does exactly one job — mark what is
actionable or active — and stays out of the way otherwise. Its rarity is what
makes it read as a signal (a "nudge") rather than as brand wallpaper. The
product is bilingual (ru default, en) and dual-theme (light/dark), so layouts
and copy must hold at both string lengths and both luminance ranges.

This system explicitly rejects four things, carried from PRODUCT.md: generic
AI-SaaS slop (purple gradients, identical card grids, numbered section eyebrows),
overloaded enterprise density (Jira-style gray chrome), toy/childish brightness,
and impersonal cold-corporate navy. The previous build's violet accent and
decorative purple hero gradients have been retired in this rework; the gradient
tokens now resolve to a near-flat graphite wash, not a hue ramp.

**Key Characteristics:**
- Calm, near-neutral graphite surfaces; hierarchy from type, not containers
- One coral signal that marks action and state, used sparingly
- Comfortable density: focused, never cramped, never sprawling
- Sharp, quiet interaction feedback over animated flourish
- Bilingual + dual-theme resilient by default

## 2. Colors

A near-true graphite scale with one electric coral signal; warmth lives in the accent, not the neutrals.

### Primary
- **Signal Coral** (#f0502e): The brand signal. Reserved for primary actions, active/selected states, focus rings, and links. In dark mode it brightens to Coral Light (#ff6a47) for legibility against the deep ground. **For body-size text and links on white, use Coral Deep (#d83e1e)** — #f0502e clears 3:1 (large text / UI) but not 4.5:1 at body size.
- **Coral Light** (#ff6a47) / **Coral Deep** (#d83e1e): Hover-up and pressed/down shifts of the signal; Coral Light is the dark-mode primary, Coral Deep the light-mode pressed and text-on-white variant.

### Secondary
- **Slate** (#3f3f46): A graphite-family supporting tone (e.g. the Logo gradient pairs Slate into Coral Deep). Structural, never a second "action" color.

### Neutral (the graphite scale)
- **Graphite Ink** (#18181b): Primary text and high-contrast marks. Also the dark-mode-adjacent ink.
- **Graphite 2** (#52525b) / **Graphite 3** (#71717a): Secondary and tertiary text — labels, captions, meta. Verify each hits 4.5:1 on its actual background.
- **Canvas** (#fafafa): Default app background.
- **Surface** (#ffffff) / **Card** (#f4f4f5): Raised surfaces and recessed/inset panels.
- **Hairline** (#e4e4e7): Borders and dividers.
- Dark mode mirrors this scale: Canvas #0e0e10, Surface #1a1a1d, Card #151518, Hairline #2a2a2e, Ink #f4f4f5.

### Tertiary (status)
- **Danger** (#dc2626), **Amber** (#d97706), **Green** (#16a34a), **Sky** (#0284c7): Error, warning, success, info. Semantic only — never decorative.

### Named Rules
**The One Signal Rule.** Signal Coral marks what is actionable or active and nothing else. If two things on a screen are coral and only one is the action, the design has failed. The coral is a nudge, not a coat of paint — its rarity is the point.

## 3. Typography

**Display / Body Font:** Geist Sans (Geist Variable, with system-ui, -apple-system, Segoe UI, Roboto fallback)
**Label / Mono Font:** Geist Mono (Geist Mono Variable, with ui-monospace, SFMono-Regular, Menlo, Consolas fallback)

**Character:** A single Geist superfamily carries the whole product — Geist Sans for everything from display to labels, Geist Mono for technical/code/metric contexts (tech tags, IDs, timers, counts). Geist is clean, slightly engineered, and reads as a control surface without shouting; it replaces the previous Inter (an acknowledged AI-tell) and pairs natively with the Geist Mono already in the project. Hierarchy is built from weight and scale within the one family, never from a competing display face. Variable font: `font-optical-sizing: auto` and `font-kerning: normal` are enabled on `body`.

### Hierarchy
Fixed rem scale, ~1.2 ratio, adjusted only at sm/lg breakpoints (product register — fluid clamp would undermine spatial predictability in dense UI).
- **Display / h1** (700, 3rem at lg → 2.5rem sm → 2.125rem xs, line-height 1.1, letter-spacing -0.022em): Hero and page titles.
- **Headline / h2** (700, 2.5rem → 2rem → 1.75rem, 1.15, -0.02em): Section headings.
- **Title / h3** (600, 2rem → 1.75rem → 1.5rem, 1.2, -0.015em): Subsection and card-group headings.
- **h4–h6** (600, 1.625 → 1.125rem range): Compact headings and panel titles.
- **Body** (400, 1rem, 1.6): Default reading text. Cap measure at 65–75ch.
- **Label / Overline** (600, 0.6875rem, letter-spacing 0.08em, UPPERCASE): Overlines and badge text. Short labels only (≤4 words).
- **Button** (600, 0.9375rem, no transform, letter-spacing 0): Action labels — verb + object.
- **Data / numerics:** use Geist Mono (or `font-variant-numeric: tabular-nums`) for timers, counts, and any aligned figures so columns don't jitter.

### Named Rules
**The Weight-Not-Family Rule.** Hierarchy is built from Geist's weight range (400 → 600 → 700) and scale, never by introducing a competing display face. One superfamily (Sans + Mono), many weights.

## 4. Elevation

Flat by default. The system conveys depth through tonal layering (Canvas → Surface → Card) and the Hairline divider, not through heavy shadows. MUI's elevation is available but used sparingly — reserved for transient, floating surfaces (menus, dialogs, popovers) that genuinely leave the page plane. Resting surfaces do not cast shadows. Scrollbars are thin (6px) and tinted with the divider color, never default-chrome.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat until something floats. Shadow is a response to state (a menu opening, a dialog appearing), never a default decoration on a resting card.

## 5. Components

The component character is **refined and precise**: quiet at rest, exact on interaction, trustworthy.

### Buttons
- **Shape:** Gently curved (12px radius; the extra-large variant uses 15px).
- **Primary:** Contained, Signal Coral fill, white text, weight 600, no uppercase transform. The default action. (Dark mode uses Coral Light fill with near-black text for contrast.)
- **Extra-large (`size="extraLarge"`):** Padding 14px / 28px, 15px radius. Used for hero and primary CTAs.
- **Outlined / Ghost:** `color="inherit"` outline for secondary actions; never competes with the contained primary.
- **Hover / Focus:** Subtle background shift toward Coral Deep; visible coral focus ring required (keyboard operability is non-negotiable per WCAG AA).

### Chips / Pills
- **Style:** Card background (#f4f4f5), Graphite 2 text, no border. Hover lifts to Hairline (#e4e4e7).
- **Use:** Tags, filters, tech labels. Selected state uses the coral signal, not a heavier fill.

### Cards / Containers
- **Corner Style:** 12px radius.
- **Background:** Surface (#ffffff) raised on Canvas; Card (#f4f4f5) for recessed/inset panels.
- **Shadow Strategy:** Flat at rest (see Elevation). Borders via Hairline when separation is needed.
- **Border:** 1px Hairline only. Never a colored side-stripe.
- **Internal Padding:** 16–24px (md–lg spacing steps).

### Inputs / Fields
- **Style:** MUI outlined, 12px radius, Surface background, Graphite Ink text.
- **Focus:** Border shifts to Signal Coral with a visible coral ring.
- **Error:** Danger border + helper text. Validation messages resolve from i18n keys (never hardcoded strings), so error copy must work in ru and en.

### Navigation
- **Style:** Quiet. Active route marked with the coral signal (text or indicator), inactive in Graphite 2. Hover is a low-chroma graphite tint, not a heavy fill.

### Browser Mockup (signature)
- A framed product preview used on the landing (header bar + content area). Uses `surface.mockupHeader` for the chrome. Keep it crisp and realistic; it is doing the "show the product" job in place of a screenshot.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Coral (#f0502e) only for actions, active/selected, focus, and links — the One Signal Rule. Use Coral Deep (#d83e1e) for body-size text/links on white to hold 4.5:1.
- **Do** build hierarchy from Inter's weight and scale, not from extra typefaces or boxes-in-boxes.
- **Do** keep resting surfaces flat; introduce shadow only when a surface genuinely floats.
- **Do** verify body text contrast ≥4.5:1 (large ≥3:1) in **both** light and dark themes before shipping.
- **Do** design empty, loading, error, and realtime/conflict states — small teams hit them constantly.
- **Do** test every heading and label in both ru and en; copy must not overflow at any breakpoint.
- **Do** honor `prefers-reduced-motion` for every animation with a crossfade or instant fallback.

### Don't:
- **Don't** bring back the generic AI-SaaS look: **purple/violet accents or purple gradients**, identical icon+heading+text card grids, or **numbered section eyebrows (01 / 02 / 03)** as default scaffolding. (PRODUCT.md anti-reference: *generic AI-SaaS slop*.)
- **Don't** drift toward overloaded enterprise: cramped gray dashboards, chrome-heavy toolbars, Jira density. (Anti-reference: *overloaded enterprise*.)
- **Don't** go toy/childish: oversaturate the coral, cartoon rounding, bouncy/elastic easing. The coral must stay a signal, not candy. (Anti-reference: *toy/childish*.)
- **Don't** fall into cold corporate: impersonal navy/gray with no point of view. (Anti-reference: *cold corporate*.)
- **Don't** use `background-clip: text` gradient text, glassmorphism as a default, or `border-left`/`border-right` > 1px colored side-stripes on cards, alerts, or list items.
- **Don't** let the coral appear twice as "the action" on one screen, or use it decoratively.
- **Don't** hardcode user-facing strings; route copy and errors through i18n keys.
