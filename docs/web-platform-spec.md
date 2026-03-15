# CampusVibe Web Platform Specification

## Product Role

The `campusvibe/` Next.js application is the public web presence of the CampusVibe ecosystem. It serves two functions:

- A high-conversion brand and acquisition website for the CampusVibe app
- A content-rich CampusVibe Media platform focused on Tanzanian university news, culture, events, and student participation

The web platform should be SEO-friendly, media-ready, and structured for growth into a full digital publishing and campus engagement product.

## Core Positioning

CampusVibe Media is a digital hub for Tanzanian university students. It informs, entertains, empowers, and connects the campus community while supporting commerce and contributor participation.

## Web Platform Objectives

- Explain the CampusVibe product and drive installs or signups
- Publish campus news and media content
- Promote awards, events, and university culture
- Preview marketplace activity and partner opportunities
- Enable contributor, sponsor, and advertiser inquiries

## Primary Navigation Structure

- Home
- News
- Events
- Media
- Marketplace
- Get Involved
- Login or Register

## Page and Section Requirements

### 1. Home

The home page should function as both a landing page and a live content hub.

Recommended sections:

- Hero with product positioning and app CTAs
- Breaking news slider
- Latest videos or podcast highlights
- Main news feed
- Featured events
- Marketplace preview
- Awards or campaigns section
- Contributor and sponsor CTA
- Footer with contacts, policies, and social links

### 2. News

Campus news should be organized into clearly navigable categories.

Core categories:

- Habari za Elimu
- Siasa za Chuo
- Maisha ya Chuo
- Sports and campus culture
- Opportunities and scholarships

Functional needs:

- Category filtering
- Search
- Article details with related content
- Social sharing
- Featured stories and trending labels

### 3. Entertainment and Events

This area showcases university lifestyle and student engagement.

Core features:

- Event calendar
- Featured events
- Campus Vibe Awards
- Nominee profiles
- Voting workflows
- RSVP or registration prompts

### 4. Media Hub

The media area centralizes video and audio experiences.

Core features:

- Campus Vibe TV
- Podcasts
- Student creator highlights
- Video playlists
- Comments and sharing
- Embedded and hosted media support

### 5. Marketplace Preview

The web platform may surface selected marketplace content for discovery while the authenticated app handles deeper transaction workflows.

Core features:

- Product highlights
- Service highlights
- Search and category previews
- Seller spotlight sections
- CTA into the app or web-auth flow

### 6. Get Involved

This page should convert interested participants into contributors, partners, or sponsors.

Core workflows:

- Become a contributor form
- Sponsor inquiry form
- Advertiser inquiry form
- Campus ambassador or media creator applications

## Shared Data Expectations

The website should use the same backend as the app where content and operational overlap exists.

Shared entities may include:

- Users and profiles
- Universities and campuses
- Events
- Articles and media
- Awards nominees and votes
- Marketplace previews
- Sponsor or contributor submissions

## Design Direction

The site should feel modern, energetic, and editorial rather than corporate-generic.

Desired characteristics:

- Strong typography
- Media-led layout hierarchy
- Fast loading on mobile networks
- Clear Swahili and English content support where needed
- Strong visual emphasis on campus life, movement, and youth culture

## Visual Design System

The web platform must follow a disciplined design system so implementation remains consistent across the entire site.

Reference document:

- [Web Design System](web-design-system.md)

Mandatory visual rules:

- Use a typography-first hierarchy led by Poppins, Montserrat, and Inter
- Use the defined palette of purple, blue, yellow, green, dark gray, light gray, and white
- Use `lucide-react` as the website icon library
- Do not use unnecessary gradients across the website
- Do not use decorative emoji in interface copy, headings, badges, or section labels
- Prefer structured editorial layouts, flat color surfaces, subtle shadows, and clean spacing

Default visual direction:

- Brand and hero headlines: Poppins Bold
- Section headings: Montserrat SemiBold
- Body text: Inter Regular
- Primary brand color: `#6C63FF`
- Interaction color: `#3D9BE9`
- Highlight color: `#FFC845`
- Success color: `#4CAF50`
- Primary text color: `#1A1A1A`
- Base surfaces: `#FFFFFF` and `#F5F5F5`

## Content and Layout Hierarchy

The website should communicate importance through structure before decoration.

Hierarchy rules:

- Header and navigation must remain clean and stable across pages
- Every page should present one dominant headline or hero statement
- Featured content should appear before secondary content blocks
- Conversion prompts should appear after users understand the content value of the page
- Cards should prioritize title, category, and metadata clarity rather than effects or ornamentation

Home page order:

1. Header
2. Hero and primary call to action
3. Breaking news
4. Main news feed
5. Media highlights
6. Featured events
7. Marketplace preview
8. Awards or campaign block
9. Contributor and sponsor call to action
10. Footer

## Functional Requirements

- Fully responsive layout
- SEO metadata and structured content pages
- CMS-friendly content model through Supabase-backed admin workflows or future editorial tooling
- Performance-conscious media handling
- Shareable article and event URLs
- Accessible navigation and reading experience

Responsive delivery expectations:

- The website must work cleanly across phones, tablets, laptops, and large desktop screens
- Navigation, hero sections, news feeds, media blocks, marketplace cards, and forms must adapt without overflow or broken hierarchy
- Mobile layouts must preserve content priority rather than hiding core information unnecessarily
- Touch targets, readable type sizes, and stable spacing must be preserved on smaller devices

Iconography expectations:

- `lucide-react` should be the standard icon package across the Next.js website
- Icons should reinforce navigation and usability, not act as decorative clutter

## Business Utility

The web platform is also a business asset. It should support:

- Organic search growth
- Campaign landing pages
- Sponsor visibility packages
- App acquisition funnels
- Brand credibility for universities and partners

## Official Contact Channels

- `info@campusvibe.co.tz`
- `ads@campusvibe.co.tz`
- `editor@campusvibe.co.tz`
- `director@campusvibe.co.tz`

## Success Criteria for the Web Platform

- High-quality public brand presentation
- Regular content publishing capability
- Clear conversion into app adoption and community participation
- Strong mobile usability and page speed
- Sustainable foundation for media, sponsorship, and campus campaigns