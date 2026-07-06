# Whitecast Landing Page — Generation Prompt

Use this prompt with an AI website/code generator (e.g. for a Next.js + Tailwind + Framer Motion build, or any AI site builder that accepts a detailed brief).

---

## MASTER PROMPT

You are an expert front-end designer and developer. Build a **single-page marketing landing page** for **Whitecast**, a modular prediction market platform for humans and AI agents. Follow the specification below exactly. Prioritize visual polish, smooth motion, and a premium, futuristic, dark-mode aesthetic.

### 1. Brand & Visual Reference

- Product category: crypto/AI prediction market platform (think Polymarket/Kalshi but AI-native).
- Visual reference: dark, near-black background (#0A0A0A–#0D0D0F), high-contrast white/off-white text, single accent color used sparingly (electric purple/violet, e.g. #A855F7 or #8B5CF6), thin hairline borders (#242424), soft glow/light-line chart accents, minimal chrome, generous whitespace, rounded 12–16px corner cards.
- Reference the attached platform screenshot for UI tone: dark trading interface, line chart with glowing white stroke on black, pill-shaped buy/sell toggle, monospace-style ticker numbers, card grid of markets with odds and multipliers.
- Overall feel: **premium AI product, futuristic, minimal, interactive but lightweight** — never cluttered or "cryptobro" loud.

### 2. Typography System

Load and apply exactly three typefaces (self-hosted or via CDN, provide @font-face declarations):

| Role | Font | Applied to |
|---|---|---|
| Title | **Nippo** | Hero wordmark, all H1/H2 section headings, feature-card titles, team member names, article titles |
| Body | **IBM Plex Sans** | Paragraph copy, descriptions, nav links, buttons, footer nav, form labels |
| Mono | **Departure Mono** | Stats, percentages/odds, timestamps, roadmap quarter labels, ticker/price data, badges, copyright line |

Rules:
- Nippo appears large and sparingly — reserve it for moments that need dramatic typographic weight. Use tight letter-spacing and a generous type scale (clamp(2.5rem, 8vw, 7rem) for the hero).
- IBM Plex Sans is the workhorse font for all reading content; keep line-height around 1.5–1.6 for readability.
- Departure Mono should visually signal "live data" — use it anywhere numbers, dates, or system-like labels appear, in a slightly smaller size with uppercase tracking where relevant.

### 3. Global Style Tokens

- Background: near-black, subtle grain or noise texture optional.
- Accent gradient: violet-to-white or violet-to-cyan for glows and particle effects.
- Cards: glassmorphism (backdrop-blur, translucent surface, 1px hairline border, soft shadow), rounded corners, hover elevation (translateY + shadow increase).
- Motion: all sections enter with smooth fade/slide-up on scroll (use IntersectionObserver or Framer Motion `whileInView`); respect `prefers-reduced-motion`.
- Fully responsive: mobile-first, stacking columns to single-column under 768px, hero particle effect can degrade to a static gradient on mobile for performance.

### 4. Sections (build in this order, content and interaction spec below)

**1. Hero**
- Fullscreen (100vh), centered layout: logo above headline, headline "Modular Prediction Market for Humans and AI" in Nippo, CTA button fades in after title animation.
- Background: thousands of animated particles/sparks that are attracted to the Whitecast wordmark, forming an energy-field effect; particles react to mouse movement; subtle product-interface screenshot visible behind the effect.

**2. Why Whitecast**
- Grid of 3 interactive 3D tilt cards: **Modular**, **AI-Powered**, **Multichain Liquidity** (copy provided in structure.md).
- Glassmorphism cards, hover triggers 3D rotation + parallax lighting, icon per card, staggered entrance animation.

**3. Agentic Layer**
- Scroll-driven two-column storytelling section (Apple-product-page style): sticky visual on the left (product/agent screenshot), vertical list of 5 features on the right that highlight sequentially as the user scrolls, with a progress indicator.
- Heading "Personalized AI Trading Agent" + description + feature list (see structure.md for exact copy).

**4. Socials & Roadmap**
- Bento-grid layout mixing a social-links card (X, Telegram, Discord, GitHub, Docs) with a 4-quarter roadmap timeline (Q3 2026 → Q2 2027, milestones per structure.md), stat/progress cards, and a decorative AI illustration tile.
- Cards: rounded, soft gradient, glass effect, hover elevation.

**5. Aquarium (editorial section)**
- One large featured article card + 3 supporting article cards in a magazine-style interactive gallery (carousel or expanding stack on hover), with Aquarium logo.

**6. Team**
- Grid of team cards with AI-stylized portraits, name (Nippo), role (IBM Plex Sans), optional LinkedIn button; hover lifts card, adds background glow and subtle holographic border. Roster in structure.md.

**7. Footer**
- Minimalist: logo left, nav center, social icons right, dark background with a subtle top hairline border, small Departure Mono copyright line beneath.

### 5. Content Source

Use the exact copy, headings, feature lists, roadmap items, and team roster from the attached `whitecast-structure.md` file — do not invent new copy, only new supporting microcopy (button labels, aria-labels) if needed.

### 6. Deliverable

Output production-ready code (HTML/CSS/JS or React components + Tailwind config) implementing all 7 sections, the 3-font type system, dark theme tokens, and the interaction behaviors described above. Include font-loading setup and a design-tokens file (colors, spacing, type scale) at the top of the output.

---

## Notes for the user
- Attach `whitecast-structure.md` and the platform screenshot alongside this prompt to any AI code/design generator for best results.
- If your generator supports image references, also pass the Urchin-style dark UI screenshot as a visual anchor for card and chart styling.
