# Accounts — BUILT, AND DELIBERATELY SWITCHED OFF

**Decided 2026-08-25: Teacher Plate is free with no login.** Every tool works, everything saves
to the teacher's own browser, and no sign-in is offered — offering one that isn't needed is worse
than not offering it.

Nothing was deleted. The whole layer is built and tested: schema, RLS, grants, session handling,
token refresh, magic-link sign-in, and whole-collection sync.

## To turn it back on
1. Paste this back into `core/config.js` as `supabaseAnonKey`, and bump `config.js?v=`:
   `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94Z21zY2VqZHV2cGxnYXBvYWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODg4NDQsImV4cCI6MjEwMzI2NDg0NH0.OC2FXB6heaGHMd-Jrd7Psf8ty5wCbD8x59GQkTLuRrg`
   (Public by design — it ships in every browser. RLS plus the grants are the boundary.)
2. Pick a sign-in method. **Google is the better first choice** and needs no email at all; magic
   link needs custom SMTP because Supabase's built-in mail is ~2/hour and lands in spam.
3. Delete the two leftover test users: `tp-rls-a@` and `tp-rls-b@teacherplate.com`.

## What only you can do

**1. Create the Supabase project**
Use **your personal Supabase account, not ClearK12's** — Teacher Plate is yours, and a project in
the wrong org is painful to move later. Name it `teacher-plate`. Pick the region closest to Texas
(`us-east-1` or `us-west-1`).

**2. Run the schema**
SQL Editor → paste all of `supabase/schema.sql` → Run. It is idempotent, so re-running is safe.
Then confirm RLS is on: Table Editor → `classes` → the shield should say **RLS enabled**.

**3. Allow the redirect URLs**
Authentication → URL Configuration:
- Site URL: `https://teacherplate.com`
- Redirect URLs: `https://teacherplate.com/app.html` and `http://localhost:4212/app.html`

**4. Fill in `core/config.js`**
Settings → API → copy the **Project URL** and the **anon / publishable** key.
Never the `service_role` key — it bypasses RLS entirely.
The anon key is public by design; it ships in every browser and RLS is what protects data.

**5. Bump the cache version**
`core/config.js?v=` and `core/bar.js?v=` on every page, or returning teachers run the old file.

## Decided 2026-08-25
- **Free tier** while testing. Free has **no backups** — see the export button below, and move to
  Pro (~$25/mo) before any teacher stores a roster they'd be upset to lose.
- **Magic link only.** Google sign-in comes later; add `"google"` to `authMethods` when a Google
  Cloud OAuth client exists. Until then `plotruckus.com` needs its own emailed link.
- Project account: hers, told to me after she creates it.

## Before real teachers, not before testing
Supabase's built-in SMTP is rate limited to a handful of messages an hour and is explicitly not for
production. Magic links will work for you and fail for users. Set custom SMTP (Resend free tier is
3k/month) under Authentication → Emails → SMTP.

## What is unverified

The local path is tested. The remote path cannot be until keys exist. Three specific things are
most likely to need a small fix on first real run:

1. **The magic-link call** — `POST /auth/v1/otp?redirect_to=…` with `{email, create_user}`.
2. **The upsert** — `on_conflict=teacher_id,local_id` with `Prefer: resolution=merge-duplicates`.
3. **The delete filter** — `?local_id=not.in.(a,b,c)` when ids contain unexpected characters.

## First-run verification — three checks
Once the keys are in, in this order:
1. **Signed out, RLS holds.** In the SQL editor as `anon`: `select count(*) from public.classes;`
   should return 0 rows, not an error and not somebody's data.
2. **A link arrives and lands.** Sign in from `/classes/`; the email link should return you to
   `/classes/` (via `/app.html?from=`) already signed in.
3. **A round trip survives.** Add a class, hard-reload, confirm it is still there; then open a
   private window, sign in again, and confirm the class appears with no local storage to help it.

If any of the three fails, the likely culprits are the three unverified calls below.

## How it behaves

- **Anonymous stays complete.** No tool ever gates behind sign-in.
- **Signing in never loses local work.** The account wins for classes it already knows; classes
  only on this device are kept and uploaded.
- **Tokens only land on `/app.html`.** Tool pages use the URL fragment for routing (Bellringers is
  `#/library`), so a token in the fragment there would fight the router. Sign-in returns you to
  where you started via `?from=`.
- **Sync is whole-collection, last write wins.** One teacher, one roster — per-row diffing would be
  more code and more ways to corrupt a roster.
- **Cross-origin:** `plotruckus.com` signs in against the same Supabase project and reads the same
  `classes` rows. That is the only way same-kids-different-URL works; `localStorage` cannot cross
  origins and the iframe bridge is blocked by Safari and dying in Chrome.
