/* Home Note — composed, not generated.
   A note home is read by a worried parent and sometimes forwarded to an
   administrator. Every sentence here is one a person wrote and checked.

   Structure: greeting → opener (situation + tone) → THE TEACHER'S OWN WORDS,
   verbatim → what happens next (situation + tone) → sign-off. The teacher's
   sentence is never rewritten; that is the whole promise of the tool.

   Copy is deliberately PRONOUN-FREE, using {student} throughout. Automatic
   pronoun insertion is not worth the risk: verb agreement across she/he/they is
   exactly how a tool produces "they is", in a message about someone's child. */

const SITUATIONS = [
  { id: "great",     emoji: "🌟", label: "Something great happened", hint: "Good news, sent on purpose." },
  { id: "missing",   emoji: "📄", label: "Missing work",             hint: "Work not coming in." },
  { id: "behavior",  emoji: "⚡", label: "Behavior",                  hint: "Something happened in class." },
  { id: "attend",    emoji: "🕘", label: "Attendance",                hint: "Absent or late a lot." },
  { id: "grade",     emoji: "📉", label: "Grade concern",             hint: "The grade is slipping." },
  { id: "social",    emoji: "💬", label: "Social concern",            hint: "Friendship or wellbeing." },
  { id: "meeting",   emoji: "🤝", label: "Need a meeting",            hint: "Let's talk properly." },
  { id: "followup",  emoji: "↩️", label: "Following up",              hint: "We spoke before." }
];

const TONES   = [
  { id: "warm",     label: "Warm",            hint: "Friendly, no alarm" },
  { id: "straight", label: "Straightforward", hint: "Plain and clear" },
  { id: "firm",     label: "Firm",            hint: "Serious, still respectful" }
];
const LENGTHS = [
  { id: "text",     label: "Text",           hint: "A couple of lines" },
  { id: "short",    label: "Short email",    hint: "A few sentences" },
  { id: "detailed", label: "Detailed email", hint: "Full context" }
];

/* {student} {class} {teacher} are filled from the roster and your profile. */
const OPENERS = {
  great: {
    warm:     "I wanted to send some good news about {student} rather than wait for a reason to worry you.",
    straight: "I'm writing with something positive about {student} in {class}.",
    firm:     "I want this on the record, because it deserves to be: {student} did something worth noticing."
  },
  missing: {
    warm:     "I wanted to let you know about some work {student} hasn't turned in yet, while it's still easy to fix.",
    straight: "I'm writing about missing work for {student} in {class}.",
    firm:     "I need to make you aware that {student} has missing work that is now affecting the grade."
  },
  behavior: {
    warm:     "I wanted to tell you about something that happened in class today, before you hear a version of it at home.",
    straight: "I'm writing about something that happened in {class} today involving {student}.",
    firm:     "I need to report something that happened in class today involving {student}."
  },
  attend: {
    warm:     "I've noticed {student} has missed some class lately, and I wanted to check in rather than assume.",
    straight: "I'm writing about {student}'s attendance in {class}.",
    firm:     "{student}'s absences have reached the point where they're affecting the work, and I need to flag it."
  },
  grade: {
    warm:     "I wanted to reach out about {student}'s grade while there's still plenty of time to turn it around.",
    straight: "I'm writing about {student}'s current grade in {class}.",
    firm:     "{student}'s grade has dropped to a point where I need to make sure you know."
  },
  social: {
    warm:     "I wanted to check in with you about how {student} seems to be doing socially at the moment.",
    straight: "I'm writing about something I've noticed with {student} socially in {class}.",
    firm:     "I need to make you aware of a social situation involving {student} that I'm watching closely."
  },
  meeting: {
    warm:     "I'd love to find a time to talk properly about {student} — nothing urgent, just better done in person.",
    straight: "I'd like to set up a time to talk about {student}.",
    firm:     "I think we need to meet about {student}, and I'd like to get it on the calendar this week."
  },
  followup: {
    warm:     "Following up on our conversation about {student} — I said I'd let you know how things were going.",
    straight: "Following up on what we discussed about {student} in {class}.",
    firm:     "Following up on our previous conversation about {student}, because the situation hasn't changed."
  }
};

const NEXTS = {
  great: {
    warm:     "I thought you'd want to hear it. Please pass on that I noticed.",
    straight: "No action needed — I just wanted you to know.",
    firm:     "Worth saying out loud at home. This kind of thing takes real effort."
  },
  missing: {
    warm:     "If it's helpful, I can send a list of exactly what's outstanding. It's all still very fixable from here.",
    straight: "The work can still be turned in. Let me know if you'd like a list of what's missing.",
    firm:     "I need the missing work turned in by the end of next week. Please let me know how you'd like to handle it."
  },
  behavior: {
    warm:     "We've already talked about it at school and it's handled from my side. I just didn't want you hearing it secondhand.",
    straight: "It's been addressed at school. I wanted you to have the same information I do.",
    firm:     "I've addressed it at school, but I need your support at home for it not to happen again."
  },
  attend: {
    warm:     "If something's going on that I should know about, I'd rather hear it than guess. Either way, I'll help catch up on what's been missed.",
    straight: "Let me know if there's something I should be aware of. I can help with the work that's been missed.",
    firm:     "The absences need to come down for {student} to pass this class. Please let me know your plan."
  },
  grade: {
    warm:     "There's still time, and I'd be glad to talk through exactly what would move it. {student} is not in a hole here.",
    straight: "There's time to bring it up. I can send the specific assignments that would make the difference.",
    firm:     "Without a change in the next few weeks this will affect the final grade. I'd like to talk about how to prevent that."
  },
  social: {
    warm:     "Nothing here alarms me — I just tend to say something early rather than late. Let me know if you're seeing the same at home.",
    straight: "I'm keeping an eye on it. Let me know if you're seeing anything similar at home.",
    firm:     "I'm involving our counselor so {student} has support beyond my classroom. I'd like you in that conversation."
  },
  meeting: {
    warm:     "Any time that works for you works for me — before school, after, or by phone if that's easier.",
    straight: "Please let me know a few times that work and I'll make one of them work.",
    firm:     "Please reply with your availability this week so we can get this scheduled."
  },
  followup: {
    warm:     "Thanks for staying in this with me. I'll keep you posted either way.",
    straight: "I'll update you again in a couple of weeks.",
    firm:     "I'd like to talk again soon about what changes from here."
  }
};

const GREETINGS = { warm: "Hi {parent},", straight: "Hello {parent},", firm: "Dear {parent}," };
const SIGNOFFS  = { warm: "Thank you so much,\n{teacher}",
                    straight: "Thanks,\n{teacher}",
                    firm: "Regards,\n{teacher}" };

/* The text version is one line — it lands on a phone. */
const TEXTS = {
  great:    "Quick good-news message about {student} from {class}:",
  missing:  "Quick note about missing work for {student}:",
  behavior: "Quick heads-up about {student} today:",
  attend:   "Checking in about {student}'s attendance:",
  grade:    "Quick note about {student}'s grade:",
  social:   "Checking in about {student}:",
  meeting:  "Could we find a time to talk about {student}?",
  followup: "Following up about {student}:"
};
