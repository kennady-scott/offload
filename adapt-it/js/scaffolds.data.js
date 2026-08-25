/* Adapt It — scaffolds and the support mapping.
   Everything here is authored or structural. What is NOT here, and cannot be
   until a language model is connected, is rewriting the teacher's own wording
   into simpler language — that needs to understand the assignment.

   Rule from the spec, enforced by the UI: teachers choose what the LEARNER NEEDS.
   Never ADHD / IEP / ELL / 504. There is deliberately nowhere to enter a label. */

const NEEDS = [
  { id: "chunk",    label: "Chunked steps",            hint: "One instruction at a time",
    adds: "Splits your assignment into numbered steps with a box to tick." },
  { id: "starters", label: "Sentence starters",        hint: "A way in to writing",
    adds: "Adds starters matched to the kind of thinking you asked for." },
  { id: "less",     label: "Reduced workload",         hint: "Less of it, not easier",
    adds: "Selects a subset of the items — same difficulty, fewer of them." },
  { id: "exec",     label: "Executive function",       hint: "Getting started and keeping going",
    adds: "Adds a first-step box, time estimates and check-in points." },
  { id: "reading",  label: "Reading support",          hint: "The text is the barrier",
    adds: "Flags the longest sentences and adds a word bank to fill in." },
  { id: "language", label: "Language support",         hint: "Still building English",
    adds: "Adds a word bank, a read-aloud note and a partner-check step." },
  { id: "simpler",  label: "Simpler directions",       hint: "Fewer words, plainer ask",
    adds: "Needs a language model — see the note below.", needsModel: true },
  { id: "extend",   label: "Extension",                hint: "They finished and want more",
    adds: "Adds a harder follow-on that uses the same content." }
];

/* Student support preferences (Class Manager) → what to switch on here.
   This is the payoff of filling in the roster: "Adapt for Avery" instead of
   ticking boxes from memory. */
const SUPPORT_TO_NEED = {
  chunk:   ["chunk"],
  both:    ["exec"],
  time:    ["exec"],
  starters:["starters"],
  checkin: ["exec"],
  less:    ["less"],
  aloud:   ["reading"],
  preview: ["language"],
  seat:    [],          // a seating change, not a change to the paper
  move:    []           // a movement break, not a change to the paper
};

const VERSIONS = [
  { id: "original", label: "Original",         hint: "Untouched" },
  { id: "support",  label: "Supported",        hint: "More structure, same task" },
  { id: "high",     label: "Highly Supported", hint: "Lower load, way in provided" },
  { id: "extend",   label: "Extended",         hint: "Same content, higher bar" }
];

/* Starters are grouped by the kind of thinking the assignment asks for, detected
   from its own verbs. Generic enough to be honest, specific enough to be useful. */
const STARTERS = {
  explain:  ["This happens because…", "The main reason is…", "One way to think about it is…",
             "In other words,…"],
  compare:  ["Both … and … are…", "The biggest difference is…", "… is more … than … because…",
             "They are alike in that…"],
  argue:    ["I think … because…", "The strongest reason is…", "Someone might disagree and say…",
             "Even so,…"],
  describe: ["First, …", "One thing I noticed is…", "For example,…", "This shows…"],
  solve:    ["First I need to…", "I know that…", "My next step is…", "I can check this by…"]
};
const VERB_HINTS = {
  explain: ["explain","why","cause","because","reason","how does","describe how"],
  compare: ["compare","contrast","difference","alike","similar","versus","both"],
  argue:   ["argue","opinion","persuade","claim","defend","agree","disagree","should"],
  solve:   ["solve","calculate","find","compute","evaluate","simplify","prove","show your work"],
  describe:["describe","list","identify","summarize","retell","what happened","name"]
};

const EXTENSIONS = [
  "Do it again without your notes.",
  "Write the question you would put on the test about this, and the answer.",
  "Explain your answer to someone who missed the lesson.",
  "Find one place where the opposite would be true, and say why.",
  "Redo your answer in half the words without losing anything.",
  "Rank your answers from most to least important and defend first place."
];

const EXEC_STEPS = [
  "Before you start: read every step once, then come back here.",
  "Put a box around the first thing you actually have to do.",
  "Check in with me when you finish step 1 — not at the end.",
  "If you are stuck for more than two minutes, box it and move on."
];

const LANGUAGE_NOTES = [
  "Words to know — write what each one means as you meet it:",
  "Read the directions out loud to yourself, or ask me to read them.",
  "Check your first answer with a partner before you do the rest."
];
