# CampusVibe Web Platform

This application contains the Next.js codebase for the public CampusVibe website.

It is intended to serve two connected purposes:

- The official landing page for the CampusVibe super-app
- The CampusVibe Media platform for university news, entertainment, events, media, and community engagement

This web platform is part of the broader CampusVibe ecosystem and is expected to share the same Supabase backend and database used by the Flutter application in the root workspace.

## Product Role

The web platform exists to:

- Present the CampusVibe brand professionally
- Explain the product to students, universities, and partners
- Publish media and campus content
- Drive installs and signups
- Support sponsor, contributor, and advertiser inquiries

## Planned Website Sections

- Home
- News
- Events
- Media
- Marketplace
- Get Involved

## Key Content and Feature Areas

### Landing Page

- Hero section with product positioning
- Breaking news slider
- Latest videos or podcasts
- Featured events
- Marketplace preview
- Community and contribution calls to action

### Campus News

- Academic news
- Student politics
- Lifestyle and culture
- Search, filters, and shareable article pages

### Entertainment and Events

- Campus Vibe Awards
- Event calendar
- Nominee and participant profiles
- Voting and RSVP support

### Media Hub

- Video publishing
- Podcasts
- Playlists and featured creators

### Marketplace Preview

- Selected products and student services
- Discovery funnels into the full app ecosystem

### Get Involved

- Contributor applications
- Sponsorship inquiries
- Advertising opportunities

## Shared Backend Direction

The web platform should use the same Supabase project as the app for:

- Authentication
- Shared content models
- Events and media data
- Marketplace previews
- Contributor and sponsor submissions

## Visual Direction

The website should follow the documented CampusVibe visual system:

- Heading fonts: Poppins and Montserrat
- Body font: Inter
- Primary brand color: `#6C63FF`
- Interaction color: `#3D9BE9`
- Highlight color: `#FFC845`
- Success color: `#4CAF50`
- Neutral text and surfaces: `#1A1A1A`, `#F5F5F5`, and `#FFFFFF`

Implementation constraints:

- Use `lucide-react` as the standard icon library for the website
- No unnecessary gradients across the website
- No decorative emoji in UI copy or section headings
- Favor clean hierarchy, subtle shadows, and flat color surfaces
- Build mobile-first and ensure the website is fully responsive across phones, tablets, laptops, and large desktop screens

See the workspace docs for the detailed web design system and layout hierarchy.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

The local app runs on `http://localhost:3000` by default.

## Reference Documentation

Workspace-level documentation lives in the root `docs/` folder, including the product overview, architecture, and roadmap for the full ecosystem.

## Contact Channels

- `info@campusvibe.co.tz`
- `ads@campusvibe.co.tz`
- `editor@campusvibe.co.tz`
- `director@campusvibe.co.tz`
