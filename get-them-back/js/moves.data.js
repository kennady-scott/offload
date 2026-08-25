/* Get Them Back — authored rescue moves.
   Read while the lesson is actively dying, so: a name, a time cost, and one
   instruction you can carry out in the next ten seconds. No pedagogy essay.

   `bands` is optional. Absent = works at any grade, which is most of them.
   Present = the move needs a skill younger students don't have yet (usually
   independent writing), so it only shows for those bands. */

const STATES = [
  {
    id: "dead", emoji: "😴", label: "They're dead", hint: "No energy, no response.",
    restate: "The room is flat and nothing is coming back.",
    moves: [
      { name: "Stand and Deliver", mins: 1,
        do: "Everyone stands. Give me an answer and you sit down. It ends when the last person is seated." },
      { name: "Two-Minute Sprint", mins: 2,
        do: "Visible timer. \"Two minutes, as many as you can, go.\" Speed beats depth when the room is flat." },
      { name: "Change the Room", mins: 1,
        do: "Move them. Switch seats, work standing, take the question to the whiteboard. The body wakes the brain." },
      { name: "Countdown Answers", mins: 2,
        do: "Count down from five out loud. On zero every hand holds up 1–4 for their answer. Nowhere to hide." },
      { name: "Turn to Your Neighbor", mins: 1,
        do: "\"Tell the person next to you one thing you remember from the last ten minutes.\" Then take three out loud." },
      { name: "Cold Water", mins: 1,
        do: "Say it out loud: \"This is flat and I can feel it. Sixty seconds of real effort, then we move on.\" Naming it often fixes it." }
    ]
  },
  {
    id: "silent", emoji: "🤐", label: "Nobody will talk", hint: "Dead air after every question.",
    restate: "You ask, and nothing comes back.",
    moves: [
      { name: "Write First, Talk Second", mins: 2,
        do: "Everyone writes an answer before anyone speaks. Then: \"Who wrote something close to this?\" Agreeing is far easier than volunteering." },
      { name: "Would You Rather", mins: 2,
        do: "Turn the question into two defensible options and make them pick a side — hands, or physically move. Then ask why." },
      { name: "Call the Room", mins: 2,
        do: "\"Thirty seconds to think. Then I'm taking three ideas — not necessarily three hands.\" Warn them, then actually do it." },
      { name: "Pass the Pen", mins: 3,
        do: "One sheet per table. Each person adds one line and passes it on. Nobody has to speak to contribute.",
        bands: ["35","68","912"] },
      { name: "Vote, Then Defend", mins: 2,
        do: "Hands for A. Hands for B. Then: \"Someone who voted A — why?\" A vote is a commitment they'll defend." },
      { name: "Borrow an Answer", mins: 1,
        do: "\"Read me anyone's answer — yours or your neighbor's.\" Takes away the risk of being wrong in public." }
    ]
  },
  {
    id: "wild", emoji: "🤯", label: "They're way too wild", hint: "Too much energy, all at once.",
    restate: "There's more energy in the room than the lesson can hold.",
    moves: [
      { name: "Silent Sixty", mins: 1,
        do: "Sixty seconds of complete silence, timed where they can see it, then straight into the work. Do not negotiate the sixty." },
      { name: "Burn It Off", mins: 2,
        do: "Stand, thirty seconds of shaking it out, sit. Suppressing the energy costs more than spending it." },
      { name: "Whisper Only", mins: 3,
        do: "The next task happens entirely in whispers. Making volume the game is easier than fighting it." },
      { name: "Freeze and Reset", mins: 1,
        do: "\"Freeze. Pens down, hands flat, eyes here.\" Wait for all three before you say anything else." },
      { name: "Beat the Clock", mins: 3,
        do: "Hard target, visible timer. Point the energy into a race instead of out the door." },
      { name: "One Voice", mins: 2,
        do: "Hold up an object. Only the person holding it talks. Passing it is slow, which is the point." }
    ]
  },
  {
    id: "lost", emoji: "😕", label: "They don't understand", hint: "Blank faces everywhere.",
    restate: "It isn't landing, and it isn't one or two students.",
    moves: [
      { name: "Back Up One Step", mins: 2,
        do: "Stop and redo the step *before* the one they're stuck on. The confusion is almost never where you think it is." },
      { name: "Show Me With Fingers", mins: 1,
        do: "\"One finger if you're lost, five if you could teach it.\" Now you know whether to reteach or move on." },
      { name: "Worked Example, Out Loud", mins: 3,
        do: "Do the next one yourself on the board, narrating your thinking — including the wrong turns." },
      { name: "Find the Error", mins: 3,
        do: "Put a wrong answer on the board and ask them to find the mistake. Far easier than producing a right one." },
      { name: "Say It Back", mins: 2,
        do: "\"Tell your partner what we're actually being asked to do.\" If they can't, the problem is the directions, not the content." },
      { name: "Two Columns", mins: 2,
        do: "On the board: what we know, what's confusing. Fill the second column together, out loud." }
    ]
  },
  {
    id: "dont-care", emoji: "🙄", label: "They don't care", hint: "Capable, unwilling.",
    restate: "They could do this. They've decided not to.",
    moves: [
      { name: "Make It Shorter", mins: 1,
        do: "Cut the task in half, out loud. \"Just the first three.\" Volume is usually what killed the buy-in." },
      { name: "Give the Why, Once", mins: 1,
        do: "One sentence on why this matters. Not a speech. Then straight back to work." },
      { name: "Choice of Two", mins: 1,
        do: "\"Paragraph or list — your call.\" A small choice buys real effort surprisingly often." },
      { name: "Compete", mins: 3,
        do: "Table against table, points on the board. Cheap, and it works more often than it should." },
      { name: "Ask Them Straight", mins: 2,
        do: "\"What would make this worth doing?\" Then actually use one of the answers." },
      { name: "Lower the Stakes", mins: 1,
        do: "\"This isn't graded. I want your thinking, not your best work.\" Sometimes fear is what reads as apathy." }
    ]
  },
  {
    id: "wont-start", emoji: "🐌", label: "Nobody will start", hint: "Released them, nothing moved.",
    restate: "You've released them to work and the room hasn't moved.",
    moves: [
      { name: "Do the First One Together", mins: 2,
        do: "Work question one on the board with them. Starting is the hard part — take it away." },
      { name: "Everybody Writes One Word", mins: 1,
        do: "\"One word on your page. Any word to do with this.\" A pen that's moving tends to keep moving." },
      { name: "Countdown to Pencils", mins: 1,
        do: "\"Pencils moving in five. Four. Three…\" Absurdly simple. Works constantly." },
      { name: "Circulate Immediately", mins: 2,
        do: "Don't sit down. Walk the room from the second you release them. Presence starts more work than instructions do." },
      { name: "Name the First Step", mins: 1,
        do: "\"What's the very first thing you have to do?\" Ask three different students, then go." },
      { name: "Two Minutes, Then I Check", mins: 2,
        do: "\"Two minutes, then I'm looking at every page.\" A near deadline beats a distant one." }
    ]
  },
  {
    id: "early", emoji: "⏰", label: "We finished way too early", hint: "Time left, plan gone.",
    restate: "The plan is done and there's real time left.",
    seeAlso: { label: "Before the Bell has 130 activities for exactly this", href: "/before-the-bell/" },
    moves: [
      { name: "Make Them Prove It", mins: 3,
        do: "\"If you're done, show me how you know it's right.\" Half the room turns out not to be done." },
      { name: "Teach Your Neighbor", mins: 4,
        do: "Finished students explain it to unfinished ones. Explaining is harder than doing." },
      { name: "Write the Test Question", mins: 3,
        do: "\"Write the question you'd put on the test about this — and the answer.\"",
        bands: ["35","68","912"] },
      { name: "Make It Harder", mins: 3,
        do: "\"Now do it without your notes,\" or \"now do it in one sentence.\" Same content, higher bar." },
      { name: "Rank and Defend", mins: 4,
        do: "\"Put your answers in order, most to least important, and defend first place.\"",
        bands: ["35","68","912"] },
      { name: "Exit Ticket Early", mins: 2,
        do: "Give the three-question version now and collect it. Ends the period cleanly instead of dribbling out." }
    ]
  },
  {
    id: "flopped", emoji: "💥", label: "The activity flopped", hint: "It just died in front of you.",
    restate: "The thing you planned is not working and everyone can tell.",
    moves: [
      { name: "Say It Out Loud", mins: 1,
        do: "\"That didn't work. My fault, not yours. Here's what we're doing instead.\" Naming it buys the room back." },
      { name: "Salvage One Piece", mins: 2,
        do: "Keep the one part that was working, drop the rest. Don't try to rescue the whole thing." },
      { name: "Go to Paper", mins: 2,
        do: "Abandon the format. Same content, on paper, individually, quietly. Reset the conditions." },
      { name: "Hard Pivot", mins: 1,
        do: "Switch to something completely different for five minutes. Come back only if there's time. Don't grind." },
      { name: "Ask What Broke", mins: 3,
        do: "\"What made that confusing?\" Fast, honest, and it usually hands you the fix in one sentence." },
      { name: "Bank It for Tomorrow", mins: 1,
        do: "Stop it. Tell them you'll fix it and bring it back. Following through tomorrow is worth more than forcing it now." }
    ]
  }
];
