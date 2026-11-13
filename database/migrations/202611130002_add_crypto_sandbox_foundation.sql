-- Monarchis Financial: isolated sandbox crypto-investment foundation.
-- Additive migration only. Do not apply to production.
-- Sandbox records are simulated and must never be presented as real custody,
-- blockchain transfers, trading execution, staking rewards, or lending income.

BEGIN;

CREATE TABLE IF NOT EXISTS public.sandbox_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.app_users(id) ON DELETE RESTRICT,
  product_id uuid REFERENCES public.investment_products(id) ON DELETE RESTRICT,
  strategy_type text NOT NULL
    CHECK (strategy_type IN ('managed_trading', 'staking', 'lending')),
  principal_minor bigint NOT NULL CHECK (principal_minor > 0),
  current_value_minor bigint NOT NULL CHECK (current_value_minor >= 0),
  currency character(3) NOT NULL
    CHECK (currency IN ('USD', 'EUR', 'GBP')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status IN ('completed', 'cancelled') AND closed_at IS NOT NULL)
      OR (status IN ('active', 'paused') AND closed_at IS NULL))
);

CREATE INDEX IF NOT EXISTS sandbox_investments_user_created_idx
  ON public.sandbox_investments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sandbox_investments_strategy_status_idx
  ON public.sandbox_investments (strategy_type, status);

-- Each row is an immutable-style simulated event in the sandbox wallet.
-- Amounts are positive minor units; entry_side determines credit or debit.
CREATE TABLE IF NOT EXISTS public.sandbox_wallet_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.app_users(id) ON DELETE RESTRICT,
  investment_id uuid REFERENCES public.sandbox_investments(id) ON DELETE RESTRICT,
  event_type text NOT NULL
    CHECK (event_type IN (
      'deposit', 'withdrawal', 'allocation', 'deallocation',
      'trading_gain', 'trading_loss', 'staking_reward',
      'lending_interest', 'fee', 'adjustment'
    )),
  entry_side text NOT NULL CHECK (entry_side IN ('credit', 'debit')),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency character(3) NOT NULL CHECK (currency IN ('USD', 'EUR', 'GBP')),
  reference text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'simulated' CHECK (status = 'simulated'),
  description text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sandbox_wallet_events_user_created_idx
  ON public.sandbox_wallet_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sandbox_wallet_events_investment_created_idx
  ON public.sandbox_wallet_events (investment_id, created_at DESC);

-- Strategy performance is recorded as dated observations, not guaranteed rates.
-- Negative P/L is allowed; snapshot values cannot be negative.
CREATE TABLE IF NOT EXISTS public.sandbox_performance_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id uuid NOT NULL REFERENCES public.sandbox_investments(id) ON DELETE RESTRICT,
  valuation_minor bigint NOT NULL CHECK (valuation_minor >= 0),
  profit_loss_minor bigint NOT NULL,
  currency character(3) NOT NULL CHECK (currency IN ('USD', 'EUR', 'GBP')),
  methodology text NOT NULL,
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sandbox_performance_investment_observed_idx
  ON public.sandbox_performance_snapshots (investment_id, observed_at DESC);

COMMIT;

-- No real wallets, private keys, blockchain transactions, deposits, or payouts
-- are created by this migration. Do not write these records to the production
-- financial_accounts, ledger_transactions, or ledger_entries tables.
