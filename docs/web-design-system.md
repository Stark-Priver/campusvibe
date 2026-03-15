# CampusVibe Web Design System

## Purpose

This document defines the visual language for the CampusVibe website and CampusVibe Media platform. It exists to keep the public web experience consistent, modern, readable, and implementation-ready across all pages.

The design system should be treated as a product rule set, not as optional inspiration.

## Design Principles

- Clean, modern, youth-oriented presentation without looking childish
- Strong editorial hierarchy for news, events, and media-heavy layouts
- High readability on mobile devices and lower-bandwidth networks
- Professional presentation suitable for students, universities, and sponsors
- Consistent visual rhythm across landing, news, media, marketplace, and campaign pages

## Global Visual Constraints

The following rules apply across the entire website:

- Do not use decorative emoji in UI headings, cards, labels, or calls to action
- Do not use unnecessary gradients in backgrounds, buttons, cards, overlays, or section dividers
- Prefer flat color surfaces, subtle borders, and soft shadows over visual effects
- Keep layouts structured and editorial rather than flashy
- Use color intentionally; do not overload one view with multiple accent colors competing at the same time

## Iconography

The website icon system should be standardized.

Required icon library:

- `lucide-react`

Usage rules:

- Use `lucide-react` for navigation icons, feature highlights, status indicators, media actions, marketplace metadata, and utility actions
- Keep icon stroke widths visually consistent across the interface
- Pair icons with text for important actions instead of relying on icon-only meaning
- Use icons to support hierarchy and clarity, not as decoration

Restrictions:

- Do not mix multiple icon libraries in the same product surface
- Do not use heavy, glossy, or skeuomorphic icon styles
- Do not overload cards or sections with unnecessary icons

## Typography System

## Primary Heading Fonts

Approved heading fonts:

- Poppins
- Montserrat
- Bebas Neue for limited display use only

Usage rules:

- Logo and major page titles: Poppins Bold by default
- Hero statements and campaign headlines: Poppins Bold or Montserrat Bold
- Awards titles or selected promotional headings: Bebas Neue only when an all-caps, high-impact treatment is appropriate
- Standard section headings: Montserrat SemiBold or Bold

Restrictions:

- Do not use Bebas Neue for body copy, article cards, or long labels
- Do not mix all three heading fonts in the same section
- Default brand direction should prefer Poppins for brand presence and Montserrat for structural headings

## Body Fonts

Approved body fonts:

- Inter
- Roboto
- Lato

Usage rules:

- Long-form body copy, article previews, and descriptive content: Inter Regular by default
- Secondary descriptive text or UI copy where broader neutrality is preferred: Roboto Regular
- Lightweight metadata such as timestamps, labels, or small interface text: Lato Regular or Inter Light

Default recommendation:

- Headlines and brand: Poppins
- Section hierarchy: Montserrat
- Body and interface copy: Inter

## Type Scale Guidance

The website should use a clear editorial scale.

Suggested hierarchy:

- H1: primary hero or page title
- H2: main section titles
- H3: card titles, article titles, module headers
- H4: metadata groups or compact content section labels
- Body Large: short introductions and summaries
- Body Regular: main paragraphs and article snippets
- Body Small: timestamps, tags, bylines, helper text

Implementation guidance:

- Maintain strong contrast between H1, H2, and body text
- Use spacing and weight before using extra colors to create hierarchy
- Body text should remain highly readable and never be overly light on white backgrounds

## Color System

## Brand and Interface Palette

Primary colors:

- Vibrant Purple: `#6C63FF`
- Electric Blue: `#3D9BE9`

Secondary colors:

- Warm Yellow: `#FFC845`
- Soft Green: `#4CAF50`

Neutral colors:

- Dark Gray: `#1A1A1A`
- Light Gray: `#F5F5F5`
- White: `#FFFFFF`

## Color Usage Rules

- Vibrant Purple is the primary brand accent for the logo, key headings, and primary buttons
- Electric Blue is the interaction color for links, secondary actions, and selected active states
- Warm Yellow is reserved for highlights such as trending labels, awards emphasis, and selected calls to action
- Soft Green is reserved for success states, verification indicators, and positive system feedback
- Dark Gray should be the default text color for strong readability
- Light Gray should be used for section backgrounds and neutral surfaces
- White should remain the main reading surface for content-heavy areas

## UI Color Guidance

Recommended mapping:

- Navbar: white background, purple logo, blue or dark navigation states
- Primary CTA: purple background with white text
- Primary CTA hover: blue background with white text
- Secondary CTA: yellow background with dark text or blue outline with white background, depending on context
- Trending or featured labels: yellow background with dark text
- Verified or successful states: green accents only where trust or completion is being communicated
- Cards: white background, subtle gray borders, restrained shadow depth

Restrictions:

- Do not place purple text on blue backgrounds or blue text on purple backgrounds if contrast is weakened
- Do not use yellow as a default body-text color
- Do not create multicolor buttons unless a specific campaign requires it

## Layout Hierarchy

## Page-Level Hierarchy

Every major page should follow a predictable reading order:

1. Header and navigation
2. Main page title or hero statement
3. Primary live or featured content
4. Supporting modules or category sections
5. Conversion block or next-step call to action
6. Footer

This rule is especially important for the home page, news landing pages, media pages, and campaign pages.

## Section Hierarchy

Each section should contain:

1. Section label or eyebrow if needed
2. Clear heading
3. Short supporting copy only when necessary
4. Primary content grid, feed, slider, or list
5. Optional secondary action such as view all

Avoid adding decorative filler between these layers.

## Home Page Hierarchy

Recommended order:

1. Header
2. Hero with product statement and install or join CTA
3. Breaking news strip or slider
4. Latest news feed
5. Featured videos or podcasts
6. Upcoming events
7. Marketplace preview
8. Awards or special campaign block
9. Contributor and sponsor call to action
10. Footer

## Card Hierarchy

For article, event, media, and marketplace cards:

1. Thumbnail or media preview
2. Category or status label
3. Title
4. Short description or metadata
5. Secondary detail such as date, campus, price, or author

Cards should remain clean and should not stack excessive badges, icons, and labels.

## Component Direction

## Buttons

- Keep button styles flat and clear
- Prioritize strong contrast and legibility
- Use one primary action per section whenever possible
- Avoid oversized rounded shapes that make the product feel toy-like

## Navigation

- Keep the navbar clean, light, and stable
- Use clear text-based navigation labels
- Highlight the current page with color and weight rather than decorative effects

## News Modules

- Prioritize title readability over visual effects
- Use thumbnails consistently
- Keep metadata compact and aligned
- Trending tags should use yellow sparingly

## Media Modules

- Use strong thumbnail framing and clean title blocks
- Keep playback controls or play affordances simple
- Avoid noisy overlays and excessive badges

## Marketplace Modules

- Maintain clean product photography areas
- Use neutral cards with subtle structure
- Let price, category, and title lead the hierarchy

## Accessibility and Readability Rules

- Maintain high text contrast on all surfaces
- Do not rely on color alone to indicate state
- Keep paragraph widths readable on desktop
- Preserve comfortable tap targets on mobile
- Ensure typography scales cleanly across mobile, tablet, and desktop

## Responsive Design Rules

The website must be fully responsive across mobile, tablet, laptop, and large desktop screens.

Layout requirements:

- Design mobile-first, then scale progressively to larger breakpoints
- Ensure navigation, hero sections, sliders, feeds, cards, and forms reflow cleanly across all viewport sizes
- Maintain consistent spacing rhythm across breakpoints rather than simply shrinking components
- Prevent horizontal overflow in every major layout module
- Keep headline wrapping controlled so page titles remain readable on smaller screens

Component requirements:

- Navigation should collapse cleanly on small screens without hiding critical actions
- Card grids should reduce columns progressively instead of shrinking content excessively
- Media thumbnails and previews should preserve consistent aspect ratios
- Buttons and links should remain easy to tap on touch devices
- Tables or dense data layouts should be avoided unless a mobile-friendly fallback exists

Performance and usability requirements:

- Prioritize lightweight assets and optimized media for slower mobile networks
- Avoid visual treatments that reduce readability on small screens
- Maintain clear focus states and keyboard accessibility across breakpoints
- Test content-heavy pages, especially news and media pages, on narrow and medium-width screens

## CSS Token Recommendation

The website should define reusable design tokens for:

- Font families
- Font weights
- Font sizes
- Spacing scale
- Border radius
- Shadow levels
- Brand and neutral colors

Suggested naming approach:

- `--font-brand`
- `--font-heading`
- `--font-body`
- `--color-primary`
- `--color-secondary`
- `--color-highlight`
- `--color-success`
- `--color-text`
- `--color-surface`
- `--color-background`

## Default Recommended Stack

Use this as the default implementation direction unless a specific campaign page needs a documented exception:

- Logo and hero: Poppins Bold
- Section headings: Montserrat SemiBold
- Body text: Inter Regular
- Primary accent: `#6C63FF`
- Interaction accent: `#3D9BE9`
- Highlight accent: `#FFC845`
- Success accent: `#4CAF50`
- Primary text: `#1A1A1A`
- Background: `#F5F5F5` and `#FFFFFF`

## Final Design Intent

CampusVibe should feel alive through content, hierarchy, and clarity rather than through visual noise. The website should communicate confidence, relevance, and youthfulness using strong typography, controlled color, and disciplined layout structure.