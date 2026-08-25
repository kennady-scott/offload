# Where Teacher Plate sits

Written 2026-08-25, when the question came up of whether this belongs with ClearK12 rather than
standing alone.

## The three-axis read

Teacher Plate, ClassCade/SuperTool and Every School Year don't overlap, because each one owns a
different **time scale** of a teacher's job:

| | Product | Scale | Facing |
|---|---|---|---|
| **During** the lesson | ClassCade / SuperTool | minutes | Projected, student-facing |
| **Around** the lesson | **Teacher Plate** | hours to days | Private, teacher-only |
| **Across** the year | Every School Year | weeks to months | Chronological, role-bound |

That is a genuinely clean split, and it's why the three feel like one thing. The sentence is:
*what you do in the room, what you do around the room, and what the year does to you.*

**The honest caveat:** this is the **teacher-experience spine**, not the whole company. ClearK12
already owns the curriculum and assessment layer — Crystal Instruction, LoneStar CR, ClearLessons,
Curriculum Hub, the HQIM work. These three sit alongside that, not on top of it. Claiming "full
breadth" for the three alone oversells it and invites someone to point at the gap.

## If it moves to ClearK12 hosting

**Migration cost is genuinely low, and it was kept that way on purpose:**
- **Zero hardcoded `teacherplate.com` references in code.** Every asset path is root-relative
  (`/core/bar.js`, `/img/icons/…`). Audited 2026-08-25.
- The domain is pinned in exactly one file: `CNAME`.
- The magic-link redirect is built from `location.origin`, so it follows the host.
- Brand is one file — `css/tokens.css`. A rebrand to ClassCade navy/blue/gold is a token swap.
- No build step, no framework, no proprietary hosting features. Static files anywhere.

**Keep it that way.** Anything that hardcodes a host, a brand colour outside tokens.css, or a
build step raises the cost of a move that is currently near zero.

## No build step — decided 2026-08-25
Plain HTML, CSS and JavaScript. The files you edit are the files that get published. No install,
no compile, no tooling anyone has to have.

That is what makes a host move a DNS change rather than a project, and it is worth more than the
automation it costs. **Do not add a bundler, framework or build pipeline without a specific reason.**

The price is cache versions kept in sync by hand: `bar.js?v=` and `config.js?v=` appear in every
page that loads them (13 references across 12 files today). Bump them together, with a loop, never
one at a time:

```python
import re, glob
base = '/Users/kennadyscott/.claude-apps/offload/'
for f in glob.glob(base+'*.html') + glob.glob(base+'*/index.html') + [base+'core/demo.html']:
    s = open(f).read()
    s = re.sub(r'bar\.js\?v=\d+', 'bar.js?v=NEW', s)
    open(f, 'w').write(s)
```

Miss one and that page silently serves old code — which has already looked like a code bug twice.
Revisit only if this grows past ~30 pages, or if ClearK12 hosting brings a pipeline it can ride on.

## Don't embed SuperTool as a screen
SuperTool runs the room — projected, live, student-facing. Teacher Plate is private and
teacher-only. Making the thing that runs your lesson into a tab inside a utility belt inverts the
hierarchy. The right shape is **siblings under one login**: SuperTool during class, Teacher Plate
around it. There is also a hard technical reason — SuperTool lives on a different origin, and
cross-origin embedding hits the same storage partitioning that makes sharing a roster with
plotruckus.com impossible.

## Three things to protect in writing, if it does move
1. **Free, and works with no login.** That is the whole acquisition thesis; a signup wall is the
   first thing a sales org reaches for.
2. **The "need not label" rule.** No IEP/504/ELL dropdown, ever. Design around what the learner
   needs.
3. **Authorship on the record** — product design, all the tool content, and the icon set.
