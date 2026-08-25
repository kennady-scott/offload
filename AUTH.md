# Accounts — setup runbook

Everything is built and deployed. It is **dormant until `core/config.js` has real values**, and
that dormant state is the normal working product: local storage, no sign-in button, nothing broken.

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

## Decisions still open

**Email delivery.** Supabase's built-in SMTP is rate limited to a handful of messages an hour and
is explicitly not for production. Magic links will work for you while testing and will fail for
real teachers. Before launch, set custom SMTP (Resend's free tier is 3k/month) under
Authentication → Emails → SMTP.

**Google sign-in.** Better for teachers — they all have a school Google account, and it is the only
thing that makes `plotruckus.com` a single click instead of a second email. Costs a Google Cloud
OAuth client plus a consent screen. Add `"google"` to `authMethods` in config once it exists.

**Free vs Pro.** Free has **no backups**. Do not let real teacher rosters live on it. Pro is ~$25/mo
and is the floor cost of taking money at all.

## What is unverified

The local path is tested. The remote path cannot be until keys exist. Three specific things are
most likely to need a small fix on first real run:

1. **The magic-link call** — `POST /auth/v1/otp?redirect_to=…` with `{email, create_user}`.
2. **The upsert** — `on_conflict=teacher_id,local_id` with `Prefer: resolution=merge-duplicates`.
3. **The delete filter** — `?local_id=not.in.(a,b,c)` when ids contain unexpected characters.

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
