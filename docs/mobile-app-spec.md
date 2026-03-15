# CampusVibe Mobile App Specification

## Product Role

The Flutter application is the core operational product of the CampusVibe ecosystem. It is the authenticated environment where students and partners complete real transactions, communicate, and participate in campus life.

The app is intended to run from one Flutter codebase across:

- Android
- iOS
- Web
- Windows
- macOS
- Linux

## Primary Goals

- Provide a trusted daily-use utility app for students
- Support multiple economic and community workflows in one interface
- Allow one account to operate across multiple approved roles
- Create a cross-platform foundation without fragmenting the product surface

## User Roles in the App

- Student/User
- Driver
- Delivery Rider
- Marketplace Seller
- Restaurant Partner
- University Admin
- Club Admin

Roles should be additive. A student may also become a seller, driver, or rider once verified.

## Main App Modules

### Authentication and Onboarding

- Sign up and sign in
- University and campus selection
- Profile setup
- Role application forms
- Verification status tracking
- Terms, privacy, and consent acceptance

### Home Dashboard

- Personalized shortcuts
- Service entry points
- Active requests or ongoing orders
- Recommended events and marketplace highlights
- Important announcements and notifications

### Transport Module

- Request ride
- Choose ride type
- View driver and ETA
- Real-time trip tracking
- Ride completion and rating

Driver dashboard:

- Go online or offline
- Accept rides
- View navigation support
- Review earnings and trip history

### Delivery Module

- Create delivery request
- Set pickup and drop-off details
- Track rider location and status
- Confirm completion

Rider dashboard:

- Accept delivery jobs
- Track route
- Update delivery stages
- Review earnings and completed jobs

### Food Ordering Module

- Browse restaurants
- View menus and item options
- Add to cart and checkout
- Select pickup or delivery
- Track order progress
- Rate restaurant and delivery experience

Restaurant dashboard:

- Manage menu items
- Receive orders
- Update order status
- Track sales and fulfillment

### Marketplace Module

- Browse listings
- Search and filter
- View seller profiles
- Chat with sellers
- Create or manage listings
- Promote premium listings

### Social Feed Module

- Create posts
- Upload media
- Like, comment, and share
- Follow campus conversations
- Join university-specific community spaces

### Messaging Module

- Direct chat
- Group chat
- Voice notes and media attachments
- Order-specific and ride-specific conversations

### Events Module

- Discover events
- RSVP or register
- Receive reminders
- Join event-specific discussion spaces

### Wallet and Payments Module

- View balance and history
- Pay for rides, delivery, food, and listings
- Top up wallet
- Track payouts for drivers, riders, and sellers

### Profile and Trust Module

- Update personal information
- Manage active roles
- View ratings and verification badges
- Access reports, support, and safety tools

## UX Principles

- Mobile-first navigation with clear service separation
- Fast access to high-frequency actions such as rides, food, and messaging
- Role-aware navigation that adapts to approved capabilities
- Low-friction flows suitable for variable connectivity environments
- Clear trust signals for verified users, vendors, and workers

## Cross-Platform Considerations

Although the app is cross-platform, the primary UX should still be optimized for mobile usage patterns. Desktop and large-screen versions should expand workflows such as messaging, dashboards, moderation, and management.

Platform-specific considerations:

- Android and iOS: primary consumer distribution platforms
- Web: lightweight access and account continuity
- Windows and macOS: admin, vendor, and operational convenience
- Linux: development and internal operations support

## Recommended Phase Priorities

### Phase 1

- Authentication
- Profiles
- Transport
- Delivery
- Food ordering
- Notifications

### Phase 2

- Marketplace
- Messaging
- Events
- Wallet and payouts

### Phase 3

- Social feed
- Club communities
- University admin tooling
- Advanced moderation and analytics

## Success Criteria for the App

- Students can complete core daily tasks without leaving the ecosystem
- Worker roles can earn and track income clearly
- Vendors can manage orders reliably
- Campus-specific engagement increases over time
- Core workflows remain usable on low-to-moderate bandwidth connections