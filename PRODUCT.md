# Product

## Register

product

## Users

Small teams (a handful of people sharing a workspace) and individuals managing
their own work. They collaborate in real time on kanban boards, organize tasks
across workspaces, and track time. Context of use: focused work sessions on
desktop, day to day, often with the app open for long stretches. They expect a
tool that gets out of the way — fast, predictable, trustworthy.

Secondary audience: recruiters and fellow developers evaluating the project as a
portfolio piece. The interface itself is part of the proof of craft.

## Product Purpose

Nudgeboard is a kanban task-board app with time tracking and offline support
(PWA), built on real-time collaboration (WebSockets). Teams create workspaces,
organize work on boards, and track effort without friction.

It serves two goals at once: a genuinely usable product for small teams, and a
portfolio-grade demonstration of engineering and design craft. Success means a
fluent user trusts it on first contact and a technical evaluator can't tell "AI
made this."

## Brand Personality

Clear and fast. Three words: precise, quick, trustworthy. The Linear / Raycast
register — a productivity instrument, not a toy and not an enterprise console.
Confidence through restraint: the interface earns trust by being legible,
responsive, and free of decoration that doesn't carry meaning. Personality shows
in sharp interaction details and considered motion, not in loudness.

## Anti-references

Explicitly avoid all of these:

- **Generic AI-SaaS slop** — purple gradients, Inter everywhere, identical card
  grids, numbered section eyebrows (01/02/03), warm near-white backgrounds. The
  current landing leans this way and should move away from it.
- **Overloaded enterprise** — Jira-style density: cramped, gray, chrome-heavy
  dashboards that bury the work under tooling.
- **Toy / childish** — overly bright, cartoonish, excessively rounded.
- **Cold corporate** — impersonal navy/gray with no point of view.

## Design Principles

1. **Earned familiarity over novelty.** Fluent users of Linear, Trello, and
   Notion should trust the product UI instantly. Convention where it serves the
   workflow; deviate only when the UX genuinely wins.
2. **Speed is the feature.** Minimize friction in every interaction. Fast,
   predictable, low-latency-feeling. Motion clarifies, never delays.
3. **Craft is the proof.** This is also a portfolio. Polish, precision, and
   attention to detail are part of the value — actively reject the AI-slop tells
   listed in anti-references.
4. **Built for many hands.** Real-time, multi-user context. Empty, loading,
   error, and conflict states are designed, not afterthoughts.
5. **A quiet point of view.** Distinctive enough to not read as generic, without
   becoming loud, toy-like, or decorative for its own sake.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text contrast >=4.5:1, large text >=3:1, visible focus
states, full keyboard operability. Honor `prefers-reduced-motion` for every
animation. Existing foundations to preserve and extend: light/dark themes
(persisted, follows `prefers-color-scheme`) and i18n (ru default, en) — copy and
layout must hold up in both languages without overflow.
