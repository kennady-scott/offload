/* Get Them Back — authored move library.
   Say This gives you a LINE for one student. This gives you a MOVE for the room.

   A move is something you physically do in the next sixty seconds. Not a strategy,
   not a framework, not a thing to try next week. If it can't be started before the
   sentence finishes, it doesn't belong in here.

   Move shape:
     name   imperative, short enough to read at a glance while a class is unravelling
     cost   what it costs you — seconds, minutes, or the rest of the block
     do     the actual instruction. Concrete. Second person.
     say    optional line to read out loud to launch it. Omit when the move is silent.
     why    ONE short clause. The spec says no pedagogy essay, so this is a clause, not a paragraph.

   Rule, same as Say This: no pronouns for students inside spoken lines. We don't
   know them and we're not guessing. */

const SITUATIONS = [

/* ─────────────────────────────────────────────────────────── */
{
  id: "dead", emoji: "😴", label: "They're dead", hint: "Nobody's awake.",
  restate: "The room has flatlined.",
  read: "Low energy is almost always physical before it is motivational.",
  sets: [
    [
      { name: "Everybody up",
        cost: "20 seconds",
        do: "Everyone stands. That's the whole instruction. Don't give the next one until every person is actually on their feet.",
        say: "“Everyone on your feet. I'll wait.”",
        why: "Changing posture beats talking about effort." },
      { name: "Turn and talk, both of you",
        cost: "2 minutes",
        do: "Pose one question, send it to partners, and require both people to speak. Walk the room and listen for the pair that isn't talking.",
        say: "“Turn to the person next to you. Both of you have to say something. Go.”",
        why: "Thirty silent listeners become fifteen people talking." },
      { name: "Hand over the marker",
        cost: "rest of the segment",
        do: "Stop presenting. Give a student the marker and have them record the next three points while the class feeds them.",
        why: "They cannot doze through a job." }
    ],
    [
      { name: "Change the light and the air",
        cost: "30 seconds",
        do: "Open the blinds, kill half the overheads, prop the door. Do it mid-sentence without announcing it.",
        why: "A room that looks different feels different." },
      { name: "Stand if you agree",
        cost: "90 seconds",
        do: "Fire six statements about the content. Stand for yes, sit for no, no talking. Move fast enough that they're up and down constantly.",
        say: "“Stand if you agree. Sit if you don't. No talking, just move.”",
        why: "Movement and a comprehension check in the same ninety seconds." },
      { name: "Skip to the interesting part",
        cost: "free",
        do: "Abandon the build-up. Jump straight to the most surprising thing in today's lesson and backfill later if there's time.",
        why: "The scaffolding was for you, not them." }
    ],
    [
      { name: "Sixty seconds, pen doesn't stop",
        cost: "1 minute",
        do: "One question on the board. Everyone writes without stopping for sixty seconds. Total silence, including you.",
        say: "“Sixty seconds. Pens don't stop. It doesn't have to be good.”",
        why: "Silence wakes a dead room faster than enthusiasm does." },
      { name: "Ask the whole room at once",
        cost: "30 seconds",
        do: "Switch to choral response. Ask three quick questions the class answers out loud together, all at the same time.",
        why: "Nobody can hide, and nobody is singled out." },
      { name: "Put a clock on it",
        cost: "10 seconds",
        do: "Whatever they're supposed to be doing, put a visible four-minute countdown on the board and say what happens when it ends.",
        why: "Vague time makes everything feel optional." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "nobody-talks", emoji: "🤐", label: "Nobody will talk", hint: "Total silence, and not the good kind.",
  restate: "You asked a question and got nothing.",
  read: "Usually the risk is too high or the question is too big — rarely that they don't know.",
  sets: [
    [
      { name: "Make them write it first",
        cost: "60 seconds",
        do: "Same question, but everyone writes an answer before anyone speaks. Then call on someone and let them read what's on their page.",
        say: "“Write it down first. Then I'll ask, and you can just read me what you wrote.”",
        why: "Reading is far less exposing than inventing out loud." },
      { name: "Shrink the audience to one",
        cost: "90 seconds",
        do: "Send the question to partners. Then ask a pair to report what their partner said, not what they said.",
        why: "Speaking for someone else carries none of the risk." },
      { name: "Ask a worse question",
        cost: "free",
        do: "Replace the open question with a binary one. “A or B — hands up for A.” Get any answer on the table, then open it back up.",
        why: "A closed question is a doorway, not a dead end." }
    ],
    [
      { name: "Count to ten and say nothing",
        cost: "10 seconds",
        do: "Ask the question, then stand still and count to ten in your head. Do not rephrase, do not fill it, do not rescue them.",
        why: "Most teachers wait about a second. The answer usually arrives at seven." },
      { name: "Everyone answers at once",
        cost: "1 minute",
        do: "Whiteboards, paper, or fingers. Everyone writes, everyone holds it up on your count. Nobody goes first.",
        say: "“Everyone writes. Hold it up on three. Nobody's going first, we're all going at once.”",
        why: "Simultaneous removes the cost of being the volunteer." },
      { name: "Ask for a wrong answer",
        cost: "30 seconds",
        do: "Ask for a confidently, obviously wrong answer first. Take two or three. Then ask what makes them wrong.",
        say: "“Give me a definitely-wrong answer. I want the worst one in the room.”",
        why: "Nobody is afraid of being wrong when wrong is the assignment." }
    ],
    [
      { name: "Name the silence",
        cost: "15 seconds",
        do: "Say what's happening out loud, without irritation, then wait anyway.",
        say: "“This is a hard question and nobody wants to be first. That's fair. I'm still going to wait.”",
        why: "Naming it removes the standoff." },
      { name: "Give them the sentence",
        cost: "20 seconds",
        do: "Put a frame on the board — “I think ___ because ___” — and ask them to fill it in rather than answer.",
        why: "The blank page is the problem, not the thinking." },
      { name: "Vote with your body",
        cost: "45 seconds",
        do: "Turn the question into a physical position: stand on this side for one answer, that side for the other, middle if unsure.",
        why: "Committing physically is easier than committing verbally." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "too-wild", emoji: "🤯", label: "Too wild", hint: "It's getting away from me.",
  restate: "The room is louder than you are.",
  read: "Volume is contagious. Whatever you do next, they will match it.",
  sets: [
    [
      { name: "Stop and go completely still",
        cost: "30–60 seconds",
        do: "Stop mid-sentence. Stand front and centre, silent, hands down, looking at the room. Do not shush. Do not start again until it's quiet.",
        why: "A teacher who has stopped is more alarming than one still shouting." },
      { name: "Count down from five, once",
        cost: "10 seconds",
        do: "Say the number and what happens at zero. Then count. Then do exactly what you said, with no second countdown.",
        say: "“Five. At zero everyone is in a seat and quiet. Four. Three…”",
        why: "The countdown only works if zero has ever meant anything." },
      { name: "One physical instruction",
        cost: "20 seconds",
        do: "Feet flat, hands on the desk, eyes on me. One instruction, visibly checkable, no explanation attached.",
        why: "You can see compliance instantly, so you can name it instantly." }
    ],
    [
      { name: "Drop your volume, not raise it",
        cost: "free",
        do: "Start speaking noticeably quieter than the room. Keep going. Let them lean in or miss it.",
        why: "Shouting over a loud room teaches them that loud is the baseline." },
      { name: "Give the energy thirty legal seconds",
        cost: "1 minute",
        do: "Announce thirty seconds of talking to anyone about anything. Time it out loud. Then hard stop, and mean it.",
        say: "“Thirty seconds. Talk to whoever you want. Then we're done — and I mean done.”",
        why: "Suppressed energy leaks; spent energy doesn't." },
      { name: "Break the configuration",
        cost: "2 minutes",
        do: "Move people. Split the two groups that are feeding each other, or reseat the whole room by a rule — birthday month, alphabetical, anything.",
        why: "The seating chart is usually the actual problem." }
    ],
    [
      { name: "One instruction at a time",
        cost: "free",
        do: "Stop stacking directions. Give one, wait for it to be done, then give the next. Nothing multi-part until the room is back.",
        why: "Chaotic rooms cannot hold three-step directions, and trying makes it worse." },
      { name: "Put the next three minutes on the board",
        cost: "45 seconds",
        do: "Write exactly what is happening and when. Read it out. Point at it every time someone asks.",
        why: "Wild is often just uncertain." },
      { name: "Reset at the door",
        cost: "3 minutes",
        do: "Send them into the hallway and bring them back in the way you actually want. Yes, it costs three minutes. It buys the other forty.",
        say: "“Everyone out. We're going to come in again, properly.”",
        why: "A do-over resets the norm without a lecture." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "dont-understand", emoji: "😕", label: "They don't understand", hint: "The blank stare.",
  restate: "It isn't landing and you can see it.",
  read: "Saying it again, louder and slower, is the one thing that reliably doesn't work.",
  sets: [
    [
      { name: "Find out who, right now",
        cost: "20 seconds",
        do: "Fist to five, everyone at once, eyes on you not each other. Count the room out loud so they know you actually looked.",
        say: "“Fist to five. Five means you could teach it. Fist means I lost you. Be honest — this is how I know what to do next.”",
        why: "You cannot fix a gap you haven't measured." },
      { name: "Do one together, slowly",
        cost: "3–4 minutes",
        do: "Abandon the plan. Work a single problem start to finish, narrating every decision, including the ones that feel too obvious to say.",
        why: "The step you skip is usually the step they're stuck on." },
      { name: "Make them explain it back",
        cost: "2 minutes",
        do: "Partners explain the process to each other. Tell them plainly: if you can't say it, that's the answer, and it's useful information.",
        say: "“Tell your partner what we're doing. If you can't get through it, that's not a failure — that's the thing I need to know.”",
        why: "Explaining exposes the gap that nodding hides." }
    ],
    [
      { name: "Find the exact sentence it broke",
        cost: "90 seconds",
        do: "Walk back through the steps out loud and ask them to stop you at the precise line where it stopped making sense.",
        say: "“Stop me the second I hit the part where you lost it. Not the general area — the exact line.”",
        why: "Confusion has a location, and they usually know it." },
      { name: "Give a second example, not a second explanation",
        cost: "2 minutes",
        do: "Don't restate. Do a different example of the same thing and let them compare the two.",
        why: "Two instances teach the pattern; one instance repeated teaches nothing new." },
      { name: "Let the kid who has it explain",
        cost: "2 minutes",
        do: "Find someone who just got it and have them explain it. Stay out of it. Resist correcting the wording.",
        why: "They've been confused more recently than you have." }
    ],
    [
      { name: "Cut the problem in half",
        cost: "free",
        do: "Remove a step. Teach the smaller version until it's solid, then add the step back.",
        why: "Most 'they don't get it' is two skills stacked, not one." },
      { name: "Do it wrong on purpose",
        cost: "2 minutes",
        do: "Work the problem incorrectly on the board and ask them to catch you. Don't tell them where the error is.",
        why: "Hunting an error is active; watching a correct solution is not." },
      { name: "Stop talking, move to paper",
        cost: "4 minutes",
        do: "End the explanation. Everyone tries one on paper while you circulate. You'll learn more in four minutes of walking than ten of talking.",
        why: "You cannot diagnose from the front of the room." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "dont-care", emoji: "🙄", label: "They don't care", hint: "Why are we doing this.",
  restate: "They've decided this isn't worth their attention.",
  read: "Apathy is usually a reasonable response to something that hasn't been justified.",
  sets: [
    [
      { name: "Say the quiet part",
        cost: "1 minute",
        do: "Name it without sarcasm and ask a real question. Then take the answer seriously, even if it's unflattering.",
        say: "“I can tell this isn't landing. Genuinely — what would make this worth doing?”",
        why: "Being asked honestly is rare enough to get an honest answer." },
      { name: "Connect it to a decision they'll actually make",
        cost: "90 seconds",
        do: "Not a career, not college. A decision in the next year: a contract, a rent split, a claim someone makes online, an argument they'll want to win.",
        why: "“You'll need this later” has never once worked." },
      { name: "Offer two options",
        cost: "30 seconds",
        do: "Same objective, two routes. Let them pick. The choice can be nearly meaningless and still change the room.",
        say: "“Two ways to do this. You pick.”",
        why: "Autonomy is doing most of the work here, not the options." }
    ],
    [
      { name: "Make it a contest against someone",
        cost: "free",
        do: "Table against table, or this class against your other section. Keep the score visible. No prize — the score is the prize.",
        why: "They don't care about the content; they care about winning." },
      { name: "Cut it in half, out loud",
        cost: "free",
        do: "Announce it's now half as long. Then actually hold that line — finish early and do something else.",
        say: "“New deal. Five questions, not ten. Do those five properly.”",
        why: "A shorter task they finish beats a longer one they abandon." },
      { name: "Let them argue it's pointless",
        cost: "2 minutes",
        do: "Invite the case against. Take it seriously, then answer honestly — including “part of this genuinely is just required.”",
        why: "Teenagers forgive a boring task. They don't forgive being sold one." }
    ],
    [
      { name: "Show the finished thing first",
        cost: "90 seconds",
        do: "Put up the end product — a strong example, a real one — before you explain any of the steps.",
        why: "Nobody works toward something they can't picture." },
      { name: "Use their example",
        cost: "1 minute",
        do: "Ask for a topic from the room and run the entire lesson's example on that instead of the one you prepared.",
        why: "Ownership of the example is ownership of the work." },
      { name: "Admit the boring part",
        cost: "20 seconds",
        do: "Tell them exactly how long the tedious stretch lasts and what's on the other side of it.",
        say: "“The next six minutes are genuinely tedious. I'm not going to pretend otherwise. Then it gets good.”",
        why: "Honesty about tedium buys more compliance than enthusiasm about it." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "wont-start", emoji: "🐌", label: "Nobody will start", hint: "Everyone's just sitting there.",
  restate: "You released them to work and nothing happened.",
  read: "A room that won't start is usually unclear about what starting looks like.",
  sets: [
    [
      { name: "Do the first one together",
        cost: "2 minutes",
        do: "Work question one on the board as a class, then release them to two onwards. Don't skip this because it feels like babying them.",
        why: "The first item is a wall; everything after it is a slope." },
      { name: "Visible timer, right now",
        cost: "10 seconds",
        do: "Three minutes on the board where everyone can see it, with a stated checkpoint at the end.",
        say: "“Three minutes. At the end I'm asking three people what they've got.”",
        why: "A countdown they can see converts later into now." },
      { name: "Be at the third desk in ten seconds",
        cost: "free",
        do: "Don't sit down. Don't go to your computer. Be standing next to someone before the room has decided whether to start.",
        why: "Proximity starts more work than instructions do." }
    ],
    [
      { name: "Ask for one thing, not the assignment",
        cost: "20 seconds",
        do: "Shrink the ask to something almost insulting in its smallness. Name on the page. Question one only.",
        say: "“Name on the page and question one. That's all I want to see. Nothing else.”",
        why: "The task isn't hard, the size of it is." },
      { name: "Count down to pens moving",
        cost: "15 seconds",
        do: "Count from ten out loud. At zero, every pen should be moving. Then look around and say who's writing.",
        say: "“In ten seconds every pen in here is moving. Ten, nine, eight…”",
        why: "A deadline ten seconds away is the only kind that can't be deferred." },
      { name: "Read the first line together",
        cost: "30 seconds",
        do: "Whole class reads the directions or the first question out loud, in unison. Then release.",
        why: "Half of them hadn't read it." }
    ],
    [
      { name: "Take the choice away for ninety seconds",
        cost: "90 seconds",
        do: "Everyone does the same single item at the same time. No choosing where to begin, no options.",
        why: "Choice at the start is a stalling mechanism." },
      { name: "Stand behind the ones who never start",
        cost: "free",
        do: "Position yourself behind the two or three you already know. Say nothing at all.",
        why: "Silent proximity avoids the confrontation and gets the same result." },
      { name: "Define what started means",
        cost: "20 seconds",
        do: "Say the criterion out loud, then check it against the room in thirty seconds.",
        say: "“Started means your name is on it and you've read question one. That's the bar. Thirty seconds.”",
        why: "They can't meet a standard nobody stated." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "finished-early", emoji: "⏰", label: "Finished too early", hint: "And there's time left.",
  restate: "They're done and the period isn't.",
  read: "Fast usually means shallow. There's almost always a deeper version of the same task.",
  handoff: { label: "Grab a five-minute activity", href: "/before-the-bell/", tool: "Before the Bell" },
  sets: [
    [
      { name: "Make them prove it",
        cost: "2 minutes",
        do: "Pick a finished student and ask them to walk you through number four out loud. Then the next one.",
        say: "“Show me. Talk me through number four like I've never seen it.”",
        why: "Finished and correct are different claims." },
      { name: "How would you teach it?",
        cost: "4 minutes",
        do: "Have them write the explanation they'd give to someone who missed today, in their own words, no jargon.",
        why: "It's the same content at a harder cognitive level, with no new materials." },
      { name: "Write a question that would stump the class",
        cost: "3 minutes",
        do: "Ask for one genuinely hard question on today's content, plus the answer. Collect them and use the best as tomorrow's warm-up.",
        why: "Writing a good question is harder than answering ten." }
    ],
    [
      { name: "Pair the finished with the stuck",
        cost: "5 minutes",
        do: "Explicitly assign it: your job is to get them unstuck without giving the answer. Both people are now working.",
        say: "“You're not doing it for them. You're getting them to the point where they can.”",
        why: "It solves both problems with one instruction." },
      { name: "Six-word summary",
        cost: "2 minutes",
        do: "Exactly six words, no more, no fewer, summarising today. Read a few out.",
        why: "The constraint forces them back into the content." },
      { name: "Find the error you planted",
        cost: "3 minutes",
        do: "Hand them a worked solution with one deliberate mistake and tell them the number of errors, not the location.",
        why: "Knowing there's exactly one turns a vague scan into a search." }
    ],
    [
      { name: "Start tomorrow now, badly",
        cost: "rest of the period",
        do: "Give them a rough first pass at the next task. Explicitly permit it to be bad — it's a draft nobody grades.",
        why: "Tomorrow starts from something instead of nothing." },
      { name: "The hardest version",
        cost: "5 minutes",
        do: "Same skill, but remove a support: no calculator, no notes, no formula sheet, or double the numbers.",
        why: "Extension by constraint costs you no prep." },
      { name: "Hand them the next five minutes",
        cost: "5 minutes",
        do: "Open Before the Bell, filter to the time you actually have, and put one on the board.",
        why: "This is the exact hole that tool exists to fill." }
    ]
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id: "flopped", emoji: "💥", label: "The activity flopped", hint: "That did not work.",
  restate: "The thing you planned is visibly failing.",
  read: "The cost of continuing a dead activity is always higher than the cost of stopping it.",
  sets: [
    [
      { name: "Say it out loud and stop",
        cost: "10 seconds",
        do: "Name it plainly, with no self-flagellation, and end it. Then move to the next thing without a pause.",
        say: "“This isn't working. We're stopping. Pens down, look up.”",
        why: "Nothing you do all year buys more credibility than this." },
      { name: "Ask them why it flopped",
        cost: "2 minutes",
        do: "Genuinely ask, and write down what they say where they can see you writing it.",
        say: "“That didn't work. Tell me why — I'll fix it before third period.”",
        why: "They diagnose it accurately, and being asked changes the room." },
      { name: "Go to the fallback",
        cost: "rest of the block",
        do: "The thing you always have — discussion, practice set, read and respond. Use it without apology.",
        why: "A boring plan that works beats a good plan that isn't." }
    ],
    [
      { name: "Keep the goal, drop the format",
        cost: "1 minute",
        do: "Same objective, different vehicle. The gallery walk becomes a discussion. The worksheet becomes a whiteboard race.",
        why: "The content was probably fine; the packaging wasn't." },
      { name: "Salvage the one part that worked",
        cost: "2 minutes",
        do: "Find the single element that had traction and give it the rest of the time. Bin the rest.",
        why: "There's usually one live piece in a dead activity." },
      { name: "Cut to the exit ticket",
        cost: "4 minutes",
        do: "Skip to the check for understanding early. You get the data and they get a clean ending.",
        why: "You still learn what they know, which was the point." }
    ],
    [
      { name: "Turn it into a critique",
        cost: "4 minutes",
        do: "Hand them the problem. How would you fix this activity for the next class? Take it seriously and use one of the ideas.",
        say: "“Right — you're the designers now. How do I fix this for fourth period?”",
        why: "It converts a dead activity into a live one about the same content." },
      { name: "Own it in one sentence and move",
        cost: "15 seconds",
        do: "One sentence, no dwelling, no apology tour. Then immediately state what's happening instead.",
        say: "“That was my call and it didn't work. Here's what we're doing instead.”",
        why: "Watching an adult take responsibility cleanly is worth the lost activity." },
      { name: "Give the time back",
        cost: "rest of the block",
        do: "If there's little left, stop and use it deliberately — a reset, a five-minute activity, an honest conversation. Don't fill it with busywork.",
        why: "They can tell the difference between a plan and filler." }
    ]
  ]
},

];
