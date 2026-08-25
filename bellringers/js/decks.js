/* Bellringers — the library.

   Each deck is one format plus a themed bank of prompts. "Next" cycles the bank,
   which is why ~20 decks produce essentially endless Bellringers.

   Deck fields:
     id, format (key in FORMATS), title, subtitle
     minutes      2 | 5 | 10 | 15   (how long one round realistically takes)
     grades       subset of k2 | 35 | 68
     subjects     subset of math | ela | science | social | sel   ([] = works anywhere)
     energy       low | medium | high
     group        whole | pairs | solo
     situations   which homepage tiles this shows up under
     featured     shows on the homepage carousel
     hero         this deck carries the FORMAT's slide art (one per format)
     art          this deck's own edition slide; overrides the format art
     direction    overrides the format's direction line (K-2 editions reword it)
     prompts      shape depends on FORMATS[format].render
*/

const DECKS = [

/* ══════════════════════ PICK A SIDE ══════════════════════ */
{
  id: "pick-a-side-classic",
  format: "pick-a-side",
  title: "Pick a Side",
  subtitle: "The originals. Impossible choices, instant opinions.",
  minutes: 5, grades: ["35","68"], subjects: [], energy: "medium", group: "whole",
  situations: ["walked-in","talking","switching","finished-early"],
  hero: true,
  featured: true,
  prompts: [
    { stem: "Would you rather have the ability to", a:{label:"Pause time", icon:"⏸"}, b:{label:"Rewind 10 minutes", icon:"⏪"} },
    { stem: "Would you rather", a:{label:"Always know when someone is lying", icon:"🕵️"}, b:{label:"Always get away with lying", icon:"🎭"} },
    { stem: "Would you rather", a:{label:"Never be bored again", icon:"🎡"}, b:{label:"Never be tired again", icon:"🔋"} },
    { stem: "Would you rather", a:{label:"Be able to talk to animals", icon:"🦊"}, b:{label:"Speak every human language", icon:"🗣️"} },
    { stem: "Would you rather", a:{label:"Have unlimited money", icon:"💰"}, b:{label:"Have unlimited time", icon:"⏳"} },
    { stem: "Would you rather", a:{label:"Be famous but disliked", icon:"📸"}, b:{label:"Be unknown but adored by six people", icon:"🏡"} },
    { stem: "Would you rather", a:{label:"Live 100 years in the past", icon:"🕰️"}, b:{label:"Live 100 years in the future", icon:"🚀"} },
    { stem: "Would you rather", a:{label:"Be the smartest person in the room", icon:"🧠"}, b:{label:"Be the funniest person in the room", icon:"😂"} },
    { stem: "Would you rather", a:{label:"Have a rewind button for your life", icon:"↩️"}, b:{label:"Have a fast-forward button", icon:"⏩"} },
    { stem: "Would you rather", a:{label:"Never have to sleep", icon:"👀"}, b:{label:"Never have to eat", icon:"🍽️"} },
    { stem: "Would you rather", a:{label:"Everyone hears your thoughts for a day", icon:"💭"}, b:{label:"You hear everyone else's for a day", icon:"📡"} },
    { stem: "Would you rather", a:{label:"Be great at one thing forever", icon:"🏆"}, b:{label:"Be decent at everything", icon:"🧩"} }
  ]
},
{
  id: "pick-a-side-school",
  format: "pick-a-side",
  title: "Pick a Side: School Edition",
  subtitle: "The debates they already have in the hallway. Now with rules.",
  minutes: 5, grades: ["35","68"], subjects: ["social","sel"], energy: "medium", group: "whole",
  situations: ["talking","walked-in","review"],
  art: "img/pick-a-side-school.webp",
  prompts: [
    { stem: "Would you rather have", a:{label:"School four days a week, longer days", icon:"🗓️"}, b:{label:"Five days, shorter days", icon:"⏱️"} },
    { stem: "Would you rather", a:{label:"No homework, longer school day", icon:"🏫"}, b:{label:"Homework, out at 2:00", icon:"🎒"} },
    { stem: "Would you rather have", a:{label:"A 40-minute lunch, no recess", icon:"🥪"}, b:{label:"A 20-minute lunch, 40 minutes outside", icon:"🏃"} },
    { stem: "Would you rather be graded on", a:{label:"Effort only", icon:"💪"}, b:{label:"Results only", icon:"📈"} },
    { stem: "Would you rather", a:{label:"Choose your seat, never change it", icon:"🪑"}, b:{label:"New random seat every week", icon:"🎲"} },
    { stem: "Would you rather have", a:{label:"Every test open-note", icon:"📓"}, b:{label:"No tests, one big project", icon:"🛠️"} },
    { stem: "Would you rather", a:{label:"Pick your classes, not your teachers", icon:"📚"}, b:{label:"Pick your teachers, not your classes", icon:"🧑‍🏫"} },
    { stem: "Would you rather", a:{label:"Start school at 10:00 a.m.", icon:"😴"}, b:{label:"End school at 1:00 p.m.", icon:"🌤️"} }
  ]
},
{
  id: "pick-a-side-k2",
  format: "pick-a-side",
  title: "Pick a Side: Little Kids",
  subtitle: "Same debate mechanic, sized for K-2. Stand on a side of the rug.",
  minutes: 2, grades: ["k2"], subjects: ["sel"], energy: "medium", group: "whole",
  situations: ["walked-in","talking","switching"],
  art: "img/pick-a-side-k2.webp",
  direction: "Stand on a side of the rug and <em>tell why</em>.",
  prompts: [
    { stem: "Would you rather be", a:{label:"As tiny as a mouse", icon:"🐭"}, b:{label:"As tall as a tree", icon:"🌳"} },
    { stem: "Would you rather have", a:{label:"A pet dragon", icon:"🐉"}, b:{label:"A pet dinosaur", icon:"🦕"} },
    { stem: "Would you rather", a:{label:"Fly like a bird", icon:"🕊️"}, b:{label:"Swim like a fish", icon:"🐟"} },
    { stem: "Would you rather eat", a:{label:"Only pizza forever", icon:"🍕"}, b:{label:"Only ice cream forever", icon:"🍦"} },
    { stem: "Would you rather live", a:{label:"In a treehouse", icon:"🏕️"}, b:{label:"In a castle", icon:"🏰"} },
    { stem: "Would you rather have", a:{label:"Hands as big as pillows", icon:"🖐️"}, b:{label:"Feet as big as boats", icon:"🦶"} },
    { stem: "Would you rather", a:{label:"Be able to turn invisible", icon:"👻"}, b:{label:"Be super fast", icon:"💨"} },
    { stem: "Would you rather it", a:{label:"Rain marshmallows", icon:"☁️"}, b:{label:"Snow sprinkles", icon:"❄️"} }
  ]
},

/* ══════════════════════ WRONG ANSWERS ONLY ══════════════════════ */
{
  id: "wrong-answers-only",
  format: "wrong-answers-only",
  title: "Wrong Answers Only",
  subtitle: "Students give incorrect answers to silly questions. Hilarity ensues.",
  minutes: 5, grades: ["k2","35","68"], subjects: [], energy: "high", group: "whole",
  situations: ["walked-in","need-energy","talking","finished-early"],
  hero: true,
  featured: true,
  prompts: [
    { stem: "Wrong answers only.", big: "What is the moon actually made of?" },
    { stem: "Wrong answers only.", big: "Why is the sky blue?" },
    { stem: "Wrong answers only.", big: "How do birds know where to go in the winter?" },
    { stem: "Wrong answers only.", big: "What is the capital of Texas?" },
    { stem: "Wrong answers only.", big: "What do teachers do after the last bell?" },
    { stem: "Wrong answers only.", big: "Why do we have to wear shoes in school?" },
    { stem: "Wrong answers only.", big: "How does the internet work?" },
    { stem: "Wrong answers only.", big: "What causes thunder?" },
    { stem: "Wrong answers only.", big: "Why do we dream?" },
    { stem: "Wrong answers only.", big: "What is inside a pencil?" }
  ]
},
{
  id: "wrong-answers-science",
  format: "wrong-answers-only",
  title: "Wrong Answers Only: Science Edition",
  subtitle: "The wrong answers surface the real misconceptions. Then you fix them.",
  minutes: 5, grades: ["35","68"], subjects: ["science"], energy: "high", group: "whole",
  situations: ["review","need-energy","walked-in"],
  art: "img/wrong-answers-science.webp",
  prompts: [
    { stem: "Wrong answers only.", big: "What makes the seasons change?", sub: "Then ask for the real one. Half the room will still say “we get closer to the sun.”" },
    { stem: "Wrong answers only.", big: "Where does the mass of a tree come from?", sub: "Real answer: mostly carbon pulled out of the air." },
    { stem: "Wrong answers only.", big: "Why do things fall down?" },
    { stem: "Wrong answers only.", big: "What is a cloud made of?" },
    { stem: "Wrong answers only.", big: "Why does the moon change shape?" },
    { stem: "Wrong answers only.", big: "What happens to a puddle when it disappears?" },
    { stem: "Wrong answers only.", big: "How does a magnet work?" },
    { stem: "Wrong answers only.", big: "What is fire?" }
  ]
},

/* ══════════════════════ ODD ONE OUT ══════════════════════ */
{
  id: "odd-one-out-classic",
  format: "odd-one-out",
  title: "Odd One Out",
  subtitle: "Find the item that doesn't belong and explain why. Multiple answers can be correct.",
  minutes: 5, grades: ["k2","35","68"], subjects: [], energy: "low", group: "whole",
  situations: ["walked-in","thinking","switching","too-much"],
  hero: true,
  featured: true,
  prompts: [
    { stem: "Which one doesn't belong?", items: [ {label:"Bicycle",icon:"🚲"}, {label:"Canoe",icon:"🛶"}, {label:"Skateboard",icon:"🛹"}, {label:"Bus",icon:"🚌"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Apple",icon:"🍎"}, {label:"Carrot",icon:"🥕"}, {label:"Strawberry",icon:"🍓"}, {label:"Tomato",icon:"🍅"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Sun",icon:"☀️"}, {label:"Lamp",icon:"💡"}, {label:"Moon",icon:"🌙"}, {label:"Candle",icon:"🕯️"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Guitar",icon:"🎸"}, {label:"Drum",icon:"🥁"}, {label:"Violin",icon:"🎻"}, {label:"Piano",icon:"🎹"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Penguin",icon:"🐧"}, {label:"Eagle",icon:"🦅"}, {label:"Bat",icon:"🦇"}, {label:"Ostrich",icon:"🦤"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Pencil",icon:"✏️"}, {label:"Keyboard",icon:"⌨️"}, {label:"Crayon",icon:"🖍️"}, {label:"Marker",icon:"🖊️"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Snow",icon:"❄️"}, {label:"Steam",icon:"♨️"}, {label:"Ice",icon:"🧊"}, {label:"Rain",icon:"🌧️"} ] },
    { stem: "Which one doesn't belong?", items: [ {label:"Clock",icon:"🕐"}, {label:"Calendar",icon:"📅"}, {label:"Ruler",icon:"📏"}, {label:"Stopwatch",icon:"⏱️"} ] }
  ]
},
{
  id: "odd-one-out-math",
  format: "odd-one-out",
  title: "Odd One Out: Math Edition",
  subtitle: "Every one of the four is defensible. The reasoning is the assessment.",
  minutes: 5, grades: ["35","68"], subjects: ["math"], energy: "low", group: "whole",
  situations: ["review","thinking","walked-in"],
  art: "img/odd-one-out-math.webp",
  prompts: [
    { stem: "Which number doesn't belong?", items: [ {label:"16",icon:""}, {label:"25",icon:""}, {label:"36",icon:""}, {label:"30",icon:""} ], note: "30 isn't a perfect square · 25 is the only odd one · 16 is the only power of 2 · 36 is the only multiple of 9." },
    { stem: "Which number doesn't belong?", items: [ {label:"3",icon:""}, {label:"7",icon:""}, {label:"9",icon:""}, {label:"11",icon:""} ], note: "9 isn't prime · 11 is the only two-digit · 7 is the only one not a factor or multiple of 3." },
    { stem: "Which one doesn't belong?", items: [ {label:"1/2",icon:""}, {label:"2/4",icon:""}, {label:"3/6",icon:""}, {label:"2/3",icon:""} ], note: "2/3 isn't equal to the others · 1/2 is the only one in simplest form among the equal three." },
    { stem: "Which shape doesn't belong?", items: [ {label:"Triangle",icon:"🔺"}, {label:"Square",icon:"🟦"}, {label:"Circle",icon:"⭕"}, {label:"Hexagon",icon:"⬡"} ], note: "Circle has no sides · triangle has the fewest · square is the only one with all right angles · hexagon has the most." },
    { stem: "Which number doesn't belong?", items: [ {label:"12",icon:""}, {label:"18",icon:""}, {label:"24",icon:""}, {label:"27",icon:""} ], note: "27 is the only odd · 24 is the only multiple of 8 · 12 is the only one under 15." },
    { stem: "Which one doesn't belong?", items: [ {label:"0.5",icon:""}, {label:"50%",icon:""}, {label:"1/2",icon:""}, {label:"5.0",icon:""} ], note: "5.0 is the only one that isn't one half · but each of the other three is written in a form the others aren't." },
    { stem: "Which number doesn't belong?", items: [ {label:"100",icon:""}, {label:"64",icon:""}, {label:"49",icon:""}, {label:"45",icon:""} ], note: "45 isn't a perfect square · 100 is the only three-digit · 64 is the only power of 2 · 49 and 45 are the odd ones." },
    { stem: "Which number doesn't belong?", items: [ {label:"2",icon:""}, {label:"3",icon:""}, {label:"5",icon:""}, {label:"9",icon:""} ], note: "9 isn't prime · 2 is the only even · 5 is the only one you count by on a clock face." }
  ]
},
{
  id: "odd-one-out-science",
  format: "odd-one-out",
  title: "Odd One Out: Science Edition",
  subtitle: "Classification practice that sounds like an argument.",
  minutes: 5, grades: ["35","68"], subjects: ["science"], energy: "low", group: "whole",
  situations: ["review","thinking"],
  prompts: [
    { stem: "Which one doesn't belong?", items: [ {label:"Frog",icon:"🐸"}, {label:"Lizard",icon:"🦎"}, {label:"Snake",icon:"🐍"}, {label:"Turtle",icon:"🐢"} ], note: "Frog is the amphibian; the rest are reptiles. Snake is the only one without legs." },
    { stem: "Which one doesn't belong?", items: [ {label:"Sun",icon:"☀️"}, {label:"Earth",icon:"🌍"}, {label:"Mars",icon:"🔴"}, {label:"Jupiter",icon:"🪐"} ], note: "The Sun is a star · Earth is the only one with known life · Jupiter is the only gas giant." },
    { stem: "Which one doesn't belong?", items: [ {label:"Copper wire",icon:"🔌"}, {label:"Rubber band",icon:"🎗️"}, {label:"Aluminum foil",icon:"🥫"}, {label:"Salt water",icon:"🌊"} ], note: "Rubber is the insulator · salt water is the only liquid · copper and aluminum are the only metals." },
    { stem: "Which one doesn't belong?", items: [ {label:"Volcano",icon:"🌋"}, {label:"Earthquake",icon:"🫨"}, {label:"Hurricane",icon:"🌀"}, {label:"Landslide",icon:"⛰️"} ], note: "Hurricane is weather; the rest are geologic. Volcano is the only one that adds new land." },
    { stem: "Which one doesn't belong?", items: [ {label:"Wind",icon:"🌬️"}, {label:"Coal",icon:"🪨"}, {label:"Solar",icon:"🔆"}, {label:"Hydro",icon:"💧"} ], note: "Coal is nonrenewable · solar is the only one not driven by moving mass." },
    { stem: "Which one doesn't belong?", items: [ {label:"Ice",icon:"🧊"}, {label:"Water",icon:"💧"}, {label:"Steam",icon:"♨️"}, {label:"Sand",icon:"🏖️"} ], note: "Sand is a different substance · steam is the only gas · ice is the only one with a fixed shape." }
  ]
},

/* ══════════════════════ ONE HAS TO GO ══════════════════════ */
{
  id: "one-has-to-go",
  format: "one-has-to-go",
  title: "One Has to Go",
  subtitle: "Four things appear. The class eliminates one — forever, for everyone.",
  minutes: 5, grades: ["35","68"], subjects: ["sel"], energy: "high", group: "whole",
  situations: ["talking","need-energy","finished-early"],
  art: "img/one-has-to-go.webp",
  prompts: [
    { stem: "One has to go. Forever.", items: [ {label:"Pizza",icon:"🍕"}, {label:"Tacos",icon:"🌮"}, {label:"Burgers",icon:"🍔"}, {label:"Ice cream",icon:"🍦"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Summer",icon:"☀️"}, {label:"Fall",icon:"🍂"}, {label:"Winter",icon:"❄️"}, {label:"Spring",icon:"🌷"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Music",icon:"🎵"}, {label:"Movies",icon:"🎬"}, {label:"Video games",icon:"🎮"}, {label:"Books",icon:"📚"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Socks",icon:"🧦"}, {label:"Umbrellas",icon:"☂️"}, {label:"Hats",icon:"🧢"}, {label:"Sunglasses",icon:"🕶️"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Elevators",icon:"🛗"}, {label:"Escalators",icon:"↗️"}, {label:"Stairs",icon:"🪜"}, {label:"Ramps",icon:"♿"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Homework",icon:"📝"}, {label:"Tests",icon:"🧪"}, {label:"Group projects",icon:"👥"}, {label:"Presentations",icon:"🎤"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Ketchup",icon:"🍅"}, {label:"Ranch",icon:"🥛"}, {label:"Mustard",icon:"🌭"}, {label:"Barbecue",icon:"🍖"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Dogs",icon:"🐕"}, {label:"Cats",icon:"🐈"}, {label:"Birds",icon:"🦜"}, {label:"Fish",icon:"🐠"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Cars",icon:"🚗"}, {label:"Planes",icon:"✈️"}, {label:"Trains",icon:"🚂"}, {label:"Boats",icon:"⛵"} ] },
    { stem: "One has to go. Forever.", items: [ {label:"Birthdays",icon:"🎂"}, {label:"Weekends",icon:"🛋️"}, {label:"Holidays",icon:"🎆"}, {label:"Snow days",icon:"🌨️"} ] }
  ]
},

/* ══════════════════════ DEFEND THE RIDICULOUS ══════════════════════ */
{
  id: "defend-the-ridiculous",
  format: "defend-the-ridiculous",
  title: "Defend the Ridiculous",
  subtitle: "An indefensible claim. Sixty seconds to make us believe it anyway.",
  minutes: 10, grades: ["35","68"], subjects: ["ela"], energy: "high", group: "pairs",
  situations: ["talking","need-energy","thinking"],
  art: "img/defend-the-ridiculous.webp",
  featured: true,
  prompts: [
    { stem: "Convince us:", big: "Homework should only be assigned at midnight." },
    { stem: "Convince us:", big: "Cereal is a soup." },
    { stem: "Convince us:", big: "Recess is more important than reading." },
    { stem: "Convince us:", big: "The best day of the week is Tuesday." },
    { stem: "Convince us:", big: "Everyone should have to walk backwards on Fridays." },
    { stem: "Convince us:", big: "Winter is objectively the superior season." },
    { stem: "Convince us:", big: "Pencils are a better technology than laptops." },
    { stem: "Convince us:", big: "Silence should be illegal in a classroom." },
    { stem: "Convince us:", big: "A hot dog is, in fact, a sandwich." },
    { stem: "Convince us:", big: "Students should grade the teachers." }
  ]
},
{
  id: "defend-the-ridiculous-history",
  format: "defend-the-ridiculous",
  title: "Defend the Ridiculous: History Edition",
  subtitle: "Absurd on the surface, real argument underneath.",
  minutes: 10, grades: ["68"], subjects: ["social"], energy: "medium", group: "pairs",
  situations: ["review","thinking","talking"],
  prompts: [
    { stem: "Convince us:", big: "The wheel is overrated.", sub: "Push them to name what actually mattered more — writing? agriculture? the plow?" },
    { stem: "Convince us:", big: "The most important invention of the last 200 years is the toilet.", sub: "This one is closer to true than students expect." },
    { stem: "Convince us:", big: "Ancient Rome would have been better off without roads." },
    { stem: "Convince us:", big: "Maps have done more harm than good." },
    { stem: "Convince us:", big: "The printing press was a bigger deal than the internet." },
    { stem: "Convince us:", big: "Every country should have to trade its name with another country." }
  ]
},

/* ══════════════════════ ESTIMATE IT ══════════════════════ */
{
  id: "estimate-it",
  format: "estimate-it",
  title: "Estimate It",
  subtitle: "Nobody knows the answer. Everybody has to produce a number anyway.",
  minutes: 5, grades: ["35","68"], subjects: ["math","science"], energy: "low", group: "whole",
  situations: ["thinking","too-much","review","walked-in"],
  hero: true,
  prompts: [
    { stem: "Estimate it.", big: "How many ping-pong balls would fit inside this classroom?", answer: "A typical classroom holds roughly 900,000 — but the number is not the point. Ask how they got there.", note: "Best path: estimate the room in feet, convert to cubic inches, divide by a ping-pong ball's volume." },
    { stem: "Estimate it.", big: "How many times does your heart beat in a school day?", answer: "About 30,000 — roughly 80 beats a minute × 60 × 7 hours." },
    { stem: "Estimate it.", big: "How many pencils does this school go through in a year?", answer: "No official answer. Award the point for the best reasoning chain, not the closest number." },
    { stem: "Estimate it.", big: "How many words do you say in one day?", answer: "Research puts most people around 16,000 words a day." },
    { stem: "Estimate it.", big: "How long would it take to walk across the United States?", answer: "About 4–6 months of walking, roughly 2,800 miles at 20 miles a day." },
    { stem: "Estimate it.", big: "How many slices of pizza does this school eat in a year?", answer: "Reasoning only. Get them to students × pizza days × slices." },
    { stem: "Estimate it.", big: "How many hairs are on your head?", answer: "About 100,000 for most people." },
    { stem: "Estimate it.", big: "How many breaths will you take today?", answer: "Around 20,000 — about 14 a minute." },
    { stem: "Estimate it.", big: "If everyone in this room held hands, how far would the line stretch?", answer: "Roughly 4 feet per student. Twenty-five students is about 100 feet." },
    { stem: "Estimate it.", big: "How many steps have you taken in your entire life?", answer: "Very roughly 5,000 a day × 365 × your age." }
  ]
},

/* ══════════════════════ MICRO MYSTERY ══════════════════════ */
{
  id: "micro-mystery",
  format: "micro-mystery",
  title: "Micro Mystery",
  subtitle: "A tiny mystery students crack using three clues. Reveal one at a time.",
  minutes: 5, grades: ["35","68"], subjects: ["ela"], energy: "low", group: "whole",
  situations: ["thinking","too-much","switching","finished-early"],
  art: "img/micro-mystery.webp",
  featured: true,
  prompts: [
    { stem: "Micro Mystery", big: "A woman pushes her car up to a hotel and immediately knows she is bankrupt. Why?",
      clues: ["Nobody is hurt and nothing is broken.","There are three other hotels nearby.","She was rolling dice earlier."],
      answer: "She is playing Monopoly." },
    { stem: "Micro Mystery", big: "The music stopped and the man died. What happened?",
      clues: ["There was a very large audience.","He was not sick.","He was balanced high above the ground."],
      answer: "He was a tightrope walker at a circus. The band's music was his cue — when it stopped early, he lost his timing." },
    { stem: "Micro Mystery", big: "A man lives on the 20th floor. Every morning he takes the elevator down. Coming home, he rides to the 10th floor and walks the rest — except on rainy days.",
      clues: ["He is perfectly healthy.","He would prefer to ride all the way up.","On rainy days he carries something he doesn't carry otherwise."],
      answer: "He is short and can only reach the 10th-floor button. On rainy days he has an umbrella to press the 20th." },
    { stem: "Micro Mystery", big: "A room is found with 53 bicycles in it. One person in the room is a cheater. How does everyone know?",
      clues: ["The bicycles are not real bicycles.","People are seated around a table.","A standard set contains 52."],
      answer: "They are Bicycle-brand playing cards. There is one card too many." },
    { stem: "Micro Mystery", big: "A woman shoots her husband, holds him under water for five minutes, then hangs him. Twenty minutes later they go out to dinner together.",
      clues: ["She is a professional.","Her workplace has a red light.","Nobody was harmed at any point."],
      answer: "She is a photographer. She shot a photo, developed it, and hung it to dry." },
    { stem: "Micro Mystery", big: "Every morning the cup on the desk is full. Nobody in the building drinks from it. It is empty by noon anyway.",
      clues: ["The window is always open.","There is a small green plant on the sill.","Nobody has ever seen it happen."],
      answer: "Evaporation, plus the custodian watering the plant. Accept any explanation the three clues actually support — the reasoning is the win." },
    { stem: "Micro Mystery", big: "Two students turn in identical essays. Neither one cheated.",
      clues: ["They have never met.","The essays are word for word.","Neither wrote the essay."],
      answer: "Both copied the same source — or both used the same generator. Same origin, no contact." },
    { stem: "Micro Mystery", big: "A man walks into a restaurant, orders soup, takes one taste, and runs out crying.",
      clues: ["The soup is perfectly made.","He has had it once before, years ago.","He was rescued at sea."],
      answer: "The taste told him the truth about what he was fed during the rescue. Let students land it — the reveal is theirs, not yours." }
  ]
},
{
  id: "micro-mystery-science",
  format: "micro-mystery",
  title: "Micro Mystery: Science Edition",
  subtitle: "Same three-clue structure. The solution is a science concept.",
  minutes: 5, grades: ["35","68"], subjects: ["science"], energy: "low", group: "whole",
  situations: ["review","thinking","too-much"],
  art: "img/micro-mystery-science.webp",
  prompts: [
    { stem: "Micro Mystery", big: "A puddle in the parking lot disappears overnight. It did not rain, and nothing drank it.",
      clues: ["The pavement was warm all evening.","There was a breeze.","The air felt slightly more humid in the morning."],
      answer: "Evaporation. Heat plus moving air pulled the water into the atmosphere as vapor." },
    { stem: "Micro Mystery", big: "A glass of ice water sitting on a desk is suddenly wet on the outside. Nobody spilled anything.",
      clues: ["The room is warm.","The wetness is only on the outside.","It got worse the longer it sat."],
      answer: "Condensation. Warm air touching the cold glass cooled below its dew point." },
    { stem: "Micro Mystery", big: "A plant on a windowsill is growing sideways.",
      clues: ["It was straight two weeks ago.","The window faces one direction only.","Nobody moved it."],
      answer: "Phototropism. The plant grew toward its light source." },
    { stem: "Micro Mystery", big: "A sealed bag of chips is puffed up like a balloon when it arrives at a mountain campsite.",
      clues: ["Nobody opened it.","It was flat at the store.","The store was near sea level."],
      answer: "Lower air pressure at altitude. The air inside pushed out harder than the thinner air pushed in." },
    { stem: "Micro Mystery", big: "A metal spoon and a wooden spoon sit in the same drawer. The metal one feels much colder.",
      clues: ["A thermometer says they are the same temperature.","You noticed it with your hand.","Metal is a good conductor."],
      answer: "Conduction. The metal pulls heat out of your hand faster, so it feels colder even though it isn't." },
    { stem: "Micro Mystery", big: "The same shirt looks bright red outside and nearly black inside the gym.",
      clues: ["The shirt did not change.","The gym has different bulbs.","Color depends on the light that reaches your eye."],
      answer: "The gym's light contains little red wavelength, so there is almost no red for the shirt to reflect." }
  ]
},

/* ══════════════════════ 60-SECOND STORY ══════════════════════ */
{
  id: "sixty-second-story",
  format: "sixty-second-story",
  title: "60-Second Story",
  subtitle: "Three random objects. One minute. All three have to be in it.",
  minutes: 5, grades: ["k2","35","68"], subjects: ["ela"], energy: "medium", group: "solo",
  situations: ["thinking","too-much","finished-early","switching"],
  art: "img/sixty-second-story.webp",
  prompts: [
    { stem: "All three. Sixty seconds.", items: [ {label:"A key",icon:"🔑"}, {label:"A goat",icon:"🐐"}, {label:"A thunderstorm",icon:"⛈️"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A broken clock",icon:"🕰️"}, {label:"A red balloon",icon:"🎈"}, {label:"A librarian",icon:"📚"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A submarine",icon:"🛥️"}, {label:"A birthday cake",icon:"🎂"}, {label:"A lost dog",icon:"🐕"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A magnet",icon:"🧲"}, {label:"A pair of boots",icon:"🥾"}, {label:"A secret door",icon:"🚪"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A violin",icon:"🎻"}, {label:"A snowstorm",icon:"🌨️"}, {label:"A hungry bear",icon:"🐻"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A telescope",icon:"🔭"}, {label:"A jar of honey",icon:"🍯"}, {label:"A stranger",icon:"🕴️"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A skateboard",icon:"🛹"}, {label:"A crown",icon:"👑"}, {label:"A flooded street",icon:"🌊"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A camera",icon:"📷"}, {label:"An octopus",icon:"🐙"}, {label:"A ringing phone",icon:"📞"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A rocket",icon:"🚀"}, {label:"A grandmother",icon:"👵"}, {label:"A single sock",icon:"🧦"} ] },
    { stem: "All three. Sixty seconds.", items: [ {label:"A candle",icon:"🕯️"}, {label:"A train ticket",icon:"🎫"}, {label:"A talking cat",icon:"🐈"} ] }
  ]
},

/* ══════════════════════ CAPTION THIS ══════════════════════ */
{
  id: "caption-this",
  format: "caption-this",
  title: "Caption This",
  subtitle: "Write the best caption for the scene. Share and vote.",
  minutes: 5, grades: ["k2","35","68"], subjects: ["ela"], energy: "medium", group: "solo",
  situations: ["finished-early","talking","switching","need-energy"],
  art: "img/caption-this.webp",
  featured: true,
  prompts: [
    { stem: "Caption this.", scene: "🐕🕶️🛹", sub: "A dog in sunglasses on a skateboard." },
    { stem: "Caption this.", scene: "🐧🏖️☂️", sub: "A penguin on a beach under an umbrella." },
    { stem: "Caption this.", scene: "🦖☕📰", sub: "A T. rex having coffee and reading the paper." },
    { stem: "Caption this.", scene: "🐄🚀🌕", sub: "A cow in a rocket approaching the moon." },
    { stem: "Caption this.", scene: "🐙🎸🎤", sub: "An octopus playing lead guitar." },
    { stem: "Caption this.", scene: "🧑‍🚀🥪🪐", sub: "An astronaut eating a sandwich next to Saturn." },
    { stem: "Caption this.", scene: "🐸👔💼", sub: "A frog in a tie carrying a briefcase." },
    { stem: "Caption this.", scene: "🦔🏀🏆", sub: "A hedgehog holding a basketball trophy." },
    { stem: "Caption this.", scene: "🐌🏎️🚦", sub: "A snail in a race car at a green light." },
    { stem: "Caption this.", scene: "🐻‍❄️🌴🍹", sub: "A polar bear on a tropical island." }
  ]
},

/* ══════════════════════ WOULD YOU SURVIVE? ══════════════════════ */
{
  id: "would-you-survive",
  format: "would-you-survive",
  title: "Would You Survive?",
  subtitle: "A scenario and four decisions. Commit, defend, then find out.",
  minutes: 10, grades: ["35","68"], subjects: ["science","social"], energy: "medium", group: "whole",
  situations: ["thinking","talking","finished-early"],
  prompts: [
    { stem: "Would you survive?", scene: "You're lost in the woods. It's getting dark and cold, and you have four hours of daylight left.",
      items: [ {label:"Keep walking to find the road",icon:"🥾"}, {label:"Build a shelter now",icon:"🏕️"}, {label:"Start a fire",icon:"🔥"}, {label:"Look for water",icon:"💧"} ],
      note: "Shelter first. Cold kills faster than thirst — you can live three days without water and three hours without warmth." },
    { stem: "Would you survive?", scene: "The ice cracks under you on a frozen pond. You're in the water.",
      items: [ {label:"Swim to the far shore",icon:"🏊"}, {label:"Turn back the way you came",icon:"↩️"}, {label:"Yell and wait",icon:"📢"}, {label:"Pull yourself up and roll",icon:"🧊"} ],
      note: "Turn back toward the ice you already crossed — you know it held — then pull up and roll to spread your weight." },
    { stem: "Would you survive?", scene: "You're in a building and the fire alarm sounds. There's smoke in the hallway.",
      items: [ {label:"Run through the smoke",icon:"🏃"}, {label:"Stay low and move",icon:"🧎"}, {label:"Take the elevator",icon:"🛗"}, {label:"Open the window and wait",icon:"🪟"} ],
      note: "Stay low. Smoke and heat rise, and the breathable air is near the floor. Never the elevator." },
    { stem: "Would you survive?", scene: "You're caught in a rip current at the beach, being pulled away from shore.",
      items: [ {label:"Swim straight back to shore",icon:"🏖️"}, {label:"Swim parallel to shore",icon:"↔️"}, {label:"Float and wave",icon:"🙋"}, {label:"Dive under it",icon:"🤿"} ],
      note: "Swim parallel. Rip currents are narrow — swimming against one exhausts you before it moves you." },
    { stem: "Would you survive?", scene: "A tornado warning sounds and you're at home in a one-story house.",
      items: [ {label:"Get in the car and drive",icon:"🚗"}, {label:"Interior room, lowest floor",icon:"🚪"}, {label:"Open the windows",icon:"🪟"}, {label:"Stand under a doorway",icon:"🧍"} ],
      note: "Interior room, lowest floor, as many walls between you and outside as possible. Opening windows is an old myth that does nothing." },
    { stem: "Would you survive?", scene: "You're hiking and there's a bear on the trail thirty feet ahead. It has seen you.",
      items: [ {label:"Run",icon:"💨"}, {label:"Climb a tree",icon:"🌲"}, {label:"Back away slowly, talking",icon:"🗣️"}, {label:"Play dead",icon:"😵"} ],
      note: "Back away slowly while speaking calmly. Running triggers a chase, and bears climb better than you do." },
    { stem: "Would you survive?", scene: "Your phone dies on a hike and you don't know the way back. It's noon.",
      items: [ {label:"Follow water downhill",icon:"🏞️"}, {label:"Climb for a view",icon:"⛰️"}, {label:"Stay put",icon:"🪧"}, {label:"Pick a direction and commit",icon:"🧭"} ],
      note: "If someone knows where you went, stay put. If nobody does, following water downhill usually leads to people." },
    { stem: "Would you survive?", scene: "You're stranded on an island. You may take exactly one item.",
      items: [ {label:"A knife",icon:"🔪"}, {label:"A lighter",icon:"🔥"}, {label:"A tarp",icon:"⛺"}, {label:"A water filter",icon:"🚰"} ],
      note: "Real debate, no single answer. Push them to name what the item lets them make, not just what it does." }
  ]
},

/* ══════════════════════ BEAT THE TEACHER ══════════════════════ */
{
  id: "beat-the-teacher-math",
  format: "beat-the-teacher",
  title: "Beat the Teacher: Math",
  subtitle: "Five rapid questions. You get to answer too — and you should lose one on purpose.",
  minutes: 5, grades: ["35","68"], subjects: ["math"], energy: "high", group: "whole",
  situations: ["review","need-energy","walked-in"],
  hero: true,
  prompts: [
    { stem: "Round 1 — Multiplication", questions: [
      { q: "7 × 8", a: "56" }, { q: "12 × 12", a: "144" }, { q: "9 × 6", a: "54" },
      { q: "11 × 7", a: "77" }, { q: "15 × 4", a: "60" } ] },
    { stem: "Round 2 — Fractions", questions: [
      { q: "1/2 + 1/4", a: "3/4" }, { q: "Simplify 6/8", a: "3/4" }, { q: "1/3 of 27", a: "9" },
      { q: "2/5 as a decimal", a: "0.4" }, { q: "3/4 + 1/2", a: "1 1/4" } ] },
    { stem: "Round 3 — Percent", questions: [
      { q: "10% of 250", a: "25" }, { q: "50% of 86", a: "43" }, { q: "25% of 80", a: "20" },
      { q: "20% of 45", a: "9" }, { q: "75% of 200", a: "150" } ] },
    { stem: "Round 4 — Mental Math", questions: [
      { q: "199 + 199", a: "398" }, { q: "1,000 − 356", a: "644" }, { q: "48 ÷ 6", a: "8" },
      { q: "Double 175", a: "350" }, { q: "Half of 1,000", a: "500" } ] },
    { stem: "Round 5 — Vocabulary", questions: [
      { q: "The answer to a subtraction problem", a: "Difference" }, { q: "The answer to a division problem", a: "Quotient" },
      { q: "The distance around a shape", a: "Perimeter" }, { q: "The middle number in an ordered list", a: "Median" },
      { q: "The number that shows up most often", a: "Mode" } ] }
  ]
},
{
  id: "beat-the-teacher-words",
  format: "beat-the-teacher",
  title: "Beat the Teacher: Words",
  subtitle: "Vocabulary and word-attack, at speed.",
  minutes: 5, grades: ["35","68"], subjects: ["ela"], energy: "high", group: "whole",
  situations: ["review","need-energy","walked-in"],
  art: "img/beat-the-teacher-words.webp",
  prompts: [
    { stem: "Round 1 — Synonyms", questions: [
      { q: "A synonym for “furious”", a: "Enraged, livid, irate" }, { q: "A synonym for “tiny”", a: "Minuscule, minute, petite" },
      { q: "A synonym for “ancient”", a: "Archaic, aged, antiquated" }, { q: "A synonym for “brave”", a: "Valiant, courageous, bold" },
      { q: "A synonym for “strange”", a: "Peculiar, bizarre, odd" } ] },
    { stem: "Round 2 — Prefixes", questions: [
      { q: "What does “pre-” mean?", a: "Before" }, { q: "What does “sub-” mean?", a: "Under, below" },
      { q: "What does “trans-” mean?", a: "Across" }, { q: "What does “mis-” mean?", a: "Wrong, badly" },
      { q: "What does “re-” mean?", a: "Again, back" } ] },
    { stem: "Round 3 — Roots", questions: [
      { q: "“Port” means…", a: "To carry (transport, portable)" }, { q: "“Scrib / script” means…", a: "To write" },
      { q: "“Aqua” means…", a: "Water" }, { q: "“Bio” means…", a: "Life" },
      { q: "“Geo” means…", a: "Earth" } ] },
    { stem: "Round 4 — Grammar", questions: [
      { q: "Name the part of speech: quickly", a: "Adverb" }, { q: "Past tense of “bring”", a: "Brought" },
      { q: "Plural of “mouse”", a: "Mice" }, { q: "A word that joins two clauses", a: "Conjunction" },
      { q: "The naming part of a sentence", a: "Subject" } ] },
    { stem: "Round 5 — Figurative Language", questions: [
      { q: "“The wind howled.” What is that?", a: "Personification" }, { q: "A comparison using like or as", a: "Simile" },
      { q: "Extreme exaggeration", a: "Hyperbole" }, { q: "Repeated beginning sounds", a: "Alliteration" },
      { q: "A phrase that doesn't mean what it says", a: "Idiom" } ] }
  ]
},

/* ══════════════════════ MYSTERY ZOOM ══════════════════════ */
{
  id: "mystery-zoom",
  format: "mystery-zoom",
  title: "Mystery Zoom",
  subtitle: "Zoomed way in. Zoom out every 15 seconds until someone shouts it.",
  minutes: 2, grades: ["k2","35","68"], subjects: [], energy: "medium", group: "whole",
  situations: ["switching","walked-in","too-much","finished-early"],
  hero: true,
  prompts: [
    { icon: "🦒", answer: "A giraffe" }, { icon: "🌻", answer: "A sunflower" },
    { icon: "🎺", answer: "A trumpet" }, { icon: "🐙", answer: "An octopus" },
    { icon: "🗽", answer: "The Statue of Liberty" }, { icon: "🍉", answer: "A watermelon" },
    { icon: "🦩", answer: "A flamingo" }, { icon: "⚓", answer: "An anchor" },
    { icon: "🌵", answer: "A cactus" }, { icon: "🦋", answer: "A butterfly" },
    { icon: "🚂", answer: "A steam train" }, { icon: "🏰", answer: "A castle" }
  ]
},

/* ══════════════════ K-2 CONTENT ══════════════════ */
{
  id: "odd-one-out-k2-math",
  format: "odd-one-out",
  title: "Odd One Out: Numbers & Shapes",
  subtitle: "K-2 math talk. Four things, one because, no wrong answer you can defend.",
  minutes: 2, grades: ["k2"], subjects: ["math"], energy: "low", group: "whole",
  situations: ["review","thinking","walked-in","switching"],
  art: "img/odd-one-out-k2-math.webp",
  direction: "Pick one and tell why. <em>More than one answer can work</em>.",
  prompts: [
    { stem: "Which one doesn't belong?", items: [ {label:"2",icon:""}, {label:"4",icon:""}, {label:"6",icon:""}, {label:"5",icon:""} ], note: "5 is the only odd one · 2 is the smallest · 6 is the biggest · 4 is the only one you can split into two equal pairs of 2." },
    { stem: "Which shape doesn't belong?", items: [ {label:"Circle",icon:"⭕"}, {label:"Square",icon:"🟦"}, {label:"Triangle",icon:"🔺"}, {label:"Star",icon:"⭐"} ], note: "Circle has no corners · triangle has the fewest sides · star has the most points · square is the only one with four equal sides." },
    { stem: "Which one doesn't belong?", items: [ {label:"🍎🍎",icon:""}, {label:"🍎🍎🍎",icon:""}, {label:"🍎🍎🍎🍎",icon:""}, {label:"🍎",icon:""} ], note: "One is the only single · three is the only odd group · four is the biggest." },
    { stem: "Which one doesn't belong?", items: [ {label:"10",icon:""}, {label:"20",icon:""}, {label:"25",icon:""}, {label:"30",icon:""} ], note: "25 is the only one you don't say when you count by tens · 10 is the smallest." },
    { stem: "Which one doesn't belong?", items: [ {label:"A penny",icon:"🪙"}, {label:"A dime",icon:"🪙"}, {label:"A dollar",icon:"💵"}, {label:"A nickel",icon:"🪙"} ], note: "The dollar is the only paper one · the penny is worth the least · the dime is the smallest but not the cheapest." },
    { stem: "Which one doesn't belong?", items: [ {label:"Clock",icon:"🕐"}, {label:"Ruler",icon:"📏"}, {label:"Scale",icon:"⚖️"}, {label:"Crayon",icon:"🖍️"} ], note: "The crayon doesn't measure anything · the clock measures time, not size." },
    { stem: "Which one doesn't belong?", items: [ {label:"Cube",icon:"🧊"}, {label:"Ball",icon:"⚽"}, {label:"Can",icon:"🥫"}, {label:"Paper",icon:"📄"} ], note: "Paper is flat, the rest are solid · the ball is the only one that rolls every direction." },
    { stem: "Which one doesn't belong?", items: [ {label:"1st",icon:"🥇"}, {label:"2nd",icon:"🥈"}, {label:"3rd",icon:"🥉"}, {label:"10th",icon:"🔟"} ], note: "10th is the only one without a medal · 1st is the only winner." }
  ]
},
{
  id: "odd-one-out-k2-nature",
  format: "odd-one-out",
  title: "Odd One Out: Animals & Nature",
  subtitle: "K-2 science sorting. Living, not living, and everything in between.",
  minutes: 2, grades: ["k2"], subjects: ["science"], energy: "low", group: "whole",
  situations: ["review","thinking","switching","too-much"],
  art: "img/odd-one-out-k2-nature.webp",
  prompts: [
    { stem: "Which one doesn't belong?", items: [ {label:"Fish",icon:"🐟"}, {label:"Duck",icon:"🦆"}, {label:"Frog",icon:"🐸"}, {label:"Cat",icon:"🐈"} ], note: "The cat is the only one that doesn't swim · the fish is the only one that can't leave the water." },
    { stem: "Which one doesn't belong?", items: [ {label:"Tree",icon:"🌳"}, {label:"Rock",icon:"🪨"}, {label:"Flower",icon:"🌸"}, {label:"Grass",icon:"🌱"} ], note: "The rock is not living · the tree is the tallest · the flower is the only one with petals." },
    { stem: "Which one doesn't belong?", items: [ {label:"Sun",icon:"☀️"}, {label:"Rain",icon:"🌧️"}, {label:"Snow",icon:"❄️"}, {label:"Wind",icon:"🌬️"} ], note: "Only the sun isn't weather that falls or blows · snow is the only cold one you can hold." },
    { stem: "Which one doesn't belong?", items: [ {label:"Bee",icon:"🐝"}, {label:"Bird",icon:"🐦"}, {label:"Bat",icon:"🦇"}, {label:"Bear",icon:"🐻"} ], note: "The bear can't fly · the bee is the only insect · the bat is the only one awake at night." },
    { stem: "Which one doesn't belong?", items: [ {label:"Apple",icon:"🍎"}, {label:"Egg",icon:"🥚"}, {label:"Bread",icon:"🍞"}, {label:"Rock",icon:"🪨"} ], note: "The rock is not food · the apple is the only one that grows on a tree." },
    { stem: "Which one doesn't belong?", items: [ {label:"Seed",icon:"🌰"}, {label:"Sprout",icon:"🌱"}, {label:"Plant",icon:"🪴"}, {label:"Cloud",icon:"☁️"} ], note: "The cloud isn't part of how a plant grows · the seed comes first." },
    { stem: "Which one doesn't belong?", items: [ {label:"Ice",icon:"🧊"}, {label:"Fire",icon:"🔥"}, {label:"Snow",icon:"❄️"}, {label:"Freezer",icon:"🧊"} ], note: "Fire is the only hot one · the freezer is the only thing people made." },
    { stem: "Which one doesn't belong?", items: [ {label:"Cow",icon:"🐄"}, {label:"Chicken",icon:"🐔"}, {label:"Pig",icon:"🐖"}, {label:"Lion",icon:"🦁"} ], note: "The lion isn't a farm animal · the chicken is the only bird · the cow is the biggest." }
  ]
},
{
  id: "beat-the-teacher-k2",
  format: "beat-the-teacher",
  title: "Beat the Teacher: Little Kids",
  subtitle: "Five fast ones for K-2. You are allowed to lose. You will lose.",
  minutes: 2, grades: ["k2"], subjects: ["math","ela"], energy: "high", group: "whole",
  situations: ["review","need-energy","walked-in"],
  art: "img/beat-the-teacher-k2.webp",
  direction: "<em>Work fast.</em> Teacher vs. class!",
  prompts: [
    { stem: "Round 1 — Counting", questions: [
      { q: "What comes after 9?", a: "10" }, { q: "What comes before 6?", a: "5" },
      { q: "Count by 2s: 2, 4, 6, …", a: "8" }, { q: "How many fingers on two hands?", a: "10" },
      { q: "What is 5 + 5?", a: "10" } ] },
    { stem: "Round 2 — Adding", questions: [
      { q: "3 + 2", a: "5" }, { q: "4 + 4", a: "8" }, { q: "6 + 1", a: "7" },
      { q: "10 + 10", a: "20" }, { q: "7 + 3", a: "10" } ] },
    { stem: "Round 3 — Letters and Sounds", questions: [
      { q: "What letter does “moon” start with?", a: "M" }, { q: "What sound does “sh” make?", a: "shhh" },
      { q: "Rhymes with “cat”", a: "hat, bat, mat, sat" }, { q: "How many letters in the alphabet?", a: "26" },
      { q: "Name a word that starts with Z", a: "zebra, zoo, zipper" } ] },
    { stem: "Round 4 — Shapes and Colors", questions: [
      { q: "How many sides does a triangle have?", a: "3" }, { q: "How many corners on a square?", a: "4" },
      { q: "Red and yellow make…", a: "Orange" }, { q: "Blue and yellow make…", a: "Green" },
      { q: "A shape with no corners", a: "A circle" } ] },
    { stem: "Round 5 — Our World", questions: [
      { q: "How many days in a week?", a: "7" }, { q: "What season comes after winter?", a: "Spring" },
      { q: "A baby dog is called a…", a: "Puppy" }, { q: "What do plants need to grow?", a: "Water, sunlight, air, soil" },
      { q: "How many months in a year?", a: "12" } ] }
  ]
},
{
  id: "one-has-to-go-k2",
  format: "one-has-to-go",
  title: "One Has to Go: Our Town",
  subtitle: "K-2 community and needs-vs-wants, disguised as an argument.",
  minutes: 5, grades: ["k2"], subjects: ["social","sel"], energy: "medium", group: "whole",
  situations: ["review","talking","finished-early"],
  prompts: [
    { stem: "Our town can only keep three. One has to go.", items: [ {label:"Fire station",icon:"🚒"}, {label:"Library",icon:"📚"}, {label:"Playground",icon:"🛝"}, {label:"Ice cream shop",icon:"🍦"} ] },
    { stem: "Our town can only keep three. One has to go.", items: [ {label:"Doctor",icon:"🩺"}, {label:"Teacher",icon:"🧑‍🏫"}, {label:"Farmer",icon:"🚜"}, {label:"Mail carrier",icon:"📬"} ] },
    { stem: "One has to go.", items: [ {label:"Sidewalks",icon:"🚶"}, {label:"Stop signs",icon:"🛑"}, {label:"Crosswalks",icon:"🚸"}, {label:"Street lights",icon:"🚦"} ] },
    { stem: "One has to go.", items: [ {label:"The park",icon:"🌳"}, {label:"The pool",icon:"🏊"}, {label:"The zoo",icon:"🦁"}, {label:"The museum",icon:"🏛️"} ] },
    { stem: "One has to go.", items: [ {label:"Water",icon:"💧"}, {label:"Food",icon:"🍎"}, {label:"A house",icon:"🏠"}, {label:"Toys",icon:"🧸"} ] },
    { stem: "One has to go.", items: [ {label:"Buses",icon:"🚌"}, {label:"Bikes",icon:"🚲"}, {label:"Cars",icon:"🚗"}, {label:"Scooters",icon:"🛴"} ] }
  ]
}

];
