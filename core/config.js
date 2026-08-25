/* Teacher Plate runtime config.
   Empty values are the normal, working state: everything runs on localStorage and
   the Sign in button stays hidden. Fill these in and accounts switch on.

   The anon key is PUBLIC by design — it ships in every browser. RLS in
   supabase/schema.sql is what actually protects a teacher's roster. Never put a
   service_role key here. */
/* ACCOUNTS ARE DELIBERATELY OFF (decided 2026-08-25).
   Teacher Plate is free with no login: every tool works, everything saves to the
   teacher's own browser, and no sign-in is offered because none is needed.

   The whole account layer is built and tested — schema, session, sync, sign-in.
   To switch it back on, paste the anon key from AUTH.md back into supabaseAnonKey
   and bump the ?v= on config.js. cfg() requires BOTH values, so a blank key keeps
   it dormant without deleting anything. */
window.TP_CONFIG = {
  supabaseUrl: "https://oxgmscejduvplgapoaib.supabase.co",
  supabaseAnonKey: "", // eyJ... (anon / publishable key, never service_role)

  // "magiclink" needs no external setup. "google" needs a Google Cloud OAuth
  // client configured in Supabase. Both can be on at once.
  authMethods: ["magiclink"]
};
