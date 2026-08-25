/* Adapt It — structural adaptation.
   What this does honestly, with no model: splits the task into steps, selects a
   subset for reduced load, attaches starters matched to the assignment's own
   verbs, flags the longest sentences, and adds executive-function scaffolding.
   What it does NOT do: rewrite the teacher's wording into simpler language. That
   needs to understand the assignment, and the UI says so rather than pretending. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
const K = "tp.v1.adaptIt";
const TP = () => window.TeacherPlate;

let s = Object.assign({ text: "", needs: ["chunk", "starters"], studentId: "", classId: "" },
  (function () { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { return {}; } })());
const save = () => { try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} };

const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
let tTimer;
const toast = m => { toastEl.textContent = m; toastEl.hidden = false;
  clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.hidden = true, 1900); };

const classes = () => { try { return TP() ? TP().classes() : []; } catch (e) { return []; } };
function currentClass() {
  const ks = classes();
  return ks.find(k => k.id === s.classId) || (TP() && TP().currentClass && TP().currentClass()) || ks[0] || null;
}
function student() {
  const k = currentClass();
  return k ? (k.students || []).find(x => x.id === s.studentId) || null : null;
}
const nameOf = st => (st.first + (st.last ? " " + st.last + "." : "")).trim();
const supportLabel = id => {
  const S = (TP() && TP().SUPPORTS) || [];
  const f = S.find(x => x.id === id); return f ? f.label : id;
};

/* ── structural transforms ──────────────────────────────────────── */
function steps(text) {
  const lines = text.split("\n").map(x => x.trim()).filter(Boolean);
  // A numbered or bulleted list is already the teacher's own structure — keep it.
  const listed = lines.filter(l => /^(\d+[.)]|[-•*])\s+/.test(l));
  if (listed.length >= 2) return listed.map(l => l.replace(/^(\d+[.)]|[-•*])\s+/, ""));
  // Otherwise split into sentences, which is the next most honest unit.
  return text.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(x => x.length > 3);
}
function reduced(items) {
  if (items.length <= 2) return items;
  // Every other item: same difficulty, fewer of them. Never "the easy half".
  return items.filter((_, i) => i % 2 === 0);
}
function kind(text) {
  const t = text.toLowerCase();
  let best = "describe", hits = 0;
  Object.keys(VERB_HINTS).forEach(k => {
    const n = VERB_HINTS[k].filter(w => t.indexOf(w) > -1).length;
    if (n > hits) { hits = n; best = k; }
  });
  return best;
}
function longSentences(text) {
  return text.split(/(?<=[.!?])\s+/).map(x => x.trim())
             .filter(x => x.split(/\s+/).length >= 18);
}

/* ── the versions ───────────────────────────────────────────────── */
function build() {
  const text = (s.text || "").trim();
  if (!text) return [];
  const has = id => s.needs.indexOf(id) > -1;
  const st = steps(text), K2 = kind(text), starters = STARTERS[K2] || STARTERS.describe;
  const out = [];

  out.push({ id: "original", blocks: [{ h: "The assignment", p: text }] });

  const sup = [];
  if (has("exec")) sup.push({ h: "Before you start", list: EXEC_STEPS.slice(0, 2) });
  sup.push(has("chunk") ? { h: "Do these in order", box: st } : { h: "The assignment", p: text });
  if (has("starters")) sup.push({ h: "Ways to start a sentence", list: starters });
  if (has("reading")) {
    const L = longSentences(text);
    if (L.length) sup.push({ h: "Read these twice — they're the long ones", list: L });
  }
  if (has("exec")) sup.push({ h: "Check in with me", list: EXEC_STEPS.slice(2) });
  out.push({ id: "support", blocks: sup });

  const hi = [];
  hi.push({ h: "Start here", p: "Do step 1. Then show me before you carry on." });
  hi.push({ h: has("less") ? "Do these — the rest can wait" : "Do these in order",
            box: has("less") ? reduced(st) : st });
  hi.push({ h: "Ways to start a sentence", list: starters.slice(0, 3) });
  if (has("language") || has("reading")) {
    hi.push({ h: LANGUAGE_NOTES[0], bank: true });
    hi.push({ h: "Also", list: LANGUAGE_NOTES.slice(1) });
  }
  out.push({ id: "high", blocks: hi });

  out.push({ id: "extend", blocks: [
    { h: "The assignment", p: text },
    { h: "Then take it further — pick one", list: EXTENSIONS.slice(0, 4) }
  ]});
  return out;
}

/* ── render ─────────────────────────────────────────────────────── */
function blockHTML(b) {
  let inner = "";
  if (b.p) inner = '<p>' + esc(b.p) + '</p>';
  else if (b.box) inner = '<ul class="box">' + b.box.map(x =>
      '<li><i></i><span>' + esc(x) + '</span></li>').join("") + '</ul>';
  else if (b.list) inner = '<ul>' + b.list.map(x => '<li>' + esc(x) + '</li>').join("") + '</ul>';
  else if (b.bank) inner = '<div class="bank">&nbsp;</div>';
  return '<div class="blk"><h4>' + esc(b.h) + '</h4>' + inner + '</div>';
}

function render() {
  const ks = classes(), k = currentClass();
  const roster = k ? (k.students || []) : [];
  const st = student();
  const versions = build();
  const needsModel = s.needs.indexOf("simpler") > -1;

  view.innerHTML =
    '<div class="setup">' +
      '<div class="panel"><h3>Paste the assignment</h3>' +
        '<p class="hint">The one you already made. Nothing here replaces it &mdash; ' +
        'the original comes back out untouched.</p>' +
        '<textarea class="paste" data-text placeholder="Read pages 42–47.&#10;Answer questions 1–4 in complete sentences.&#10;Explain why Jonas reacts differently to the other characters.">' +
          esc(s.text) + '</textarea></div>' +

      '<div class="panel"><h3>Adapt for one student</h3>' +
        (roster.length
          ? '<p class="hint">Their support preferences switch the right boxes on. That&rsquo;s what the roster is for.</p>' +
            '<div class="forstu">' +
              (ks.length > 1 ? '<div class="f"><label for="cls">Class</label><select id="cls" data-cls>' +
                ks.map(x => '<option value="' + x.id + '"' + (k && x.id === k.id ? " selected" : "") + '>' +
                  esc(x.period) + (x.name ? " · " + esc(x.name) : "") + '</option>').join("") + '</select></div>' : "") +
              '<div class="f"><label for="stu">Student</label><select id="stu" data-stu>' +
                '<option value="">Nobody in particular</option>' +
                roster.map(x => '<option value="' + x.id + '"' + (x.id === s.studentId ? " selected" : "") + '>' +
                  esc(nameOf(x)) + '</option>').join("") + '</select></div>' +
            '</div>' +
            (st ? '<p class="supports">' + (st.supports || []).length
                    ? '<p class="supports"><b>' + esc(nameOf(st)) + ' needs:</b> ' +
                      (st.supports || []).map(supportLabel).join(" · ") + '</p>'
                    : '<p class="supports">No support preferences saved for ' + esc(nameOf(st)) +
                      ' yet — <a href="/classes/">add them</a> and this fills itself in.</p>'
                : '')
          : '<p class="rosternote"><a href="/classes/">Add your classes</a> and you can adapt for a ' +
            'named student instead of ticking boxes from memory.</p>') +
      '</div>' +

      '<div class="panel"><h3>What does this learner need?</h3>' +
        '<p class="hint">Built around the need, never a label. There is deliberately nowhere ' +
        'here to enter a diagnosis.</p>' +
        '<div class="needs">' +
          NEEDS.map(n =>
            '<button class="need' + (s.needs.indexOf(n.id) > -1 ? " on" : "") +
              (n.needsModel ? " locked" : "") + '" data-need="' + n.id + '">' +
              '<b>' + esc(n.label) + '</b><span>' + esc(n.hint) + '</span>' +
              '<span class="adds">' + esc(n.adds) + '</span></button>').join("") +
        '</div>' +
        (needsModel
          ? '<div class="gap"><b>Simpler directions is the one thing this can&rsquo;t do yet.</b>' +
            'Rewriting your wording means understanding your assignment, which needs a language ' +
            'model connected. Everything else here is structural and works right now: splitting ' +
            'into steps, reducing the load, starters, and flagging the long sentences.</div>'
          : "") +
      '</div>' +

      '<div class="rowacts">' +
        '<button class="btn primary" data-print><svg viewBox="0 0 24 24"><path d="M7 8.5V4.4h10v4.1"/>' +
          '<path d="M5 8.5h14a1.5 1.5 0 0 1 1.5 1.5v5H3.5v-5A1.5 1.5 0 0 1 5 8.5z"/><path d="M7 15h10v4.6H7z"/></svg>' +
          'Print all versions</button>' +
        '<button class="btn" data-copy>Copy as text</button>' +
      '</div>' +
    '</div>' +

    '<div class="versions">' +
      (versions.length
        ? versions.map(v => {
            const meta = VERSIONS.find(x => x.id === v.id);
            return '<div class="ver"><div class="vh"><b>' + esc(meta.label) + '</b>' +
              '<span>' + esc(meta.hint) + '</span></div>' +
              v.blocks.map(blockHTML).join("") + '</div>';
          }).join("")
        : '<div class="ver"><div class="vh"><b>Nothing yet</b><span>Paste an assignment above</span></div>' +
          '<div class="blk"><p>Four versions appear here: the original untouched, plus supported, ' +
          'highly supported and extended.</p></div></div>') +
    '</div>';
}

document.addEventListener("click", e => {
  const n = e.target.closest("[data-need]");
  if (n) {
    const i = s.needs.indexOf(n.dataset.need);
    if (i > -1) s.needs.splice(i, 1); else s.needs.push(n.dataset.need);
    save(); render(); return;
  }
  if (e.target.closest("[data-print]")) { window.print(); return; }
  if (e.target.closest("[data-copy]")) {
    const t = [...document.querySelectorAll(".ver")].map(v => v.innerText).join("\n\n———\n\n");
    if (!t.trim()) return toast("Paste an assignment first");
    navigator.clipboard.writeText(t).then(() => toast("Copied")).catch(() => toast("Press ⌘C to copy"));
  }
});

document.addEventListener("input", e => {
  if (e.target.hasAttribute("data-text")) {
    s.text = e.target.value; save();
    // repaint only the output, so the textarea keeps focus and caret
    const box = document.querySelector(".versions");
    if (box) {
      const versions = build();
      box.innerHTML = versions.length
        ? versions.map(v => {
            const meta = VERSIONS.find(x => x.id === v.id);
            return '<div class="ver"><div class="vh"><b>' + esc(meta.label) + '</b><span>' +
              esc(meta.hint) + '</span></div>' + v.blocks.map(blockHTML).join("") + '</div>';
          }).join("")
        : box.innerHTML;
    }
  }
});
document.addEventListener("change", e => {
  if (e.target.hasAttribute("data-cls")) { s.classId = e.target.value; s.studentId = ""; save(); render(); }
  if (e.target.hasAttribute("data-stu")) {
    s.studentId = e.target.value; save();
    const st = student();
    if (st) {
      // their saved supports decide which needs switch on
      const add = [];
      (st.supports || []).forEach(sup => (SUPPORT_TO_NEED[sup] || []).forEach(nd => {
        if (add.indexOf(nd) < 0) add.push(nd);
      }));
      if (add.length) { s.needs = add; save(); toast("Set from " + nameOf(st) + "'s supports"); }
    }
    render();
  }
});

(function boot() {
  if (!window.TeacherPlate) return setTimeout(boot, 40);
  if (TP().onChange) TP().onChange(() => render());
  render();
})();
