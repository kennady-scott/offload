/* Bellringers — formats, situations, and filter vocabulary.

   A FORMAT is a repeatable mechanic (Pick a Side, Odd One Out…).
   `art`       optional 16:9 slide thumbnail; shown only on the deck flagged
               `hero: true`, so subject editions don't repeat the same picture.
   `band`      tint behind the prompt on the board (mint|lilac|butter|blush|sky|pink)
   `direction` the line in the pill at the bottom of the board. <em> underlines it.
   A DECK is one themed set of prompts inside a format (see decks.js).
   A PROMPT is a single Bellringer. Formats render; decks supply.

   render types and the prompt shape each one expects:
     duel      { stem, a:{label,icon}, b:{label,icon} }
     quad      { stem, scene?, items:[{label,icon} x4] }
     statement { stem, big, sub? }
     reveal    { stem, big, answer, note? }
     clues     { stem, big, clues:[3 strings], answer }
     objects   { stem, items:[{label,icon} x3] }
     rapid     { stem, questions:[{q,a} x5] }
     zoom      { icon, answer, hint? }
     caption   { stem, scene, sub? }
*/

const FORMATS = {
  "pick-a-side": {
    name: "Pick a Side",
    icon: "⚖️",
    tint: "teal",
    art: "img/pick-a-side.webp",
    render: "duel",
    band: "mint",
    direction: "Pick one. Be ready to <em>defend your answer</em>.",
    blurb: "Students choose a side and defend their choice. Great for quick debates.",
    how: [
      "Read both options out loud. Do not editorialize — the second you have a favorite, half the room takes it.",
      "Everyone commits before anyone talks: hands up, stand on a side of the room, or thumbs left/right.",
      "Take two defenders from each side. Cap each at one sentence.",
      "Ask if anyone switched, and why. That question is the whole activity."
    ],
    say: "“You have to pick. ‘Both’ is not a side. Be ready to defend it in one sentence.”",
    why: "Committing before discussing is what makes it a debate instead of a poll."
  },

  "wrong-answers-only": {
    name: "Wrong Answers Only",
    icon: "🙃",
    tint: "coral",
    art: "img/wrong-answers-only.webp",
    render: "statement",
    band: "lilac",
    direction: "Give the most <em>ridiculous wrong answer</em> you can think of.",
    blurb: "Students give incorrect answers to silly questions. Hilarity ensues.",
    how: [
      "Post the question. Say the rule: every answer must be confidently, gloriously wrong.",
      "Give 30 seconds of thinking time so it isn't just the fastest three kids.",
      "Take answers rapid-fire. No commentary between them — momentum is the point.",
      "Close by asking for the real answer. Nobody is embarrassed to guess by then."
    ],
    say: "“Wrong answers only. If you accidentally say something true, you're out.”",
    why: "Removing the risk of being wrong is the fastest way to get a quiet class talking."
  },

  "odd-one-out": {
    name: "Odd One Out",
    icon: "🔺",
    tint: "moss",
    art: "img/odd-one-out.webp",
    render: "quad",
    band: "mint",
    direction: "Choose one and defend your answer. <em>More than one answer can work</em>.",
    blurb: "Four things appear. Students argue which one doesn't belong — and more than one answer can be right.",
    how: [
      "Show all four. Silent look for 20 seconds — no hands yet.",
      "Every student picks one and prepares a because.",
      "Collect reasoning, not votes. “I said the third one because…”",
      "The move that makes this great: keep going until every one of the four has been defended."
    ],
    say: "“There is more than one right answer here. The answer is whatever you can defend.”",
    why: "Four defensible answers means the reasoning is the assessment, not the choice."
  },

  "one-has-to-go": {
    name: "One Has to Go",
    icon: "🗳️",
    tint: "plum",
    render: "quad",
    band: "lilac",
    direction: "Vote one out. It's gone <em>forever, for everybody</em>.",
    blurb: "Four things appear on screen. The class has to eliminate one — permanently.",
    how: [
      "Read the four. Establish the stakes: whatever they pick is gone forever, for everyone.",
      "30 seconds to decide privately.",
      "Vote. Then take one appeal from whoever is most upset about the result.",
      "Re-vote. Watching a class change its mind out loud is the good part."
    ],
    say: "“One of these has to go. Forever. For everybody. Choose carefully.”",
    why: "Elimination forces students to compare and rank, which is harder than choosing a favorite."
  },

  "defend-the-ridiculous": {
    name: "Defend the Ridiculous",
    icon: "🎤",
    tint: "amber",
    render: "statement",
    band: "butter",
    direction: "You don't have to believe it. Just <em>make us believe it</em>.",
    blurb: "An absurd claim appears. Students have to argue for it convincingly.",
    how: [
      "Post the claim. Make clear nobody has to believe it — they just have to sell it.",
      "60 seconds with a partner to build the strongest possible case.",
      "Two or three pairs present. Class scores each on persuasiveness alone.",
      "Optional finish: ask what the best argument had in it that the others didn't."
    ],
    say: "“You don't have to believe it. You have to make me believe it.”",
    why: "Arguing a position you don't hold is the cleanest rhetoric practice there is."
  },

  "estimate-it": {
    name: "Estimate It",
    icon: "📏",
    tint: "sky",
    art: "img/estimate-it.webp",
    render: "reveal",
    band: "mint",
    direction: "Make your best estimate. Then <em>explain your thinking</em>.",
    blurb: "An impossible-sounding number question. Students reason their way to a guess.",
    how: [
      "Read the question. Ban “I don't know” — everyone must produce a number.",
      "First pass: everyone writes a private guess.",
      "Ask two students how they got theirs. Reasoning out loud usually moves the whole room.",
      "Second pass: allow anyone to revise. Then reveal."
    ],
    say: "“Nobody knows this. That's fine. I want your reasoning, not your memory.”",
    why: "Estimation is the math skill adults actually use daily, and it's almost never taught."
  },

  "micro-mystery": {
    name: "Micro Mystery",
    icon: "🔍",
    tint: "plum",
    render: "clues",
    band: "lilac",
    direction: "Every clue is true. <em>Nothing here is a trick</em>.",
    blurb: "A tiny mystery students crack using three clues.",
    how: [
      "Read the scenario. Ask what they notice before you give any clue.",
      "Reveal clues one at a time. Pause after each — the pause is where the thinking happens.",
      "Take theories only after all three clues are up.",
      "Reveal the answer. Then ask which clue was the one that gave it away."
    ],
    say: "“Every clue on the screen is true. Nothing is a trick. It all fits together.”",
    why: "Students have to hold three facts at once and test them against each other — that's inference."
  },

  "sixty-second-story": {
    name: "60-Second Story",
    icon: "📖",
    tint: "teal",
    render: "objects",
    band: "mint",
    direction: "All three objects. <em>Sixty seconds</em>. Go.",
    blurb: "Three random objects appear. Build a story that contains all three.",
    how: [
      "Show the three objects. Start a 60-second timer immediately.",
      "Students write or plan silently — no talking during the minute.",
      "Take two or three stories. Cap them at 30 seconds each or one kid takes the whole block.",
      "Vote for the story that used the third object best, not the funniest one."
    ],
    say: "“All three. Sixty seconds. Starts now.”",
    why: "A hard constraint plus a short clock produces more creative output than an open prompt."
  },

  "caption-this": {
    name: "Caption This",
    icon: "✏️",
    tint: "blush",
    render: "caption",
    band: "pink",
    direction: "One line only. <em>Make somebody laugh</em>.",
    blurb: "A strange scene appears. Students write the best caption. Share and vote.",
    how: [
      "Show the scene. Give a 90-second writing window.",
      "Set the bar out loud: a caption is one line, not a paragraph.",
      "Collect four or five on the board with no names attached.",
      "Class votes. Anonymity is what gets the shy writers to submit."
    ],
    say: "“One line. It has to make somebody in this room make a noise.”",
    why: "Short high-stakes writing with a real audience beats a long low-stakes prompt every time."
  },

  "would-you-survive": {
    name: "Would You Survive?",
    icon: "🧭",
    tint: "moss",
    render: "quad",
    band: "mint",
    direction: "Pick a number. Be ready to <em>defend it</em>.",
    blurb: "A scenario with four possible decisions. Choose, defend, then find out.",
    how: [
      "Read the scenario. Read all four options before anyone commits.",
      "Everyone picks — fingers 1 through 4 on the count of three.",
      "Take one defender per option, in order.",
      "Reveal what actually happens. Argue about it. That argument is free discussion practice."
    ],
    say: "“Pick a number. You're stuck with it. On three — one, two, three.”",
    why: "Consequence-based choices make students justify decisions, not just express preferences."
  },

  "beat-the-teacher": {
    name: "Beat the Teacher",
    icon: "⚡",
    tint: "amber",
    art: "img/beat-the-teacher.webp",
    render: "rapid",
    band: "butter",
    direction: "Work fast. <em>No calculators</em>.",
    blurb: "Five rapid questions. Students race you — and they will absolutely try.",
    how: [
      "Announce the score: class 0, you 0. Say you have never lost. This is a lie and they know it.",
      "Reveal one question at a time. First correct answer wins the point.",
      "Answer a couple yourself — including one you get wrong on purpose.",
      "Final score goes on the board and stays there until next time."
    ],
    say: "“Five questions. I get to answer too. I have never lost to a class this size.”",
    why: "Retrieval practice disguised as a competition produces more attempts than a worksheet."
  },

  "mystery-zoom": {
    name: "Mystery Zoom",
    icon: "🔬",
    tint: "sky",
    art: "img/mystery-zoom.webp",
    render: "zoom",
    band: "mint",
    direction: "Zoom out every 15 seconds <em>until someone guesses it</em>.",
    blurb: "Zoomed way in. Zoom out every few seconds until someone shouts it.",
    how: [
      "Start fully zoomed in. Take guesses immediately, even absurd ones.",
      "Zoom out one step every 15–20 seconds.",
      "Rule: once you guess, you can't guess again until the next zoom step. It keeps three kids from running it.",
      "Reveal. Then ask what the giveaway was."
    ],
    say: "“Guess early. Wrong guesses are free.”",
    why: "Progressive reveal keeps every student in the game long after a normal question would be over."
  }
};

/* The homepage launcher — the teacher's situation, not the subject. */
const SITUATIONS = [
  { id: "walked-in",     icon: "🚪", label: "They just walked in",       sub: "Start class.",           tint: "mint"   },
  { id: "need-energy",   icon: "⚡", label: "They need some energy",     sub: "Wake them up.",          tint: "butter" },
  { id: "too-much",      icon: "💥", label: "They have way too much energy", sub: "Bring it down.",     tint: "blush"  },
  { id: "finished-early",icon: "🕐", label: "We finished early",         sub: "Fill the time.",         tint: "sky"    },
  { id: "switching",     icon: "🔄", label: "We're switching activities",sub: "Smooth the transition.", tint: "lilac"  },
  { id: "thinking",      icon: "🧠", label: "I want them thinking",      sub: "Give me a challenge.",   tint: "mint"   },
  { id: "talking",       icon: "💬", label: "I want them talking",       sub: "Start a conversation.",  tint: "pink"   },
  { id: "review",        icon: "📋", label: "We need to review",         sub: "Sneak in some learning.",tint: "sky"    },
  { id: "surprise",      icon: "✨", label: "Surprise me",               sub: "I don't care. Just give me something.", tint: "butter" }
];

const TIMES    = [2, 5, 10, 15];
const GRADES   = [ { id: "k2", label: "K-2" }, { id: "35", label: "3-5" }, { id: "68", label: "6-8" } ];
const SUBJECTS = [
  { id: "math",   label: "Math" },
  { id: "ela",    label: "ELA" },
  { id: "science",label: "Science" },
  { id: "social", label: "Social Studies" },
  { id: "sel",    label: "SEL" }
];
const ENERGY = [
  { id: "low",    label: "Low",    note: "Calm them down" },
  { id: "medium", label: "Medium", note: "Steady and focused" },
  { id: "high",   label: "High",   note: "Loud on purpose" }
];
