-- ================================================================
-- Campus Memory Booking System Tables
-- ================================================================

-- Campus Memory Bookings
CREATE TABLE IF NOT EXISTS public.campus_memory_bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_type      TEXT NOT NULL CHECK (package_type IN ('basic', 'standard', 'premium')),
  event_type        TEXT NOT NULL,
  event_date        TIMESTAMPTZ NOT NULL,
  additional_notes  TEXT,
  total_price       INTEGER NOT NULL,
  payment_plan      TEXT NOT NULL CHECK (payment_plan IN ('full', 'installment')),
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status    TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campus_memory_bookings_user_id ON public.campus_memory_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_campus_memory_bookings_status ON public.campus_memory_bookings(status);
CREATE INDEX IF NOT EXISTS idx_campus_memory_bookings_payment_status ON public.campus_memory_bookings(payment_status);

-- Campus Memory Installments (create before payments)
CREATE TABLE IF NOT EXISTS public.campus_memory_installments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id        UUID NOT NULL REFERENCES public.campus_memory_bookings(id) ON DELETE CASCADE,
  amount            INTEGER NOT NULL,
  due_date          TIMESTAMPTZ NOT NULL,
  installment_number INTEGER NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campus_memory_installments_booking_id ON public.campus_memory_installments(booking_id);
CREATE INDEX IF NOT EXISTS idx_campus_memory_installments_status ON public.campus_memory_installments(status);

-- Campus Memory Payments
CREATE TABLE IF NOT EXISTS public.campus_memory_payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id        UUID NOT NULL REFERENCES public.campus_memory_bookings(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount            INTEGER NOT NULL,
  payment_method    TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'bank', 'card')),
  phone_number      TEXT,
  installment_id    UUID REFERENCES public.campus_memory_installments(id) ON DELETE SET NULL,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  mpesa_reference   TEXT UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campus_memory_payments_booking_id ON public.campus_memory_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_campus_memory_payments_user_id ON public.campus_memory_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_campus_memory_payments_status ON public.campus_memory_payments(status);

-- Enable RLS
ALTER TABLE public.campus_memory_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_memory_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_memory_installments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.campus_memory_bookings;
CREATE POLICY "Users can view own bookings"
  ON public.campus_memory_bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own bookings" ON public.campus_memory_bookings;
CREATE POLICY "Users can create own bookings"
  ON public.campus_memory_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.campus_memory_bookings;
CREATE POLICY "Admins can view all bookings"
  ON public.campus_memory_bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND ('administrator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );

-- RLS Policies for Payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.campus_memory_payments;
CREATE POLICY "Users can view own payments"
  ON public.campus_memory_payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own payments" ON public.campus_memory_payments;
CREATE POLICY "Users can create own payments"
  ON public.campus_memory_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.campus_memory_payments;
CREATE POLICY "Admins can view all payments"
  ON public.campus_memory_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND ('administrator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );

-- RLS Policies for Installments
DROP POLICY IF EXISTS "Users can view own installments" ON public.campus_memory_installments;
CREATE POLICY "Users can view own installments"
  ON public.campus_memory_installments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campus_memory_bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all installments" ON public.campus_memory_installments;
CREATE POLICY "Admins can view all installments"
  ON public.campus_memory_installments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND ('administrator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );
