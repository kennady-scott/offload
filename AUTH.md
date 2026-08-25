# Accounts — ON, and FREE

**Decided 2026-08-25: accounts stay, and there is no paid tier.** Signing in is optional and free.

## What the account actually adds
Worth being precise, because it is easy to over-credit:

| | Anonymous (no login) | Signed in |
|---|---|---|
| Every tool, in full | yes | yes |
| Grade bands remembered | yes | yes |
| Classes, roster, supports | yes | yes |
| Saved work and history | yes | yes |
| ...on your other computer | **no** | yes |
| ...after clearing your browser | **no** | yes |

Everything already persists in `localStorage`. The account moves that store to the cloud so it
survives a different machine and a cleared browser. That is the whole difference — it is
durability, not features.

## The open blocker: how people actually sign in
Magic link is wired and the request shape is verified, but **Supabase's built-in mail is about two
messages an hour and lands in spam**, so it works for testing and will fail for real teachers.
Two ways out:

- **Google sign-in — recommended.** No email sent by us at all, one click, and teachers all have a
  school Google account. Also the only clean fix for signing in on `plotruckus.com`, which is a
  different origin. Costs a Google Cloud OAuth client + consent screen (her console, ~20 min).
- **Custom SMTP.** Resend free tier is 3k/month, plus SPF/DKIM records in Cloudflare. Keeps magic
  link, adds email infrastructure to maintain.

Until one of those exists, the Sign in button appears but the emailed link will rate-limit.
No users yet, so the cost is currently zero — but it is the first thing to fix before launch.

## Housekeeping still outstanding
- Delete the two test users: `tp-rls-a@` and `tp-rls-b@teacherplate.com`.
- Run the `class_days` migration in `supabase/schema.sql` before wiring the Catch Me Up sync.

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
