# CampusVibe Workspace

CampusVibe is a multi-product university platform built for Tanzania. This workspace contains:

- A Flutter application that will power the main CampusVibe super-app across Android, iOS, Web, Windows, macOS, and Linux
- A Next.js web application in `campusvibe/` that will power the public landing page and CampusVibe Media experience

Both products are intended to share the same Supabase backend and database so that identity, content, marketplace data, events, media, and operational records remain consistent across app and web.

## Platform Vision

CampusVibe combines student utility, commerce, and community in one ecosystem.

Core product areas include:

- Transport services
- Delivery services
- Restaurant food ordering
- Campus marketplace
- Messaging and social networking
- Events and university announcements
- Student gig work and side hustles
- CampusVibe Media for news, entertainment, and engagement

Brand line:

Ride. Eat. Connect. Earn.

## Repository Structure

- `lib/`, `android/`, `ios/`, `web/`, `windows/`, `macos/`, `linux/`: Flutter application workspace
- `campusvibe/`: Next.js website and media platform
- `docs/`: Product, architecture, and planning documentation

## Documentation

Start here for the professional documentation set:

- [Docs Index](docs/README.md)
- [Product Overview](docs/product-overview.md)
- [Platform Architecture](docs/platform-architecture.md)
- [Mobile App Specification](docs/mobile-app-spec.md)
- [Web Platform Specification](docs/web-platform-spec.md)
- [Roadmap](docs/roadmap.md)

## Technology Direction

### Flutter app

- Framework: Flutter
- Target platforms: Android, iOS, Web, Windows, macOS, Linux
- Intended role: authenticated product for transport, delivery, food ordering, marketplace, social features, messaging, events, and role-based dashboards

### Web platform

- Framework: Next.js
- Workspace: `campusvibe/`
- Intended role: public landing experience, CampusVibe Media, acquisition funnels, public event discovery, sponsor and contributor engagement

### Shared backend

- Platform: Supabase
- Shared responsibilities: authentication, PostgreSQL database, storage, real-time features, security, and backend workflows

## Current Status

The codebase currently contains the generated starter projects for Flutter and Next.js. The documentation in this repository now defines the professional product scope and technical direction that future implementation should follow.

## Developer Notes

- Keep the Flutter app and Next.js site aligned to a shared domain model
- Avoid creating separate databases for mobile and web
- Treat Supabase as the shared source of truth for users, content, marketplace, events, and media
- Build features in phases, starting with the highest-value operational workflows

## Local Development

### Flutter

From the repository root:

```bash
flutter pub get
flutter run
```

### Next.js

From `campusvibe/`:

```bash
npm install
npm run dev
```

## Strategic Goal

CampusVibe is being built as the digital operating system for campus life in Tanzania, connecting students, universities, businesses, and creators through one unified platform.
