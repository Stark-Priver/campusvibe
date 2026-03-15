# CampusVibe Documentation

This documentation set defines the product, platform architecture, and delivery scope for the CampusVibe ecosystem.

## Documents

- [Product Overview](product-overview.md)
- [Platform Architecture](platform-architecture.md)
- [Mobile App Specification](mobile-app-spec.md)
- [Web Platform Specification](web-platform-spec.md)
- [Web Design System](web-design-system.md)
- [Roadmap](roadmap.md)

## Intended Use

These documents are written for:

- Product planning
- Technical implementation planning
- Contributor onboarding
- Investor and partner discussions
- Internal alignment across mobile, web, and backend workstreams

## Workspace Context

This repository contains two primary products sharing one backend and one source of truth for core data:

- `campus_vibe/`: Flutter application for Android, iOS, Web, Windows, macOS, and Linux
- `campusvibe/`: Next.js web platform for the public landing page and CampusVibe Media experience

Both products are intended to integrate with the same Supabase project for authentication, data, storage, real-time updates, and operational dashboards.