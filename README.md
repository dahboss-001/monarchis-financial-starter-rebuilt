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
