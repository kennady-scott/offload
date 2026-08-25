/* Tiny Things — a drawer of small utilities.
   Everything here is real logic, not generation: groups, a fair picker, a seating
   chart, a checklist. Four of the five need the roster, which is the point —
   these are what make Class Manager worth filling in. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
const TP = () => window.TeacherPlate;
const K_CALLED = "tp.v1.tiny.called";
const K_LAST   = "tp.v1.tiny.lastClass";

let open = null;         // which utility
let classId = null;
let out = null;          // last computed output
let seatSel = null;      // seating chart swap selection

const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
let tTimer;
const toast = m => { toastEl.textContent = m; toastEl.hidden = false;
  clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.hidden = true, 1800); };
const read = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const UTILS = [
  { id: "groups",   e: "👥", name: "Make groups",     blurb: "Split a class into groups, fairly and fast.", roster: true },
  { id: "picker",   e: "🎯", name: "Pick a student",   blurb: "Cold call without picking the same three kids.", roster: true },
  { id: "seating",  e: "🪑", name: "Seating chart",    blurb: "Lay out a room, swap seats, print it.", roster: true },
  { id: "order",    e: "🔀", name: "Random order",     blurb: "Shuffle the roster for turns or presentations.", roster: true },
  { id: "checklist",e: "☑️", name: "Make a checklist", blurb: "Type a list, print it with boxes.", roster: false }
];

function classesWithKids() { return (TP() ? TP().classes() : []).filter(k => (k.students || []).length); }
function currentK() {
  const all = TP() ? TP().classes() : [];
  return all.find(k => k.id === classId) || null;
}
function names(k) { return (k.students || []).map(s => (s.first + (s.last ? " " + s.last + "." : "")).trim()).filter(Boolean); }
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

/* ── the drawer ─────────────────────────────────────────────────── */
function renderDrawer() {
  view.innerHTML =
    '<h2 class="ask">What annoying little thing?</h2>' +
    '<p class="ask-sub">Pick one. Nothing here takes more than a minute.</p>' +
    '<div class="drawer">' +
      UTILS.map(u =>
        '<button class="util" data-open="' + u.id + '"><span class="e">' + u.e + '</span>' +
        '<span><b>' + esc(u.name) + '</b><span>' + esc(u.blurb) + '</span>' +
        (u.roster ? '<span class="need">needs your roster</span>' : '') + '</span></button>').join("") +
    '</div>' +
    '<p class="soonnote">Rubrics, learning targets, exit tickets and report-card comments are coming. ' +
    'These five are the ones that work without asking a robot to write for you.</p>';
}

/* ── shared chrome for an open utility ──────────────────────────── */
function shell(title, body) {
  return '<div class="head no-print"><button class="back" data-back>' +
    '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3 5 7l3.5 4"/></svg>Tiny Things</button>' +
    '<h2>' + esc(title) + '</h2></div>' + body;
}
function needRoster() {
  return '<div class="panel"><div class="needroster"><span class="e">🗂️</span>' +
    '<h3>This one needs your students</h3>' +
    '<p>Add a class and a few names, and this works instantly &mdash; here and in every other tool.</p>' +
    '<a class="btn primary" href="/classes/">Set up my classes</a></div></div>';
}
function classPicker() {
  const ks = classesWithKids();
  return '<div class="f"><label for="cls">Class</label><select id="cls" data-cls>' +
    ks.map(k => '<option value="' + k.id + '"' + (k.id === classId ? " selected" : "") + '>' +
      esc(k.period) + (k.name ? " · " + esc(k.name) : "") + ' (' + (k.students || []).length + ')</option>').join("") +
    '</select></div>';
}

/* ── utilities ──────────────────────────────────────────────────── */
function uiGroups() {
  const k = currentK(); const n = names(k);
  const mode = out && out.mode ? out.mode : "size";
  const num = out && out.num ? out.num : 3;
  let body =
    '<div class="panel"><div class="controls">' + classPicker() +
      '<div class="f"><label for="mode">Split by</label><select id="mode" data-g="mode">' +
        '<option value="size"' + (mode === "size" ? " selected" : "") + '>Students per group</option>' +
        '<option value="count"' + (mode === "count" ? " selected" : "") + '>Number of groups</option>' +
      '</select></div>' +
      '<div class="f"><label for="num">How many</label><input id="num" type="number" min="2" max="' +
        Math.max(2, n.length) + '" value="' + num + '" data-g="num"></div>' +
      '<button class="btn primary" data-mk="groups"><svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>Shuffle</button>' +
    '</div><p class="count">' + n.length + ' students on the roster</p></div>';
  if (out && out.groups) {
    body += '<div class="panel"><div class="groups">' +
      out.groups.map((g, i) => '<div class="grp"><h4>Group ' + (i + 1) + ' &middot; ' + g.length + '</h4><ol>' +
        g.map(s => '<li>' + esc(s) + '</li>').join("") + '</ol></div>').join("") +
      '</div><div class="rowacts no-print">' +
        '<button class="btn" data-print>Print</button>' +
        '<button class="btn" data-copy>Copy as text</button></div></div>';
  }
  return shell("Make groups", body);
}
function mkGroups() {
  const k = currentK(); const n = shuffle(names(k));
  const mode = out && out.mode || "size";
  let num = Math.max(2, parseInt((out && out.num) || 3, 10));
  const count = mode === "size" ? Math.ceil(n.length / num) : Math.min(num, n.length);
  const groups = Array.from({ length: count }, () => []);
  n.forEach((s, i) => groups[i % count].push(s));      // deal round-robin so sizes stay even
  out = { mode: mode, num: num, groups: groups.filter(g => g.length) };
}

function uiPicker() {
  const k = currentK(); const n = names(k);
  const called = read(K_CALLED, {})[classId] || [];
  const left = n.filter(x => called.indexOf(x) < 0);
  let body =
    '<div class="panel"><div class="controls">' + classPicker() +
      '<button class="btn primary" data-mk="pick">Pick a student</button>' +
      '<button class="btn" data-resetcalled>Start over</button>' +
    '</div>' +
    '<div class="pickstage">' +
      (out && out.picked
        ? '<p class="pickname">' + esc(out.picked) + '</p>'
        : '<p class="pickidle">Tap <strong>Pick a student</strong>. Nobody gets called twice until everyone has.</p>') +
      '<p class="pickmeta">' + left.length + ' of ' + n.length + ' still to be called</p>' +
      (called.length ? '<div class="called">' + called.map(c => '<span>' + esc(c) + '</span>').join("") + '</div>' : '') +
    '</div></div>';
  return shell("Pick a student", body);
}
function mkPick() {
  const k = currentK(); const n = names(k);
  const store = read(K_CALLED, {});
  let called = store[classId] || [];
  let left = n.filter(x => called.indexOf(x) < 0);
  if (!left.length) { called = []; left = n.slice(); toast("Everyone's been called — starting over"); }
  const picked = left[Math.floor(Math.random() * left.length)];
  called.push(picked); store[classId] = called; write(K_CALLED, store);
  out = { picked: picked };
}

function uiSeating() {
  const k = currentK(); const n = names(k);
  const cols = (out && out.cols) || 5;
  const seats = (out && out.seats) || null;
  let body =
    '<div class="panel"><div class="controls">' + classPicker() +
      '<div class="f"><label for="cols">Desks per row</label><input id="cols" type="number" min="2" max="10" value="' + cols + '" data-s="cols"></div>' +
      '<button class="btn primary" data-mk="seats"><svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>Shuffle seats</button>' +
    '</div><p class="count">' + n.length + ' students &middot; click two desks to swap them</p></div>';
  if (seats) {
    body += '<div class="panel"><div class="front">Front of room</div>' +
      '<div class="seats" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))">' +
      seats.map((s, i) => '<div class="seat' + (s ? "" : " empty") + (seatSel === i ? " sel" : "") +
        '" data-seat="' + i + '">' + (s ? esc(s) : "&mdash;") + '</div>').join("") +
      '</div><div class="rowacts no-print"><button class="btn" data-print>Print</button></div></div>';
  }
  return shell("Seating chart", body);
}
function mkSeats() {
  const k = currentK(); const n = shuffle(names(k));
  const cols = Math.max(2, parseInt((out && out.cols) || 5, 10));
  const rows = Math.ceil(n.length / cols);
  const seats = [];
  for (let i = 0; i < rows * cols; i++) seats.push(n[i] || null);
  out = { cols: cols, seats: seats };
  seatSel = null;
}

function uiOrder() {
  const k = currentK();
  let body = '<div class="panel"><div class="controls">' + classPicker() +
    '<button class="btn primary" data-mk="order"><svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>Shuffle</button>' +
    '</div></div>';
  if (out && out.order) {
    body += '<div class="panel"><ol class="olist">' +
      out.order.map(s => '<li>' + esc(s) + '</li>').join("") + '</ol>' +
      '<div class="rowacts no-print"><button class="btn" data-print>Print</button>' +
      '<button class="btn" data-copy>Copy as text</button></div></div>';
  }
  return shell("Random order", body);
}
function mkOrder() { out = { order: shuffle(names(currentK())) }; }

function uiChecklist() {
  const title = (out && out.title) || "";
  const raw = (out && out.raw) || "";
  let body =
    '<div class="panel"><div class="f" style="margin-bottom:12px"><label for="ct">Title</label>' +
      '<input id="ct" data-ck="title" value="' + esc(title) + '" placeholder="End of day"></div>' +
      '<div class="f"><label for="ci">One item per line</label>' +
      '<textarea id="ci" data-ck="raw" placeholder="Stack the chairs&#10;Turn off the projector&#10;Close the windows">' + esc(raw) + '</textarea></div>' +
      '<div class="rowacts"><button class="btn primary" data-mk="checklist">Make it</button></div></div>';
  if (out && out.items) {
    body += '<div class="panel">' + (out.title ? '<p class="printtitle">' + esc(out.title) + '</p>' : '') +
      '<ul class="chk">' + out.items.map(i => '<li><span class="box"></span><span>' + esc(i) + '</span></li>').join("") + '</ul>' +
      '<div class="rowacts no-print"><button class="btn" data-print>Print</button></div></div>';
  }
  return shell("Make a checklist", body);
}
function mkChecklist() {
  out = Object.assign({}, out, { items: String((out && out.raw) || "").split("\n").map(s => s.trim()).filter(Boolean) });
}

/* ── render ─────────────────────────────────────────────────────── */
const UI = { groups: uiGroups, picker: uiPicker, seating: uiSeating, order: uiOrder, checklist: uiChecklist };
const MK = { groups: mkGroups, pick: mkPick, seats: mkSeats, order: mkOrder, checklist: mkChecklist };

function render() {
  if (!open) return renderDrawer();
  const u = UTILS.find(x => x.id === open);
  if (u.roster) {
    const ks = classesWithKids();
    if (!ks.length) { view.innerHTML = shell(u.name, needRoster()); return; }
    if (!classId || !ks.some(k => k.id === classId)) classId = (read(K_LAST, null) && ks.some(k => k.id === read(K_LAST, null)) ? read(K_LAST, null) : ks[0].id);
  }
  view.innerHTML = UI[open]();
}

/* ── events ─────────────────────────────────────────────────────── */
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]");
  if (o) { open = o.dataset.open; out = null; seatSel = null; render(); window.scrollTo(0,0); return; }
  if (e.target.closest("[data-back]")) { open = null; out = null; render(); window.scrollTo(0,0); return; }

  const mk = e.target.closest("[data-mk]");
  if (mk) { MK[mk.dataset.mk](); render(); return; }

  if (e.target.closest("[data-print]")) { window.print(); return; }
  if (e.target.closest("[data-resetcalled]")) {
    const s = read(K_CALLED, {}); delete s[classId]; write(K_CALLED, s);
    out = null; render(); toast("Everyone's back in the pool"); return;
  }
  if (e.target.closest("[data-copy]")) {
    let t = "";
    if (out && out.groups) t = out.groups.map((g,i)=>"Group "+(i+1)+"\n"+g.map(s=>"  "+s).join("\n")).join("\n\n");
    else if (out && out.order) t = out.order.map((s,i)=>(i+1)+". "+s).join("\n");
    navigator.clipboard.writeText(t).then(()=>toast("Copied")).catch(()=>toast("Press ⌘C to copy"));
    return;
  }
  const seat = e.target.closest("[data-seat]");
  if (seat && out && out.seats) {
    const i = +seat.dataset.seat;
    if (seatSel === null) { seatSel = i; }
    else if (seatSel === i) { seatSel = null; }
    else { const s = out.seats; [s[seatSel], s[i]] = [s[i], s[seatSel]]; seatSel = null; }
    render();
  }
});

document.addEventListener("change", e => {
  if (e.target.dataset.cls) { classId = e.target.value; write(K_LAST, classId); out = null; seatSel = null; render(); }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.g)  { out = Object.assign({}, out); out[t.dataset.g] = t.value; }
  if (t.dataset.s)  { out = Object.assign({}, out); out[t.dataset.s] = t.value; }
  if (t.dataset.ck) { out = Object.assign({}, out); out[t.dataset.ck] = t.value; }
});

(function boot() {
  if (!window.TeacherPlate) return setTimeout(boot, 40);
  if (TP().onChange) TP().onChange(() => { if (open) render(); });
  render();
})();
