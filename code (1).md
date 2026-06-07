# Documentation site · Al-khobaraa for import and distribute medicines and medical supplies — Implementation

> **Code specification.** Feed this file to a coding agent (Claude Code, Antigravity, Cursor). The companion `design.md` carries every visual decision — read it first, do not redesign.

## 1. Project manifest

- **Type:** Documentation site
- **Owner:** Al-khobaraa for import and distribute medicines and medical supplies
- **Primary audience:** Integration partners
- **Tone (drives micro-decisions):** Confident & sharp

## 2. Tech stack (pinned)

Use exactly these. Add no other runtime dependencies without explicit confirmation from the user.

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** | Server Components by default; client components only where state or events require it. |
| Language | **TypeScript** | `strict: true`. No `any` outside library boundaries. |
| Styling | **TailwindCSS v4** | Theme tokens via CSS custom properties; no inline tailwind config hacks. |
| Component kit | **shadcn/ui** | Use as a starting kit; override aggressively to match `design.md`. The shadcn defaults are not the brand. |
| Motion | **Framer Motion** for stateful / scroll / page-level animation. **CSS keyframes** for simple loops. | Do not mix libraries on the same animation. |
| Icons | **Lucide React** | Tree-shakable, single-stroke. |
| Hosting | **Vercel** | Zero-config deployment. |
| Persistence | **localStorage only** (theme, simple prefs) | No backend, no database, no auth in v1. |

**Forbidden without user confirmation:** any new dependency, any UI library beyond shadcn (no MUI, no Chakra, no Mantine), any state library beyond React + URL (no Redux, no Zustand unless the design specifies persistent flow state), any CMS, any analytics package.

## 3. Design handoff contract

**Read this section before scaffolding anything.**

The companion `design.md` was fed to a UI-generation tool (Stitch, Claude Design, v0, Figma's Make, or similar). That tool produced an artifact — JSX components, HTML pages, a tokens stylesheet, or some combination. Your job is to integrate that artifact verbatim, **never redesign it**.

**Step 1 — Inventory what the design tool produced.** Look for any of the following, in priority order:
1. A `design/` folder (or similarly-named `ui/`, `generated/`, `mockup/`) at the repo root.
2. Loose `.tsx` / `.jsx` files matching component names referenced in §5 (Route → Component Map).
3. Standalone `.html` files representing full screens.
4. A `tokens.css` / `theme.css` / `design-tokens.json` file with CSS custom properties or token definitions.
5. A Figma link in the user's repo — flag this and stop; ask the user to export to code first.

**Step 2 — Adopt the artifact.**
- **If JSX components were produced:** copy them into `components/ui/` (creating the directory if missing). Preserve filenames. Do not rename or refactor on import.
- **If raw HTML was produced:** convert each page to a Next.js route under `app/`. Translate `style="..."` to `style={{...}}` (camelCase keys) or to Tailwind utilities derived from the literal values. Preserve every declared value exactly.
- **If `tokens.css` was produced:** import it into `app/globals.css` at the top, before the Tailwind directives. Map any `--mm-*` / `--token-*` variables into Tailwind's `@theme` block so utilities can reference them.
- **If multiple formats are present:** prefer JSX > HTML > raw tokens. Mix only with explicit user permission.

**Step 3 — Don't invent.** If a component referenced in §5 (Route → Component Map) is missing from the design artifact, **halt and report**. Do not generate a placeholder. Ask the user whether to (a) run the design tool again, (b) implement a quick stand-in, or (c) drop the section entirely.

**Step 4 — Visual decisions live in `design.md`.** When `code.md` says "use the spacing scale from the design spec," read `design.md` §6 and apply it. Do not infer spacing or color values from this file — every visual token has an authoritative source in the design spec.

## 4. App Router file tree

```
.
├── app/
│   ├── layout.tsx              # Root layout, fonts, theme, top bar + left rail wrappers
│   ├── page.tsx                # /docs landing (renders the sidebar tree as cards)
│   ├── [...slug]/
│   │   └── page.tsx            # Catch-all MDX renderer (generateStaticParams from frontmatter)
│   ├── globals.css             # Tailwind directives + design tokens + syntax theme
│   ├── opengraph-image.tsx     # Per-page OG image with article title
│   ├── robots.ts
│   └── sitemap.ts              # Generated from MDX slugs
├── content/
│   └── docs/
│       ├── concepts/             # *.mdx, conceptual prose
│       ├── reference/            # *.mdx, API / CLI / config tables
├── components/
│   ├── ui/                     # shadcn primitives + design-tool output
│   └── docs/
│       ├── LeftNavTree.tsx
│       ├── RightToc.tsx
│       ├── Breadcrumb.tsx
│       ├── Article.tsx
│       ├── Callout.tsx          # Note / Warning / Tip variants
│       ├── CodeTabs.tsx        # Conditional on docs.code-density + docs.languages
│       ├── FeedbackWidget.tsx
├── lib/
│   └── docs/
│       ├── nav-tree.ts          # Build sidebar tree from frontmatter at build time
│       ├── toc.ts               # Extract h2/h3 → TocNode[]
│       └── frontmatter.ts       # Typed frontmatter parser
├── public/
│   └── …                       # Diagrams, favicon, fonts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json               # strict: true
└── package.json
```

**Naming:** PascalCase for components, kebab-case for routes and MDX filenames, camelCase for utilities. Folder names under `content/docs/` match `docs.shape` answers verbatim (lowercased, hyphenated).

## 5. Route → component map

| Route | Component(s) | Data | Notes |
|---|---|---|---|
| **/** | `<DocsLanding />` | `NavNode[]` from `lib/docs/nav-tree` | Cards-of-sections landing. Search affordance is focal. |
| **/[...slug]** | `<Article />, <Breadcrumb />, <RightToc />, <PrevNextPager />` | `Doc` by slug (MDX) | Catch-all. 404s when slug doesn't resolve. `generateStaticParams` from `content/docs/**/*.mdx`. |

**Anchors.** Every heading rendered by `<Article />` emits a kebab-case `id` so deep links work. The left nav tree resolves to slugs, never to anchors.

## 6. State & data contracts

All documentation content lives in MDX under `content/docs/`. No server fetching, no CMS, no API routes. The build step walks the MDX tree, parses frontmatter, and emits typed data for the runtime.

Contracts (define in `lib/docs/frontmatter.ts` and re-export as needed):

```ts
export type DocFrontmatter = {
  title: string;                  // required
  description?: string;           // 1-2 sentences, used in OG + search snippet
  section: string;                // e.g. "concepts" | "tutorials" | "reference"
  order?: number;                 // sort key within a section; falls back to filename
  date?: string;                  // ISO 8601, used for changelog ordering
  draft?: boolean;                // true → exclude from build output
};

export type Doc = {
  slug: string[];                 // path segments, e.g. ["concepts", "routing"]
  url: string;                    // joined slug, leading slash
  frontmatter: DocFrontmatter;
  body: string;                   // raw MDX source
  headings: TocNode[];            // h2/h3 only
};

export type NavNode = {
  label: string;
  url?: string;                   // leaf → present; group → absent
  children?: NavNode[];           // group → present
};

export type TocNode = {
  id: string;                     // kebab-case anchor
  text: string;
  level: 2 | 3;
};

```

**Loaders** in `lib/docs/nav-tree.ts` and `lib/docs/toc.ts` run at build time only. No `useEffect`-driven fetching, no client-side MDX parsing.

**Tier-2 dependencies (pick one, flag to the user before installing):**
- **MDX bundler:** `[unspecified, pick one: next-mdx-remote, @next/mdx, or contentlayer]`. Default recommendation: `next-mdx-remote` for static-build simplicity.
- **Search:** none required at this tier (docs.search = native browser-find).
- **Syntax highlighting:** `[unspecified, pick one: shiki or prismjs]`. Default recommendation: `shiki` (build-time tokenization, zero runtime cost).

## 7. Interaction spec (behavior, not visuals)

**Selection / focus states**
- Every interactive element has a visible `:focus-visible` state, never suppressed.
- `:focus-visible` ONLY (no `:focus`) — so mouse clicks don't render a ring.
- Tab order follows visual order, no `tabindex > 0`.

**Pressed / active states**
- Buttons scale to `0.97` for 60ms on press. Disabled buttons do not respond.
- Cards (tile-shaped surfaces) keep their hover lift on press and add `scale(0.97)`.

**Hover (desktop / fine-pointer only — never the only signal)**
- Default to subtle hover lifts on cards.

**Density implications**
- Comfortable: balanced cadence; tap targets 44px+; two-to-three focal elements per scroll-screen.

**Animations**
- 11 animations selected — the full implementation contract for each one is in the **Motion catalog** section below.
- **Every animation** must check `useReducedMotion()` (Framer) or `@media (prefers-reduced-motion: reduce)` (CSS). When the user prefers reduced motion, the animation is **disabled** (not slowed) — content state remains, motion does not.

## Motion catalog

The user selected **11 animations**. Implement exactly these — no extras. Each entry below is the contract: trigger, target, easing, duration, reduced-motion path, suggested library.

**Project baseline:** `cubic-bezier(0.22, 1, 0.36, 1)` @ 220ms. Used by chromeSafe animations; expressive animations keep their own curve (noted per entry).

### Entrance

- **Fade in** (Framer Motion) — Soft opacity 0 → 1.
  - Trigger: viewport-enter  ·  Intensity: whisper  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: any
  - Distance: opacity 0 → 1
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 320ms
  - Reduced-motion fallback: opacity-only

### Hover

- **Arrow nudge** (CSS) — Arrow icon scoots forward to signal continuation.
  - Trigger: hover/focus  ·  Intensity: whisper  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: link arrows, next-step CTAs
  - Distance: translateX 0 → 4px on hover loop
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 180ms
  - Reduced-motion fallback: opacity-only

### Scroll

- **Progress bar** (CSS) — Top-of-page strip fills with scroll position.
  - Trigger: scroll  ·  Intensity: whisper  ·  Affinity: portfolio, landing, docs
  - Target: thin top-of-viewport bar
  - Distance: scaleX 0 → 1 as scroll advances
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: scroll-linked
  - Reduced-motion fallback: opacity-only

### Page transitions

- **Cross fade** (Framer Motion) — Old page fades out as new fades in.
  - Trigger: route-change  ·  Intensity: whisper  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: page roots
  - Distance: old opacity 1 → 0, new 0 → 1 (overlap 50%)
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 300ms
  - Reduced-motion fallback: opacity-only

### Micro-interactions

- **Search highlight** (CSS) — Matched term flashes warmly then settles into a tint.
  - Trigger: state-change  ·  Intensity: whisper  ·  Affinity: docs, dashboard
  - Target: matched search tokens
  - Distance: background opacity 0 → 1 → 0.3
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 900ms
  - Reduced-motion fallback: opacity-only

- **Check pop** (Framer Motion) — Tick draws + scales on confirm.
  - Trigger: state-confirm  ·  Intensity: standard  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: icon button
  - Distance: stroke-dashoffset 24 → 0 + scale 0.8 → 1.08 → 1
  - Easing: `cubic-bezier(0.4, 1.6, 0.4, 1)`  ·  Duration: 500ms total
  - Reduced-motion fallback: opacity-only
  - ⚠ Expressive motion (chromeSafe=false). Respect `prefers-reduced-motion` with fallback `opacity-only`.

- **Copy confirm** (Framer Motion) — A small Copied label lifts and fades after the action.
  - Trigger: state-confirm  ·  Intensity: whisper  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: copy-to-clipboard buttons
  - Distance: label opacity 0 → 1 → 0 + translateY 0 → -4
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 280ms in / 1400ms hold / 200ms out
  - Reduced-motion fallback: opacity-only

- **Scroll spy** (Framer Motion) — Active TOC indicator glides to the current section.
  - Trigger: scroll  ·  Intensity: whisper  ·  Affinity: docs, dashboard
  - Target: TOC active bar
  - Distance: 2px bar translateY between TOC slots
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 220ms
  - Reduced-motion fallback: opacity-only

- **Skeleton shimmer** (CSS) — Muted bars sweep with a soft gradient while loading.
  - Trigger: passive-loop  ·  Intensity: whisper  ·  Affinity: landing, dashboard, docs
  - Target: loading placeholders
  - Distance: background-position -150% → 150%
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 1400ms loop
  - Reduced-motion fallback: instant

- **Input focus glow** (CSS) — Subtle ring blooms around the focused field.
  - Trigger: focus  ·  Intensity: whisper  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: text inputs, search bars
  - Distance: box-shadow ring opacity 0 → 1 on focus
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 160ms
  - Reduced-motion fallback: opacity-only

- **Toggle flip** (CSS) — Switch knob slides while track shifts color.
  - Trigger: state-change  ·  Intensity: whisper  ·  Affinity: portfolio, landing, dashboard, docs
  - Target: toggle switches
  - Distance: knob translateX 0 → 18px, track bg fades
  - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`  ·  Duration: 180ms
  - Reduced-motion fallback: opacity-only

### Reduced motion
Every loop and reveal above MUST be disabled under `@media (prefers-reduced-motion: reduce)`. Content state is preserved (no element disappears); only the motion transition is removed.

## 8. Accessibility requirements
**WCAG 2.1 AA is the floor.** These are non-negotiable.
- **Semantic HTML.** `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` over generic `<div>`. One `<h1>` per page.
- **Keyboard.** Every interactive element reachable by tab. `Esc` closes menus and modals. `Enter` and `Space` activate buttons. No keyboard traps.
- **Focus.** `:focus-visible` style on every interactive element. Outline `2px solid` in the accent color, `2px offset`. Never `outline: none` without an equivalent replacement.
- **ARIA.** `aria-label` on icon-only buttons. `aria-pressed` on toggles. `aria-expanded` on disclosure controls. `role="dialog" aria-modal="true"` on modals. Use ARIA only when semantic HTML doesn't suffice; the first rule of ARIA is don't use ARIA.
- **Contrast.** Body text ≥ 4.5:1, large text and UI components ≥ 3:1, against the surface. The contrast ratios are documented per-pair in `design.md` §2.
- **Reduced motion.** Honor `prefers-reduced-motion: reduce` globally. The implementation: a single `@media` block that overrides every `animation-duration` and `transition-duration` to `0.001ms`. Loop counts to `1`.
- **Screen readers.** All animations that convey state changes use `aria-live="polite"` regions to announce the change. Visual-only animations are decorative and `aria-hidden="true"`.
- **Reduced-motion fallbacks per animation.** Every entry in the Motion catalog above has a non-motion alternative (the content arrives in its end state with no transition). Implement both paths.

## 9. Performance budgets

**Targets (Vercel preview build, mid-tier laptop, Slow 4G throttle):**

| Metric | Budget |
|---|---|
| LCP | ≤ 2.0s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| Initial JS (compressed) | ≤ 180KB |
| Total page weight (initial paint) | ≤ 800KB |
| Lighthouse (mobile) | ≥ 95 across the board |

**Mandates**
- All Next/Image components have explicit `width`, `height`, and `sizes` props. No raw `<img>` for hero imagery.
- Fonts loaded via `next/font` with `display: swap`. No `@import url("fonts.googleapis.com...")` in CSS.
- No client component above the fold unless it has interactive state. Server-render everything you can.
- Animations use `transform` and `opacity` only (compositor-only). Animating `top`, `left`, `width`, `height` is forbidden.
- Lighthouse-flagged issues block deploy. Run `next build` locally before pushing; warnings count.

## 10. Deployment

- **Host:** Vercel.
- **Build command:** `next build`. **Output:** `.next` (default). No custom output directory.
- **Env vars:** none required in v1. Add only via `.env.local` (gitignored) and the Vercel dashboard. Never commit `.env.local`.
- **Preview/Prod parity:** every branch deploys to a preview URL. Production is the `main` branch.
- **Domain:** configure after the first successful production deploy. Use the Vercel-managed certificate.
- **Analytics:** out of scope for v1. If added later, prefer Vercel Analytics or Plausible (no client-side fingerprinting).

## 11. Anti-hallucination guardrails

**Closed-world clause.** Implement only what is specified across this file and `design.md`. Do not add:
- Routes not in §5.
- Sections not in the page kinds in `answers["docs.shape"]`.
- Dependencies not in §2.
- Analytics, auth, CMS, or backend.
- 'Best-practices' boilerplate (cookie banners, splash screens, loading spinners) unless they appear in a spec section.

**Unspecified fields.** When you encounter a field marked `[unspecified]` in this spec OR in `design.md`, **ask the user before guessing**. Do not invent content, copy, palette values, or behavior.

**Animation invention.** If the Motion catalog earlier in this file lists animations, do not add extras (no "subtle" parallax, no decorative scroll reveals). The motion budget is what the user picked.

**Palette invention.** Use only the hex values from `design.md` §2. Do not generate a tint, shade, or hover variant unless the spec defines one. If you need an interaction-state color the spec doesn't provide, derive it via the OKLCH adjustment formula in `design.md` §2 (and document the derived value back into the spec).
**Curated palette reference.** Specflow's curated palettes are: Mono Slate, Sunset Warm, Forest Deep, Plum Noir, Paper & Ink, Electric Mint, Cobalt Quiet, Rose Clay, Oxblood, Graphite Lime, Quiet Walnut, Foxed Paper, Riso Cobalt, Mid-Century Cardroom, Reading Room Sage, Pressed Linen, Vellum & Vermilion, Studio Notebook, Tea-Stained Margin, Drafting Vellum, Quiet Concrete, Bone Linen, Atelier Bone, Stationery Pale, Soft Tarmac, Iceberg Lean, Warm Quartz, Salt Flat, Tangerine Riot, Citron Press, Magenta Tarot, Klein Wash, Pool Float, Acid Olive, Terracotta Hearth, Kiln Smoke, Hayfield, Riverbed Clay, Date Palm, Saffron Loom, Walnut Reading Lamp, Plum Curtain, Petrol Library, Smoked Pearl, Espresso Velvet, Confetti Café, Bubblegum Risograph, Marshmallow Lawn, Crayon & Cream, Soft Static. If the brief's palette is one of these, the swatches are canonical — do not modify.

**Docs closed-world specifics.**
- Do NOT invent documentation content. Every `.mdx` file ships with placeholder copy that says `[unspecified — author this page]` rather than fabricated technical guidance.
- Do NOT add a versioning sidebar unless `answers["docs.versioning"]` is set to a versioned option.
- Do NOT generate API reference tables from imagined endpoints. The reference page template stays empty until the user supplies endpoint definitions.
- Search index builds only at compile time; never at runtime. No client-side full-text crawling.
