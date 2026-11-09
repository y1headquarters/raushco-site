# Mercury Theme — Raushco's current design system

**Status: this is the active design system for every page at raushco.com/{slug} and the homepage, as of 2026-11-09.**

This file exists so a future request can say "Mercury theme" / "Mercury design system" and get this exact
visual language back — either as the baseline to keep building on, or as something to revert a page to if a
"Raushco theme" rebuild of it doesn't work out. It is a literal, deeply-researched clone of mercury.com's
real visual system (colors, type, spacing, component mechanics — not a loose inspiration), adapted with
Raushco's own branding, copy, and India-specific product content. Treat this doc as the spec; treat any page
under `website/*/index.html` (every page except the homepage) as a working reference implementation you can
read the actual CSS/markup from.

**Raushco already has its own separate, non-Mercury design system too — see [RAUSHCO-THEME.md](RAUSHCO-THEME.md).**
It's live today on the homepage (`website/index.html`) only. The plan going forward is to extend Raushco
theme (not Mercury theme) to more pages — this doc is the reference for what to revert to or compare against
when doing that, not the direction new work should default to.

**Canonical reference files** (most complete, most recently verified, safe to copy the shared `<style>` block
and nav/footer markup from): `website/nps-vatsalya/index.html` and `website/fd-backed-credit-card/index.html`.
Every page's shared chrome (tokens, nav, hero mechanics, buttons, accordion, split-rows, wayfind, FAQ, CTA
band, footer) is byte-identical boilerplate copy-pasted page to page — only content (copy, images, links)
differs. If asked to revert a page to Mercury theme, diff its `<style>` block against one of these two files;
any divergence in the shared portion is drift, not an intentional page-specific choice.

---

## 1. Philosophy

Every token, spacing value, easing curve, and component mechanic was reverse-engineered from mercury.com's
**real, live, compiled CSS and DOM** — not guessed from the design's general look. Inline CSS comments
throughout the codebase document *why* a value is what it is (often "confirmed live: computed style dump
showed X", or "real measured value at a 1600px viewport"). When extending this theme, keep that discipline:
measure, don't eyeball.

Content discipline is equally deliberate: Mercury's own copy, real customer testimonials, and real Mercury
customer logos are **never** reproduced — testimonials use an invented, consistent persona roster; case
studies and specific claims are paraphrased/genericized. The one explicit exception is genuine Raushco
partner branding (real logos for Suryoday/Shriram/Bajaj/Mahindra/Unity Finance, Augmont, PensionBox) —
those are real confirmed partnerships, so reusing their real marks is correct, not a content-safety issue.

## 2. Design tokens

Three color ramps, switched by context rather than one global palette:

- **`--pb-beige-*`** (warm, `#fcfcfa` → `#201f1c`) — the personal-banking-style page family's default content
  background (`--pb-base-150` = `#efeee9` is literally "default section bg" on those pages).
- **`--pb-neutral-1000`/`-950`** (cool near-black, `#10101a`/`#171721`) — hero canvas only on the
  personal-banking hero, and the dark nav/footer state.
- **`--bb-lavender-bg`** (`#f5f4fd`) + **`--pb-purple-600`** (`#5266eb`, the one accent color shared by
  *every* theme/page) — the business-style page family's (`.bb-*` prefixed components) default background
  and accent.
- **Dark-purple footer/disclaimers**: `--pb-dp-bg` `#181623`, text `rgba(255,255,255,.92)`, muted
  `rgba(255,255,255,.5)` — used only for the shared footer + disclaimer band at the bottom of every page.

Typography: `Inter` (variable font, weights 300–800) for everything except an italic `Georgia` serif
(`--pb-serif`, used sparingly as `.accent-serif`) and `Geist Mono` for eyebrows/mono accents. Headings use
fractional weights (480, 530, 560) matching Mercury's real variable-font instances, not round 400/600/700
steps — this is deliberate, not a typo. Hero/module headings use `clamp()` fluid sizing tuned against real
measured viewport-width ratios, documented inline per hero variant.

Radii: `--pb-radius-s/m/l/xl/full` = 4/8/12/20/9999px. Buttons are always fully-pill (`border-radius:
var(--pb-radius-full)`). Cards are 12–16px. Easing: four named cubic-beziers (`--pb-ease-appear/transform/
snap/pop`) reused throughout rather than ad hoc values — match an existing one before inventing a new curve.

## 3. Layout

`.wrap` (max-width 1240px, 40px side padding, 20px under 640px) is the standard content container.
`section { padding: clamp(64px, 5vw+40px, 128px) 0; }` is the default section rhythm; `.bb-*` business-family
sections often override to a flatter 72–128px fixed padding instead of the clamp — check the specific
component's CSS rather than assuming.

## 4. Navigation system

Sticky nav (`position: sticky; top: 0`), transparent until scrolled (`.nav.scrolled` adds a blurred
translucent background). **Two parallel nav systems exist and must not be confused:**

- **Homepage** (`index.html`): `.wordmark` brand mark, `.nav-dropdown`/`.nav-dropdown-panel` mega-menus (hover
  or click, two-axis — check current markup), top-level items currently "Personal" (dropdown: Goals, Fixed &
  recurring deposits, Gold & silver, FD-backed credit card, NPS family) and a Business-oriented dropdown.
- **Every sub-page** (`website/{slug}/index.html`): `.brand` mark linking to `https://raushco.com/` (absolute
  URL, fixed 2026-11-09 — was a broken `#top` same-page anchor before that), `.nav-item`/`.mega-menu` system,
  **click-to-open, not hover**, closes on outside click (JS, not pure CSS). Top-level items today: **Products**
  (business banking product mega-menu + a "Personal Banking" foot-link), **Solutions** (industry-vertical
  mega-menu), **Resources** (blog/perks/tools + a "Product Releases" foot-link), **About** (story/connect/
  support + a "Contact us" foot-link), and a bare **Pricing** link.

  **This Products/Solutions/Resources/About/Pricing structure is the pre-restructuring state** — a
  Personal/Business top-level split (informed by axis.bank.in's real nav) was requested and is being rolled
  out across all sub-pages; check current `website/*/index.html` nav markup rather than assuming which
  structure is live when reverting to/from Mercury theme.

Mega-menu panel chrome: `border` + `border-radius: 0 0 16px 16px` + `overflow: hidden` (NOT `box-shadow` —
that was a bug, fixed once already; don't reintroduce it). The `.nav-links a` selector is scoped ONLY to
top-level nav pills — if you add any new element nested inside `.mega-menu`, give it an explicit
`.mega-menu a.<your-class>` override resetting display/height/padding/gap/border-radius, or it will
silently inherit the pill styling (this exact bug recurred three times this session).

Nav dark/light theme crossfades via `IntersectionObserver` watching `[data-theme]`-tagged sections at the
viewport's 50% line — `navEl.dataset.theme` and `body.dataset.theme` flip together, off one shared signal.

## 5. Hero patterns

Three variants in use:

- **`.hero`** (personal-banking-style): full-bleed blurred/desaturated photo background, dark overlay
  gradient, light text, a sticky sticky-pill disclosure (`.hero-note-wrap`) that releases from sticky near
  the hero's bottom edge. `min-height: 118vh` floor (Mercury's own hero has no explicit height — matches its
  real content-driven aspect ratio at common viewports).
- **`.bb-hero`** (business-style, used by almost every product page): flat lavender or near-white
  (`.tr-hero-neutral`) background, centered text, `.bb-email-pill` + `.bb-cta-secondary` CTA row, a
  `.bb-hero-visual` image below with responsive aspect-ratio steps (4:5 → 16:9 at 640px → 21:9 at 1280px)
  and a 4-edge mask-image fade into the page background.
- **`.tr-hero-neutral`**: a `.bb-hero` modifier that swaps just the background to near-white; used by
  treasury-style/product-comparison pages.

**Deprecated, do not reuse:** a 3-layer cursor-hover-reveal effect on `.bb-hero-visual` (`.bb-hv-mask` +
`.bb-hv-reveal` + `.bb-hv-top`, JS tracking `--hvx`/`--hvy`) existed on `business-banking` and `venture-debt`
only. Removed 2026-11-09 — it looked broken/muddled mid-transition, and its base layer depended on an asset
(`bb-hero-dashboard-mask.png`) that had real third-party PensionBox branding baked in. Every `.bb-hero-visual`
should now be a single static `.bb-hv-mask` layer, image `raushco-dashboard.png` — never
`bb-hero-dashboard.png` or `bb-hero-dashboard-mask.png` (both tainted, both should be fully unreferenced).

## 6. Content component catalog

| Component | Classes | Use for |
|---|---|---|
| Accordion-with-visual | `.acc-section` / `.acc-list-wrap` / `.acc-visual` | Feature deep-dive w/ a swappable product-shot visual, single-open accordion (dot indicator) |
| Carousel | `.carousel-section` / `.car-track` / `.car-captions` | Slideshow with persistent captions below, used sparingly |
| Split row | `.split-section` / `.bb-split-section` | Alternating text+image rows; `.bb-split-section` is the one almost every product page actually uses |
| Two-fact callout | `.bullet-grid` / `.bullet-item` | A short, bordered 2-column fact pair (e.g. "Section 80C" vs "Section 80CCD(1B)") — no new CSS needed, reuse this before inventing a new component |
| Icon feature grid | `.bb-listing` / `.bb-listing-grid` | 6-item icon+heading+description grid, the default "everything you need" section |
| Partner comparison grid | `.fd-partner-grid` / `.fd-partner-card` | Multi-partner-institution comparison (logos, rates, badges) — page-specific to `fixed-deposit`, only reuse if a page genuinely compares several named partners |
| Testimonial (single) | `.tr-testi-section` | One pull-quote, simplified pattern used by most product pages |
| Testimonial (tabs) | `.bb-testi-section` / `.bb-testi-tabs` | Multi-quote crossfade with progress-pill tabs |
| Wayfinding | `.bb-wayfind-section` / `.bb-wayfind-card` | 3-up cross-sell cards to other products; needs a page-scoped grid modifier (see below) for 4 or 6 cards |
| FAQ | `.bb-faq-section` / `.bb-faq-item` | Multi-open accordion, right-side chevron |
| Closing CTA | `.bb-cta-band` | Flat full-bleed closing band, no card chrome |
| Footer + disclaimers | `.dark-purple` / `footer.dp` / `.disclaimer-section` | Shared footer nav + a page-specific numbered disclaimer list — always update the disclaimer text to match the actual product's real regulatory caveats, never leave a copy-pasted disclaimer from the page it was cloned from |

`.bb-wayfind-grid` is `display:flex` (one row, no wrap) by default — fine for 3 cards, breaks for 4/6. Add a
page-scoped modifier class (e.g. `.bb-wayfind-grid-6`) using real CSS Grid instead of editing the shared rule.

## 7. Interaction patterns

Smooth scroll via Lenis + scroll-reveal via GSAP ScrollTrigger (`.reveal` elements fade/translate in on
scroll; falls back to instant-visible if the CDN scripts fail to load — always keep that fallback). Accordions
(both `.acc-*` and `.faq-*`/`.bb-faq-*` families) animate height via the CSS `grid-template-rows: 0fr → 1fr`
trick, not JS height measurement.

## 8. Page scaffolding convention

A new page is built by copying the **most content-similar existing page** (not always the most recent one —
pick by content/structure fit), then editing content only: hero copy, feature-grid items, split-row text,
testimonial persona (check the running list of already-used names before reusing one), wayfind cards, FAQ,
closing CTA, footer link additions, and disclaimer text. The shared chrome (tokens, nav, buttons, footer
structure) stays untouched byte-for-byte. **Known failure mode:** a whole leftover section from the source
page surviving the content edit by mistake — always grep the finished file for the old page's product name/
unique terms before shipping (e.g. grep a new page cloned from `gold-silver` for "gold", "silver", "Augmont").

Relative asset/link paths are `../`-prefixed (one level deep) except pages nested one level further
(e.g. `legal/privacy/index.html`), which need `../../`.

## 9. What's explicitly NOT Mercury-sourced

Product content (fixed-deposit, gold-silver, nps/corporate-nps/nps-vatsalya, fd-backed-credit-card) is
informed by axis.bank.in, stablemoney.in, pensionbox.in, augmont.com, novio.in, and zetapp.in — not Mercury,
which has no equivalent products. Only the *visual system* (this file) is Mercury's; the *product content* is
India-banking-reference-informed and partner-fact-grounded. Keep these two inputs separate when reverting —
"back to Mercury theme" means the CSS/components, not rewriting India-specific product copy back to
Mercury's own (US business-banking) content.
