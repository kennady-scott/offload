/* 5 Minutes Before the Bell — app
   Routes: #/  #/browse  #/a/:id  #/favorites  #/dashboard
   Overlays: the finder, the full-screen result, and Project Mode. */
(function () {
"use strict";

/* ─────────────────────────── icons ─────────────────────────── */
const I = {
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  speech:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  brain:'<path d="M12 5.2A2.6 2.6 0 0 0 7.1 4 2.6 2.6 0 0 0 4.8 6.6a2.6 2.6 0 0 0-.5 4.1A2.6 2.6 0 0 0 5.9 15a2.6 2.6 0 0 0 3.6 2.5A2.6 2.6 0 0 0 12 19.4z"/><path d="M12 5.2A2.6 2.6 0 0 1 16.9 4a2.6 2.6 0 0 1 2.3 2.6 2.6 2.6 0 0 1 .5 4.1A2.6 2.6 0 0 1 18.1 15a2.6 2.6 0 0 1-3.6 2.5A2.6 2.6 0 0 1 12 19.4z"/><path d="M12 5.2v14.2"/>',
  star:'<path d="m12 2 2.9 6.3 6.6.8-4.9 4.6 1.3 6.6L12 17.1 6.1 20.3l1.3-6.6L2.5 9.1l6.6-.8z"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  shuffle:'<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  check:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 18l-6-6 6-6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  play:'<path d="m6 4 14 8-14 8z" fill="currentColor" stroke="none"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
  reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  volume:'<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/>',
  sparkle:'<path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  folder:'<path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  printer:'<path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="8" rx="2"/><path d="M6 14h12v8H6z"/>',
  wifi:'<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01"/><path d="m2 2 20 20"/>',
  lock:'<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const svg = (n, s) =>
  `<svg width="${s||18}" height="${s||18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||""}</svg>`;

/* ─────────────────────────── storage ─────────────────────────── */
const K = {
  fav:"fmbtb.favorites.v1", plays:"fmbtb.plays.v1", coll:"fmbtb.collections.v1",
  cls:"fmbtb.classes.v1", who:"fmbtb.teacher.v1", lastCls:"fmbtb.lastclass.v1",
  legacyRecents:"fmbtb.recents.v1",
};
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let favs        = store.get(K.fav, []);
let plays       = store.get(K.plays, []);          // [{id, cls, ts}]
let collections = store.get(K.coll, {});           // {name: [ids]}
let classes     = store.get(K.cls, []);            // [name]
let teacher     = store.get(K.who, "");
let lastClass   = store.get(K.lastCls, "");

// one-time migration from the old recents list
(function migrate() {
  const old = store.get(K.legacyRecents, null);
  if (Array.isArray(old) && old.length && !plays.length) {
    plays = old.map((id, i) => ({ id, cls: "", ts: Date.now() - (i + 1) * 864e5 }));
    store.set(K.plays, plays);
    try { localStorage.removeItem(K.legacyRecents); } catch {}
  }
})();

/* ───────────────────────── helpers ───────────────────────── */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const byId = id => ACTIVITIES.find(a => a.id === id);
const cat  = k => CATEGORIES[k];
const catVar = k => "--c-" + cat(k).short.toLowerCase();
const gradeLabel = k => (GRADES.find(g => g.key === k) || {}).label || k;
const gradesText = arr => {
  const o = ["k2","35","68","912"].filter(g => arr.includes(g));
  if (o.length === 4) return "K–12";
  if (o.length === 3 && o[0] === "k2") return "K–8";          // k2+35+68
  if (o.length === 3 && o[0] === "35") return "3–12";         // 35+68+912
  if (o.length === 2 && o[0] === "68") return "6–12";         // 68+912
  return o.map(gradeLabel).join(", ");
};
const noiseLabel  = { silent:"Silent", quiet:"Quiet", lively:"Lively" };
const formatLabel = { whole:"Whole class", pairs:"Pairs", solo:"Independent", small:"Small groups" };

function shuffle(arr, seed) {
  const a = arr.slice();
  let s = seed == null ? Math.floor(Math.random() * 1e9) : seed;
  const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];

function ago(ts) {
  const d = Math.floor((Date.now() - ts) / 864e5);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return d + " days ago";
  if (d < 14) return "last week";
  return Math.floor(d / 7) + " weeks ago";
}
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-up");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("is-up"), 2100);
}
const voiceLine = i => VOICE[(i == null ? Math.floor(Math.random() * VOICE.length) : i) % VOICE.length];

/* ─────────────────── favorites / plays / collections ─────────────────── */
function isFav(id) { return favs.includes(id); }
function toggleFav(id) {
  const i = favs.indexOf(id);
  if (i >= 0) { favs.splice(i, 1); toast("Removed from favorites"); }
  else { favs.push(id); toast("Saved ♡"); }
  store.set(K.fav, favs);
  paintFavCount();
  $$('[data-fav="' + id + '"]').forEach(b => {
    b.classList.toggle("is-on", isFav(id));
    b.setAttribute("aria-pressed", String(isFav(id)));
  });
  $$('[data-fav-inline="' + id + '"]').forEach(b => {
    const long = b.classList.contains("btn-block");
    b.classList.toggle("is-on", isFav(id));
    b.innerHTML = svg("heart",16) + " " + (isFav(id) ? (long ? "Saved to favorites" : "Saved") : (long ? "Save to favorites" : "Save"));
  });
}
function paintFavCount() {
  const el = $("#favCount");
  el.textContent = favs.length;
  el.hidden = favs.length === 0;
}
function logPlay(id) {
  const last = plays[0];
  if (last && last.id === id && Date.now() - last.ts < 6e5) return; // don't double-count
  plays = [{ id, cls: lastClass, ts: Date.now() }].concat(plays).slice(0, 200);
  store.set(K.plays, plays);
}
function playedRecently(id, cls) {
  const p = plays.find(x => x.id === id && (!cls || x.cls === cls));
  return p ? ago(p.ts) : null;
}
function addToCollection(name, id) {
  if (!collections[name]) collections[name] = [];
  if (!collections[name].includes(id)) collections[name].push(id);
  store.set(K.coll, collections);
}

/* ─────────────────────── filtering ─────────────────────── */
/* Default order round-robins the categories so a browse page never opens
   as one long block of a single color. */
const BROWSE_ORDER = (() => {
  const buckets = CAT_ORDER.map(k => ACTIVITIES.filter(a => a.cat === k));
  const out = [];
  for (let i = 0; out.length < ACTIVITIES.length; i++) buckets.forEach(b => { if (b[i]) out.push(b[i]); });
  return out;
})();

function filterActivities(f) {
  f = f || {};
  return BROWSE_ORDER.filter(a => {
    if (f.cat && a.cat !== f.cat) return false;
    if (f.grade && !a.grades.includes(f.grade)) return false;
    if (f.vibe && f.vibe !== "surprise" && !a.vibes.includes(f.vibe)) return false;
    if (f.moment && !a.moments.includes(f.moment)) return false;
    if (f.time && a.minutes > Number(f.time)) return false;   // "I have N minutes" = at most N
    if (f.exact && a.minutes !== Number(f.exact)) return false;
    if (f.fav && !isFav(a.id)) return false;
    if (f.coll && !(collections[f.coll] || []).includes(a.id)) return false;
    if (f.q) {
      const hay = (a.title + " " + a.hook + " " + a.why + " " + a.steps.join(" ")).toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    return true;
  });
}
function qs(o) {
  return Object.entries(o).filter(([, v]) => v || v === 0).map(([k, v]) => k + "=" + encodeURIComponent(v)).join("&");
}

/* ─────────────────────── small components ─────────────────────── */
const pill = k => `<span class="pill cat-${k}">${esc(cat(k).short)}</span>`;
const bellTag = m => `<span class="tag tag-bell">${svg("bell",11)} ${m} MIN</span>`;

function favBtn(id) {
  return `<button class="fav ${isFav(id) ? "is-on" : ""}" data-fav="${id}" aria-pressed="${isFav(id)}" aria-label="Save to favorites">${svg("heart",17)}</button>`;
}

function activityCard(a, opts) {
  opts = opts || {};
  const played = opts.showPlayed ? playedRecently(a.id) : null;
  return `<div class="acard">
    ${favBtn(a.id)}
    <a href="#/a/${a.id}" style="display:contents">
      <div class="acard-top">${pill(a.cat)}${bellTag(a.minutes)}</div>
      <h3>${esc(a.title)}</h3>
      <p class="hook">${esc(a.hook)}</p>
      <div class="acard-meta">
        <span class="tag">${gradesText(a.grades)}</span>
        <span class="tag">${svg("volume",11)} ${noiseLabel[a.noise]}</span>
        <span class="tag">${svg("users",11)} ${formatLabel[a.format]}</span>
        ${played ? `<span class="tag tag-played">played ${played}</span>` : ""}
      </div>
    </a>
  </div>`;
}

function dial(seconds, cls, catKey) {
  const C = 2 * Math.PI * 44;
  const tone = catKey ? ` style="--dial:var(${catVar(catKey)});--dial-track:var(${catVar(catKey)}-line)"` : "";
  return `<div class="${cls || "dial"}" data-dial data-total="${seconds}"${tone}>
    <svg viewBox="0 0 100 100">
      <circle class="track" cx="50" cy="50" r="44"/>
      <circle class="prog" cx="50" cy="50" r="44" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="0"/>
    </svg>
    <div class="dial-face"><div>
      <div class="dial-time">${fmtTime(seconds)}</div>
      <div class="dial-unit">min</div>
    </div></div>
  </div>`;
}
function fmtTime(s) {
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

/* ─────────────────────────── timer ─────────────────────────── */
function makeTimer(root) {
  const el = $("[data-dial]", root);
  if (!el) return null;
  const total = Number(el.dataset.total);
  const prog = $(".prog", el), face = $(".dial-time", el);
  const C = 2 * Math.PI * 44;
  let left = total, tick = null, running = false;

  const paint = () => {
    face.textContent = fmtTime(Math.max(0, left));
    prog.style.strokeDashoffset = (C * (1 - Math.max(0, left) / total)).toFixed(2);
  };
  function chime() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      // a small bell: two strikes, bright then settling
      [[0, 1046], [.14, 1568], [.30, 1046], [.46, 784]].forEach(([t, f]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0, ctx.currentTime + t);
        g.gain.linearRampToValueAtTime(.17, ctx.currentTime + t + .015);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + t + .9);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + .95);
      });
      setTimeout(() => ctx.close(), 2200);
    } catch {}
  }
  const api = {
    toggle() { running ? api.pause() : api.start(); },
    start() {
      if (running || left <= 0) return;
      running = true; api.onstate && api.onstate(true);
      api.onstart && api.onstart();
      tick = setInterval(() => {
        left--; paint();
        if (left <= 0) {
          clearInterval(tick); running = false;
          el.classList.add("is-done"); chime();
          api.onstate && api.onstate(false);
          api.ondone && api.ondone();
        }
      }, 1000);
    },
    pause() { running = false; clearInterval(tick); api.onstate && api.onstate(false); },
    reset() { clearInterval(tick); running = false; left = total; el.classList.remove("is-done"); paint(); api.onstate && api.onstate(false); },
    destroy() { clearInterval(tick); },
    get running() { return running; },
  };
  paint();
  return api;
}

function wireTimer(root, timer, startLabel, pauseLabel, activityId, onDone) {
  if (!timer) return;
  const btn = $("[data-t-toggle]", root), rst = $("[data-t-reset]", root);
  if (btn) {
    timer.onstate = r => { btn.innerHTML = r ? svg("pause",15) + " " + (pauseLabel || "Pause") : svg("play",15) + " " + (startLabel || "Start"); };
    btn.addEventListener("click", () => timer.toggle());
  }
  if (rst) rst.addEventListener("click", () => timer.reset());
  if (activityId) timer.onstart = () => logPlay(activityId);
  timer.ondone = onDone || (() => toast("🔔 RIIIIING. You made it."));
}

/* ─────────────── the bell (what happens at zero) ─────────────── */
function bellPanel(a, size) {
  const nxt = nextSuggestion(a);
  return `<div class="bell-done ${size === "big" ? "bell-big" : ""}">
    <div class="bell-ico">${svg("bell", size === "big" ? 64 : 36)}</div>
    <div class="bell-ring">RIIIIING.</div>
    <div class="bell-sub">You made it.</div>
    ${nxt ? `<button class="btn ${size === "big" ? "btn-amber btn-lg" : "btn-ghost btn-block"}" data-onemore="${nxt.id}">One more? ${svg("arrow",16)}</button>` : ""}
  </div>`;
}
function nextSuggestion(a) {
  const pool = ACTIVITIES.filter(x => x.id !== a.id && x.minutes <= a.minutes);
  const same = pool.filter(x => x.cat === a.cat);
  return pickOne(same.length ? same : pool);
}

/* ═══════════════════════════ HOME ═══════════════════════════ */
function viewHome() {
  const previewPicks = ["mind-mindful-minute","fun-would-you-rather-impossible","math-which-one-doesnt-belong"].map(byId);
  const fallback = ["fun-two-truths-and-a-lie","math-mathle","fun-back-to-back-drawing"];
  const recentRows = Array.from(new Set(plays.map(p => p.id).concat(fallback))).map(byId).filter(Boolean).slice(0, 3);

  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <h1>Turn the awkward five minutes into something worth doing.</h1>
        <p class="hero-sub">Quick, classroom-ready activities for the moments when your lesson ends early, the assembly starts late, or everyone just needs a reset.</p>
        <button class="btn btn-primary btn-lg" data-open-finder>I’ve Got 5 Minutes ${svg("arrow",18)}</button>
        <div class="hero-note">${svg("check",17)} No prep. No printing. No digging through a 47-page PDF.</div>
      </div>
      <div class="preview" aria-hidden="true">
        <div class="preview-win">
          <div class="preview-rail">
            <span class="rail-item on">${svg("home",19)} Home</span>
            <span class="rail-item">${svg("search",19)} Browse</span>
            <span class="rail-item">${svg("heart",19)} Saved</span>
            <span class="rail-item">${svg("grid",19)} Grade</span>
            <span class="rail-item">${svg("layers",19)} Library</span>
          </div>
          <div class="preview-body">
            <div class="preview-hi">Welcome back, Teacher! 👋</div>
            <div class="preview-q">What’s the plan for today?</div>
            <div class="preview-cards">
              ${previewPicks.map(a => `<div class="pcard cat-${a.cat}">
                <span>${esc(a.title)}</span>
                <span class="pico">${svg(cat(a.cat).icon, 15)}</span>
                <span class="pmin">🔔 ${a.minutes} min</span>
              </div>`).join("")}
            </div>
            <div class="preview-recent-h">Recently played</div>
            ${recentRows.map(a => `<div class="prow">
              <span class="pdot cat-${a.cat}"></span><span>${esc(a.title)}</span>
              <span class="pg">${gradesText(a.grades)}</span><span class="ph">${svg("heart",13)}</span>
            </div>`).join("")}
          </div>
        </div>
        <div class="sticky-note">You’ve got this.</div>
      </div>
    </div>
  </section>

  <!-- Nope. Less Than 5. -->
  <section class="section-tight">
    <div class="wrap">
      <div class="lessthan">
        <div class="lessthan-copy">
          <h2>Nope. Less Than 5.</h2>
          <p>For when there are actually only two minutes left.</p>
        </div>
        <div class="lessthan-tiers">
          ${DURATIONS.map(d => {
            const n = ACTIVITIES.filter(a => a.minutes === d.key).length;
            return `<a class="tier" href="#/browse?exact=${d.key}">
              <b>${d.key}</b><span class="tier-min">min</span>
              <em>${esc(d.note)}</em><span class="tier-n">${n} activities</span>
            </a>`;
          }).join("")}
        </div>
      </div>
    </div>
  </section>

  <!-- finder + live example -->
  <section class="section" id="finder">
    <div class="wrap finder-grid">
      <div class="finder">
        <h2>${svg("sparkle",20)} I’ve Got 5 Minutes</h2>
        <p class="finder-sub">Tell me what you need. I’ll do the rest.</p>
        <div class="field-label">Grade</div>
        <div class="chips chips-grade chips-4" data-group="grade">
          ${GRADES.map(g => `<button class="chip" data-val="${g.key}">${g.label}</button>`).join("")}
        </div>
        <div class="field-label">Time</div>
        <div class="chips chips-grade chips-4" data-group="time">
          ${DURATIONS.map(d => `<button class="chip" data-val="${d.key}">${d.short}</button>`).join("")}
        </div>
        <div class="field-label">Vibe</div>
        <div class="chips chips-vibe" data-group="vibe">
          ${VIBES.map(v => `<button class="chip" data-val="${v.key}"><span class="emo">${v.emoji}</span><span>${esc(v.label)}</span></button>`).join("")}
        </div>
        <button class="btn btn-primary btn-block" id="findBtn">Find me something ${svg("arrow",17)}</button>
      </div>
      <div class="finder-arrow">
        <svg width="46" height="34" viewBox="0 0 46 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 26C10 8 26 2 42 8"/><path d="M35 4l8 5-6 7"/>
        </svg>
      </div>
      <div id="featuredSlot">${featuredCard(pickFeatured())}</div>
    </div>
  </section>

  <!-- five libraries -->
  <section class="section-tight">
    <div class="wrap">
      <div class="panel">
        <div class="section-head">
          <h2>What do you need right now?</h2>
          <p>${esc(voiceLine(1))}</p>
        </div>
        <div class="tiles">
          ${CAT_ORDER.map(k => {
            const c = cat(k);
            return `<a class="tile cat-${k}" href="#/browse?cat=${k}">
              <span class="tile-ico">${svg(c.icon, 40)}</span>
              <b>${esc(c.action)}</b>
              <span>${esc(c.blurb)}</span>
            </a>`;
          }).join("")}
        </div>
      </div>
    </div>
  </section>

  <!-- moments -->
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2>Built for the weird parts of the school day</h2>
        <p>${esc(voiceLine(4))}</p>
      </div>
      <div class="moments">
        ${MOMENTS.map(m => {
          const n = ACTIVITIES.filter(a => a.moments.includes(m.key)).length;
          return `<a class="moment" href="#/browse?moment=${m.key}">
            <span class="m-ico">${m.emoji}</span>
            <span class="m-body"><b>5 Minutes ${esc(m.label)}</b><em>${esc(m.note)}</em><span class="m-n">${n} activities</span></span>
          </a>`;
        }).join("")}
      </div>
    </div>
  </section>

  <!-- library row -->
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head"><h2>Explore the library</h2></div>
      <div class="library">
        ${CAT_ORDER.map(k => {
          const c = cat(k), list = ACTIVITIES.filter(a => a.cat === k);
          return `<div class="lib-card cat-${k}">
            <h3><span class="lib-emo">${c.emoji}</span> ${esc(c.short)}</h3>
            <ul>${shuffle(list, k.length * 977).slice(0, 5).map(a => `<li><a href="#/a/${a.id}">${esc(a.title)}</a></li>`).join("")}</ul>
            <a class="lib-more" href="#/browse?cat=${k}">See all ${list.length} ${esc(c.short)} activities ${svg("arrow",15)}</a>
          </div>`;
        }).join("")}
      </div>
    </div>
  </section>

  <!-- no prep -->
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2>No prep means actually no prep.</h2>
        <p>${esc(voiceLine(2))}</p>
      </div>
      <div class="noprep">
        <div class="np"><span class="np-ico">${svg("printer",26)}</span><b>Nothing to print</b>
          <span>${ACTIVITIES.filter(a => a.materials === "None").length} of ${ACTIVITIES.length} activities need no materials at all. The rest need a board or scrap paper.</span></div>
        <div class="np"><span class="np-ico">${svg("wifi",26)}</span><b>Works when the Wi-Fi doesn’t</b>
          <span>${ACTIVITIES.filter(a => a.moments.includes("wifi")).length} activities run entirely off-screen. No cart, no cables, no logins for the kids.</span></div>
        <div class="np"><span class="np-ico">${svg("lock",26)}</span><b>No account, no paywall</b>
          <span>Nothing to sign up for. Favorites save to this device and stay there.</span></div>
        <div class="np"><span class="np-ico">${svg("bell",26)}</span><b>The timer is built in</b>
          <span>Every activity has a countdown and a Project Mode for the board. It’s a tool, not a PDF.</span></div>
      </div>
    </div>
  </section>

  <!-- browse by grade -->
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head"><h2>Browse by grade</h2></div>
      <div class="grades-row">
        ${GRADES.map(g => {
          const list = ACTIVITIES.filter(a => a.grades.includes(g.key));
          return `<a class="grade-card" href="#/browse?grade=${g.key}">
            <b>${g.label}</b>
            <span>${list.length} activities</span>
            <em>${CAT_ORDER.map(k => list.filter(a => a.cat === k).length + " " + cat(k).short).join(" · ")}</em>
            <span class="grade-go">Browse ${g.label} ${svg("arrow",15)}</span>
          </a>`;
        }).join("")}
      </div>
      <p class="grade-note">Every band is written for that band. 9–12 is not a relabelled middle-school list.</p>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <div class="cta-band">
        <span class="cta-deco">
          <svg width="86" height="86" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="55" r="30" stroke="#11293F" stroke-width="6" fill="#fff"/>
            <path d="M50 38v18l11 7" stroke="#11293F" stroke-width="6" stroke-linecap="round"/>
            <path d="M26 28 16 18M74 28 84 18" stroke="#E9A62C" stroke-width="6" stroke-linecap="round"/>
          </svg>
        </span>
        <div class="cta-copy">
          <h2>Got five minutes?</h2>
          <p>${esc(voiceLine(5))}</p>
        </div>
        <button class="btn btn-amber btn-lg" data-open-finder>Let’s use them. ${svg("arrow",18)}</button>
      </div>
    </div>
  </section>`;
}

const finderState = { grade: null, vibe: null, time: null, pick: null };

function pickFeatured() {
  const pool = filterActivities({ grade: finderState.grade, vibe: finderState.vibe, time: finderState.time });
  const use = pool.length ? pool : ACTIVITIES;
  const choices = use.filter(a => a.id !== finderState.pick);
  const a = pickOne(choices.length ? choices : use);
  finderState.pick = a.id;
  return a;
}

function featuredCard(a) {
  const n = filterActivities({ grade: finderState.grade, vibe: finderState.vibe, time: finderState.time }).length;
  return `<div class="featured">
    <div class="eyebrow" style="color:var(${catVar(a.cat)})">Featured activity</div>
    <div class="featured-top">
      <div class="featured-main">
        <h3><a href="#/a/${a.id}">${esc(a.title)}</a></h3>
        <p class="featured-hook">${esc(a.hook)}</p>
        <ol class="mini-steps">
          ${a.steps.slice(0, 3).map((s, i) => `<li><span class="num" style="background:var(${catVar(a.cat)}-bg);color:var(${catVar(a.cat)})">${i + 1}</span><span>${esc(s)}</span></li>`).join("")}
        </ol>
      </div>
      ${dial(a.minutes * 60, null, a.cat)}
    </div>
    <div class="featured-actions">
      <button class="btn btn-ghost" data-another>${svg("shuffle",16)} Give me another</button>
      <button class="btn btn-ghost fav-inline ${isFav(a.id) ? "is-on" : ""}" data-fav-inline="${a.id}">${svg("heart",16)} ${isFav(a.id) ? "Saved" : "Save"}</button>
      <button class="btn btn-primary" data-project="${a.id}">${svg("monitor",16)} Project mode</button>
    </div>
    <p class="featured-count">
      ${n} activit${n === 1 ? "y" : "ies"} match${n === 1 ? "es" : ""} ·
      <a href="#/browse?${qs({ grade: finderState.grade, vibe: finderState.vibe, time: finderState.time })}">See them all</a>
    </p>
  </div>`;
}

/* ═══════════════════════════ BROWSE ═══════════════════════════ */
/* One band from Teacher Plate, used only when the URL hasn't asked for a grade.
   This filter takes a single band, so a teacher who ticked several gets their
   first — the chips are right there to switch. */
function defaultBand() {
  try {
    const b = (window.TeacherPlate && TeacherPlate.gradeBands) ? TeacherPlate.gradeBands() : [];
    return b.length === 1 ? b[0] : (b.length ? b[0] : null);
  } catch (e) { return null; }
}

function viewBrowse(p) {
  const f = { cat:p.cat, grade:("grade" in p ? p.grade : defaultBand()),
              vibe:p.vibe, moment:p.moment, exact:p.exact,
              q:p.q, fav:p.fav === "1", coll:p.coll };
  const results = filterActivities(f);
  const c = f.cat ? cat(f.cat) : null;
  const m = f.moment ? MOMENTS.find(x => x.key === f.moment) : null;
  const d = f.exact ? DURATIONS.find(x => String(x.key) === String(f.exact)) : null;

  let title = "Browse all activities", sub = `${ACTIVITIES.length} activities, none of which require a printer.`;
  if (f.fav)       { title = "Your favorites"; sub = favs.length ? "Everything you’ve saved, ready to go." : "Nothing saved yet — tap the heart on any activity."; }
  else if (f.coll) { title = f.coll; sub = `Your collection · ${(collections[f.coll] || []).length} saved.`; }
  else if (c)      { title = c.action; sub = c.blurb + "."; }
  else if (m)      { title = "5 Minutes " + m.label; sub = m.note; }
  else if (d)      { title = d.label + " exactly"; sub = d.note + " " + results.length + " that fit."; }

  return `
  <section class="wrap browse-head">
    <h1>${esc(title)}</h1>
    <p>${esc(sub)}</p>
  </section>

  <section class="wrap" style="padding-bottom:64px">
    <div class="filters">
      <div class="filter-row">
        <div class="field-label">Time</div>
        <div class="chips" data-f="exact">
          <button class="chip ${!f.exact ? "is-on" : ""}" data-val="">Any</button>
          ${DURATIONS.map(x => `<button class="chip ${String(f.exact) === String(x.key) ? "is-on" : ""}" data-val="${x.key}">${svg("bell",12)} ${x.short}</button>`).join("")}
        </div>
      </div>
      <div class="filter-row">
        <div class="field-label">Type</div>
        <div class="chips" data-f="cat">
          <button class="chip ${!f.cat ? "is-on" : ""}" data-val="">All</button>
          ${CAT_ORDER.map(k => `<button class="chip ${f.cat === k ? "is-on" : ""}" data-val="${k}"><span class="emo">${cat(k).emoji}</span><span>${esc(cat(k).short)}</span></button>`).join("")}
        </div>
      </div>
      <div class="filter-row">
        <div class="field-label">Grade</div>
        <div class="chips" data-f="grade">
          <button class="chip ${!f.grade ? "is-on" : ""}" data-val="">All</button>
          ${GRADES.map(g => `<button class="chip ${f.grade === g.key ? "is-on" : ""}" data-val="${g.key}">${g.label}</button>`).join("")}
        </div>
      </div>
      <div class="filter-row">
        <div class="field-label">Vibe</div>
        <div class="chips" data-f="vibe">
          <button class="chip ${!f.vibe ? "is-on" : ""}" data-val="">Any</button>
          ${VIBES.filter(v => v.key !== "surprise").map(v => `<button class="chip ${f.vibe === v.key ? "is-on" : ""}" data-val="${v.key}"><span class="emo">${v.emoji}</span><span>${esc(v.label)}</span></button>`).join("")}
        </div>
      </div>
      <div class="filter-row">
        <div class="field-label">Moment</div>
        <div class="chips" data-f="moment">
          <button class="chip ${!f.moment ? "is-on" : ""}" data-val="">Any</button>
          ${MOMENTS.map(x => `<button class="chip ${f.moment === x.key ? "is-on" : ""}" data-val="${x.key}"><span class="emo">${x.emoji}</span><span>${esc(x.label)}</span></button>`).join("")}
        </div>
      </div>
      <div class="filter-bar">
        <span class="result-count"><b>${results.length}</b> of ${ACTIVITIES.length} activities</span>
        <label class="search">${svg("search",16)}
          <input type="search" id="q" placeholder="Search activities…" value="${esc(f.q || "")}" aria-label="Search activities">
        </label>
        <button class="btn btn-ghost btn-sm" data-clear>Clear filters</button>
      </div>
    </div>

    ${results.length
      ? `<div class="grid">${results.map(a => activityCard(a, { showPlayed: true })).join("")}</div>`
      : `<div class="empty">
           <h3>Nothing matches that combination.</h3>
           <p>Try loosening one filter — vibe and moment together get narrow fast.</p>
           <p style="margin-top:18px"><button class="btn btn-ghost" data-clear>Clear filters</button></p>
         </div>`}
  </section>`;
}

/* ═══════════════════════════ DETAIL ═══════════════════════════ */
function viewDetail(id) {
  const a = byId(id);
  if (!a) return `<section class="wrap empty" style="padding:100px 20px"><h3>That activity doesn’t exist.</h3><p><a class="btn btn-ghost" href="#/browse" style="margin-top:16px">Browse all activities</a></p></section>`;
  const c = cat(a.cat);
  const related = shuffle(ACTIVITIES.filter(x => x.cat === a.cat && x.id !== a.id)).slice(0, 3);
  const played = playedRecently(a.id);
  const collNames = Object.keys(collections);

  return `
  <section class="wrap detail">
    <a class="back" href="#/browse?cat=${a.cat}">${svg("back",16)} All ${esc(c.short)} activities</a>
    <div class="detail-head">
      ${pill(a.cat)} ${bellTag(a.minutes)}
      ${played ? `<span class="tag tag-played">You played this ${played}</span>` : ""}
      <h1>${esc(a.title)}</h1>
      <p class="detail-hook">${esc(a.hook)}</p>
      <div class="meta-strip">
        <span class="tag">${gradesText(a.grades)}</span>
        <span class="tag">${svg("volume",12)} ${noiseLabel[a.noise]}</span>
        <span class="tag">${svg("users",12)} ${formatLabel[a.format]}</span>
        <span class="tag">${esc(a.materials)}</span>
      </div>
    </div>

    <div class="detail-grid">
      <div>
        <div class="block">
          <h2>${svg("check",19)} How to run it</h2>
          <ol class="steps">
            ${a.steps.map((s, i) => `<li><span class="num cat-${a.cat}">${i + 1}</span><span>${esc(s)}</span></li>`).join("")}
          </ol>
        </div>
        <div class="callout callout-say"><div class="lbl">Say this</div><p>${esc(a.say)}</p></div>
        <div class="callout callout-swap"><div class="lbl">Switch it up</div><p>${esc(a.swap)}</p></div>
        <div class="callout callout-why"><div class="lbl">Why it works</div><p>${esc(a.why)}</p></div>
      </div>

      <aside>
        <div class="side-card" id="sideCard">
          <div id="sideTimer">
            ${dial(a.minutes * 60, null, a.cat)}
            <div class="timer-controls">
              <button class="btn btn-primary" data-t-toggle>${svg("play",15)} Start</button>
              <button class="btn btn-ghost" data-t-reset>${svg("reset",15)} Reset</button>
            </div>
          </div>
          <div class="side-actions">
            <button class="btn btn-primary btn-block" data-project="${a.id}">${svg("monitor",16)} Project mode</button>
            <button class="btn btn-ghost btn-block fav-inline ${isFav(a.id) ? "is-on" : ""}" data-fav-inline="${a.id}">
              ${svg("heart",16)} ${isFav(a.id) ? "Saved to favorites" : "Save to favorites"}
            </button>
            <div class="collect">
              <button class="btn btn-ghost btn-block" data-collect-open>${svg("folder",16)} Add to a collection</button>
              <div class="collect-menu" hidden>
                ${collNames.map(n => `<button class="collect-item" data-collect="${esc(n)}" data-act="${a.id}">${svg("plus",13)} ${esc(n)}</button>`).join("")}
                ${collNames.length ? '<div class="collect-sep"></div>' : ""}
                <button class="collect-item" data-collect-new="${a.id}">${svg("plus",13)} New collection…</button>
              </div>
            </div>
          </div>
          <ul class="factlist">
            <li><span class="k">Time</span><span class="v">🔔 ${a.minutes} min</span></li>
            <li><span class="k">Grades</span><span class="v">${gradesText(a.grades)}</span></li>
            <li><span class="k">Materials</span><span class="v">${esc(a.materials)}</span></li>
            <li><span class="k">Noise level</span><span class="v">${noiseLabel[a.noise]}</span></li>
            <li><span class="k">Grouping</span><span class="v">${formatLabel[a.format]}</span></li>
            <li><span class="k">Good when</span><span class="v">${a.vibes.map(v => esc((VIBES.find(x => x.key === v) || {}).label || v)).join("<br>")}</span></li>
          </ul>
        </div>
      </aside>
    </div>

    <div class="related">
      <h2>More ${esc(c.short)} activities</h2>
      <div class="grid">${related.map(x => activityCard(x)).join("")}</div>
    </div>
  </section>`;
}

/* ═══════════════════════════ DASHBOARD ═══════════════════════════ */
function viewDashboard() {
  const who = teacher ? esc(teacher) : "Teacher";
  const favList = favs.map(byId).filter(Boolean);
  const recent = plays.slice(0, 6).map(p => ({ a: byId(p.id), p })).filter(x => x.a);
  const collNames = Object.keys(collections);
  const validPlays = plays.filter(x => byId(x.id)).length;
  const SUGGEST = ["Friday Favorites","After Lunch","My Class Loves These","Sub Plans","Test Week"];

  return `
  <section class="wrap dash">
    <div class="dash-head">
      <h1>${greeting()}, <button class="name-edit" data-edit-name>${who}</button> 👋</h1>
      <p>${esc(voiceLine(0))}</p>
    </div>

    <div class="dash-quick">
      <div>
        <div class="field-label">Quick start</div>
        <button class="btn btn-primary btn-lg" data-open-finder>I’ve Got 5 Minutes ${svg("arrow",18)}</button>
      </div>
      <div class="dash-stat">
        <b>🔥 ${validPlays}</b>
        <span>${validPlays === 1 ? "five-minute activity" : "five-minute activities"} run on this device${validPlays ? " so far" : " — the counter starts when you do"}.</span>
      </div>
    </div>

    <div class="dash-grid">
      <div class="dash-card">
        <h2>${svg("heart",19)} Your favorites</h2>
        ${favList.length
          ? `<ul class="dash-list">${favList.slice(0, 6).map(a => `<li><a href="#/a/${a.id}"><span class="pdot cat-${a.cat}"></span>${esc(a.title)}<em>🔔 ${a.minutes}</em></a></li>`).join("")}</ul>
             ${favList.length > 6 ? `<a class="lib-more" href="#/favorites">See all ${favList.length} ${svg("arrow",15)}</a>` : ""}`
          : `<p class="dash-empty">Tap the heart on any activity and it lands here.</p>`}
      </div>

      <div class="dash-card">
        <h2>${svg("clock",19)} Recently played</h2>
        ${recent.length
          ? `<ul class="dash-list">${recent.map(({ a, p }) => `<li><a href="#/a/${a.id}"><span class="pdot cat-${a.cat}"></span>${esc(a.title)}<em>${p.cls ? esc(p.cls) + " · " : ""}${ago(p.ts)}</em></a></li>`).join("")}</ul>
             <p class="dash-note">So you don’t accidentally run the same thing three times in one week.</p>`
          : `<p class="dash-empty">Nothing yet. Start a timer or open Project Mode and it gets logged here.</p>`}
      </div>

      <div class="dash-card">
        <h2>${svg("users",19)} Your classes</h2>
        ${classes.length
          ? `<ul class="chip-list">${classes.map(n => `<li class="chip-static">${esc(n)}<button class="chip-x" data-del-class="${esc(n)}" aria-label="Remove ${esc(n)}">${svg("x",12)}</button></li>`).join("")}</ul>`
          : `<p class="dash-empty">Add your classes and Project Mode will tag what you ran with which group.</p>`}
        <button class="btn btn-ghost btn-sm" data-add-class>${svg("plus",14)} Add a class</button>
      </div>

      <div class="dash-card">
        <h2>${svg("folder",19)} Your collections</h2>
        ${collNames.length
          ? `<ul class="dash-list">${collNames.map(n => `<li><a href="#/browse?coll=${encodeURIComponent(n)}"><span class="pdot" style="background:var(--amber)"></span>${esc(n)}<em>${collections[n].length}</em></a></li>`).join("")}</ul>`
          : ""}
        <div class="suggest">
          ${SUGGEST.filter(n => !collections[n]).map(n => `<button class="chip" data-new-coll="${esc(n)}">${svg("plus",12)} ${esc(n)}</button>`).join("")}
        </div>
      </div>
    </div>
  </section>`;
}

/* ═══════════════════════ OVERLAYS ═══════════════════════ */
let overlayTimer = null;
function closeOverlay() {
  const el = $("#modal");
  el.classList.remove("is-open");
  el.innerHTML = "";
  document.body.style.overflow = "";
  if (overlayTimer) { overlayTimer.destroy(); overlayTimer = null; }
}
function openOverlay(html, cls) {
  const el = $("#modal");
  el.className = "modal is-open " + (cls || "");
  el.innerHTML = html;
  document.body.style.overflow = "hidden";
  return el;
}

/* ── the finder ── */
function openFinder() {
  const el = openOverlay(`
    <div class="modal-shell">
      <button class="modal-close" data-close aria-label="Close">${svg("x",20)}</button>
      <div class="finder-full">
        <div class="eyebrow" style="color:var(--amber-deep)">I’ve got 5 minutes</div>
        <h1>What are we working with?</h1>
        <div class="ff-block">
          <div class="field-label">Grade</div>
          <div class="chips chips-grade chips-4" data-group="grade">
            ${GRADES.map(g => `<button class="chip ${finderState.grade === g.key ? "is-on" : ""}" data-val="${g.key}">${g.label}</button>`).join("")}
          </div>
        </div>
        <div class="ff-block">
          <div class="field-label">How long have you actually got?</div>
          <div class="chips chips-grade chips-4" data-group="time">
            ${DURATIONS.map(d => `<button class="chip ${String(finderState.time) === String(d.key) ? "is-on" : ""}" data-val="${d.key}">${svg("bell",13)} ${d.short}</button>`).join("")}
          </div>
        </div>
        <div class="ff-block">
          <div class="field-label">Vibe</div>
          <div class="chips chips-vibe" data-group="vibe">
            ${VIBES.map(v => `<button class="chip ${finderState.vibe === v.key ? "is-on" : ""}" data-val="${v.key}"><span class="emo">${v.emoji}</span><span>${esc(v.label)}</span></button>`).join("")}
          </div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" data-find-go>Find me something ${svg("arrow",18)}</button>
        <p class="ff-note" data-ff-count></p>
      </div>
    </div>`, "modal-finder");
  paintFinderCount();
  return el;
}
function paintFinderCount() {
  const el = $("[data-ff-count]");
  if (!el) return;
  const n = filterActivities({ grade: finderState.grade, vibe: finderState.vibe, time: finderState.time }).length;
  el.textContent = n === 0 ? "Nothing matches that yet — try loosening one." : n + " activities fit. You’ll get one at random.";
}

/* ── the result: a full-screen activity ── */
function openResult(a) {
  finderState.pick = a.id;
  const clsPicker = classes.length ? `
    <label class="cls-pick">for
      <select data-class-pick>
        <option value="">— no class —</option>
        ${classes.map(n => `<option value="${esc(n)}" ${n === lastClass ? "selected" : ""}>${esc(n)}</option>`).join("")}
      </select>
    </label>` : "";
  const played = playedRecently(a.id, lastClass);

  openOverlay(`
    <div class="modal-shell">
      <button class="modal-close" data-close aria-label="Close">${svg("x",20)}</button>
      <div class="result" id="resultBox">
        <div class="result-bar">
          ${pill(a.cat)} ${bellTag(a.minutes)} <span class="tag">${gradesText(a.grades)}</span>
          ${played ? `<span class="tag tag-played">played ${played}</span>` : ""}
          ${clsPicker}
        </div>
        <div class="result-body">
          <div class="result-main">
            <h1>${esc(a.title)}</h1>
            <p class="result-hook">${esc(a.hook)}</p>
            <div class="result-do">Do this:</div>
            <ol class="result-steps">
              ${a.steps.map((s, i) => `<li><span class="num">${i + 1}</span><span>${esc(s)}</span></li>`).join("")}
            </ol>
            <div class="result-say">${esc(a.say)}</div>
          </div>
          <div class="result-side" id="resultSide">
            ${dial(a.minutes * 60, null, a.cat)}
            <div class="timer-controls">
              <button class="btn btn-primary" data-t-toggle>${svg("play",15)} Start</button>
              <button class="btn btn-ghost" data-t-reset>${svg("reset",15)} Reset</button>
            </div>
          </div>
        </div>
        <div class="result-foot">
          <button class="btn btn-ghost" data-another-result>${svg("shuffle",16)} Give me another</button>
          <button class="btn btn-ghost fav-inline ${isFav(a.id) ? "is-on" : ""}" data-fav-inline="${a.id}">${svg("heart",16)} ${isFav(a.id) ? "Saved" : "Save"}</button>
          <button class="btn btn-primary" data-project="${a.id}">${svg("monitor",16)} Project mode</button>
          <a class="btn btn-ghost" href="#/a/${a.id}" data-close>Full page ${svg("arrow",15)}</a>
        </div>
      </div>
    </div>`, "modal-result");

  overlayTimer = makeTimer($("#resultSide"));
  wireTimer($("#resultSide"), overlayTimer, "Start", "Pause", a.id, () => {
    $("#resultSide").innerHTML = bellPanel(a);
  });
}
function resultAnother() {
  const pool = filterActivities({ grade: finderState.grade, vibe: finderState.vibe, time: finderState.time });
  const use = pool.length ? pool : ACTIVITIES;
  const choices = use.filter(x => x.id !== finderState.pick);
  if (overlayTimer) { overlayTimer.destroy(); overlayTimer = null; }
  openResult(pickOne(choices.length ? choices : use));
}

/* ── project mode ── */
let projectTimer = null;
function openProject(id) {
  const a = byId(id);
  if (!a) return;
  const el = $("#project");
  el.innerHTML = `
    <div class="project-bar">
      <span class="pcat">${esc(cat(a.cat).short)} · ${gradesText(a.grades)}</span>
      <span class="pcat pcat-bell">${svg("bell",14)} ${a.minutes} MIN</span>
      ${classes.length ? `<label class="cls-pick cls-dark">for
        <select data-class-pick>
          <option value="">— no class —</option>
          ${classes.map(n => `<option value="${esc(n)}" ${n === lastClass ? "selected" : ""}>${esc(n)}</option>`).join("")}
        </select></label>` : ""}
      <button class="project-close" data-close-project>Exit ✕</button>
    </div>
    <div class="project-body" id="projectBody">
      <div>
        <h1>${esc(a.title)}</h1>
        <ol class="project-steps">
          ${a.steps.map((s, i) => `<li><span class="num">${i + 1}</span><span>${esc(s)}</span></li>`).join("")}
        </ol>
        <div class="project-say">${esc(a.say)}</div>
      </div>
      ${dial(a.minutes * 60, "project-dial")}
    </div>
    <div class="project-foot" id="projectFoot">
      <button class="btn btn-amber btn-lg" data-t-toggle>${svg("play",17)} Start the timer</button>
      <button class="btn btn-ghost btn-lg" data-t-reset>${svg("reset",17)} Reset</button>
    </div>`;
  el.classList.add("is-open");
  document.body.style.overflow = "hidden";
  projectTimer = makeTimer(el);
  wireTimer(el, projectTimer, "Start the timer", "Pause", a.id, () => {
    $("#projectBody").innerHTML = `<div class="project-bell">${bellPanel(a, "big")}</div>`;
    $("#projectFoot").innerHTML = `<button class="btn btn-ghost btn-lg" data-close-project>Done ✕</button>`;
  });
  $("[data-close-project]", el).focus();
}
function closeProject() {
  const el = $("#project");
  el.classList.remove("is-open");
  el.innerHTML = "";
  if (!$("#modal").classList.contains("is-open")) document.body.style.overflow = "";
  if (projectTimer) { projectTimer.destroy(); projectTimer = null; }
}

/* ═══════════════════════════ router ═══════════════════════════ */
let pageTimer = null;

function parseHash() {
  const raw = (location.hash || "#/").slice(1);
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const p = {};
  new URLSearchParams(query || "").forEach((v, k) => { p[k] = v; });
  return { parts, p };
}

function render() {
  const { parts, p } = parseHash();
  const view = $("#view");
  if (pageTimer) { pageTimer.destroy(); pageTimer = null; }

  let route = "home";
  if (parts[0] === "browse") route = "browse";
  else if (parts[0] === "favorites") route = "favorites";
  else if (parts[0] === "dashboard") route = "dashboard";
  else if (parts[0] === "a" && parts[1]) route = "detail";

  if (route === "browse")         view.innerHTML = viewBrowse(p);
  else if (route === "favorites") view.innerHTML = viewBrowse(Object.assign({}, p, { fav: "1" }));
  else if (route === "dashboard") view.innerHTML = viewDashboard();
  else if (route === "detail")    view.innerHTML = viewDetail(parts[1]);
  else                            view.innerHTML = viewHome();

  $$(".nav a[data-route]").forEach(el => {
    const r = el.dataset.route;
    el.classList.toggle("is-active",
      (r === "browse" && route === "browse" && !p.grade) ||
      (r === "favorites" && route === "favorites") ||
      (r === "dashboard" && route === "dashboard") ||
      (r === "grade" && route === "browse" && !!p.grade));
  });
  $("#nav").classList.remove("is-open");

  const side = $("#sideTimer");
  if (side && route === "detail") {
    const a = byId(parts[1]);
    pageTimer = makeTimer(side);
    wireTimer(side, pageTimer, "Start", "Pause", a.id, () => { side.innerHTML = bellPanel(a); });
  }
  window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}

/* ─────────────────── events ─────────────────── */
document.addEventListener("click", e => {
  const t = e.target;

  if (t.closest("[data-close-project]")) { closeProject(); return; }
  if (t.closest("[data-close]"))         { closeOverlay(); return; }
  if (t.closest(".modal") && !t.closest(".modal-shell")) { closeOverlay(); return; }

  const proj = t.closest("[data-project]");
  if (proj) { e.preventDefault(); openProject(proj.dataset.project); return; }

  if (t.closest("[data-open-finder]")) { openFinder(); return; }

  if (t.closest("[data-find-go]")) {
    const pool = filterActivities({ grade: finderState.grade, vibe: finderState.vibe, time: finderState.time });
    if (!pool.length) { toast("Nothing matches — try loosening one."); return; }
    openResult(pickOne(pool));
    return;
  }
  if (t.closest("[data-another-result]")) { resultAnother(); return; }

  const more = t.closest("[data-onemore]");
  if (more) {
    const id = more.dataset.onemore;
    if ($("#project").classList.contains("is-open")) { closeProject(); openProject(id); }
    else if ($("#modal").classList.contains("is-open")) { if (overlayTimer) overlayTimer.destroy(); openResult(byId(id)); }
    else location.hash = "#/a/" + id;
    return;
  }

  const fav = t.closest("[data-fav]");
  if (fav) { e.preventDefault(); e.stopPropagation(); toggleFav(fav.dataset.fav); return; }

  const favIn = t.closest("[data-fav-inline]");
  if (favIn) {
    toggleFav(favIn.dataset.favInline);
    if (location.hash.startsWith("#/favorites") || location.hash.startsWith("#/dashboard")) render();
    return;
  }

  if (t.closest("[data-another]")) { $("#featuredSlot").innerHTML = featuredCard(pickFeatured()); return; }

  // finder chips (single-select per group) — used by both the inline panel and the modal
  const fchip = t.closest("[data-group] .chip");
  if (fchip) {
    const group = fchip.closest("[data-group]").dataset.group;
    const on = fchip.classList.contains("is-on");
    $$(".chip", fchip.parentElement).forEach(c => c.classList.remove("is-on"));
    if (!on) fchip.classList.add("is-on");
    finderState[group] = on ? null : fchip.dataset.val;
    paintFinderCount();
    return;
  }
  if (t.closest("#findBtn")) {
    finderState.pick = null;
    $("#featuredSlot").innerHTML = featuredCard(pickFeatured());
    $("#featuredSlot").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // browse filter chips
  const bchip = t.closest("[data-f] .chip");
  if (bchip) {
    const key = bchip.closest("[data-f]").dataset.f;
    const { p } = parseHash();
    const val = bchip.dataset.val;
    if (val) p[key] = val; else delete p[key];
    const base = location.hash.startsWith("#/favorites") ? "#/favorites" : "#/browse";
    location.hash = base + (qs(p) ? "?" + qs(p) : "");
    return;
  }
  if (t.closest("[data-clear]")) {
    location.hash = location.hash.startsWith("#/favorites") ? "#/favorites" : "#/browse";
    return;
  }

  // collections
  if (t.closest("[data-collect-open]")) {
    const m = $(".collect-menu");
    m.hidden = !m.hidden;
    return;
  }
  const coll = t.closest("[data-collect]");
  if (coll) {
    addToCollection(coll.dataset.collect, coll.dataset.act);
    $(".collect-menu").hidden = true;
    toast("Added to " + coll.dataset.collect);
    return;
  }
  const collNew = t.closest("[data-collect-new]");
  if (collNew) {
    const name = (prompt("Name this collection:", "Friday Favorites") || "").trim();
    if (name) { addToCollection(name, collNew.dataset.collectNew); toast("Added to " + name); render(); }
    return;
  }
  const nc = t.closest("[data-new-coll]");
  if (nc) { collections[nc.dataset.newColl] = collections[nc.dataset.newColl] || []; store.set(K.coll, collections); render(); return; }

  // classes
  if (t.closest("[data-add-class]")) {
    const n = (prompt("Class name (e.g. 6th Grade ELA):", "") || "").trim();
    if (n && !classes.includes(n)) { classes.push(n); store.set(K.cls, classes); render(); }
    return;
  }
  const dc = t.closest("[data-del-class]");
  if (dc) { classes = classes.filter(x => x !== dc.dataset.delClass); store.set(K.cls, classes); render(); return; }

  if (t.closest("[data-edit-name]")) {
    const n = (prompt("What should we call you?", teacher || "Ms. Scott") || "").trim();
    if (n) { teacher = n; store.set(K.who, n); render(); }
    return;
  }

  if (t.closest("#menuBtn")) {
    const nav = $("#nav");
    nav.classList.toggle("is-open");
    $("#menuBtn").setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
    return;
  }
});

document.addEventListener("change", e => {
  if (e.target.matches("[data-class-pick]")) {
    lastClass = e.target.value;
    store.set(K.lastCls, lastClass);
  }
});

let sTimer = null;
document.addEventListener("input", e => {
  if (e.target.id !== "q") return;
  clearTimeout(sTimer);
  const val = e.target.value;
  sTimer = setTimeout(() => {
    const { p } = parseHash();
    if (val) p.q = val; else delete p.q;
    const base = location.hash.startsWith("#/favorites") ? "#/favorites" : "#/browse";
    history.replaceState(null, "", base + (qs(p) ? "?" + qs(p) : ""));
    render();
    const inp = $("#q");
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  }, 260);
});

document.addEventListener("keydown", e => {
  const projOpen = $("#project").classList.contains("is-open");
  const modalOpen = $("#modal").classList.contains("is-open");
  if (e.key === "Escape") { if (projOpen) closeProject(); else if (modalOpen) closeOverlay(); }
  if (e.key === " " && (projOpen || modalOpen) && e.target === document.body) {
    e.preventDefault();
    const t = projOpen ? projectTimer : overlayTimer;
    if (t) t.toggle();
  }
});

window.addEventListener("hashchange", render);
paintFavCount();
render();
})();
