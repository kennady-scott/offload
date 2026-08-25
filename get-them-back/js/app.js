/* Get Them Back — pick a state, get three moves.
   Hash routes so a link to a state is shareable, matching the other tools. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
let offset = 0;                     // which slice of six is showing

const byId = id => STATES.find(s => s.id === id);
const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
let tTimer;
const toast = m => { toastEl.textContent = m; toastEl.hidden = false;
  clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.hidden = true, 1800); };

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Copied"); }
  catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Copied"); } catch (e2) { toast("Press ⌘C to copy"); }
    ta.remove();
  }
}

/* The rule: an untagged move suits any grade, so it always shows. A tagged move
   only shows for those bands. If that leaves nothing, show everything and say so —
   never hand back an empty screen. */
function movesFor(s) {
  let bands = [];
  try { bands = (window.TeacherPlate && TeacherPlate.gradeBands) ? TeacherPlate.gradeBands() : []; }
  catch (e) {}
  if (!bands.length) return { list: s.moves, widened: false };
  const fit = s.moves.filter(m => !m.bands || m.bands.some(b => bands.indexOf(b) > -1));
  return fit.length ? { list: fit, widened: false } : { list: s.moves, widened: true };
}

const COPY_ICON =
  '<svg viewBox="0 0 24 24"><rect x="8.6" y="8.6" width="11" height="11.4" rx="2"/>' +
  '<path d="M15.4 5.4H6.4a2 2 0 0 0-2 2v9"/></svg>';

function renderPicker() {
  view.innerHTML =
    '<h2 class="ask">What&rsquo;s happening in your room?</h2>' +
    '<p class="ask-sub">Closest one wins. You&rsquo;ll get three things to try right now.</p>' +
    '<div class="states">' +
      STATES.map(s =>
        '<button class="st" data-go="' + s.id + '"><span class="e">' + s.emoji + '</span>' +
        '<b>' + esc(s.label) + '</b><span class="h">' + esc(s.hint) + '</span></button>').join("") +
    '</div>';
}

function renderMoves(s) {
  const pool = movesFor(s);
  const n = pool.list.length;
  const show = [0, 1, 2].map(i => pool.list[(offset + i) % n]);
  view.innerHTML =
    '<div class="answer">' +
      '<div class="crumb"><button class="back" data-back>' +
        '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3 5 7l3.5 4"/></svg>' +
        'Something else</button></div>' +
      '<h2 class="restate">' + esc(s.restate) + '</h2>' +
      '<p class="nowline">Try this now &mdash; pick one and commit.</p>' +
      '<div class="moves">' +
        show.map(m =>
          '<div class="mv"><div class="n"><h3>' + esc(m.name) + '</h3>' +
          '<span class="mins">' + m.mins + ' min</span></div>' +
          '<p>' + esc(m.do) + '</p>' +
          '<button class="copy" data-copy="' + esc(m.name) + '">' + COPY_ICON + 'Copy</button></div>').join("") +
      '</div>' +
      (pool.widened
        ? '<p class="gradenote">Some of these need more independent writing than your grades usually manage, ' +
          'so this is everything. Adapt down as you go.</p>' : '') +
      (s.seeAlso
        ? '<p class="seealso">&rarr; <a href="' + s.seeAlso.href + '">' + esc(s.seeAlso.label) + '</a></p>' : '') +
      '<div class="next">' +
        '<button class="act primary" data-more>' +
          '<svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>' +
          'Three more</button>' +
        '<a class="act" href="/say-this/">It&rsquo;s one student, not the room</a>' +
      '</div>' +
    '</div>';
}

function route() {
  const id = (location.hash || "").replace(/^#\/?/, "");
  const s = byId(id);
  if (s) { document.title = "Get Them Back — " + s.label + " | Teacher Plate"; renderMoves(s); }
  else { document.title = "Get Them Back — quick moves when the lesson is dying | Teacher Plate";
         offset = 0; renderPicker(); }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

document.addEventListener("click", e => {
  const go = e.target.closest("[data-go]");
  if (go) { offset = 0; location.hash = "#/" + go.dataset.go; return; }
  if (e.target.closest("[data-back]")) { location.hash = ""; return; }

  const cur = byId((location.hash || "").replace(/^#\/?/, ""));
  if (!cur) return;

  if (e.target.closest("[data-more]")) {
    const n = movesFor(cur).list.length;
    offset = (offset + 3) % n;
    renderMoves(cur);
    toast("Three more");
    return;
  }
  const c = e.target.closest("[data-copy]");
  if (c) {
    const m = movesFor(cur).list.find(x => x.name === c.dataset.copy);
    if (m) copy(m.name + " — " + m.do);
  }
});

document.addEventListener("keydown", e => { if (e.key === "Escape" && location.hash) location.hash = ""; });

if (window.TeacherPlate && TeacherPlate.onChange) {
  TeacherPlate.onChange(() => { if (location.hash) route(); });
}
route();
