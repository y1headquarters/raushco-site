# Raushco Theme — the homepage's own, non-Mercury design system

**Status: live today only on `website/index.html` (raushco.com itself). Every sub-page
(raushco.com/{slug}) currently uses [Mercury theme](MERCURY-THEME.md) instead — a separate, literal
mercury.com clone.** This file documents what already exists on the homepage, as the starting point for
extending Raushco's own design language to more pages going forward, rather than continuing to build new
pages as Mercury clones.

**Canonical reference file:** `website/index.html` — currently the only page on this system. Read its
`<style>` block and body markup directly for exact values; this doc is an orientation map, not a full
mechanical extraction (unlike MERCURY-THEME.md, which this project's author has much deeper accumulated
context on — treat the component list below as "what exists and roughly what it does," and go read the
actual CSS/JS before extending a specific piece).

---

## 1. Philosophy

Original, editorial, India-specific — not derived from any reference site. Bilingual brand voice (English +
Hindi in the hero: "India Saving. भारतीय बचत."), warm gold/deep-green/paper palette instead of Mercury's
cool beige/purple, phone-number-first signup (country-code chip + mobile number) instead of Mercury's
email-first pattern, and bespoke illustrated/animated components (a physical mail-unboxing metaphor, an
animated connected-dots hero annotation layer) rather than Mercury's product-screenshot mini-cards.

## 2. Design tokens

```
--ink: #1C1A16        /* primary text, light mode */
--ink-soft: #46574F
--paper: #FFFFFF       /* light-mode background */
--night: #0B1C18       /* dark sections (hero, footer) */
--night-raised: #142E28
--night-text: #ECEEE6
--night-text-soft: #9FB3AB
--brand: #D7A23B       /* warm gold — primary accent */
--brand-soft: #F0D9A6
--brand-deep: #1F6F5C  /* deep green — secondary accent */
--line / --line-dark: rgba(15,36,32,.12) / rgba(255,255,255,.14)
```

Fonts: `Inter` (same variable font as Mercury theme) for body/display, `Geist Mono` for eyebrows (also
shared with Mercury theme), plus two Google Fonts Mercury theme doesn't use at all — **Source Serif 4**
(`--font-serif`) and **Pinyon Script** (loaded but not yet seen wired to a token — check current usage
before assuming it's live). Headings are weight 600 (not Mercury's fractional 480/530 system). Buttons are
still fully-pill (`border-radius: 999px`), consistent with Mercury theme.

`section { padding: 108px 0; }` is the flat default rhythm (no `clamp()` fluid sizing, unlike Mercury theme).
`.wrap` max-width is 1180px (Mercury theme's is 1240px) with 32px side padding.

## 3. Component catalog (as currently built)

| Component | Classes | What it is |
|---|---|---|
| Nav | `.site-header` / `header.site-nav` / `.wordmark` | Fixed (not sticky) header, hides on scroll-down via `.nav-hidden` transform — a different mechanic from Mercury theme's sticky+blur nav |
| Announcement bar | `.announce-bar` / `.announce-chase` | A 2×2 chasing-dot loader animation + dismissible message, sits above the nav |
| Hero | `.hero` / `.hero-bg` / `.hero-annotations` | Dark (`--night`) full-bleed hero, bilingual h1, phone-number signup form. `.hero-annotations`/`.hn-dot`/`.hn-line-svg`/`.hn-card` is a bespoke animated layer connecting dots with drawn lines to a floating info-card (`#heroNodes`/`#hnLineSvg`/`#hnCard` — JS-driven, read the script block for the actual behavior before touching it) |
| Product grid | `.grid-feature` / `.gf-card` / `.gf-card-stage` | 4 photo-backed cards, one per core product (Credit/Deposits/Reserves/Retirement — maps directly to fd-backed-credit-card, fixed-deposit, gold-silver, nps) |
| Partner marquee | `.trust` / `.gallery-rail` / `.gallery-track` | Scrolling/paged logo rail of partner banks & institutions, with `.gallery-dots` pagination |
| Unboxing feature | `.unbox` / `.unbox-mailer` / `.unbox-toggle` | A bespoke, illustrated physical-mail-unboxing interaction (mailer, seal, postage, tear-strip, a toggle with `data-active` state) — the most custom/original piece on the page; read its full markup + JS directly before reusing or extending this pattern elsewhere |

(This list covers what's been surveyed; the file is ~2870 lines and likely has more sections below `.unbox`
— read `website/index.html` directly for the full picture before assuming this table is exhaustive.)

## 4. Relationship to Mercury theme

Both themes currently co-exist by page: homepage = Raushco theme, every `/{slug}` page = Mercury theme. They
are NOT meant to be visually merged piecemeal — when a page moves from Mercury theme to Raushco theme, treat
it as a full re-skin (new tokens, new component set), not a token swap on top of Mercury's component
mechanics. Product *content* (copy, partner facts, disclaimers) carries over regardless of which visual
theme a page uses — only the visual system changes.
