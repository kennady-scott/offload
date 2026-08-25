/* Say This — routing + render.
   Hash routes (#/wont-start) so a link to a situation is shareable and the
   back button behaves, matching how the other tools in the hub work. */

const view  = document.getElementById("view");
const toastEl = document.getElementById("toast");
const NAME_KEY = "tp.v1.sayThis.name";

let setIndex = 0;          // which of the three approaches is showing
let student  = "";
try { student = localStorage.getItem(NAME_KEY) || ""; } catch (e) {}

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

/* ── the situation grid ─────────────────────────────────────────── */
function renderPicker() {
  view.innerHTML =
    '<h2 class="ask">What&rsquo;s happening?</h2>' +
    '<p class="ask-sub">Pick the closest one. You&rsquo;ll get four ways to handle it.</p>' +
    '<div class="sits">' +
      SITUATIONS.map(s =>
        '<button class="sit" data-go="' + s.id + '">' +
          '<span class="e">' + s.emoji + '</span>' +
          '<b>' + esc(s.label) + '</b>' +
          '<span class="h">' + esc(s.hint) + '</span>' +
        '</button>').join("") +
    '</div>';
}

/* ── the four registers ─────────────────────────────────────────── */
function renderAnswer(s) {
  const set = s.sets[setIndex % s.sets.length];
  view.innerHTML =
    '<div class="answer">' +
      '<div class="crumb">' +
        '<button class="back" data-back>' +
          '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3 5 7l3.5 4"/></svg>' +
          'Something else</button>' +
        '<span class="who"><label for="who">Who?</label>' +
          '<input id="who" type="text" placeholder="optional" value="' + esc(student) + '" autocomplete="off"></span>' +
      '</div>' +
      '<h2 class="restate">' + esc(s.restate) + '</h2>' +
      '<p class="setno">Approach ' + ((setIndex % s.sets.length) + 1) + ' of ' + s.sets.length + '</p>' +
      (s.safety ? '<div class="safety"><b>⚠️</b><span>' + esc(s.safety) + '</span></div>' : "") +
      '<div class="cards">' +
        REGISTERS.map(r =>
          '<div class="card">' +
            '<div class="top"><span class="tag t-' + r.tone + '">' + r.label + '</span>' +
            '<span class="blurb">' + esc(r.blurb) + '</span></div>' +
            '<p class="line">&ldquo;' + esc(set[r.key]) + '&rdquo;</p>' +
            '<button class="copy" data-copy="' + r.key + '">' + COPY_ICON + 'Copy</button>' +
          '</div>').join("") +
      '</div>' +
      '<div class="next">' +
        '<button class="act primary" data-another>' +
          '<svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>' +
          'Try another approach</button>' +
        '<button class="act" data-doc>' +
          '<svg viewBox="0 0 24 24"><path d="M6.5 3.8h11a1 1 0 0 1 1 1v14.4a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1z"/><path d="M9 8.6h6M9 12h6M9 15.4h4"/></svg>' +
          'Document this</button>' +
        '<a class="act" href="/tools.html">' +
          '<svg viewBox="0 0 24 24"><path d="M3.6 7.4a1.6 1.6 0 0 1 1.6-1.6h13.6a1.6 1.6 0 0 1 1.6 1.6v9.2a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6z"/><path d="m3.9 7.9 8.1 5.6 8.1-5.6"/></svg>' +
          'Contact home<span class="soon">in build</span></a>' +
      '</div>' +
      '<div id="docPanel"></div>' +
    '</div>';
}

/* ── documentation starter ──────────────────────────────────────── */
function docLine(s) {
  const now = new Date();
  const when = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
               ", " + now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const k = (window.TeacherPlate && TeacherPlate.currentClass && TeacherPlate.currentClass()) || null;
  const where = k ? k.period + " · " + k.name : null;
  const who = student.trim() || "[student]";
  // Factual and neutral on purpose: documentation is read later by people who
  // were not in the room. No pronouns — we do not know them and will not guess.
  return [when, where, who].filter(Boolean).join(" — ") + "\n" +
         s.log.replace(/\{who\}/g, who) + "\n" +
         "Teacher response: ";
}

function renderDoc(s) {
  const panel = document.getElementById("docPanel");
  if (!panel) return;
  if (panel.dataset.open === "1") { panel.innerHTML = ""; panel.dataset.open = "0"; return; }
  panel.dataset.open = "1";
  const k = (window.TeacherPlate && TeacherPlate.currentClass && TeacherPlate.currentClass()) || null;
  panel.innerHTML =
    '<div class="doc">' +
      '<h3>Documentation starter</h3>' +
      '<p class="note">Factual, no interpretation, no pronouns' +
        (k ? ' &mdash; class filled in from Teacher Plate.' : ' &mdash; pick a class in the bar and it fills in.') +
      '</p>' +
      '<textarea id="docText">' + esc(docLine(s)) + '</textarea>' +
      '<div class="row"><button class="act" data-doccopy>' + COPY_ICON + 'Copy note</button></div>' +
    '</div>';
}

/* ── router ─────────────────────────────────────────────────────── */
function route() {
  const id = (location.hash || "").replace(/^#\/?/, "");
  const s = byId(id);
  if (s) { document.title = "Say This — " + s.label + " | Teacher Plate"; renderAnswer(s); }
  else   { document.title = "Say This — what to say in the moment | Teacher Plate"; setIndex = 0; renderPicker(); }
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
    toast("Approach " + (setIndex + 1) + " of " + cur.sets.length);
    return;
  }
  const c = e.target.closest("[data-copy]");
  if (c) { copy(cur.sets[setIndex % cur.sets.length][c.dataset.copy], "Line copied"); return; }

  if (e.target.closest("[data-doc]")) { renderDoc(cur); return; }
  if (e.target.closest("[data-doccopy]")) {
    copy(document.getElementById("docText").value, "Note copied");
  }
});

document.addEventListener("input", e => {
  if (e.target.id === "who") {
    student = e.target.value;
    try { localStorage.setItem(NAME_KEY, student); } catch (err) {}
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && location.hash) { location.hash = ""; }
});

/* keep the documentation starter in step with the class picked in the bar */
if (window.TeacherPlate && TeacherPlate.onChange) {
  TeacherPlate.onChange(() => {
    const panel = document.getElementById("docPanel");
    const cur = byId((location.hash || "").replace(/^#\/?/, ""));
    if (cur && panel && panel.dataset.open === "1") { panel.dataset.open = "0"; renderDoc(cur); }
  });
}

route();
