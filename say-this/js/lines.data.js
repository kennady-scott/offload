/* Say This — authored response library.
   Deliberately NOT generated: a teacher opens this mid-moment, so it has to be
   instant and every line has to be one you'd actually say out loud.

   Four registers, always in this order:
     lowkey    — least attention possible, keeps the lesson moving, no audience
     supportive— names the hard part, offers a way in
     firm      — a clear boundary, non-negotiable, still respectful
     private   — later, one to one, curious rather than punitive

   Rule: no pronouns and no names inside the spoken lines. Teachers add the name
   themselves, and guessing a student's pronouns in a script is not ours to do. */

const SITUATIONS = [
  {
    id: "wont-start", emoji: "✋", label: "Won't start", hint: "They're just sitting there.",
    restate: "A student won't start their work.",
    log: "{who} did not begin assigned work after a verbal prompt.",
    sets: [
      { lowkey:    "Hey, get the first one started. I'll come back in two minutes.",
        supportive:"Looks like getting started is the hard part. Want me to do the first one with you?",
        firm:      "You don't have to like the assignment, but you do need to begin. Start with number one.",
        private:   "I noticed starting has been tough lately. What's getting in the way?" },
      { lowkey:    "Number one only. That's all I'm asking for right now.",
        supportive:"Would it help to talk it through first, or would you rather I just point at where to start?",
        firm:      "I need to see something on that page before I come back around.",
        private:   "When you sit down and the page is blank, what's going through your head?" },
      { lowkey:    "I'm setting a timer for three minutes. See how far you get.",
        supportive:"Big page. Let's cover everything except the first question so it's not so much at once.",
        firm:      "This isn't optional work. Pick up your pencil and start where you can.",
        private:   "I want to figure out a better way to help you get going. What's worked before?" }
    ]
  },
  {
    id: "talking-over", emoji: "🗣️", label: "Talking over me", hint: "I can't get a word in.",
    restate: "A student keeps talking while you're teaching.",
    log: "{who} talked over instruction after being asked to wait.",
    sets: [
      { lowkey:    "I'll wait.",
        supportive:"I can tell you've got something to say. Hold it for sixty seconds and I'll come to you.",
        firm:      "I need you to stop talking while I'm giving directions. We'll talk after.",
        private:   "I keep having to pause for you during instructions. What's going on there?" },
      { lowkey:    "Give me thirty seconds and the floor is yours.",
        supportive:"Write it down so you don't lose it — I want to hear it, just not right now.",
        firm:      "One person talks at a time in here, and right now that's me.",
        private:   "You have good things to add. I need help with the timing. Ideas?" },
      { lowkey:    "Pausing until we're all here.",
        supportive:"Is this about the work, or about something else? If it's the work, I'll take it now.",
        firm:      "That's twice. I'm asking you directly to let me finish.",
        private:   "When I'm talking and you jump in, the class loses the thread. Can we come up with a signal?" }
    ]
  },
  {
    id: "phone", emoji: "📱", label: "Phone", hint: "It's out again.",
    restate: "A student's phone is out.",
    log: "{who} had a phone out during instruction after being asked to put it away.",
    sets: [
      { lowkey:    "Phone away, please.",
        supportive:"If something's going on at home, tell me and we'll deal with it. Otherwise it needs to go away.",
        firm:      "Phone in the bag, not the pocket. I'll be watching for it.",
        private:   "The phone's been out a lot this week. Is something happening I should know about?" },
      { lowkey:    "Face down or in the bag — your call.",
        supportive:"I'm not trying to make this a thing. Put it away and we're good.",
        firm:      "This is the second time I've asked. Put it away now, or bring it to me.",
        private:   "I don't want to spend our time on the phone thing. What would actually help you leave it alone?" },
      { lowkey:    "Not right now.",
        supportive:"Ten more minutes and then there's a break. Can it wait that long?",
        firm:      "The phone is out of bounds during instruction. Away, please.",
        private:   "Every day this comes up and neither of us enjoys it. What's a plan we can both live with?" }
    ]
  },
  {
    id: "arguing", emoji: "💬", label: "Arguing", hint: "Everything is a debate.",
    restate: "A student is arguing with you about the task or the rule.",
    log: "{who} argued with the teacher about a direction rather than following it.",
    sets: [
      { lowkey:    "Maybe so. Start anyway.",
        supportive:"You might be right, and I want to hear it — just not in the middle of class. Catch me after.",
        firm:      "This isn't a negotiation. I've told you what to do.",
        private:   "You push back on a lot of my directions. I'd rather understand why than keep going round." },
      { lowkey:    "Noted. Number one.",
        supportive:"I can tell this feels unfair. Do it now, and let's talk about it when the room isn't watching.",
        firm:      "I'm not debating this during class. Do the work.",
        private:   "When you disagree with me, what would you want me to do differently?" },
      { lowkey:    "We can talk about it later. Right now, page forty-two.",
        supportive:"You're making an argument, not just complaining — I appreciate that. It still has to wait.",
        firm:      "I've given you the direction twice. The next step is a conversation outside.",
        private:   "I want you to be able to disagree with me. There's a way to do it that works better than this." }
    ]
  },
  {
    id: "refusing", emoji: "🚫", label: "Refusing", hint: "Flat no.",
    restate: "A student is flatly refusing to do what you asked.",
    log: "{who} declined a direct request to begin the assigned task.",
    sets: [
      { lowkey:    "Okay. I'll check back in five.",
        supportive:"You don't have to do all of it. What part could you do?",
        firm:      "You're choosing not to right now. I'm going to ask again in a minute, and I'd rather not go further than that.",
        private:   "You said no today and I let it go in the moment. Now I want to know what that no was about." },
      { lowkey:    "I heard you. The work's still here when you're ready.",
        supportive:"Is this a 'I can't' or a 'I won't'? They're different and I'll help with either.",
        firm:      "I'm not going to argue with you, and I'm not going to pretend this is fine. Take a minute and start.",
        private:   "What would have to be true for you to say yes to that?" },
      { lowkey:    "That's your call for now.",
        supportive:"Do you want a minute first? You can take one and then start.",
        firm:      "This is the part where I need you to do it anyway. I'll be back in two minutes.",
        private:   "I don't want a repeat of today. What's a signal you could give me instead of a flat no?" }
    ]
  },
  {
    id: "shutdown", emoji: "😶", label: "Shutdown", hint: "Head down, nothing.",
    restate: "A student has shut down completely.",
    log: "{who} disengaged from the lesson and did not respond to check-ins.",
    sets: [
      { lowkey:    "I'm going to leave you for a few minutes. I'll come back.",
        supportive:"You don't have to talk. Thumbs up if you want me to come back later, thumbs down if you want help now.",
        firm:      "I'm not going to push you right now, but I'm not going to forget about you either.",
        private:   "You went quiet today. I'm not in trouble mode — I just want to know if you're okay." },
      { lowkey:    "Sitting this one out is okay for now.",
        supportive:"Want the short version of the assignment, or want to just breathe for a bit?",
        firm:      "I'll give you space, and in ten minutes I'm going to need something from you.",
        private:   "Does that happen a lot, where everything just gets too loud?" },
      { lowkey:    "No questions. I'll be nearby.",
        supportive:"I put a paper next to you. No pressure to touch it.",
        firm:      "I'm going to check in every few minutes. That's not me nagging, that's me not leaving you alone in it.",
        private:   "When you shut down like that, what actually helps? What makes it worse?" }
    ]
  },
  {
    id: "disrespect", emoji: "😤", label: "Disrespect", hint: "That was rude.",
    restate: "A student said something disrespectful.",
    log: "{who} spoke disrespectfully to the teacher.",
    sets: [
      { lowkey:    "That one landed wrong. Try it again.",
        supportive:"I don't think you meant it the way it came out. Want to redo it?",
        firm:      "You don't talk to me that way. Step outside and we'll reset.",
        private:   "What you said earlier stuck with me. I want to hear what was actually going on." },
      { lowkey:    "Nope. Rephrase.",
        supportive:"Something's clearly up, because that's not how you usually talk to me.",
        firm:      "That was disrespectful, and I'm not going to pretend it wasn't. We're dealing with it.",
        private:   "I'm not looking for an apology speech. I want to know what set that off." },
      { lowkey:    "I'll let you take that back.",
        supportive:"I'd rather hear what's really bothering you than the version that comes out sideways.",
        firm:      "Stop. That's the line, and you know it.",
        private:   "You and I are fine. I still need that not to happen again — help me understand it." }
    ]
  },
  {
    id: "out-of-seat", emoji: "🚶", label: "Out of seat", hint: "Wandering again.",
    restate: "A student keeps getting out of their seat.",
    log: "{who} left the assigned seat repeatedly during work time.",
    sets: [
      { lowkey:    "Back to your seat, thanks.",
        supportive:"Do you need a real break, or do you just need to move? Those get different answers from me.",
        firm:      "You need to be in your seat during work time. That's not negotiable.",
        private:   "You're up a lot. I'm not mad about it — I want to build in a break that actually works." },
      { lowkey:    "Seat.",
        supportive:"Take a lap to the pencil sharpener and come straight back. That's the deal.",
        firm:      "Sit down, please. Now.",
        private:   "What makes sitting still hard on days like today?" },
      { lowkey:    "Where are you headed? Okay — straight back.",
        supportive:"Want to move your seat somewhere you'd be less tempted to wander?",
        firm:      "I've asked twice. I need you seated before I move on.",
        private:   "Let's set up a break you can take without asking. What would it look like?" }
    ]
  },
  {
    id: "peer-conflict", emoji: "⚡", label: "Conflict with peer", hint: "It's about another kid.",
    restate: "A student is in conflict with another student.",
    log: "{who} was involved in a conflict with another student.",
    sets: [
      { lowkey:    "Separate for now. We'll sort it out after.",
        supportive:"I'm not deciding who's right yet. I just need you two apart until we can talk.",
        firm:      "This stops here. Different sides of the room, and no more back and forth.",
        private:   "Tell me your side. I'm going to hear the other one too, and then we'll figure it out." },
      { lowkey:    "Not right now. Turn around.",
        supportive:"You look genuinely upset. Do you want a minute in the hall before we deal with it?",
        firm:      "You don't get to handle this yourself in the middle of my class.",
        private:   "What do you actually want to happen with this? Fixed, or just left alone?" },
      { lowkey:    "Eyes on your own work. We'll deal with it after.",
        supportive:"I believe you that something happened. I need it paused, not ignored.",
        firm:      "One more word across the room and we're doing this in the office instead.",
        private:   "Has this been building for a while, or did it start today?" }
    ]
  },
  {
    id: "distracting", emoji: "🎯", label: "Distracting others", hint: "Taking the room with them.",
    restate: "A student is pulling other students off task.",
    log: "{who} disrupted the work of nearby students.",
    sets: [
      { lowkey:    "You're taking three people with you. Bring it back.",
        supportive:"You've got a lot of influence in here. I'd rather you used it the other direction.",
        firm:      "You're stopping other people from working. Move up here, please.",
        private:   "When you're on, this class is better. When you're off, so are they. That's a lot of power." },
      { lowkey:    "Just you. Not the table.",
        supportive:"Finish yours and then I'll let you help someone — you're good at explaining it.",
        firm:      "I'm moving your seat. This isn't a punishment, it's because the work isn't happening.",
        private:   "What would make it easier for you to sit near your friends and still get work done?" },
      { lowkey:    "Volume down, work up.",
        supportive:"If you're done, tell me and I'll give you something. If you're stuck, tell me that instead.",
        firm:      "That's the second table you've pulled into it. Up here with me.",
        private:   "I keep moving you and it isn't fixing it. What do you think would?" }
    ]
  },
  {
    id: "escalating", emoji: "🔥", label: "Escalating", hint: "This is getting big.",
    restate: "A student is escalating and it's getting bigger.",
    log: "{who} escalated during class and required support to de-escalate.",
    safety: "If anyone's safety is at risk, get support first — the words come after.",
    sets: [
      { lowkey:    "I'm going to stop talking for a minute.",
        supportive:"You're not in trouble right now. I just want this to get smaller.",
        firm:      "I need you to step into the hall with me. Now, please.",
        private:   "That got big fast. What was happening right before it did?" },
      { lowkey:    "Take the time you need. I'm right here.",
        supportive:"You don't have to explain it yet. Breathe first, talk after.",
        firm:      "This is the point where I have to involve someone else. I'd rather not, so help me out.",
        private:   "What's the earliest moment you noticed it starting? That's the one I want to catch next time." },
      { lowkey:    "Okay. I'm not going to argue with you.",
        supportive:"Do you want to go to the counselor, or the hall, or just have me back off?",
        firm:      "Stop. Look at me. We're going to walk out this door together.",
        private:   "Next time, what could I do at the very beginning that would help instead of make it worse?" }
    ]
  },
  {
    id: "wont-transition", emoji: "⏳", label: "Won't transition", hint: "Still on the last thing.",
    restate: "A student won't move on to the next activity.",
    log: "{who} did not move to the next activity when directed.",
    sets: [
      { lowkey:    "Two minutes, then we're moving.",
        supportive:"I know you're not finished. Mark where you are so you can come back to it.",
        firm:      "We're moving on now. Books closed.",
        private:   "Switching tasks seems to be the hard part for you. What would make it easier?" },
      { lowkey:    "Pens down, eyes up.",
        supportive:"Would a warning before we switch help? I can give you one every time.",
        firm:      "I need you with the rest of us. Right now.",
        private:   "Is it that you're not done, or that you don't want to stop?" },
      { lowkey:    "Finish that sentence and then we go.",
        supportive:"You can have the first five minutes of tomorrow to finish it. Deal?",
        firm:      "This is the transition. I'm not asking again.",
        private:   "Let's build in a landing spot so you're not cut off mid-thought every time." }
    ]
  }
];

const REGISTERS = [
  { key: "lowkey",     label: "Low-key",          blurb: "Least attention possible",  tone: "sky"   },
  { key: "supportive", label: "Supportive",       blurb: "Name it, offer a way in",   tone: "mint"  },
  { key: "firm",       label: "Firm",             blurb: "A clear line, still kind",  tone: "amber" },
  { key: "private",    label: "Private follow-up",blurb: "Later, one to one",         tone: "lilac" }
];
