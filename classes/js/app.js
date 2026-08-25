/* Class Manager — the thing that stops every tool asking the same questions.
   All state lives in the shared store on TeacherPlate (core/bar.js), so the bar,
   Sub Day and Say This see edits the moment they're made. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
const TP = () => window.TeacherPlate;

let selected = null;
let tTimer;
const toast = m => { toastEl.textContent = m; toastEl.hidden = false;
  clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.hidden = true, 1800); };
const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

/* ── empty state ────────────────────────────────────────────────── */
function renderEmpty() {
  view.innerHTML =
    '<div class="empty"><span class="e">🗂️</span>' +
    '<h2>No classes yet</h2>' +
    '<p>Add them once and every tool stops asking. Sub Day fills in your periods, ' +
    'Say This knows which class you&rsquo;re in, and Adapt It can work from what a student ' +
    'actually needs.</p>' +
    '<div class="row">' +
      '<button class="btn primary" data-add><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add your first class</button>' +
      '<button class="btn" data-examples>Load example classes</button>' +
    '</div></div>';
}

/* ── class list + detail ────────────────────────────────────────── */
function renderApp() {
  const ks = TP().classes();
  if (!ks.length) { selected = null; return renderEmpty(); }
  if (!selected || !ks.some(k => k.id === selected)) selected = ks[0].id;
  const k = ks.find(x => x.id === selected);
  const S = TP().SUPPORTS;

  view.innerHTML =
    '<div class="cols">' +
      '<div class="side">' +
        '<div class="klist">' +
          ks.map(c =>
            '<button class="kbtn' + (c.id === selected ? " on" : "") + '" data-pick="' + c.id + '">' +
              '<span class="sw" style="background:' + c.color + '"></span>' +
              '<span class="t"><b>' + esc(c.period || "Untitled") + '</b>' +
              '<span>' + esc(c.name || "—") + ' · ' + (c.students || []).length + '</span></span>' +
            '</button>').join("") +
        '</div>' +
        '<button class="btn sm" data-add><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add a class</button>' +
      '</div>' +

      '<div>' +
        '<div class="panel">' +
          '<h3>Class details</h3><p class="hint">Every tool reads these.</p>' +
          '<div class="grid2">' +
            fld("period", "Period or label", k.period, "Period 3") +
            fld("name", "Subject", k.name, "8th Grade ELA") +
            fld("grade", "Grade", k.grade, "8") +
            fld("time", "Time", k.time, "10:05–10:55") +
            fld("unit", "Current unit", k.unit, "Character & dialogue", true) +
            fldArea("notes", "Notes about this class", k.notes,
                    "Energetic group. Needs structured transitions.") +
            '<div class="f wide"><label>Color</label><div class="swatches">' +
              TP().COLORS.map(c => '<button data-color="' + c + '" class="' + (c === k.color ? "on" : "") +
                                   '" style="background:' + c + '" aria-label="' + c + '"></button>').join("") +
            '</div></div>' +
          '</div>' +
          '<div class="rowacts">' +
            '<button class="btn danger sm" data-delclass="' + k.id + '">Delete this class</button>' +
          '</div>' +
        '</div>' +

        '<div class="panel">' +
          '<h3>Students</h3>' +
          '<p class="hint">' + (k.students || []).length + ' on the roster. First name and last initial &mdash; that&rsquo;s all any tool needs.</p>' +
          ((k.students || []).length
            ? k.students.map(st =>
              '<div class="stu">' +
                '<div class="stuhead">' +
                  '<input class="fn" data-st="' + st.id + '" data-k="first" value="' + esc(st.first) + '" placeholder="First name">' +
                  '<input class="li" data-st="' + st.id + '" data-k="last" maxlength="1" value="' + esc(st.last) + '" placeholder="L">' +
                  '<button class="del" data-delstu="' + st.id + '">Remove</button>' +
                '</div>' +
                '<div class="chips">' +
                  S.map(sup => '<button class="chip' + ((st.supports || []).indexOf(sup.id) > -1 ? " on" : "") +
                    '" data-sup="' + sup.id + '" data-for="' + st.id + '">' + esc(sup.label) + '</button>').join("") +
                '</div>' +
                '<div class="stunote"><input data-st="' + st.id + '" data-k="note" value="' + esc(st.note || "") +
                  '" placeholder="Anything else that helps (optional)"></div>' +
              '</div>').join("")
            : '<p class="hint" style="margin:0">Nobody yet. You don&rsquo;t need the whole roster &mdash; ' +
              'start with the handful of kids you plan around.</p>') +
          '<div class="rowacts">' +
            '<button class="btn sm" data-addstu><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add a student</button>' +
          '</div>' +
          '<div class="rowacts" style="margin-top:18px;border-top:1px solid var(--line-2);padding-top:16px">' +
            '<button class="btn sm" data-export>Download a backup</button>' +
            '<button class="btn sm" data-import>Restore from a file</button>' +
            '<input type="file" id="impFile" accept="application/json" hidden>' +
          '</div>' +
          '<div class="priv"><span>🔒</span><span>Stays in this browser. Keep it to what helps you teach ' +
          '&mdash; supports, not diagnoses. No medical information, no labels, no IEP details.</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function fld(key, label, val, ph, wide) {
  return '<div class="f' + (wide ? " wide" : "") + '"><label for="c_' + key + '">' + esc(label) + '</label>' +
         '<input id="c_' + key + '" data-c="' + key + '" value="' + esc(val) + '" placeholder="' + esc(ph) + '"></div>';
}
function fldArea(key, label, val, ph) {
  return '<div class="f wide"><label for="c_' + key + '">' + esc(label) + '</label>' +
         '<textarea id="c_' + key + '" data-c="' + key + '" placeholder="' + esc(ph) + '">' + esc(val) + '</textarea></div>';
}

/* ── events ─────────────────────────────────────────────────────── */
function stamp() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

document.addEventListener("click", e => {
  const t = e.target;

  if (t.closest("[data-export]")) {
    const blob = new Blob([JSON.stringify({ version: 1, exported: stamp(), classes: TP().classes() }, null, 2)],
                          { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "teacher-plate-classes-" + stamp() + ".json";
    a.click(); URL.revokeObjectURL(a.href);
    toast("Backup downloaded"); return;
  }
  if (t.closest("[data-import]")) { document.getElementById("impFile").click(); return; }

  if (t.closest("[data-examples]")) { TP().loadExamples(); toast("Example classes added"); return renderApp(); }
  if (t.closest("[data-add]")) {
    const k = TP().addClass({ period: "New class" });
    selected = k.id; renderApp();
    const first = document.getElementById("c_period"); if (first) { first.focus(); first.select(); }
    return;
  }
  const pick = t.closest("[data-pick]");
  if (pick) { selected = pick.dataset.pick; return renderApp(); }

  const col = t.closest("[data-color]");
  if (col) { TP().updateClass(selected, { color: col.dataset.color }); return renderApp(); }

  const dc = t.closest("[data-delclass]");
  if (dc) {
    const k = TP().classes().find(x => x.id === dc.dataset.delclass);
    const n = (k.students || []).length;
    const msg = "Delete " + (k.period || "this class") +
      (n ? " and its " + n + " student" + (n === 1 ? "" : "s") + "?" : "?") + " This can't be undone.";
    if (confirm(msg)) { TP().removeClass(dc.dataset.delclass); selected = null; toast("Class deleted"); renderApp(); }
    return;
  }
  if (t.closest("[data-addstu]")) {
    TP().addStudent(selected, { first: "", last: "" }); renderApp();
    const inputs = document.querySelectorAll(".stu .fn");
    if (inputs.length) inputs[inputs.length - 1].focus();
    return;
  }
  const ds = t.closest("[data-delstu]");
  if (ds) { TP().removeStudent(selected, ds.dataset.delstu); return renderApp(); }

  const sup = t.closest("[data-sup]");
  if (sup) {
    const k = TP().classes().find(x => x.id === selected);
    const st = k.students.find(x => x.id === sup.dataset.for);
    const list = (st.supports || []).slice();
    const i = list.indexOf(sup.dataset.sup);
    if (i > -1) list.splice(i, 1); else list.push(sup.dataset.sup);
    TP().updateStudent(selected, st.id, { supports: list });
    sup.classList.toggle("on");        // toggle in place: a re-render would steal focus
  }
});

/* Typing writes straight through to the store. No save button — a save button on
   a form a teacher fills at 6am is just one more thing to forget. */
document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.c) {
    const patch = {}; patch[t.dataset.c] = t.value;
    TP().updateClass(selected, patch);
    const btn = document.querySelector('[data-pick="' + selected + '"]');
    if (btn && (t.dataset.c === "period" || t.dataset.c === "name")) {
      const k = TP().classes().find(x => x.id === selected);
      btn.querySelector("b").textContent = k.period || "Untitled";
      btn.querySelector("span span").textContent = (k.name || "—") + " · " + (k.students || []).length;
    }
    return;
  }
  if (t.dataset.st) {
    const patch = {}; patch[t.dataset.k] = t.dataset.k === "last" ? t.value.toUpperCase() : t.value;
    if (t.dataset.k === "last") t.value = patch.last;
    TP().updateStudent(selected, t.dataset.st, patch);
  }
});

document.addEventListener("change", e => {
  if (e.target.id !== "impFile" || !e.target.files || !e.target.files[0]) return;
  const f = e.target.files[0];
  const rd = new FileReader();
  rd.onload = () => {
    let data;
    try { data = JSON.parse(rd.result); } catch (err) { return toast("That file isn't a backup"); }
    const incoming = (data && data.classes) || [];
    if (!Array.isArray(incoming) || !incoming.length) return toast("No classes in that file");
    // Additive by default: restoring must never silently wipe what is already here.
    const have = {}; TP().classes().forEach(k => { have[k.period + "|" + k.name] = true; });
    let added = 0;
    incoming.forEach(k => {
      if (have[k.period + "|" + k.name]) return;
      const nk = TP().addClass({ period: k.period, name: k.name, grade: k.grade,
                                 time: k.time, unit: k.unit, notes: k.notes, color: k.color });
      (k.students || []).forEach(st => {
        const ns = TP().addStudent(nk.id, { first: st.first, last: st.last });
        TP().updateStudent(nk.id, ns.id, { supports: st.supports || [], note: st.note || "" });
      });
      added++;
    });
    toast(added ? "Restored " + added + " class" + (added === 1 ? "" : "es") : "Those classes are already here");
    renderApp();
  };
  rd.readAsText(f);
});

function boot() {
  if (!window.TeacherPlate) return setTimeout(boot, 40);   // bar mounts on DOMContentLoaded
  renderApp();
}
boot();
