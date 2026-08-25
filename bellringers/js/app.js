/* Bellringers — app engine.
   No build step, no framework, no login. Favorites live in localStorage. */

/* ─────────────── helpers ─────────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const pick = a => a[Math.floor(Math.random() * a.length)];
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, "0")}`;

const DECK_BY_ID = Object.fromEntries(DECKS.map(d => [d.id, d]));

/* ─────────────── favorites ─────────────── */
const FAV_KEY = "bellringers.favorites.v1";
let favorites = new Set();
try { favorites = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch (e) {}
function toggleFav(id){
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...favorites])); } catch (e) {}
  paintFavCount();
}
function paintFavCount(){
  const el = $("#navFavCount");
  el.hidden = favorites.size === 0;
  el.textContent = favorites.size;
}

/* ─────────────── filter state ─────────────── */
const state = {
  time: null,          // 2 | 5 | 10 | 15
  grades: new Set(),
  subjects: new Set(),
  situation: null,
  previewDeck: null,
  previewIdx: 0
};

function matches(deck){
  if (state.time && deck.minutes > state.time) return false;
  if (state.grades.size && !deck.grades.some(g => state.grades.has(g))) return false;
  if (state.subjects.size){
    if (!deck.subjects.length) return false;
    if (!deck.subjects.some(s => state.subjects.has(s))) return false;
  }
  if (state.situation && state.situation !== "surprise" && !deck.situations.includes(state.situation)) return false;
  return true;
}
const filtered = () => DECKS.filter(matches);

/* ═══════════════════ STAGE RENDERING ═══════════════════
   One renderer drives both the projector player and the little
   classroom preview on the homepage. `rv` is the reveal step. */

function maxReveal(deck, prompt){
  switch (FORMATS[deck.format].render){
    case "clues":  return 4;                      // 3 clues, then the solution
    case "rapid":  return 6;                      // 5 questions, then all answers
    case "zoom":   return 4;                      // 3 zoom-outs, then the answer
    case "reveal": return 1;
    case "quad":   return prompt.note ? 1 : 0;
    default:       return 0;
  }
}

const norm = t => String(t || "").toLowerCase().replace(/[.:!?]+$/, "").trim();

/* A deck shows its own edition slide if it has one; otherwise the format's
   slide, but only on the deck flagged `hero`, so editions never repeat it. */
const artFor = deck => deck.art || (deck.hero ? FORMATS[deck.format].art : null);

/* "Odd One Out: Numbers & Shapes" -> "Numbers & Shapes"; no colon, no badge. */
function editionOf(deck){
  const name = FORMATS[deck.format].name;
  return deck.title.startsWith(name + ":") ? deck.title.slice(name.length + 1).trim() : "";
}

const DASH = `<svg class="stage-dash" viewBox="0 0 30 34" fill="none" aria-hidden="true">
  <path d="M26 4 6 10M28 17H8M26 30 6 24" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`;

function renderStage(deck, prompt, rv = 0){
  const f = FORMATS[deck.format];
  /* the title already says the format name — don't say it twice in the band */
  const stemLine = t => (t && norm(t) !== norm(f.name)) ? `<div class="stage-stem">${esc(t)}</div>` : "";
  let band = "", rest = "";

  switch (f.render){

    case "duel":
      band = `<div class="stage-big">${esc(prompt.stem)} ${esc(lowerFirst(prompt.a.label))} or ${esc(lowerFirst(prompt.b.label))}?</div>`;
      rest = `
        <div class="duel">
          <div class="duel-side a"><div class="duel-orb a">${prompt.a.icon}</div><div class="duel-label">${esc(prompt.a.label)}</div></div>
          <div class="duel-or">OR</div>
          <div class="duel-side b"><div class="duel-orb b">${prompt.b.icon}</div><div class="duel-label">${esc(prompt.b.label)}</div></div>
        </div>`;
      break;

    case "quad":
      band = prompt.scene
        ? `${stemLine(prompt.stem)}<div class="quad-scene">${esc(prompt.scene)}</div>`
        : `<div class="stage-big">${esc(prompt.stem || "")}</div>`;
      rest = `
        <div class="quad">
          ${prompt.items.map((it, i) => `
            <div class="quad-item${it.icon ? "" : " no-icon"}">
              <div class="quad-num">${i + 1}</div>
              ${it.icon ? `<div class="quad-icon">${it.icon}</div>` : ""}
              <div class="quad-label">${esc(it.label)}</div>
            </div>`).join("")}
        </div>
        ${prompt.note && rv >= 1 ? `<div class="stage-note">${esc(prompt.note)}</div>` : ""}`;
      break;

    case "statement":
      band = `${stemLine(prompt.stem)}<div class="stage-big">${esc(prompt.big)}</div>`;
      rest = prompt.sub ? `<div class="stage-sub">${esc(prompt.sub)}</div>` : "";
      break;

    case "reveal":
      band = `<div class="stage-big">${esc(prompt.big)}</div>`;
      rest = rv >= 1
        ? `<div class="answer-box">${esc(prompt.answer)}</div>${prompt.note ? `<div class="answer-note">${esc(prompt.note)}</div>` : ""}`
        : `<div class="stage-sub">Everyone writes a number. No passes.</div>`;
      break;

    case "clues":
      band = `<div class="stage-big">${esc(prompt.big)}</div>`;
      rest = `
        <div class="clues">
          ${prompt.clues.map((c, i) => `
            <div class="clue ${rv >= i + 1 ? "" : "hidden-clue"}">
              <div class="clue-n">${i + 1}</div>
              <div>${rv >= i + 1 ? esc(c) : "• • • • • • • • • • • • • • •"}</div>
            </div>`).join("")}
        </div>
        ${rv >= 4 ? `<div class="solution">${esc(prompt.answer)}</div>` : ""}`;
      break;

    case "objects":
      band = `<div class="stage-big">${esc(prompt.stem)}</div>`;
      rest = `
        <div class="objects">
          ${prompt.items.map(it => `
            <div class="object"><div class="object-icon">${it.icon}</div><div class="object-label">${esc(it.label)}</div></div>`).join("")}
        </div>`;
      break;

    case "caption":
      band = `<div class="stage-big">${esc(prompt.stem)}</div>`;
      rest = `<div class="caption-scene">${prompt.scene}</div>
              ${prompt.sub ? `<div class="stage-sub">${esc(prompt.sub)}</div>` : ""}`;
      break;

    case "rapid":
      band = `<div class="stage-stem">${esc(prompt.stem)}</div>
              <div class="stage-big">Can your class solve all 5 before the teacher does?</div>`;
      rest = `
        <div class="rapid">
          ${prompt.questions.map((q, i) => {
            const shown = rv >= i + 1;
            const ans   = rv >= i + 2;
            return `<div class="rapid-row ${shown ? "" : "pending"}">
                      <div class="rapid-n">${i + 1}</div>
                      <div class="rapid-q">${shown ? esc(q.q) : "?"}</div>
                      ${ans ? `<div class="rapid-a">${esc(q.a)}</div>` : ""}
                    </div>`;
          }).join("")}
        </div>`;
      break;

    case "zoom": {
      const scales = [8, 4.2, 2.1, 1, 1];
      band = `<div class="stage-big">${rv >= 4 ? "It was…" : "What are you looking at?"}</div>`;
      rest = `
        <div class="zoom-frame${rv >= 4 ? " revealed" : ""}"><div class="zoom-emoji" style="transform:scale(${scales[Math.min(rv, 4)]})">${prompt.icon}</div></div>
        ${rv >= 4
          ? `<div class="answer-box">${esc(prompt.answer)}</div>`
          : `<div class="zoom-steps">Zoom ${rv + 1} of 4 &nbsp;·&nbsp; guess now, wrong guesses are free</div>`}`;
      break;
    }
  }

  const edition = editionOf(deck);
  return `<div class="stage">
    <div class="stage-title">${DASH}<span>${esc(f.name)}</span>${DASH.replace('class="stage-dash"', 'class="stage-dash r"')}</div>
    ${edition ? `<div class="stage-badge band-${f.band || "mint"}">${esc(edition)}</div>` : ""}
    <div class="stage-band band-${f.band || "mint"}">${band}</div>
    ${rest}
  </div>`;
}

/* ═══════════════════ PLAYER ═══════════════════ */
const P = {
  deck: null, idx: 0, rv: 0,
  seq: null, seqPos: 0,
  timer: null, remaining: 0, timerTotal: 0,
  open: false
};

function openPlayer(deckId, idx = 0){
  P.seq = null; $("#playerSeq").hidden = true;
  P.deck = DECK_BY_ID[deckId];
  P.idx = idx; P.rv = 0;
  showPlayer();
}

function openSequence(seq){
  P.seq = seq; P.seqPos = 0;
  const b = seq.beats[0];
  P.deck = DECK_BY_ID[b.deckId]; P.idx = b.promptIdx; P.rv = 0;
  $("#playerSeq").hidden = false;
  showPlayer();
  startTimer(b.seconds);
}

function showPlayer(){
  P.open = true;
  $("#player").hidden = false;
  document.body.style.overflow = "hidden";
  paintPlayer();
}

function closePlayer(){
  P.open = false;
  $("#player").hidden = true;
  $("#notesPanel").hidden = true;
  $("#player").classList.remove("notes-open");
  document.body.style.overflow = "";
  stopTimer();
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

function paintPlayer(){
  const deck = P.deck, prompt = deck.prompts[P.idx];
  const f = FORMATS[deck.format];
  $("#playerStage").innerHTML = renderStage(deck, prompt, P.rv);
  $("#playerTitle").textContent = `${deck.title} · ${P.idx + 1} of ${deck.prompts.length}`;
  const direction = deck.direction || f.direction;
  $("#playerDirection").innerHTML = direction ? `<span class="pd-text">${direction}</span>` : "";
  $("#playerChips").innerHTML =
    `<span class="pchip pchip-time">🕐 ${deck.minutes} min</span>` +
    `<span class="pchip pchip-energy e-${deck.energy}">⚡ ${deck.energy[0].toUpperCase() + deck.energy.slice(1)} energy</span>`;

  const mr = maxReveal(deck, prompt);
  const btn = $("#btnReveal");
  btn.hidden = mr === 0 || P.rv >= mr;
  btn.firstChild.nodeValue = revealLabel(deck, P.rv) + " ";

  if (P.seq) paintSeqRail();
  if (!$("#notesPanel").hidden) paintNotes();
}

function revealLabel(deck, rv){
  switch (FORMATS[deck.format].render){
    case "clues":  return rv < 3 ? `Clue ${rv + 1}` : "Solution";
    case "rapid":  return rv === 0 ? "Question 1" : rv < 5 ? `Question ${rv + 1}` : "Answers";
    case "zoom":   return rv < 3 ? "Zoom out" : "Reveal";
    default:       return "Reveal";
  }
}

function nextPrompt(){
  if (P.seq) return advanceSeq();
  P.idx = (P.idx + 1) % P.deck.prompts.length;
  P.rv = 0;
  paintPlayer();
}

function doReveal(){
  if (P.rv < maxReveal(P.deck, P.deck.prompts[P.idx])) { P.rv++; paintPlayer(); }
}

function randomize(){
  const pool = filtered().length ? filtered() : DECKS;
  const d = pick(pool);
  P.deck = d; P.idx = Math.floor(Math.random() * d.prompts.length); P.rv = 0;
  P.seq = null; $("#playerSeq").hidden = true;
  paintPlayer();
}

/* ─── sequence rail ─── */
function paintSeqRail(){
  $("#playerSeq").innerHTML = P.seq.beats.map((b, i) => {
    const cls = i === P.seqPos ? "now" : i < P.seqPos ? "done" : "";
    return `<span class="seq-pip ${cls}">${esc(b.range)} · ${esc(b.label)}</span>`;
  }).join("");
}

function advanceSeq(){
  if (P.seqPos >= P.seq.beats.length - 1){
    closePlayer();
    return;
  }
  P.seqPos++;
  const b = P.seq.beats[P.seqPos];
  if (b.deckId !== P.deck.id || b.promptIdx !== P.idx){
    P.deck = DECK_BY_ID[b.deckId]; P.idx = b.promptIdx; P.rv = 0;
  }
  paintPlayer();
  startTimer(b.seconds);
}

/* ─── timer ─── */
function startTimer(seconds){
  stopTimer();
  P.remaining = seconds; P.timerTotal = seconds;
  $("#timerChip").hidden = false;
  $("#timerChip").classList.remove("done");
  $("#timerClock").textContent = clock(P.remaining);
  P.timer = setInterval(() => {
    P.remaining--;
    $("#timerClock").textContent = clock(Math.max(0, P.remaining));
    if (P.remaining <= 0){
      clearInterval(P.timer); P.timer = null;
      $("#timerChip").classList.add("done");
    }
  }, 1000);
}
function stopTimer(){
  if (P.timer) clearInterval(P.timer);
  P.timer = null;
  $("#timerChip").hidden = true;
  $("#timerChip").classList.remove("done");
}
function bumpTimer(){
  if (!P.timer && $("#timerChip").hidden){
    startTimer(Math.min(P.deck.minutes, 5) * 60);
  } else {
    P.remaining += 60;
    $("#timerClock").textContent = clock(P.remaining);
    $("#timerChip").classList.remove("done");
    if (!P.timer) startTimer(P.remaining);
  }
}

/* ─── teacher notes ─── */
function paintNotes(){
  const f = FORMATS[P.deck.format];
  $("#notesBody").innerHTML = `
    <div class="notes-kicker">Teacher Notes</div>
    <h3>${esc(P.deck.title)}</h3>
    <p style="font-size:13.5px;color:var(--ink-2);margin:6px 0 18px;line-height:1.5">${esc(P.deck.subtitle)}</p>
    <div class="notes-h">How to run it</div>
    <ol>${f.how.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
    <div class="notes-say"><div class="notes-h">Say this</div>${esc(f.say)}</div>
    <div class="notes-why"><div class="notes-h">Why it works</div>${esc(f.why)}</div>`;
}

/* ─── player controls ─── */
$("#btnExit").onclick   = closePlayer;
$("#btnNext").onclick   = nextPrompt;
$("#btnReveal").onclick = doReveal;
$("#btnRandom").onclick = randomize;
$("#btnTimer").onclick  = bumpTimer;
$("#timerStop").onclick = stopTimer;
$("#btnFull").onclick   = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $("#player").requestFullscreen().catch(() => {});
};
$("#btnNotes").onclick  = () => {
  const n = $("#notesPanel");
  n.hidden = !n.hidden;
  if (!n.hidden) paintNotes();
  $("#player").classList.toggle("notes-open", !n.hidden);
};
$("#notesClose").onclick = () => { $("#notesPanel").hidden = true; $("#player").classList.remove("notes-open"); };

document.addEventListener("keydown", e => {
  if (!P.open) return;
  if (e.key === "Escape"){
    if (!$("#notesPanel").hidden){ $("#notesPanel").hidden = true; $("#player").classList.remove("notes-open"); }
    else closePlayer();
  }
  else if (e.key === "ArrowRight" || e.key === " "){ e.preventDefault(); nextPrompt(); }
  else if (e.key === "ArrowLeft"){ if (!P.seq){ P.idx = (P.idx - 1 + P.deck.prompts.length) % P.deck.prompts.length; P.rv = 0; paintPlayer(); } }
  else if (e.key === "r" || e.key === "R") doReveal();
  else if (e.key === "t" || e.key === "T") bumpTimer();
  else if (e.key === "f" || e.key === "F") $("#btnFull").click();
  else if (e.key === "n" || e.key === "N") $("#btnNotes").click();
});

/* ═══════════════════ BELLRINGER MODE ═══════════════════
   One activity becomes a timed facilitation sequence. Longer blocks
   chain more than one activity. "I have 7 minutes" works. */

const BEATS = {
  "pick-a-side":            [["Pick a Side",.20,"Set the stage with a fun prompt."],["Partner Talk",.50,"Talk with a partner and share ideas."],["Class Vote",.30,"Vote as a class and reveal results."]],
  "wrong-answers-only":     [["Post the Question",.15,"Read it. Set the rule: wrong answers only."],["Rapid Fire",.55,"Take answers with no commentary in between."],["The Real Answer",.30,"Now ask for the true one."]],
  "odd-one-out":            [["Silent Look",.20,"Twenty seconds, no hands."],["Pick and Defend",.50,"Everyone chooses one and says because."],["Defend All Four",.30,"Keep going until each has been argued."]],
  "one-has-to-go":          [["Read the Four",.15,"Establish that it's gone forever."],["Decide Privately",.35,"No talking yet."],["Vote and Appeal",.50,"One appeal, then re-vote."]],
  "defend-the-ridiculous":  [["Post the Claim",.15,"Nobody has to believe it."],["Build the Case",.45,"Sixty seconds with a partner."],["Present and Score",.40,"Two pairs present. Class scores persuasion."]],
  "estimate-it":            [["Private Guess",.30,"Everyone writes a number."],["Share Reasoning",.40,"Two students explain how they got there."],["Revise and Reveal",.30,"Change your number, then find out."]],
  "micro-mystery":          [["The Scenario",.20,"What do you notice?"],["Clues, One at a Time",.50,"Pause after each one."],["Theories and Reveal",.30,"Which clue gave it away?"]],
  "sixty-second-story":     [["Three Objects",.15,"Show them. Start the clock."],["Write",.45,"Sixty silent seconds."],["Share Two",.40,"Vote on best use of the third object."]],
  "caption-this":           [["The Scene",.15,"Look at it. One line only."],["Write",.45,"Ninety seconds."],["Read and Vote",.40,"Anonymous on the board."]],
  "would-you-survive":      [["Scenario",.25,"Read all four options first."],["Commit and Defend",.45,"Fingers up on three."],["Reveal and Argue",.30,"Find out what actually happens."]],
  "beat-the-teacher":       [["Set the Score",.10,"Class 0, Teacher 0."],["Five Questions",.70,"First correct answer takes the point."],["Final Score",.20,"On the board until next time."]],
  "mystery-zoom":           [["Zoomed In",.30,"Guess early. Wrong guesses are free."],["Zoom Out",.50,"One step every fifteen seconds."],["Reveal",.20,"What was the giveaway?"]]
};

function buildSequence(totalMin, opts = {}){
  const grade = opts.grade || null, energy = opts.energy || null, subject = opts.subject || null;
  let pool = DECKS.filter(d =>
    (!grade   || d.grades.includes(grade)) &&
    (!energy  || d.energy === energy) &&
    (!subject || d.subjects.includes(subject)));
  if (!pool.length) pool = DECKS.filter(d => !grade || d.grades.includes(grade));
  if (!pool.length) pool = DECKS.slice();

  const total = Math.max(2, Math.min(60, totalMin));
  let remaining = total, chosen = [], guard = 0;
  const usedFormats = new Set();

  while (remaining >= 2 && guard++ < 12){
    let fits = pool.filter(d => d.minutes <= remaining && !usedFormats.has(d.format));
    if (!fits.length) fits = pool.filter(d => d.minutes <= remaining);
    if (!fits.length) break;
    const best = Math.max(...fits.map(d => d.minutes));
    const d = pick(fits.filter(x => x.minutes === best));
    chosen.push(d); usedFormats.add(d.format);
    remaining -= d.minutes;
  }
  if (!chosen.length) chosen = [pick(pool)];

  // any leftover minutes get folded into the last activity rather than left dangling
  const share = remaining > 0 ? remaining / chosen.length : 0;

  const beats = [];
  let t = 0;
  chosen.forEach(deck => {
    const promptIdx = Math.floor(Math.random() * deck.prompts.length);
    const secs = Math.round((deck.minutes + share) * 60);
    const tpl = BEATS[deck.format];
    let acc = 0;
    tpl.forEach((b, i) => {
      const dur = i === tpl.length - 1 ? secs - acc : Math.round(secs * b[1]);
      acc += dur;
      const start = t, end = t + dur;
      beats.push({
        deckId: deck.id, promptIdx, label: b[0], blurb: b[2],
        seconds: dur, start, end, range: `${clock(start)} – ${clock(end)}`,
        icon: FORMATS[deck.format].icon, tint: FORMATS[deck.format].tint
      });
      t = end;
    });
  });
  return { beats, totalSeconds: t, decks: chosen };
}

/* ═══════════════════ CARD + CHIP MARKUP ═══════════════════ */
function cardHTML(deck){
  const f = FORMATS[deck.format];
  const on = favorites.has(deck.id);
  const art = artFor(deck);
  return `
    <div class="card" data-deck="${deck.id}" role="button" tabindex="0">
      <div class="card-art art-${f.tint}${art ? " has-img" : ""}">
        ${art ? `<img class="card-img" src="${art}" alt="" loading="lazy" decoding="async">` : f.icon}
        <button class="fav ${on ? "on" : ""}" data-fav="${deck.id}" aria-label="Favorite">${on ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <div class="card-title">${esc(deck.title)}</div>
        <div class="card-desc">${esc(deck.subtitle)}</div>
        <div class="card-meta">
          <span>🕐 ${deck.minutes} min</span>
          <span><i class="bars e-${deck.energy}"><i></i><i></i><i></i></i> ${esc(deck.energy[0].toUpperCase() + deck.energy.slice(1))}</span>
        </div>
      </div>
    </div>`;
}

function chipsHTML(){
  return `
    <div class="filters">
      <div class="fgroup">
        <div class="fgroup-label">🕐 Time</div>
        <div class="chips">${TIMES.map(t => `<button class="chip ${state.time === t ? "on" : ""}" data-f="time" data-v="${t}">${t} min</button>`).join("")}</div>
      </div>
      <div class="fgroup">
        <div class="fgroup-label">👥 Audience</div>
        <div class="chips">${GRADES.map(g => `<button class="chip ${state.grades.has(g.id) ? "on" : ""}" data-f="grade" data-v="${g.id}">${g.label}</button>`).join("")}</div>
      </div>
      <div class="fgroup">
        <div class="fgroup-label">📖 Subject</div>
        <div class="chips">${SUBJECTS.map(s => `<button class="chip ${state.subjects.has(s.id) ? "on" : ""}" data-f="subject" data-v="${s.id}">${esc(s.label)}</button>`).join("")}</div>
      </div>
    </div>`;
}

/* ═══════════════════ VIEWS ═══════════════════ */
function viewHome(){
  const list = filtered();
  const featured = (list.filter(d => d.featured).length ? list.filter(d => d.featured) : list).slice(0, 8);
  if (!state.previewDeck || !matches(state.previewDeck)) setPreview(list[0] || DECKS[0]);

  return `
  <div class="home">
    <div class="home-left">
      <div class="hero">
        <svg class="hero-swoop" width="86" height="40" viewBox="0 0 86 40" fill="none" aria-hidden="true">
          <path d="M4 30C22 8 52 4 82 16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
          <path d="M20 36C36 20 58 18 78 26" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
        </svg>
        <svg class="hero-arrow" width="40" height="62" viewBox="0 0 40 62" fill="none" aria-hidden="true">
          <path d="M6 4C22 18 30 34 28 54" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M18 42L28 56L36 40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1><span class="spark">〰</span> What kind of five<br>minutes are we dealing with?</h1>
        <p>Fun, engaging ways to start class, fill awkward transition times, and get students thinking fast.</p>
      </div>

      <div class="situations">
        ${SITUATIONS.map(s => `
          <button class="sit t-${s.tint}" data-sit="${s.id}">
            <span class="sit-icon">${s.icon}</span>
            <span><span class="sit-label">${esc(s.label)}</span><span class="sit-sub">${esc(s.sub)}</span></span>
            <span class="sit-chev">›</span>
          </button>`).join("")}
      </div>

      ${chipsHTML()}

      <div class="sec-head">
        <span class="sec-star">⭐</span>
        <h2>Featured Activities</h2>
        <a class="sec-link" href="#/library">View all →</a>
      </div>
      <p class="sec-sub">Teacher favorites that work every time.</p>
      <div class="rail-wrap">
        <div class="rail" id="rail">${featured.map(cardHTML).join("") || `<div class="empty"><b>Nothing matches all of that.</b>Loosen a filter.</div>`}</div>
        ${featured.length > 4 ? `<button class="rail-next" id="railNext" aria-label="Scroll right">›</button>` : ""}
      </div>

      <div class="value-strip">
        <div class="value"><span class="value-icon">🕐</span><span><b>Save time</b><span>Ready-to-go activities that actually work.</span></span></div>
        <div class="value"><span class="value-icon">👥</span><span><b>Engage every student</b><span>Built for participation, not just busywork.</span></span></div>
        <div class="value"><span class="value-icon">❤️</span><span><b>Feel confident</b><span>Classroom-tested by real teachers.</span></span></div>
        <div class="value"><span class="value-icon">🛡️</span><span><b>Always appropriate</b><span>Safe, inclusive, and grade-level smart.</span></span></div>
      </div>
    </div>

    <div class="home-right">
      ${previewPanelHTML()}
      ${homeSeqPanelHTML()}
      <div class="fav-card">
        <div>
          <h3>⭐ Save your favorites</h3>
          <p>Favorites and custom sequences save right here in this browser. No account required, no email, no nonsense.</p>
          <a class="btn btn-teal" href="#/favorites">See favorites${favorites.size ? ` (${favorites.size})` : ""}</a>
        </div>
        <div class="fav-card-icon">🖍️</div>
      </div>
    </div>
  </div>`;
}

function setPreview(deck){
  if (!deck) return;
  state.previewDeck = deck;
  state.previewIdx = Math.floor(Math.random() * deck.prompts.length);
}

function previewPanelHTML(){
  const d = state.previewDeck, f = FORMATS[d.format];
  return `
  <div class="panel">
    <div class="panel-head">
      <span class="ph-icon">🖥️</span>
      <span><b>Classroom Preview</b><span>This is what your students will see.</span></span>
      <span class="panel-tag">${esc(d.title)}</span>
    </div>
    <div class="preview" id="previewBox">
      <div class="preview-open"><span>Put it on the board →</span></div>
      <div class="preview-stage">${renderStage(d, d.prompts[state.previewIdx], 0)}</div>
      <div class="preview-bar">
        <span class="mini-clock">🕐 ${String(d.minutes).padStart(2, "0")}:00</span>
        <span class="sp"></span>
        <button class="mini-btn amber" data-prev="next">Next</button>
        <button class="mini-btn" data-prev="open">Timer</button>
        <button class="mini-btn" data-prev="open">⤢ Full Screen</button>
      </div>
    </div>
  </div>`;
}

let homeSeq = null;
function homeSeqPanelHTML(){
  if (!homeSeq) homeSeq = buildSequence(5, { grade: [...state.grades][0] || null });
  return `
  <div class="panel">
    <div class="panel-head">
      <span class="ph-icon">⚡</span>
      <span><b>Bellringer Mode</b><span>Build a quick 5-minute sequence.</span></span>
    </div>
    <div class="seq-list">
      <div class="seq-total">
        <b>${clock(homeSeq.totalSeconds)} Total</b>
        <span class="st-name">${esc(homeSeq.decks.map(d => d.title).join(" + "))}</span>
        <a class="st-edit" href="#/bellringer-mode">Edit</a>
      </div>
      ${homeSeq.beats.map(b => `
        <button class="seq-row" data-seqrun="1">
          <span class="seq-time">${esc(b.range)}</span>
          <span class="seq-icon art-${b.tint}">${b.icon}</span>
          <span class="seq-copy"><b>${esc(b.label)}</b><span>${esc(b.blurb)}</span></span>
          <span class="seq-grip">≡</span>
        </button>`).join("")}
    </div>
    <div class="seq-actions">
      <button class="btn" id="seqShuffle">↻ New flow</button>
      <button class="btn btn-dark" data-seqrun="1">▶ Run This Sequence</button>
    </div>
  </div>`;
}

function viewLibrary(){
  const list = filtered();
  const sit = SITUATIONS.find(s => s.id === state.situation);
  return `
  <div class="page">
    <div class="page-head">
      <h1>${sit ? esc(sit.label) : "Activity Library"}</h1>
      <p>${sit
        ? esc(sit.sub) + " Every one of these is projector-ready — pick it, put it on the board, go."
        : "Every Bellringer, all in one place. Each one has a full bank of prompts behind it, so Next never runs out."}</p>
    </div>
    ${sit ? `<p style="margin:-8px 0 16px"><a class="btn" href="#/library" data-clearsit="1">✕ Clear “${esc(sit.label)}”</a></p>` : ""}
    ${chipsHTML()}
    <p class="result-count">${list.length} ${list.length === 1 ? "activity" : "activities"} · ${list.reduce((n, d) => n + d.prompts.length, 0)} prompts ready to go</p>
    ${list.length
      ? `<div class="grid">${list.map(cardHTML).join("")}</div>`
      : `<div class="empty"><b>Nothing matches all of that.</b>Try clearing the subject filter — a lot of Bellringers work in any class.</div>`}
  </div>`;
}

function viewFavorites(){
  const list = DECKS.filter(d => favorites.has(d.id));
  return `
  <div class="page">
    <div class="page-head">
      <h1>Favorites</h1>
      <p>Saved in this browser only. Nothing is sent anywhere, and nobody made you create an account.</p>
    </div>
    ${list.length
      ? `<div class="grid">${list.map(cardHTML).join("")}</div>`
      : `<div class="empty"><b>No favorites yet.</b>Tap the ♡ on any activity and it lands here.</div>`}
  </div>`;
}

let builderSeq = null;
function viewBuilder(){
  return `
  <div class="page">
    <div class="page-head">
      <h1>Bellringer Mode</h1>
      <p>Tell it how many minutes you have. It builds the whole block — activity, timings, and what to say at each beat. “I have 7 minutes” is a real answer.</p>
    </div>
    <div class="builder">
      <div>
        <h3>How much time do we have?</h3>
        <div class="field">
          <label>Minutes</label>
          <div class="chips" style="margin-bottom:9px">
            ${[2,5,7,10,15].map(m => `<button class="chip" data-min="${m}">${m} min</button>`).join("")}
          </div>
          <input class="minutes-input" id="minInput" type="number" min="2" max="60" value="5"> <span style="font-size:13px;color:var(--ink-2)">minutes</span>
        </div>
        <div class="field">
          <label>Grade band</label>
          <div class="chips" id="bGrades">
            ${GRADES.map(g => `<button class="chip" data-bgrade="${g.id}">${g.label}</button>`).join("")}
          </div>
        </div>
        <div class="field">
          <label>Energy</label>
          <div class="chips" id="bEnergy">
            ${ENERGY.map(e => `<button class="chip" data-benergy="${e.id}" title="${esc(e.note)}">${e.label}</button>`).join("")}
          </div>
        </div>
        <div class="field">
          <label>Subject (optional)</label>
          <div class="chips" id="bSubject">
            ${SUBJECTS.map(s => `<button class="chip" data-bsubject="${s.id}">${esc(s.label)}</button>`).join("")}
          </div>
        </div>
        <button class="btn btn-amber" id="btnBuild" style="width:100%;padding:13px">⚡ Build my Bellringer</button>
      </div>
      <div class="build-out" id="buildOut"></div>
    </div>
  </div>`;
}

function paintBuild(){
  const s = builderSeq;
  $("#buildOut").innerHTML = `
    <div class="seq-total">
      <b>${clock(s.totalSeconds)} Total</b>
      <span class="st-name">${esc(s.decks.map(d => d.title).join(" + "))}</span>
    </div>
    ${s.beats.map(b => `
      <div class="seq-row">
        <span class="seq-time">${esc(b.range)}</span>
        <span class="seq-icon art-${b.tint}">${b.icon}</span>
        <span class="seq-copy"><b>${esc(b.label)}</b><span>${esc(b.blurb)}</span></span>
      </div>`).join("")}
    <div style="display:flex;gap:9px;margin-top:14px">
      <button class="btn" id="buildAgain">↻ Try another</button>
      <button class="btn btn-dark" id="buildRun" style="flex:1">▶ Run This Sequence</button>
    </div>`;
  $("#buildRun").onclick   = () => openSequence(builderSeq);
  $("#buildAgain").onclick = () => { doBuild(); };
}

const builderState = { minutes: 5, grade: null, energy: null, subject: null };
function doBuild(){
  builderSeq = buildSequence(builderState.minutes, builderState);
  paintBuild();
}

/* ═══════════════════ ROUTER + EVENTS ═══════════════════ */
function route(){
  const hash = location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
  const view = $("#view");
  $$(".site-nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === (hash || "home")));

  if (hash === "library")            view.innerHTML = viewLibrary();
  else if (hash === "favorites")     view.innerHTML = viewFavorites();
  else if (hash === "bellringer-mode"){
    view.innerHTML = viewBuilder();
    doBuild();
    syncBuilderChips();
  }
  else                               view.innerHTML = viewHome();

  window.scrollTo(0, 0);
  paintFavCount();
  wireRail();
}

function syncBuilderChips(){
  $$("[data-min]").forEach(b => b.classList.toggle("on", +b.dataset.min === builderState.minutes));
  $$("[data-bgrade]").forEach(b => b.classList.toggle("on", b.dataset.bgrade === builderState.grade));
  $$("[data-benergy]").forEach(b => b.classList.toggle("on", b.dataset.benergy === builderState.energy));
  $$("[data-bsubject]").forEach(b => b.classList.toggle("on", b.dataset.bsubject === builderState.subject));
  const inp = $("#minInput"); if (inp) inp.value = builderState.minutes;
}

function wireRail(){
  const next = $("#railNext");
  if (next) next.onclick = () => $("#rail").scrollBy({ left: 460, behavior: "smooth" });
  const box = $("#previewBox");
  if (box) box.onclick = e => {
    const act = e.target.closest("[data-prev]");
    if (act && act.dataset.prev === "next"){
      const d = state.previewDeck;
      state.previewIdx = (state.previewIdx + 1) % d.prompts.length;
      $(".preview-stage").innerHTML = renderStage(d, d.prompts[state.previewIdx], 0);
      return;
    }
    openPlayer(state.previewDeck.id, state.previewIdx);
  };
}

document.addEventListener("click", e => {
  /* favorite hearts */
  const fav = e.target.closest("[data-fav]");
  if (fav){
    e.stopPropagation();
    toggleFav(fav.dataset.fav);
    const on = favorites.has(fav.dataset.fav);
    fav.classList.toggle("on", on);
    fav.textContent = on ? "\u2665" : "\u2661";
    if (location.hash.includes("favorites")) route();
    return;
  }

  /* activity cards */
  const card = e.target.closest("[data-deck]");
  if (card){ openPlayer(card.dataset.deck); return; }

  /* situation tiles */
  const sit = e.target.closest("[data-sit]");
  if (sit){
    const id = sit.dataset.sit;
    if (id === "surprise"){
      const pool = filtered().length ? filtered() : DECKS;
      const d = pick(pool);
      openPlayer(d.id, Math.floor(Math.random() * d.prompts.length));
    } else {
      state.situation = id;
      if (location.hash.replace(/^#\/?/, "") === "library") route();
      else location.hash = "#/library";
    }
    return;
  }
  if (e.target.closest("[data-clearsit]")){ state.situation = null; route(); return; }

  /* filter chips */
  const chip = e.target.closest("[data-f]");
  if (chip){
    const { f, v } = chip.dataset;
    if (f === "time")    state.time = state.time === +v ? null : +v;
    if (f === "grade")   state.grades.has(v)   ? state.grades.delete(v)   : state.grades.add(v);
    if (f === "subject") state.subjects.has(v) ? state.subjects.delete(v) : state.subjects.add(v);
    homeSeq = null;
    if (state.previewDeck && !matches(state.previewDeck)) setPreview(filtered()[0] || DECKS[0]);
    route();
    return;
  }

  /* homepage sequence panel */
  if (e.target.closest("[data-seqrun]")){ openSequence(homeSeq); return; }
  if (e.target.closest("#seqShuffle")){ homeSeq = null; route(); return; }

  /* builder chips */
  const bm = e.target.closest("[data-min]");
  if (bm){ builderState.minutes = +bm.dataset.min; doBuild(); syncBuilderChips(); return; }
  const bg = e.target.closest("[data-bgrade]");
  if (bg){ builderState.grade = builderState.grade === bg.dataset.bgrade ? null : bg.dataset.bgrade; doBuild(); syncBuilderChips(); return; }
  const be = e.target.closest("[data-benergy]");
  if (be){ builderState.energy = builderState.energy === be.dataset.benergy ? null : be.dataset.benergy; doBuild(); syncBuilderChips(); return; }
  const bs = e.target.closest("[data-bsubject]");
  if (bs){ builderState.subject = builderState.subject === bs.dataset.bsubject ? null : bs.dataset.bsubject; doBuild(); syncBuilderChips(); return; }
  if (e.target.closest("#btnBuild")){ doBuild(); return; }
});

document.addEventListener("input", e => {
  if (e.target.id === "minInput"){
    const v = Math.max(2, Math.min(60, +e.target.value || 5));
    builderState.minutes = v;
    $$("[data-min]").forEach(b => b.classList.toggle("on", +b.dataset.min === v));
    doBuild();
  }
});

document.addEventListener("keydown", e => {
  if (P.open) return;
  const card = e.target.closest && e.target.closest("[data-deck]");
  if (card && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); openPlayer(card.dataset.deck); }
});

window.addEventListener("hashchange", route);
route();
