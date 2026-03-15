# CampusVibe Platform Architecture

## Architecture Summary

CampusVibe is designed as a shared-platform ecosystem composed of:

- A Flutter client for cross-platform application delivery
- A Next.js web platform for public web presence and media experiences
- A single shared Supabase backend for both products

The architecture should preserve one source of truth for identity, operational data, media content, and marketplace activity while allowing the mobile and web products to serve different user journeys.

## Platform Components

### 1. Flutter Application

Workspace path: `./`

Purpose:

- Deliver the main CampusVibe application experience
- Support authenticated user journeys
- Handle transport, food, delivery, messaging, marketplace, notifications, and student roles
- Run on Android, iOS, Web, Windows, macOS, and Linux

### 2. Next.js Web Platform

Workspace path: `./campusvibe`

Purpose:

- Serve the public landing site
- Power CampusVibe Media content experiences
- Support public discovery of news, events, awards, marketplace previews, and contributor onboarding
- Provide web acquisition funnels for app installs, partner signups, and sponsorship inquiries

### 3. Shared Supabase Backend

Supabase is the recommended single backend for both application surfaces.

Primary responsibilities:

- Authentication and authorization
- PostgreSQL database
- Row-level security
- File storage for media and uploads
- Real-time subscriptions
- Edge functions for business logic and integrations
- Admin operations and auditing

## Shared Data Principle

Both the Flutter app and Next.js site must use the same database and identity platform.

This ensures:

- Consistent user accounts across mobile and web
- Shared content models for news, media, events, and marketplace data
- Centralized moderation and verification
- Reliable analytics and reporting
- Reduced duplication in backend development

## Recommended Domain Modules

The shared backend should be organized into clear business domains.

### Identity and Access

- Users
- Profiles
- Universities
- Campuses
- Roles
- Role applications
- Verification records

### Transport

- Drivers
- Vehicles
- Ride requests
- Trips
- Route events
- Ratings
- Earnings

### Delivery

- Riders
- Delivery requests
- Parcel items
- Delivery status timeline
- Proof of delivery
- Fees and payouts

### Food Commerce

- Restaurants
- Menus
- Menu items
- Operating hours
- Orders
- Order status history
- Promotions

### Marketplace

- Seller accounts
- Listings
- Listing media
- Categories
- Buyer inquiries
- Premium placements
- Listing reports

### Social and Community

- Posts
- Comments
- Reactions
- Follows
- Clubs
- Groups
- Content reports

### Messaging

- Conversations
- Conversation members
- Messages
- Attachments
- Read states

### Events and Media

- Events
- RSVPs
- Awards programs
- Nominees
- Votes
- Articles
- Videos
- Podcasts

### Payments and Wallet

- Wallets
- Transactions
- Top-ups
- Withdrawals
- Payout requests
- External payment references

### Notifications and Operations

- Push notifications
- In-app notifications
- Announcement broadcasts
- Audit logs
- Moderation actions
- Support tickets

## Integration Strategy

Supabase edge functions or service-layer APIs should be used for logic that should not live directly in the client.

Examples:

- Payment gateway callbacks
- Fare calculation or delivery pricing
- Driver and rider dispatching logic
- Voting integrity checks
- Marketplace fee enforcement
- Sponsor lead capture workflows
- Email and SMS notifications

## Access Model

The backend should enforce row-level security by default.

Examples:

- Users only access their own private account and wallet data
- Drivers access only trips assigned to them
- Restaurants manage only their own menus and orders
- University admins manage only their campus-level content
- Public web visitors access only explicitly published content

## Media and Storage Model

Supabase Storage should be segmented by content type.

Suggested buckets:

- `avatars`
- `marketplace`
- `restaurants`
- `articles`
- `videos`
- `podcasts`
- `events`
- `verification-documents`

Storage rules should distinguish between public assets and protected assets.

## Web and App Responsibility Split

### Flutter app owns

- Authenticated student workflows
- Role switching and role dashboards
- Real-time ride, delivery, and food operations
- Messaging and social interactions
- Wallet, notifications, and profile management

### Next.js web owns

- Brand presentation and SEO
- CampusVibe Media publishing
- Public event discovery
- Awards, votes, media previews, and sponsor information
- Conversion journeys for install, signup, contribution, advertising, and partnerships

### Shared ownership

- Accounts and profiles
- Universities and campuses
- Events
- Marketplace content where public previews are needed
- Media posts and articles
- Moderation and analytics

## Recommended Non-Functional Requirements

### Security

- Row-level security on all sensitive tables
- Verified role approval flows
- Moderation tooling
- Secure payment callback handling
- PII minimization and auditability

### Performance

- Fast mobile-first payloads
- Cached web content where possible
- Image optimization and lazy loading
- Efficient pagination on feed and listing-heavy surfaces

### Reliability

- Real-time features should degrade gracefully if connectivity is poor
- Critical transaction flows should be idempotent
- Order, trip, and payment state transitions should be logged

### Scalability

- Multi-campus, multi-university tenancy model
- Clear service domains even if implemented in one database initially
- Async processing for notifications and media jobs

## Suggested Environment Separation

At minimum, maintain:

- Development
- Staging
- Production

Each environment should have isolated Supabase configuration and secrets.

## Implementation Guidance

Near-term implementation should favor a modular monolith approach using one Supabase project per environment and shared domain conventions. This keeps execution fast while the product is still proving demand.

As scale grows, selected workflows can later move to dedicated services without changing the public product model.