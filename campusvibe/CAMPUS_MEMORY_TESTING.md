# Campus Memory System - Quick Start & Testing Guide

## 🚀 Quick Start

### 1. Database Setup (First Time Only)

```sql
-- Copy the SQL from: campus-memory-schema.sql
-- Paste into Supabase SQL Editor
-- Execute
```

### 2. Test User Flow

```
✓ Student Registration
  → Creates account at /register

✓ Browse Campus Memory
  → Visit /campus-memory
  → View packages and services

✓ Book Service
  → Click "Book Now"
  → Select package (Basic/Standard/Premium)
  → Choose event type and date
  → Select payment plan (Full or Installment)
  → Proceed to checkout

✓ Make Payment
  → Enter M-Pesa phone number
  → System simulates payment
  → Booking confirmed

✓ View Bookings
  → Go to /campus-memory/my-bookings
  → See all bookings
  → Check payment status
  → Can complete payments if pending
```

## 📊 Admin Testing

```
✓ Access Admin Dashboard
  → Must have admin/administrator role
  → Navigate to /dashboard/admin/campus-memory

✓ View Statistics
  → Total bookings count
  → Total revenue
  → Confirmed bookings
  → Pending/completed payments

✓ Monitor Bookings
  → See all student bookings
  → View customer information
  → Check booking status
  → Verify payment status

✓ Track Payments
  → View all transactions
  → See M-Pesa references
  → Payment method tracking
  → Transaction status
```

## 💾 Database Tables Reference

### campus_memory_bookings
```
- id (UUID)
- user_id (references profiles)
- package_type (basic|standard|premium)
- event_type (graduation|birthday|etc)
- event_date (TIMESTAMPTZ)
- total_price (INTEGER, in TSH)
- payment_plan (full|installment)
- status (pending|confirmed|completed|cancelled)
- payment_status (unpaid|partial|paid)
```

### campus_memory_payments
```
- id (UUID)
- booking_id (UUID)
- user_id (UUID)
- amount (INTEGER, in TSH)
- payment_method (mpesa|bank|card)
- phone_number (TEXT)
- status (pending|completed|failed|refunded)
- mpesa_reference (UNIQUE TEXT)
```

### campus_memory_installments
```
- id (UUID)
- booking_id (UUID)
- amount (INTEGER)
- due_date (TIMESTAMPTZ)
- installment_number (1, 2, or 3)
- status (pending|paid|overdue|cancelled)
```

## 🔄 Payment Flow Diagram

```
User Booking
    ↓
Fill Details (package, event, date)
    ↓
Choose Payment Plan
  ├→ Full Payment → Checkout
  └→ Installment → Creates 3 installments
    ↓
Checkout Page
    ↓
Enter M-Pesa Phone
    ↓
Payment Processing
    ↓
Booking Confirmed (if all paid)
    ↓
View in My Bookings
    ↓
Admin Sees in Dashboard
```

## 💳 Pricing Summary

### Main Packages
- **Basic Memory**: 50,000 TSH
- **Standard Vibe**: 80,000 TSH  
- **Full Experience**: 150,000 TSH

### Installment Example (Standard Vibe)
- Installment 1: 27,000 TSH (due now)
- Installment 2: 27,000 TSH (due +30 days)
- Installment 3: 26,000 TSH (due +60 days)

### Add-on Services
- Squad Shoots: 10,000-35,000 TSH
- Viral Reels: 10,000-15,000 TSH
- Event Coverage: 60,000-120,000 TSH
- Business Promo: 20,000 TSH
- Class Documentary: 500,000 TSH

## 🧪 Test Scenarios

### Scenario 1: Full Payment
```
1. Student books Standard package
2. Selects "Full Payment" option
3. Amount shown: 80,000 TSH
4. Goes to checkout
5. Enters phone: 255712345678
6. Payment processed immediately
7. Status becomes "confirmed" and "paid"
```

### Scenario 2: Installment Payment
```
1. Student books Premium package
2. Selects "Installment" option
3. Three installments created:
   - 50,000 TSH (now)
   - 50,000 TSH (+30 days)
   - 50,000 TSH (+60 days)
4. Pays first installment at checkout
5. Can pay remaining anytime
6. Status updates as installments paid
7. Final confirmation when all paid
```

### Scenario 3: Admin Monitoring
```
1. Admin logs in
2. Goes to Campus Memory admin panel
3. Sees statistics dashboard
4. Reviews all bookings with customer info
5. Monitors all payments
6. Can identify:
   - Overdue installments
   - Pending payments
   - Revenue by package
```

## 📱 M-Pesa Integration

### Payment Account
- **M-Pesa Lipa Number**: 353332037
- **Company**: Campus Vibe Media
- **Contact**: 0798194062

### Payment Process
1. User enters phone number on checkout
2. M-Pesa sends STK prompt to phone
3. User enters PIN to authorize
4. Payment verified and recorded
5. Booking status updates immediately

### Simulation (Development)
- Currently set to auto-complete for testing
- In production, integrate actual M-Pesa API
- Use sandbox credentials for testing

## 🔍 Monitoring Checklist

### Daily Tasks
- [ ] Check pending bookings
- [ ] Verify payment completions
- [ ] Monitor failed transactions
- [ ] Track revenue

### Weekly Tasks
- [ ] Review all bookings status
- [ ] Check installment due dates
- [ ] Generate revenue report
- [ ] Identify overdue payments

### Monthly Tasks
- [ ] Full reconciliation
- [ ] Performance analysis
- [ ] Customer satisfaction review
- [ ] Plan improvements

## 🐛 Troubleshooting

### Issue: Payment not processing
- Check phone number format
- Verify M-Pesa account active
- Check sufficient balance
- Review transaction logs

### Issue: Booking not appearing
- Refresh browser/cache
- Verify user logged in
- Check database connection
- Review user permissions

### Issue: Admin can't see bookings
- Verify admin role assigned
- Check RLS policies
- Verify database permissions
- Review auth token

## 📞 Support

**M-Pesa Issues**: Contact Campus Vibe Media (0798194062)
**Technical Issues**: Check database logs in Supabase
**User Issues**: Review booking details page

---

✅ **System Ready for Testing!**

Start at `/campus-memory` and work through the complete user flow.
