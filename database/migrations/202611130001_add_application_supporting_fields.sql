-- Monarchis Financial: supporting tables and fields for the application data layer.
-- REVIEW ONLY: this migration has NOT been applied to any database.
-- Target: the existing Monarchis schema described in database/README.md and schema inspection.
-- Apply only to a reviewed staging database after taking a backup and confirming the target branch.

BEGIN;

-- Product catalogue used by the admin product-management screens.
CREATE TABLE IF NOT EXISTS public.investment_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  summary text NOT NULL,
  risk_band text NOT NULL DEFAULT 'Balanced'
    CHECK (risk_band IN ('Conservative', 'Balanced', 'Growth', 'Opportunistic')),
  min_amount numeric(20, 2) NOT NULL CHECK (min_amount > 0),
  max_amount numeric(20, 2) NOT NULL CHECK (max_amount >= min_amount),
  fee_percent numeric(7, 4) NOT NULL DEFAULT 0 CHECK (fee_percent >= 0),
  duration_months integer NOT NULL CHECK (duration_months >= 1),
  currency character(3) NOT NULL DEFAULT 'USD'
    CHECK (currency IN ('USD', 'EUR', 'GBP')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'suspended', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS investment_products_status_created_at_idx
  ON public.investment_products (status, created_at DESC);

-- The existing kyc_cases table already owns the user relationship, country_code,
-- status and review fields. Add only the application fields absent from that schema.
ALTER TABLE public.kyc_cases
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS document_type text,
  ADD COLUMN IF NOT EXISTS notes text;

-- Keep the original support_tickets ownership, status and priority constraints.
-- Store the user's message on the ticket instead of inventing a separate message table.
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS message text;

COMMIT;

-- No customer records, financial accounts, ledger entries, or payment requests
-- are created or modified by this migration.
