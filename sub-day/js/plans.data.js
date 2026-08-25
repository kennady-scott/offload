/* Sub Day — authored plan content.
   Written for the person who is NOT you: a sub who has never met these kids,
   may not know the subject, and is reading this at 7:15am in an unfamiliar room.
   Everything is no-prep, needs no login, and survives the copier being broken. */

const ENERGY = [
  { id: "barely", emoji: "😵", label: "I can barely function",
    blurb: "Ask me nothing. Build a safe, structured day.",
    needs: "none" },
  { id: "ten", emoji: "😐", label: "I can give you 10 minutes",
    blurb: "I'll tell you what each class is working on.",
    needs: "topic" },
  { id: "ready", emoji: "🤓", label: "I know what I want them doing",
    blurb: "Build the plan around my materials.",
    needs: "plan" }
];

/* Emergency blocks. Each one has to work with no prep, no tech, and no subject
   knowledge from the adult in the room. `student` is what gets printed and handed out. */
const BLOCKS = [
  {
    id: "read-respond", title: "Silent read, then write",
    fits: "any subject, any grade",
    materials: "Whatever students are already reading, or anything from the classroom shelf. Paper.",
    timing: ["First 5 min — settle, get a book, write name and date on paper",
             "20 min — silent reading, nobody out of seat",
             "15 min — answer the three questions in complete sentences",
             "Last 5 min — collect papers, stack on the desk"],
    student: ["Read silently for 20 minutes. Any book is fine.",
              "Then answer these three questions in complete sentences:",
              "1. What happened in what you read today?",
              "2. What surprised you, confused you, or annoyed you? Say why.",
              "3. What do you think happens next, and what makes you think that?"],
    done: "One page of writing, three questions answered in full sentences.",
    extra: "Add a fourth: write three questions you would ask the author."
  },
  {
    id: "brain-dump", title: "Everything you know",
    fits: "any subject — reviews the current unit without the sub knowing it",
    materials: "Paper only.",
    timing: ["5 min — write the unit name on the board (it's in the notes below)",
             "10 min — students write everything they can remember, alone, no notes",
             "10 min — trade papers with a partner and add anything they missed",
             "15 min — each pair writes the five most important things on one sheet",
             "Last 5 min — collect the pair sheets"],
    student: ["Write down everything you remember about what we have been studying. No notes, no phone.",
              "Keep going even when it gets hard — messy lists are fine.",
              "Then swap with a partner. Add anything they have that you missed.",
              "Together, pick the five most important things and write them on one clean sheet with both names."],
    done: "One shared sheet per pair with five items and both names.",
    extra: "Rank your five from most to least important and write one sentence defending first place."
  },
  {
    id: "word-work", title: "Word work",
    fits: "any subject with vocabulary — which is all of them",
    materials: "The word wall, the glossary at the back of the textbook, or the vocabulary list in the folder.",
    timing: ["5 min — students copy ten words from the word wall or glossary",
             "15 min — define each one in their own words, no dictionary copying",
             "15 min — use each word in a sentence that proves they know it",
             "10 min — sort the ten words into groups and label the groups"],
    student: ["Copy ten words from the word wall (or the glossary at the back of the book).",
              "Define each one in your own words. Do not copy the dictionary — if you copy it, you have to explain it out loud.",
              "Write a sentence for each word that shows what it means. \"I like the osmosis\" does not count.",
              "Last: sort your ten words into groups that go together, and give each group a name."],
    done: "Ten words, ten definitions, ten sentences, and labeled groups.",
    extra: "Find two words that could go in more than one group and explain why."
  },
  {
    id: "one-question", title: "One big question",
    fits: "any subject — discussion-free version of a seminar",
    materials: "Paper. The question is in the class notes below.",
    timing: ["5 min — write the question on the board",
             "10 min — students write their first answer, alone",
             "10 min — write the strongest argument AGAINST their own answer",
             "15 min — final answer, having considered both, with reasons",
             "Last 5 min — collect"],
    student: ["Answer the question on the board in a paragraph. Say what you actually think.",
              "Now argue against yourself. Write the best case someone who disagrees would make.",
              "Last, write your real answer, knowing both sides. Give at least two reasons.",
              "You are not graded on which side you pick. You are graded on the reasons."],
    done: "Three paragraphs: first answer, counter-argument, final answer.",
    extra: "Write the question you would rather have been asked, and answer that too."
  },
  {
    id: "skill-drill", title: "Practice set",
    fits: "math, grammar, anything with practice problems",
    materials: "The practice packets or workbook pages in the folder on the desk.",
    timing: ["5 min — hand out the packet, names on top",
             "25 min — work quietly, in order, showing all steps",
             "10 min — trade and check with a partner; mark disagreements with a star",
             "Last 5 min — collect, starred problems on top"],
    student: ["Work the problems in order. Show every step — the steps are the point, not the answer.",
              "If you get stuck for more than two minutes, put a box around it and move on.",
              "When time is called, trade with a partner and compare. Star anything you disagree on.",
              "Do not erase your original work. I want to see the disagreement."],
    done: "Packet attempted in order, steps shown, disagreements starred.",
    extra: "Write your own problem that would trick someone who did this packet too fast."
  },
  {
    id: "write-about-it", title: "Write about it",
    fits: "any subject, best for the last period of the day",
    materials: "Paper only.",
    timing: ["5 min — read the prompt out loud twice",
             "10 min — plan: bullet points only, no full sentences",
             "20 min — write",
             "10 min — reread and fix three things",
             "Last 5 min — collect"],
    student: ["Prompt: Describe something you got better at, and how you know you got better.",
              "Plan first in bullet points. Do not start writing sentences yet.",
              "Then write at least three paragraphs. Specific beats long.",
              "Before you hand it in, reread it and fix exactly three things. Circle what you fixed."],
    done: "A plan in bullets plus at least three paragraphs, with three fixes circled.",
    extra: "Add a paragraph about something you are still bad at and what would help."
  }
];

/* Boilerplate sections. Placeholders in {braces} are filled from the saved profile. */
const BOILER = {
  attendance: [
    "Take attendance every period in the computer if you can log in. If you cannot, write names on paper and leave it on the desk — do not guess.",
    "Mark students who arrive after the bell as tardy, not absent.",
    "If a student's name is not on the roster, write it down with the period. It happens; it is not a crisis."
  ],
  techFails: [
    "Everything in this plan works on paper. If the computers, projector, or internet are down, nothing changes.",
    "Do not spend the period troubleshooting. Move to the paper version and let the class work.",
    "If a student's device dies, they share with a neighbor or use paper."
  ],
  behavior: [
    "You have my full authority to move a student's seat. Do it early rather than late.",
    "You do not need to win an argument. Give the direction once, walk away, come back.",
    "Please write down names — good and bad. I would rather have too much detail than none.",
    "Do not send a student into the hall alone for more than a couple of minutes."
  ],
  checklist: [
    "Collect all student work and leave it on the desk in period order",
    "Leave the attendance notes where I can find them",
    "Write down anything I should know — who helped, who struggled, what did not work",
    "Straighten the desks and close the windows",
    "Turn off the projector and lock the door"
  ]
};

/* Profile fields. Filled once, reused for every sub day forever — that is the
   whole point of doing this inside the hub rather than on a blank document. */
const PROFILE_FIELDS = [
  { key: "teacherName", label: "Your name",            ph: "Ms. Scott",                     span: 1 },
  { key: "room",        label: "Room",                 ph: "214",                           span: 1 },
  { key: "conference",  label: "Conference period",    ph: "4th, 11:50–12:40",              span: 1 },
  { key: "neighbor",    label: "Teacher next door",    ph: "Mr. Alvarez, room 216",         span: 1 },
  { key: "frontOffice", label: "Who to call for help", ph: "Front office, ext. 2100",       span: 1 },
  { key: "dismissal",   label: "Dismissal procedure",  ph: "Students stay seated until the bell — not the hallway clock.", span: 2 },
  { key: "restroom",    label: "Restroom policy",      ph: "One at a time, sign the clipboard by the door.", span: 2 },
  { key: "seating",     label: "Seating expectations", ph: "Assigned seats — chart is on the desk. Do not let them move.", span: 2 },
  { key: "phones",      label: "Phone rule",           ph: "Phones in the caddy by the door at the bell.", span: 2 },
  { key: "notes",       label: "Anything else a sub should know", ph: "3rd period has a student who leaves at 10:30 for services.", span: 2 }
];
