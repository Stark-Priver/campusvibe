# 🏆 CampusVibe Awards & Voting System

A comprehensive awards management and voting platform integrated into CampusVibe. Admins can create awards events, add nominees with details, and manage voting periods. Students can vote for their favorite nominees across different award categories.

## Features

### 🎯 Admin Features
- **Create Awards Events**: Set up new awards events with custom titles, descriptions, and timelines
- **Event Status Management**: Control event lifecycle (draft → nominations_open → voting_open → voting_closed → completed)
- **Award Categories**: Create custom award categories with icons and descriptions
- **Nominee Management**: 
  - Add nominees with full profiles (name, bio, image, achievement, university)
  - Track vote counts in real-time
  - Edit or delete nominees (in draft mode)
- **Event Customization**: Set nomination and voting dates, add banner images

### 👥 User Features
- **View Active Awards**: Browse all published awards events
- **Vote by Category**: Vote for nominees in different categories
- **Live Leaderboard**: See real-time vote counts and rankings
- **Vote Tracking**: See which nominees you've already voted for
- **Results Display**: View top nominees by votes with medal rankings

## Database Schema

### Tables Created

#### `awards_events`
- Main table for awards event metadata
- Status: draft | nominations_open | voting_open | voting_closed | completed
- Stores event dates, descriptions, and images

#### `award_categories`
- Links categories to specific awards events
- Each event can have multiple categories
- Includes icon, name, and display order

#### `nominees`
- Individual nominees with full profile information
- Tracks vote count
- Links to specific event and category

#### `votes`
- Records individual votes
- Prevents duplicate votes (unique constraint on event+nominee+voter)
- Timestamps all voting activity

## API Routes

### Awards Events
```
GET  /api/awards/events                           # List all non-draft events
POST /api/awards/events                           # Create event (admin only)
GET  /api/awards/events/[eventId]                 # Get specific event
PUT  /api/awards/events/[eventId]                 # Update event (admin only)
DELETE /api/awards/events/[eventId]               # Delete event (admin only)
```

### Award Categories
```
GET  /api/awards/events/[eventId]/categories      # List categories for event
POST /api/awards/events/[eventId]/categories      # Create category (admin only)
```

### Nominees
```
GET  /api/awards/events/[eventId]/nominees        # List nominees for event
POST /api/awards/events/[eventId]/nominees        # Add nominee (admin only)
PUT  /api/awards/events/[eventId]/nominees/[nomineeId] # Update nominee (admin only)
DELETE /api/awards/events/[eventId]/nominees/[nomineeId] # Delete nominee (admin only)
```

### Voting
```
POST /api/awards/vote                             # Submit a vote (authenticated)
GET  /api/awards/vote                             # Get vote counts for event
```

### Results
```
GET  /api/awards/events/[eventId]/results         # Get leaderboard for event
```

## Public Routes

### Pages
- `/awards` - Browse all awards events
- `/awards/[slug]` - View specific event with voting interface and leaderboard

## Admin Routes

### Pages
- `/dashboard/administrator/awards` - Admin panel for managing awards

## Components

### AwardsManager
Location: `src/components/awards/AwardsManager.tsx`

Handles:
- Creating new awards events
- Viewing all events
- Changing event status
- Form validation

Props:
```typescript
interface AwardsManagerProps {
  onEventCreated?: (event: AwardsEvent) => void
}
```

### NomineesManager
Location: `src/components/awards/NomineesManager.tsx`

Handles:
- Adding award categories
- Adding nominees with full details
- Deleting nominees (draft mode only)
- Category selection
- Vote count display

Props:
```typescript
interface NomineesManagerProps {
  eventId: string
  eventStatus: string
}
```

### VotingInterface
Location: `src/components/awards/VotingInterface.tsx`

Handles:
- Category selection
- Voting on nominees
- Vote submission with validation
- Duplicate vote prevention
- Vote feedback

Props:
```typescript
interface VotingInterfaceProps {
  eventId: string
  eventTitle: string
  eventStatus: string
}
```

### AwardsLeaderboard
Location: `src/components/awards/AwardsLeaderboard.tsx`

Handles:
- Displaying ranked nominees
- Medal icons (🏆 🥈 🥉)
- Vote count display
- Category filtering
- Live results

Props:
```typescript
interface AwardsLeaderboardProps {
  eventId: string
  eventTitle: string
}
```

## Event Lifecycle

### 1. Draft
- Admin creates the event
- Add categories and nominees
- Configure event details
- Not visible to public

### 2. Nominations Open
- Event becomes visible
- Users can view nominees
- Admin can still add/edit nominees
- Voting not yet available

### 3. Voting Open
- Users can vote
- Live voting interface available
- Real-time leaderboard updates
- Vote tracking enabled

### 4. Voting Closed
- No new votes accepted
- Leaderboard visible
- Results preserved

### 5. Completed
- Event marked as finished
- Final results visible
- Archives voting data

## How to Use

### For Admins

#### Step 1: Create an Awards Event
1. Go to `/dashboard/administrator/awards`
2. Click "Create Event"
3. Fill in event details:
   - Title
   - URL Slug
   - Description
   - Nomination & Voting dates
   - Banner image URL (optional)
4. Click "Create Event"

#### Step 2: Add Award Categories
1. Find your event in the "Manage Event Details" section
2. Expand the event
3. Click "Add Category"
4. Enter category name, description, and icon
5. Click "Add Category"

#### Step 3: Add Nominees
1. Select the category from dropdown
2. Click "Add Nominee"
3. Fill in nominee details:
   - Full Name
   - Bio
   - Photo URL
   - Achievement description
   - University
   - Email & Phone (optional)
4. Click "Add Nominee"

#### Step 4: Open Voting
1. Change event status from "Draft" to "Voting Open"
2. Users can now start voting

#### Step 5: View Results
1. Go to the public event page: `/awards/[slug]`
2. Switch to "Leaderboard" tab
3. See real-time vote counts and rankings

### For Users

#### Step 1: Browse Awards
1. Visit `/awards`
2. See all active awards events
3. Click on an event to participate

#### Step 2: Vote
1. Select an award category
2. Browse nominees
3. Click the heart icon to vote
4. See immediate vote count update

#### Step 3: View Results
1. Switch to leaderboard tab
2. See ranked nominees
3. Filter by category if desired

## Vote Constraints

- **One vote per user per nominee**: Users cannot vote twice for the same nominee
- **Voting window**: Only possible when event status is "voting_open"
- **Authentication required**: Only logged-in users can vote
- **Unique constraint**: Database prevents duplicate votes

## Data Validation

### Nominee Data
- Full name: Required
- Email: Optional but validated
- Phone: Optional
- Photo URL: Must be valid image URL

### Vote Submission
- User must be authenticated
- Event must have voting_open status
- Nominee must exist
- User cannot have already voted for this nominee

## Storage Buckets

An `awards-images` bucket is created for storing nominee photos:
- Public read access
- Authenticated upload (admins only)
- File path structure: `awards/[eventId]/[nomineeId]/`

## Row-Level Security (RLS)

### awards_events table
- Public read for non-draft events
- Admin-only write access

### nominees table
- Public read for events in nomination/voting phases
- Admin-only write access

### votes table
- Read by authenticated users for open events
- Insert allowed during voting_open status
- One unique vote per (event, nominee, voter)

## Real-Time Features

- Vote counts update immediately after submission
- Leaderboard refreshes live
- Category filtering works instantly
- Vote tracking prevents duplicates

## Error Handling

- Graceful error messages for vote failures
- Toast notifications for user feedback
- Admin validation for all operations
- Database constraint enforcement

## Future Enhancements

- [ ] Vote results export (CSV/PDF)
- [ ] Email notifications to nominees
- [ ] Social sharing of voting
- [ ] Advanced filtering/sorting on leaderboard
- [ ] Webhook notifications
- [ ] Analytics dashboard
- [ ] Multiple voting methods (ranked choice, weighted)
- [ ] Nominee self-nomination

## Security Considerations

- Admin-only event creation and management
- Vote authentication required
- RLS policies enforce data access
- No sensitive data in client responses
- Duplicate vote prevention at database level
- IP tracking for audit (optional)

## Performance Optimization

- Indexed queries for event/nominee/vote lookups
- Efficient vote aggregation
- Cached leaderboard results
- Optimized image serving via storage CDN
- Pagination support for large nominee lists

## Integration with CampusVibe

The awards system integrates seamlessly with:
- **Authentication**: Uses existing user auth system
- **Dashboard**: Admin control via `/dashboard/administrator`
- **Navigation**: Added to admin sidebar
- **Styling**: Matches CampusVibe design system
- **Icons**: Uses Lucide React icons
- **UI Components**: Reuses Toast, FormWithToast components

## File Structure

```
src/
├── app/
│   ├── api/awards/
│   │   ├── actions.ts
│   │   ├── events/
│   │   │   ├── route.ts
│   │   │   ├── [eventId]/
│   │   │   │   ├── route.ts
│   │   │   │   ├── categories/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── nominees/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [nomineeId]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── results/
│   │   │   │       └── route.ts
│   │   └── vote/
│   │       └── route.ts
│   ├── awards/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── dashboard/[role]/admin/
│       └── awards/
│           └── page.tsx
└── components/awards/
    ├── AwardsManager.tsx
    ├── AwardsLeaderboard.tsx
    ├── NomineesManager.tsx
    └── VotingInterface.tsx
```

## Troubleshooting

### Votes Not Showing
- Ensure event status is "voting_open"
- Check user authentication
- Verify nominee exists in database

### Images Not Loading
- Verify image URLs are accessible
- Check awards-images bucket permissions
- Ensure proper file format (JPG, PNG, GIF)

### Admin Can't Create Events
- Verify user has "administrator" role
- Check user auth token is valid
- Ensure database RLS policies allow access

### Duplicate Vote Error
- Clear browser cache
- Check database for ghost votes
- Verify unique constraint on votes table

## Support & Questions

For issues or questions:
1. Check the database schema in `supabase-schema.sql`
2. Review API route implementations
3. Check browser console for client-side errors
4. Review Supabase logs for server-side errors
