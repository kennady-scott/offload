/* Get Them Back — routing + render.
   Same hash-route shape as Say This (#/too-wild) so a link to one situation is
   shareable, the back button behaves, and the two tools feel like one product. */

const view    = document.getElementById("view");
const toastEl = document.getElementById("toast");

let setIndex = 0;                       // which of the three sets of moves is showing

const byId = id => SITUATIONS.find(s => s.id === id);
const esc  = t => String(t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

let toastTimer;
function toast(msg) {
  toastEl.textContent = msg; toastEl.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, 1900);
}
async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg || "Copied"); }
  catch (e) {                                        // clipboard API needs https or localhost
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast(msg || "Copied"); }
    catch (e2) { toast("Press ⌘C to copy"); }
    ta.remove();
  }
}

const COPY_ICON =
  '<svg viewBox="0 0 24 24"><rect x="8.6" y="8.6" width="11" height="11.4" rx="2"/>' +
  '<path d="M15.4 5.4H6.4a2 2 0 0 0-2 2v9"/></svg>';

/* ── step 1: what's happening in the room ───────────────────────── */
function renderPicker() {
  view.innerHTML =
    '<h2 class="ask">What&rsquo;s happening in your room?</h2>' +
    '<p class="ask-sub">Pick the closest one. You&rsquo;ll get three things to try right now.</p>' +
    '<div class="sits">' +
      SITUATIONS.map(s =>
        '<button class="sit" data-go="' + s.id + '">' +
          '<span class="e">' + s.emoji + '</span>' +
          '<b>' + esc(s.label) + '</b>' +
          '<span class="h">' + esc(s.hint) + '</span>' +
        '</button>').join("") +
    '</div>' +
    // The disambiguation that stops this tool and Say This from being confused.
    '<p class="sib">One student, not the whole room? That&rsquo;s ' +
      '<a href="/say-this/">Say This</a> &mdash; what to say when a kid pushes back.</p>';
}

/* ── step 2: three moves ────────────────────────────────────────── */
function moveCard(m, i) {
  return '<div class="move">' +
    '<div class="mh"><span class="n">' + (i + 1) + '</span>' +
      '<span class="cost">' + esc(m.cost) + '</span></div>' +
    '<h3>' + esc(m.name) + '</h3>' +
    '<p class="do">' + esc(m.do) + '</p>' +
    (m.say
      ? '<p class="say">' + esc(m.say) + '</p>' +
        '<button class="copy" data-copysay="' + i + '">' + COPY_ICON + 'Copy the line</button>'
      : "") +
    '<p class="why">' + esc(m.why) + '</p>' +
  '</div>';
}

function renderAnswer(s) {
  const set = s.sets[setIndex % s.sets.length];
  view.innerHTML =
    '<div class="answer">' +
      '<div class="crumb">' +
        '<button class="back" data-back>' +
          '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3 5 7l3.5 4"/></svg>' +
          'Something else</button>' +
      '</div>' +
      '<h2 class="restate">' + esc(s.restate) + '</h2>' +
      '<p class="setno">Three moves &mdash; set ' + ((setIndex % s.sets.length) + 1) + ' of ' + s.sets.length + '</p>' +
      (s.read ? '<div class="read"><b>👀</b><span>' + esc(s.read) + '</span></div>' : "") +
      '<div class="moves">' + set.map(moveCard).join("") + '</div>' +
      '<div class="next">' +
        '<button class="act primary" data-another>' +
          '<svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>' +
          'Three more</button>' +
        (s.handoff
          ? '<a class="act" href="' + s.handoff.href + '">' +
              '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.3V12l3 2"/></svg>' +
              esc(s.handoff.label) + '</a>'
          : '<a class="act" href="/before-the-bell/">' +
              '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.3V12l3 2"/></svg>' +
              'Need a whole activity?</a>') +
        '<a class="act" href="/say-this/">' +
          '<svg viewBox="0 0 24 24"><path d="M3.9 7A2.6 2.6 0 0 1 6.5 4.4h11A2.6 2.6 0 0 1 20.1 7v6.9a2.6 2.6 0 0 1-2.6 2.6h-7.2l-4.5 3.4v-3.4h-.7A2.6 2.6 0 0 1 3.9 14z"/></svg>' +
          'It&rsquo;s one kid</a>' +
      '</div>' +
    '</div>';
}

/* ── router ─────────────────────────────────────────────────────── */
function route() {
  const id = (location.hash || "").replace(/^#\/?/, "");
  const s = byId(id);
  if (s) { document.title = "Get Them Back — " + s.label + " | Teacher Plate"; renderAnswer(s); }
  else   { document.title = "Get Them Back — the lesson is dying | Teacher Plate"; setIndex = 0; renderPicker(); }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

/* ── events ─────────────────────────────────────────────────────── */
document.addEventListener("click", e => {
  const go = e.target.closest("[data-go]");
  if (go) { setIndex = 0; location.hash = "#/" + go.dataset.go; return; }

  if (e.target.closest("[data-back]")) { location.hash = ""; return; }

  const cur = byId((location.hash || "").replace(/^#\/?/, ""));
  if (!cur) return;

  if (e.target.closest("[data-another]")) {
    setIndex = (setIndex + 1) % cur.sets.length;
    renderAnswer(cur);
    toast("Set " + (setIndex + 1) + " of " + cur.sets.length);
    return;
  }

  const c = e.target.closest("[data-copysay]");
  if (c) {
    const m = cur.sets[setIndex % cur.sets.length][Number(c.dataset.copysay)];
    // Copy without the curly quotes — they're for reading, not for pasting.
    copy(String(m.say).replace(/[“”]/g, ""), "Line copied");
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && location.hash) { location.hash = ""; }
});

route();
