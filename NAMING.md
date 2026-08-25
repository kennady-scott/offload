# Naming + domain search — PARKED 2026-08-24
She hated all the finalists. Do not restart this from scratch; start from here.

## The method that actually works
`dig` and the system `whois` both LIE.
- `dig NS` returns nothing for registered-but-unconfigured domains → false "available".
- System `whois` only returns the IANA referral and never follows it → everything looks registered.

Query the registry directly, and calibrate before trusting a run:
```sh
whois -h whois.verisign-grs.com "domain example.com" | grep -i "^No match"   # match = available
```
Calibration: `google.com` → "Domain Name: GOOGLE.COM"; a nonsense domain → "No match".

## The finding that matters
**The constraint is inventory, not creativity.** ~90 names checked. Every ordinary English word
and every obvious two-word compound is registered — 24 of 24 in one batch, 23 of 24 in another.
This is why edtech is full of coined words (Padlet, Blooket, Gimkit, Wakelet): inventing a
letter-string nobody would speculatively register is the only way to own a short `.com`.

## Criteria we derived (keep these)
- **Must not echo ClassCade SuperTool** — killed `SpareTab` (same S-word + short-T-word shape).
  Also rules out tool/bench/workshop language. See [[offload-vs-supertool-overlap]].
- **No dark parse.** Killed `offloadme.com` ("k*ll me"), `offloadteachers` / `offloadteaching` /
  `offloadclass` (all read as *getting rid of* teachers/teaching/class).
- **Not dismissive.** Cut `JustTeach` ("just teach, stop complaining"), `Lightwork` ("the work is
  easy"), `Breather` (wellness-coded; burned-out teachers want help, not self-care).
- **Does, not holds.** Cut the container family — drawer / hutch / caddy / cart. The product
  writes the parent email; it doesn't store it.
- **Recoverable, not just typeable.** Someone who half-remembers the name must be able to find it
  by searching. This is why a brand-matched domain beats a cleverer unrelated one.
- She rejected non-`.com` TLDs outright: "nobody uses weird url endings like .school."

## Confirmed AVAILABLE (registry-verified 2026-08-24)
Brand-matched: `teacheroffload.com` · `theoffloadapp.com` · `offloadforteachers.com` ·
`offloadedu.com` · `offloadclassroom.com` · `offloadnest.com`
Other: `teacherslate.com` · `teacherplate.com` · `backpockethq.com` · `teacherbackpocket.com` ·
`teacherdrawer.com` · `prepdrawer.com` · `prepcaddy.com` · `teacherhutch.com` · `chalkcart.com` ·
`teachside.com` · `teachbench.com` · `spareprep.com` · `sparetab.com` (rejected — SuperTool echo)

## Confirmed TAKEN — don't re-check
offload · offyourplate (held since 2005, renewed to 2027) · offtheplate · handled · itshandled ·
backpocket · mybackpocket · oneless · onelessthing · headroom · toolroom · thetoolroom ·
teachtab · sidedesk · seconddesk · deskmate · pocketprep · prepside · classside · sparebrain ·
sparebrains · mysparebrain · spareperiod · sparedesk · sparepocket · sparedrawer · offhand ·
prepless · noprep · understudy · cubby · caddy · satchel · lanyard · deskly · classly · tidyup ·
lessen · unload · handoff · standby · onit · righthand · thelittlethings · teachercubby ·
teachercaddy · teachercrate · sidenote · teacherly · bellhop · subhub · hallpass · secondchair ·
teacheraide · cubbit · desklet · teachlet · prepnook · classnook · teachernest · teachertote ·
chalkbox · chalkline · plately · offly · handly · classlet · bellkit · freeperiod · prepperiod ·
teacherbell · offloadschool · offloadtools(*) · getoffload · tryoffload · useoffload · myoffload ·
offloadapp · offloadhq · offload.app/.co/.io/.tools · fullplate(**) · clearyourplate · offmyplate ·
theoffload · offloadit · justoffload · theteacherplate · offloadme(***)

(*) available but cut — tool language. (**) DNS said free; unverified by registry, and it names
the problem not the fix. (***) available but rejected — reads as "k*ll me."

## Existing-product collisions to avoid
Buffer · Sidekick · GotIt · CoverMe · Lightwork · PocketPrep · Headroom · Margin

## Where it stands
Nothing decided. **Offload remains the working name** and everything is built under it.
The two finalists she rejected were "keep Offload @ teacheroffload.com" and
"rename to Teacher Slate @ teacherslate.com".
