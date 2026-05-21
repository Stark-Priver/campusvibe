# Campus Memory System - Full Stack Implementation

## 📋 Overview

Complete full-stack booking system for Campus Memory services with payment processing, installment support, and admin dashboard.

## 🗄️ Database Setup

Run the SQL migration to create all necessary tables:

```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Run the migration from: campus-memory-schema.sql
```

### Tables Created:
- `campus_memory_bookings` - Stores all booking records
- `campus_memory_payments` - Tracks payment transactions
- `campus_memory_installments` - Manages installment plans

## 🛠️ API Routes

### User Booking APIs

**POST /api/campus-memory**
- Create a new campus memory booking
- Requires: authentication, package_type, event_type, event_date, payment_plan
- Returns: booking object with ID

**GET /api/campus-memory**
- Fetch all bookings for authenticated user
- Returns: array of user's bookings

### Payment APIs

**POST /api/campus-memory/payments**
- Process payment via M-Pesa
- Requires: booking_id, amount, phone_number, payment_method
- Returns: payment confirmation with transaction ID

**GET /api/campus-memory/payments**
- Get all payments for authenticated user
- Returns: array of payment records

**GET /api/campus-memory/installments?booking=<id>**
- Fetch installment schedule for a booking
- Returns: array of installment objects

### Admin APIs

**GET /api/admin/campus-memory**
- View all bookings and payments (admin only)
- Returns: bookings, payments, and statistics
- Requires: admin role

## 📄 Frontend Components

### User Pages

**`/campus-memory`** - Main Campus Memory page
- Service showcase
- Package pricing
- Event types coverage
- Add-on services

**`/campus-memory/book`** - Booking form
- Package selection
- Event details
- Payment plan choice
- Special requests

**`/campus-memory/checkout`** - Payment page
- Booking summary
- M-Pesa phone entry
- Installment selection
- Payment processing

**`/campus-memory/my-bookings`** - User dashboard
- All user bookings
- Status tracking
- Payment status
- Quick payment links

**`/campus-memory/booking/[id]`** - Booking details
- Full booking information
- Installment schedule
- Special requests
- Payment history

### Admin Pages

**`/dashboard/admin/campus-memory`** - Admin dashboard
- Overview statistics
- Total revenue tracking
- All bookings management
- Payment verification
- Tabs for overview, bookings, and payments

## 💳 Payment Processing

### M-Pesa Integration

The system accepts M-Pesa payments via **Lipa** number: **353332037**

#### Payment Flow:
1. User enters phone number on checkout page
2. M-Pesa prompt sent to user's phone
3. User enters PIN to authorize payment
4. Payment processed and recorded
5. Booking status updated to "confirmed"
6. Installment (if applicable) marked as "paid"

### Full Payment vs Installments

**Full Payment:**
- Single payment for entire amount
- Booking confirmed immediately upon payment

**Installment Plan (3 payments):**
- Split into 3 equal payments
- 30-day intervals between installments
- Each installment tracks separately
- Can pay any installment anytime

## 📊 Admin Dashboard Features

### Statistics Overview
- Total bookings count
- Total revenue calculation
- Confirmed bookings
- Pending payments
- Completed payments

### Bookings Management
- View all customer bookings
- Client information display
- Package type and amount
- Booking and payment status
- Customer contact details

### Payments Tracking
- All transactions listed
- M-Pesa reference numbers
- Payment method
- Payment status (pending/completed/failed)
- Transaction dates

## 🔐 Security & Access Control

### Row-Level Security (RLS)
- Users can only view their own bookings
- Users can only create bookings for themselves
- Only admins can view all bookings and payments
- Payment records protected by user ID

### Authentication Required
- All booking/payment endpoints require authentication
- Admin endpoints verify admin role
- Redirect to login if not authenticated

## 📱 Package Pricing

| Package | Price | Features |
|---------|-------|----------|
| Basic Memory | 50,000 TSH | Edited photos, highlight reel |
| Standard Vibe | 80,000 TSH | High-quality photos, videos, interview |
| Full Experience | 150,000 TSH | Complete package with documentary |

## 🎯 Add-on Services

| Service | Price |
|---------|-------|
| Individual/Squad Shoot | 10,000 - 35,000 TSH |
| Campus Vibe Reel | 10,000 - 15,000 TSH |
| Event Coverage | 60,000 - 120,000 TSH |
| Entrepreneur Promo | 20,000 TSH |
| Class Documentary | 500,000 TSH |

## 🚀 Deployment Checklist

- [ ] Run database migration (campus-memory-schema.sql)
- [ ] Update M-Pesa API credentials in environment
- [ ] Configure email service for booking confirmations
- [ ] Test booking flow end-to-end
- [ ] Verify admin dashboard access
- [ ] Test M-Pesa payment simulation
- [ ] Set up payment webhooks (if using real M-Pesa)
- [ ] Configure error alerts/monitoring

## 📝 Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
MPESA_API_KEY=your_mpesa_key
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

## 🧪 Testing

### Test Booking Flow:
1. Register/Login as student
2. Go to `/campus-memory/book`
3. Select package and fill details
4. Choose payment plan (full or installment)
5. Proceed to checkout
6. Enter phone number
7. Simulate M-Pesa payment
8. Verify booking appears in "My Bookings"

### Test Admin Dashboard:
1. Login as admin user
2. Navigate to `/dashboard/admin/campus-memory`
3. Verify all bookings display
4. Check revenue calculations
5. Verify payment tracking

## 📞 Contact Information

**M-Pesa Lipa Number:** 353332037
**Company:** Campus Vibe Media
**Phone:** 0798194062
**YouTube:** Campus Vibe Tv

## 🔧 Future Enhancements

- [ ] Real M-Pesa STK push integration
- [ ] Email notifications for bookings
- [ ] SMS reminders for installments
- [ ] Advanced analytics and reporting
- [ ] Booking cancellation & refunds
- [ ] Review and rating system
- [ ] Team member assignment to bookings
- [ ] Portfolio showcase of completed jobs
