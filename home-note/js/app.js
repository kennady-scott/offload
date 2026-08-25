/* Home Note — compose a note home from parts.
   The teacher's own sentence goes in verbatim and is never rewritten. Everything
   around it is authored copy chosen by situation, tone and length. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
const K = "tp.v1.homeNote";
const TP = () => window.TeacherPlate;

let s = Object.assign(
  { sit: null, tone: "warm", len: "short", student: "", parent: "", teacher: "", classId: "", words: "" },
  (function () { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { return {}; } })()
);
const save = () => { try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} };

const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
let tTimer;
const toast = m => { toastEl.textContent = m; toastEl.hidden = false;
  clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.hidden = true, 1800); };

const classes = () => { try { return TP() ? TP().classes() : []; } catch (e) { return []; } };
function currentClass() {
  const ks = classes();
  return ks.find(k => k.id === s.classId) || (TP() && TP().currentClass && TP().currentClass()) || ks[0] || null;
}
function roster() {
  const k = currentClass();
  return k ? (k.students || []).map(st => (st.first + (st.last ? " " + st.last + "." : "")).trim()).filter(Boolean) : [];
}
/* Sub-day already asks for the teacher's name; reuse it rather than asking twice. */
function profileName() {
  try { return (JSON.parse(localStorage.getItem("tp.v1.subDay.profile")) || {}).teacherName || ""; }
  catch (e) { return ""; }
}

function fill(t) {
  const k = currentClass();
  return String(t || "")
    .replace(/\{student\}/g, s.student || "your child")
    .replace(/\{class\}/g, (k && (k.name || k.period)) || "class")
    .replace(/\{teacher\}/g, s.teacher || profileName() || "[your name]")
    .replace(/\{parent\}/g, s.parent || "there")
    // Roster names carry their own period ("Avery R."), which collided with the
    // sentence's full stop and produced "Avery R..". Collapsed HERE, inside the
    // template fill only — never over the teacher's own words, which may contain "…".
    .replace(/([.!?])\1+/g, "$1");
}

/* ── the note ───────────────────────────────────────────────────── */
function build() {
  if (!s.sit) return "";
  const words = (s.words || "").trim();
  if (s.len === "text") {
    const one = words.split(/(?<=[.!?])\s+/)[0] || "";
    return [fill(TEXTS[s.sit]), one, "— " + fill("{teacher}")].filter(Boolean).join(" ");
  }
  const parts = [fill(GREETINGS[s.tone]), "", fill(OPENERS[s.sit][s.tone])];
  if (words) parts.push("", words);
  parts.push("", fill(NEXTS[s.sit][s.tone]));
  if (s.len === "detailed") {
    parts.push("", fill("If it's easier to talk than to write, I'm happy to call — just tell me a time that suits you."));
  }
  parts.push("", fill(SIGNOFFS[s.tone]));
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ── step 1 ─────────────────────────────────────────────────────── */
function renderPicker() {
  view.innerHTML =
    '<h2 class="ask">Why are you reaching out?</h2>' +
    '<p class="ask-sub">Pick the reason. You&rsquo;ll write what happened in your own words.</p>' +
    '<div class="sits">' +
      SITUATIONS.map(x =>
        '<button class="sit" data-sit="' + x.id + '"><span class="e">' + x.emoji + '</span>' +
        '<b>' + esc(x.label) + '</b><span class="h">' + esc(x.hint) + '</span></button>').join("") +
    '</div>';
}

/* ── step 2 ─────────────────────────────────────────────────────── */
function renderCompose() {
  const sit = SITUATIONS.find(x => x.id === s.sit);
  const ks = classes(), names = roster();
  const note = build();

  view.innerHTML =
    '<div class="crumb"><button class="back" data-back>' +
      '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3 5 7l3.5 4"/></svg>Different reason</button>' +
      '<h2>' + esc(sit.emoji + "  " + sit.label) + '</h2></div>' +

    '<div class="compose"><div>' +
      '<div class="panel"><h3>Who</h3>' +
        (ks.length
          ? '<div class="f"><label for="cls">Class</label><select id="cls" data-k="classId">' +
              ks.map(k => '<option value="' + k.id + '"' + (currentClass() && k.id === currentClass().id ? " selected" : "") + '>' +
                esc(k.period) + (k.name ? " · " + esc(k.name) : "") + '</option>').join("") +
            '</select></div>'
          : '') +
        '<div class="f"><label for="stu">Student</label>' +
          (names.length
            ? '<select id="stu" data-k="student">' +
                '<option value="">Choose…</option>' +
                names.map(n => '<option' + (n === s.student ? " selected" : "") + '>' + esc(n) + '</option>').join("") +
              '</select>'
            : '<input id="stu" data-k="student" value="' + esc(s.student) + '" placeholder="First name">') +
        '</div>' +
        (names.length ? '' :
          '<p class="rosternote">Typing names every time? <a href="/classes/">Add your classes</a> and they&rsquo;ll be waiting here.</p>') +
        '<div class="f"><label for="par">Address them as</label>' +
          '<input id="par" data-k="parent" value="' + esc(s.parent) + '" placeholder="Ms. Alvarez — or leave blank"></div>' +
        '<div class="f"><label for="tea">Sign as</label>' +
          '<input id="tea" data-k="teacher" value="' + esc(s.teacher || profileName()) + '" placeholder="Ms. Scott"></div>' +
      '</div>' +

      '<div class="panel"><h3>How it should sound</h3>' +
        '<div class="f"><label>Tone</label><div class="pills">' +
          TONES.map(t => '<button class="pill' + (s.tone === t.id ? " on" : "") + '" data-tone="' + t.id + '">' +
            esc(t.label) + '<small>' + esc(t.hint) + '</small></button>').join("") +
        '</div></div>' +
        '<div class="f"><label>Length</label><div class="pills">' +
          LENGTHS.map(l => '<button class="pill' + (s.len === l.id ? " on" : "") + '" data-len="' + l.id + '">' +
            esc(l.label) + '<small>' + esc(l.hint) + '</small></button>').join("") +
        '</div></div>' +
      '</div>' +

      '<div class="panel"><h3>What happened?</h3>' +
        '<p class="hint">Your words, exactly as you type them. Nothing here gets rewritten.</p>' +
        '<div class="f"><textarea data-k="words" placeholder="Jake threw his Chromebook when I asked him to close a game and start the assignment.">' +
          esc(s.words) + '</textarea></div>' +
        '<div class="yours">This sentence goes into the note untouched. That&rsquo;s deliberate &mdash; ' +
        'you know what happened, and a tool that reworded it would make it sound like nobody was there.</div>' +
      '</div>' +
    '</div>' +

    '<div class="out"><div class="note">' +
      (note ? '<pre id="noteText">' + esc(note) + '</pre>'
            : '<pre class="ph">Pick a student and say what happened — the note builds as you type.</pre>') +
    '</div>' +
    '<div class="rowacts">' +
      '<button class="btn primary" data-copy><svg viewBox="0 0 24 24"><rect x="8.6" y="8.6" width="11" height="11.4" rx="2"/>' +
        '<path d="M15.4 5.4H6.4a2 2 0 0 0-2 2v9"/></svg>Copy the note</button>' +
      '<a class="btn" href="/say-this/">What do I say in class?</a>' +
    '</div></div></div>';
}

function render() { s.sit ? renderCompose() : renderPicker(); }

/* Redraw only the note while typing, so the textarea keeps focus and caret. */
function repaintNote() {
  const el = document.querySelector(".note");
  if (!el) return render();
  const note = build();
  el.innerHTML = note ? '<pre id="noteText">' + esc(note) + '</pre>'
                      : '<pre class="ph">Pick a student and say what happened — the note builds as you type.</pre>';
}

document.addEventListener("click", e => {
  const st = e.target.closest("[data-sit]");
  if (st) { s.sit = st.dataset.sit; save(); render(); window.scrollTo(0,0); return; }
  if (e.target.closest("[data-back]")) { s.sit = null; save(); render(); window.scrollTo(0,0); return; }

  const tn = e.target.closest("[data-tone]");
  if (tn) { s.tone = tn.dataset.tone; save(); render(); return; }
  const ln = e.target.closest("[data-len]");
  if (ln) { s.len = ln.dataset.len; save(); render(); return; }

  if (e.target.closest("[data-copy]")) {
    const t = build();
    if (!t) return toast("Nothing to copy yet");
    navigator.clipboard.writeText(t).then(() => toast("Note copied")).catch(() => toast("Press ⌘C to copy"));
  }
});

document.addEventListener("input", e => {
  const k = e.target.dataset.k;
  if (!k) return;
  s[k] = e.target.value; save();
  repaintNote();
});
document.addEventListener("change", e => {
  const k = e.target.dataset.k;
  if (k === "classId" || k === "student") { s[k] = e.target.value; save(); render(); }
});

if (window.TeacherPlate && TeacherPlate.onChange) TeacherPlate.onChange(() => { if (s.sit) render(); });
render();
