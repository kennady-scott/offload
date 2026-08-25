/* Teacher Plate runtime config.
   Empty values are the normal, working state: everything runs on localStorage and
   the Sign in button stays hidden. Fill these in and accounts switch on.

   The anon key is PUBLIC by design — it ships in every browser. RLS in
   supabase/schema.sql is what actually protects a teacher's roster. Never put a
   service_role key here. */
window.TP_CONFIG = {
  supabaseUrl: "https://oxgmscejduvplgapoaib.supabase.co",     // https://xxxxxxxx.supabase.co
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94Z21zY2VqZHV2cGxnYXBvYWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODg4NDQsImV4cCI6MjEwMzI2NDg0NH0.OC2FXB6heaGHMd-Jrd7Psf8ty5wCbD8x59GQkTLuRrg", // eyJ... (anon / publishable key, never service_role)

  // "magiclink" needs no external setup. "google" needs a Google Cloud OAuth
  // client configured in Supabase. Both can be on at once.
  authMethods: ["magiclink"]
};
