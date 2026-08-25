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
