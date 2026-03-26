# Design System — Ashwani Senapati Portfolio

> Single source of truth for every design token used across the portfolio.
> All tokens live as CSS custom properties in `src/styles.css` (`:root` + `[data-theme='dark']`).

---

## Colors

### Core Palette

| Token                   | Light                   | Dark                    | Usage                                              |
| ----------------------- | ----------------------- | ----------------------- | -------------------------------------------------- |
| `--bg`                  | `#FAFAF8`               | `#121212`               | Page background                                    |
| `--bg-alt`              | `#F3F2EE`               | `#1a1a1a`               | Alternate / section background                     |
| `--surface`             | `#FFFFFF`               | `#1e1e1e`               | Cards, panels, elevated surfaces                   |
| `--text`                | `#1A1A1A`               | `#e8e6e1`               | Primary text, headings                             |
| `--text-secondary`      | `#6B6B6B`               | `#b0b0b0`               | Body copy, descriptions                            |
| `--text-tertiary`       | `#999999`               | `#858585`               | Meta labels, placeholders                          |
| `--accent`              | `#2D2D2D`               | `#e8e6e1`               | High-contrast accent (buttons, rules)              |
| `--accent-subtle`       | `#E8E6E1`               | `#2a2a2a`               | Low-contrast accent backgrounds                    |
| `--accent-brass`        | `#8C7A52`               | `#A89060`               | Warm muted accent — links, underlines, focus rings |
| `--accent-brass-subtle` | `rgba(140,122,82,0.08)` | `rgba(168,144,96,0.10)` | Brass tint for hover states                        |
| `--border`              | `#E5E3DE`               | `#2f2f2f`               | Default borders                                    |
| `--border-light`        | `#F0EEEA`               | `#242424`               | Subtle inner borders, dividers                     |

### Semantic Colors

| Token                  | Light                 | Dark                  | Usage                         |
| ---------------------- | --------------------- | --------------------- | ----------------------------- |
| `--color-available`    | `oklch(0.62 0.1 145)` | `oklch(0.68 0.1 145)` | Availability status dot       |
| `--color-error`        | `#dc2626`             | `#f87171`             | Error accents, danger buttons |
| `--color-error-bg`     | `#fef2f2`             | `#2d1b1b`             | Error alert background        |
| `--color-error-border` | `#fecaca`             | `#7f1d1d`             | Error alert border            |
| `--color-error-hover`  | `#b91c1c`             | `#ef4444`             | Danger button hover           |
| `--color-error-text`   | `#dc2626`             | `#f87171`             | Error message text            |
| `--color-success-bg`   | `#dcfce7`             | `#14532d`             | Success / permission on       |
| `--color-success-text` | `#166534`             | `#86efac`             | Success text                  |
| `--color-info-bg`      | `#dbeafe`             | `#1e3a5f`             | Info / full permission        |
| `--color-info-text`    | `#1e40af`             | `#93c5fd`             | Info text                     |
| `--color-on-error`     | `#fff`                | —                     | Text on error backgrounds     |
| `--color-selection`    | `#ffffff`             | —                     | `::selection` text color      |

### Surfaces & Overlays

| Token                | Light                    | Dark                     | Usage                     |
| -------------------- | ------------------------ | ------------------------ | ------------------------- |
| `--nav-bg`           | `rgba(250,250,248,0.92)` | `rgba(18,18,18,0.92)`    | Frosted navbar background |
| `--cursor-glow`      | `rgba(26,26,26,0.02)`    | `rgba(232,230,225,0.03)` | Cursor radial glow        |
| `--backdrop-overlay` | `rgba(0,0,0,0.35)`       | —                        | Mobile nav backdrop       |

---

## Typography

### Font Families

| Token          | Value                                                                | Usage                             |
| -------------- | -------------------------------------------------------------------- | --------------------------------- |
| `--font-sans`  | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Body, UI, buttons                 |
| `--font-serif` | `'Playfair Display', Georgia, serif`                                 | Italic accents, editorial moments |

### Type Scale

| Token             | Value                         | px (at 16px base) | Usage                                     |
| ----------------- | ----------------------------- | ----------------- | ----------------------------------------- |
| `--fs-2xs`        | `0.6875rem`                   | 11px              | Tag labels, tiny meta                     |
| `--fs-xs`         | `0.75rem`                     | 12px              | Section labels, table heads, meta         |
| `--fs-sm`         | `0.8125rem`                   | 13px              | Small UI text, filter buttons, back links |
| `--fs-base`       | `0.875rem`                    | 14px              | Body text, card copy, table body          |
| `--fs-md`         | `0.9375rem`                   | 15px              | Body+, form inputs, timeline copy         |
| `--fs-lg`         | `1rem`                        | 16px              | Greetings, base size                      |
| `--fs-xl`         | `1.0625rem`                   | 17px              | About body, blog lead, article headings   |
| `--fs-2xl`        | `1.125rem`                    | 18px              | Card titles, nav logo, subtitles          |
| `--fs-3xl`        | `1.25rem`                     | 20px              | Timeline role, section header h2          |
| `--fs-4xl`        | `1.5rem`                      | 24px              | Admin form page heading                   |
| `--fs-5xl`        | `1.75rem`                     | 28px              | Admin login title, mobile hero            |
| `--fs-display-sm` | `clamp(1.75rem, 4vw, 2.5rem)` | 28–40px           | Detail page titles                        |
| `--fs-display-md` | `clamp(2rem, 4vw, 3rem)`      | 32–48px           | Section headings                          |
| `--fs-display-lg` | `clamp(3rem, 8vw, 5.5rem)`    | 48–88px           | Hero name                                 |

### Line Height

| Token               | Value  | Usage                                 |
| ------------------- | ------ | ------------------------------------- |
| `--leading-none`    | `1.05` | Hero name, display text               |
| `--leading-tight`   | `1.2`  | Section headings, detail titles       |
| `--leading-snug`    | `1.4`  | Blog titles, role badges              |
| `--leading-normal`  | `1.6`  | Belief list, general compact          |
| `--leading-relaxed` | `1.7`  | Body default, card descriptions       |
| `--leading-loose`   | `1.8`  | About body, article prose, philosophy |

### Letter Spacing

| Token                    | Value     | Usage                               |
| ------------------------ | --------- | ----------------------------------- |
| `--tracking-tightest`    | `-0.03em` | Hero display                        |
| `--tracking-tighter`     | `-0.02em` | Section headings, nav logo          |
| `--tracking-tight`       | `-0.01em` | Card titles, blog titles            |
| `--tracking-normal`      | `0.01em`  | Nav links                           |
| `--tracking-wide`        | `0.02em`  | Buttons, timeline period            |
| `--tracking-wider`       | `0.04em`  | Admin field labels, permissions     |
| `--tracking-widest`      | `0.05em`  | Hero greeting, placeholders         |
| `--tracking-caps`        | `0.06em`  | Blog meta dates                     |
| `--tracking-caps-wide`   | `0.08em`  | Detail section h3                   |
| `--tracking-caps-wider`  | `0.1em`   | Scroll indicator, detail labels     |
| `--tracking-caps-widest` | `0.12em`  | Section detail labels, skill groups |
| `--tracking-caps-ultra`  | `0.15em`  | Section labels                      |

---

## Spacing

| Token         | Value    | px    | Usage                              |
| ------------- | -------- | ----- | ---------------------------------- |
| `--space-xs`  | `0.5rem` | 8px   | Tight gaps, tag margins            |
| `--space-sm`  | `1rem`   | 16px  | Standard element gap               |
| `--space-md`  | `1.5rem` | 24px  | Section inner padding, form groups |
| `--space-lg`  | `2.5rem` | 40px  | Section margins, card padding      |
| `--space-xl`  | `4rem`   | 64px  | Large section gaps                 |
| `--space-2xl` | `6rem`   | 96px  | Hero bottom padding                |
| `--space-3xl` | `10rem`  | 160px | Hero top padding (6rem at ≤768px)  |

---

## Widths

| Token                  | Value                      | Usage                                   |
| ---------------------- | -------------------------- | --------------------------------------- |
| `--w-container`        | `1200px`                   | Main container, nav inner               |
| `--w-container-sm`     | `1100px`                   | Admin layout max-width                  |
| `--w-container-narrow` | `800px`                    | Admin form pages                        |
| `--w-content`          | `720px`                    | Hero content max-width                  |
| `--w-prose`            | `680px`                    | Detail body, article body               |
| `--w-prose-sm`         | `560px`                    | About body, timeline desc               |
| `--w-measure`          | `540px`                    | Section subtext                         |
| `--w-sidebar`          | `480px`                    | Hero philosophy, contact socials narrow |
| `--w-card`             | `400px`                    | Admin login card, contact socials       |
| `--w-mobile-nav`       | `280px`                    | Mobile nav drawer width                 |
| `--container-pad`      | `clamp(1.5rem, 5vw, 3rem)` | Horizontal container padding            |

---

## Border Radius

| Token            | Value   | Usage                                                   |
| ---------------- | ------- | ------------------------------------------------------- |
| `--radius-xs`    | `2px`   | Buttons, form inputs, focus rings                       |
| `--radius-sm`    | `4px`   | Cards, detail hero, skeletons, tags, blockquotes        |
| `--radius-md`    | `8px`   | Admin form inputs, blocks, error alerts, permissions    |
| `--radius-lg`    | `10px`  | Admin user form wrap                                    |
| `--radius-xl`    | `12px`  | Admin login card, admin sections, admin forms           |
| `--radius-full`  | `100px` | Pill tags, filter buttons, skill tags                   |
| `--radius-round` | `50%`   | Circles (timeline marker, availability dot, login glow) |

---

## Shadows

| Token             | Value                           | Usage                                                  |
| ----------------- | ------------------------------- | ------------------------------------------------------ |
| `--shadow-border` | `0 1px 0 var(--border)`         | Scrolled navbar bottom edge                            |
| `--shadow-sm`     | `0 8px 24px rgba(0,0,0,0.06)`   | View-all link hover                                    |
| `--shadow-md`     | `0 12px 40px rgba(0,0,0,0.05)`  | Blog card hover                                        |
| `--shadow-lg`     | `0 20px 60px rgba(0,0,0,0.06)`  | Project card hover                                     |
| `--shadow-nav`    | `-10px 0 40px rgba(0,0,0,0.08)` | Mobile nav drawer                                      |
| `--shadow-btn`    | `0 8px 30px color-mix(…)`       | Primary button hover                                   |
| `--shadow-focus`  | `0 0 0 3px rgba(26,26,26,0.06)` | Form input focus ring (dark: `rgba(232,230,225,0.08)`) |

---

## Z-Index

| Token            | Value  | Usage                   |
| ---------------- | ------ | ----------------------- |
| `--z-base`       | `1`    | Admin login card        |
| `--z-sticky`     | `100`  | Admin header            |
| `--z-backdrop`   | `999`  | Mobile nav backdrop     |
| `--z-nav`        | `1000` | Main navigation         |
| `--z-nav-toggle` | `1001` | Mobile hamburger toggle |
| `--z-cursor`     | `9999` | Custom cursor glow      |

---

## Transitions

| Token               | Value                           | Usage                                         |
| ------------------- | ------------------------------- | --------------------------------------------- |
| `--ease`            | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary easing — expressive deceleration      |
| `--duration-fast`   | `0.15s`                         | Micro-interactions (block controls)           |
| `--duration-normal` | `0.2s`                          | Standard UI (color, opacity, backdrop)        |
| `--duration-medium` | `0.3s`                          | Interactive transitions (nav, buttons, links) |
| `--duration-slow`   | `0.4s`                          | Card hover, mobile nav slide                  |
| `--duration-slower` | `0.5s`                          | Detail page fade-in                           |
| `--duration`        | `0.6s`                          | Default / hero-level animation                |

---

## Breakpoints

> CSS custom properties cannot be used in `@media` queries.
> These are documented values that stay as raw pixels in media rules.

| Name | Value   | Usage                                                  |
| ---- | ------- | ------------------------------------------------------ |
| `sm` | `480px` | Small phones — stacked hero CTA, smaller headings      |
| `md` | `640px` | Admin responsive — collapse form rows, hide columns    |
| `lg` | `768px` | Mobile nav, single-column grids, reduced `--space-3xl` |
| `xl` | `968px` | About/contact to single column, skills to 2-col        |

---

## File Map

| File                   | Scope                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| `src/styles.css`       | Token definitions (`:root`, dark theme) + all portfolio front-end styles |
| `src/styles/admin.css` | Admin panel styles — consumes the same tokens                            |

---

## Usage Rules

1. **Never use raw color/size values outside `:root`.** Always reference the token.
2. **Dark mode is automatic.** Tokens in `[data-theme='dark']` override light values — components need no theme-specific code.
3. **Font sizes use the `--fs-*` scale.** If a needed size doesn't exist, add it to the scale rather than using a raw value.
4. **Breakpoints stay as raw pixels** in `@media` queries (CSS limitation). Document any new breakpoint in this file.
5. **Shadows are pre-composed.** Use `--shadow-sm` through `--shadow-lg` rather than writing raw `box-shadow` values.
6. **Transitions pair `--duration-*` with `--ease` or `ease`.** The `--ease` curve is the brand motion feel; simple state changes can use `ease`.
