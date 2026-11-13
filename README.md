# Monarchis Financial — Neon Auth integration

This project connects the client sign-up/sign-in experience to Neon Managed Auth using `@neon/auth`.

## Setup on Windows
1. Extract the ZIP and open the project folder in VS Code.
2. In the VS Code terminal run `npm.cmd install`.
3. Create `.env.local` in the project root using `.env.example` as a guide.
4. Set `NEON_AUTH_BASE_URL` to the existing Neon Managed Auth URL for the correct branch.
5. Set `NEON_AUTH_COOKIE_SECRET` to a private random value of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
6. Set `ADMIN_EMAILS` to your own verified administrator email address. Do not use a public or shared address.
7. Run `npm.cmd run dev` and test `/auth`, sign-up, email verification, sign-in, reload, `/dashboard`, sign-out and signed-out redirect.

## Routes and security
- `/auth` is public and provides email/password registration and sign-in.
- `/dashboard` requires a valid Neon Auth session.
- `/admin` requires a valid session and an email in the server-side `ADMIN_EMAILS` allowlist.
- `/api/auth/*` forwards to Neon Managed Auth.

## Important
The UI does not create financial accounts or move money. KYC, database profile linkage, audit events, financial ledgers, payments, withdrawals and investment execution are not implemented by this auth integration. Do not accept deposits or promise returns. Production use requires custom SMTP, HTTPS, security review, legal review and jurisdiction-specific authorisations.

## Additional application features
The app now includes a premium public website, client dashboard, and admin dashboard. Configure `DATABASE_URL` to use Neon PostgreSQL; `/api/health/database` performs a read-only `SELECT 1` check and returns only `connected`, `unconfigured`, or `unavailable`. Database reads inspect the active schema and map only recognized columns. Writes use parameterized values and transactions, including audit events when the existing schema supports them. The application does not create, alter, or delete database tables.

The JSON store is development-only. It is never used in production, and database errors do not silently fall back to local data. The existing schema must include compatible tables and columns for each operation; the repository does not establish that the live schema matches its documentation. In particular, product persistence requires an existing `investment_products` table. No real-money processing or investment execution is enabled.
