/* Catch Me Up — a per-class day log, and the slip it produces.
   The log is the new thing here: nothing else in Teacher Plate records what a
   class actually did on a given day. Kept local for now (tp.v1.catchMeUp);
   supabase/schema.sql carries a class_days table for when it syncs. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
const K = "tp.v1.catchMeUp";
const TP = () => window.TeacherPlate;

const store = {
  read() { try { return JSON.parse(localStorage.getItem(K)) || { days: {} }; } catch (e) { return { days: {} }; } },
  write(d) { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }
};
let data = store.read();
let classId = null;
let date = todayISO();

function todayISO() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function pretty(iso) {
  const [y, m, d] = (iso || "").split("-").map(Number);
  if (!y) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(undefined,
    { weekday: "long", month: "long", day: "numeric" });
}
const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
let tTimer;
const toast = m => { toastEl.textContent = m; toastEl.hidden = false;
  clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.hidden = true, 1800); };

const classes = () => { try { return TP() ? TP().classes() : []; } catch (e) { return []; } };
function currentClass() {
  const ks = classes();
  return ks.find(k => k.id === classId) || (TP() && TP().currentClass && TP().currentClass()) || ks[0] || null;
}
function entry() {
  const k = currentClass();
  if (!k) return { learned: "", todo: "", skip: "", ask: "", due: "", absent: [] };
  const byClass = data.days[k.id] || {};
  return Object.assign({ learned: "", todo: "", skip: "", ask: "", due: "", absent: [] }, byClass[date] || {});
}
function saveEntry(patch) {
  const k = currentClass();
  if (!k) return;
  data.days[k.id] = data.days[k.id] || {};
  data.days[k.id][date] = Object.assign(entry(), patch);
  store.write(data);
}
function studentName(st) { return (st.first + (st.last ? " " + st.last + "." : "")).trim(); }

/* ── the slip ───────────────────────────────────────────────────── */
function slipHTML(name) {
  const e = entry(), k = currentClass();
  const todo = (e.todo || "").split("\n").map(x => x.trim()).filter(Boolean);
  const any = e.learned || todo.length || e.skip || e.ask || e.due;
  return '<div class="slip">' +
    '<p class="st">You Were Gone</p>' +
    '<p class="meta">' + esc(name || "Student") +
      (k ? ' &nbsp;·&nbsp; ' + esc(k.period + (k.name ? " · " + k.name : "")) : "") +
      ' &nbsp;·&nbsp; ' + esc(pretty(date)) + '</p>' +
    (any ? "" : '<p class="ph">Fill in the day on the left and the slip builds itself.</p>') +
    (e.learned ? '<div class="sec"><h4>Here&rsquo;s what we learned</h4><p>' + esc(e.learned) + '</p></div>' : "") +
    (todo.length ? '<div class="sec"><h4>You need to do</h4><ol>' +
        todo.map(x => '<li>' + esc(x) + '</li>').join("") + '</ol></div>' : "") +
    (e.skip ? '<div class="sec"><h4>You can skip</h4><p>' + esc(e.skip) + '</p></div>' : "") +
    (e.ask  ? '<div class="sec"><h4>Ask me about</h4><p>' + esc(e.ask) + '</p></div>' : "") +
    (e.due  ? '<div class="sec"><h4>Due</h4><p class="due">' + esc(e.due) + '</p></div>' : "") +
  '</div>';
}
function slipText(name) {
  const e = entry(), k = currentClass();
  const todo = (e.todo || "").split("\n").map(x => x.trim()).filter(Boolean);
  const L = ["YOU WERE GONE",
             [name || "Student", k ? k.period + (k.name ? " · " + k.name : "") : "", pretty(date)]
               .filter(Boolean).join(" · "), ""];
  if (e.learned) L.push("Here's what we learned", e.learned, "");
  if (todo.length) { L.push("You need to do"); todo.forEach((x, i) => L.push((i + 1) + ". " + x)); L.push(""); }
  if (e.skip) L.push("You can skip", e.skip, "");
  if (e.ask)  L.push("Ask me about", e.ask, "");
  if (e.due)  L.push("Due", e.due);
  return L.join("\n").trim();
}

/* ── render ─────────────────────────────────────────────────────── */
function render() {
  const ks = classes(), k = currentClass(), e = entry();
  const roster = k ? (k.students || []) : [];
  const absent = roster.filter(st => e.absent.indexOf(st.id) > -1);

  view.innerHTML =
    '<div class="cols"><div>' +
      '<div class="panel"><h3>Which class, which day?</h3>' +
        '<div class="row2">' +
          '<div class="f"><label for="cls">Class</label>' +
            (ks.length
              ? '<select id="cls" data-cls>' + ks.map(x =>
                  '<option value="' + x.id + '"' + (k && x.id === k.id ? " selected" : "") + '>' +
                  esc(x.period) + (x.name ? " · " + esc(x.name) : "") + '</option>').join("") + '</select>'
              : '<input value="No classes yet" disabled>') +
          '</div>' +
          '<div class="f"><label for="dt">Date</label>' +
            '<input id="dt" type="date" value="' + esc(date) + '" data-date></div>' +
        '</div>' +
        (ks.length ? '' : '<p class="empty-roster"><a href="/classes/">Add your classes</a> and this fills in your periods and rosters.</p>') +
      '</div>' +

      '<div class="panel"><h3>What happened in class</h3>' +
        '<p class="hint">Thirty seconds now saves the conversation you&rsquo;d otherwise have four times.</p>' +
        '<div class="f"><label for="l">Here&rsquo;s what we learned</label>' +
          '<textarea id="l" data-k="learned" placeholder="We looked at how authors reveal character through dialogue.">' + esc(e.learned) + '</textarea></div>' +
        '<div class="f"><label for="t">You need to do <span class="eg">— one per line</span></label>' +
          '<textarea id="t" data-k="todo" placeholder="Read pages 42–47.&#10;Complete questions 1–4.&#10;Turn them into the blue tray.">' + esc(e.todo) + '</textarea></div>' +
        '<div class="row2">' +
          '<div class="f"><label for="s">You can skip</label>' +
            '<textarea id="s" data-k="skip" placeholder="The partner discussion.">' + esc(e.skip) + '</textarea></div>' +
          '<div class="f"><label for="a">Ask me about</label>' +
            '<textarea id="a" data-k="ask" placeholder="Why Jonas reacts differently to the others.">' + esc(e.ask) + '</textarea></div>' +
        '</div>' +
        '<div class="f"><label for="d">Due</label>' +
          '<input id="d" data-k="due" value="' + esc(e.due) + '" placeholder="Friday"></div>' +
      '</div>' +

      '<div class="panel"><h3>Who was out?</h3>' +
        (roster.length
          ? '<p class="hint">Tap anyone absent. You&rsquo;ll get a slip each, and it&rsquo;s remembered for this date.</p>' +
            '<div class="who">' + roster.map(st =>
              '<button class="stu' + (e.absent.indexOf(st.id) > -1 ? " on" : "") + '" data-abs="' + st.id + '">' +
              esc(studentName(st)) + '</button>').join("") + '</div>'
          : '<p class="empty-roster">No roster for this class yet. The slip still works &mdash; ' +
            '<a href="/classes/">add students</a> to print one each.</p>') +
      '</div>' +
    '</div>' +

    '<div class="out">' +
      (absent.length ? absent.map(st => slipHTML(studentName(st))).join("") : slipHTML("")) +
      '<div class="rowacts">' +
        '<button class="btn primary" data-print><svg viewBox="0 0 24 24"><path d="M7 8.5V4.4h10v4.1"/>' +
          '<path d="M5 8.5h14a1.5 1.5 0 0 1 1.5 1.5v5H3.5v-5A1.5 1.5 0 0 1 5 8.5z"/><path d="M7 15h10v4.6H7z"/></svg>' +
          'Print ' + (absent.length > 1 ? absent.length + " slips" : "the slip") + '</button>' +
        '<button class="btn" data-copy>Copy to student</button>' +
        (absent.length ? '<span class="count">' + absent.length + ' absent</span>' : '') +
      '</div>' +
    '</div></div>';
}

/* Redraw only the slips while typing, so the textarea keeps focus. */
function repaint() {
  const out = document.querySelector(".out");
  if (!out) return render();
  const k = currentClass(), e = entry();
  const absent = k ? (k.students || []).filter(st => e.absent.indexOf(st.id) > -1) : [];
  const slips = absent.length ? absent.map(st => slipHTML(studentName(st))).join("") : slipHTML("");
  out.querySelectorAll(".slip").forEach(n => n.remove());
  out.insertAdjacentHTML("afterbegin", slips);
}

document.addEventListener("click", e => {
  const a = e.target.closest("[data-abs]");
  if (a) {
    const cur = entry().absent.slice();
    const i = cur.indexOf(a.dataset.abs);
    if (i > -1) cur.splice(i, 1); else cur.push(a.dataset.abs);
    saveEntry({ absent: cur });
    a.classList.toggle("on");
    repaint();
    const c = document.querySelector(".count");
    if (c) c.textContent = cur.length + " absent";
    return;
  }
  if (e.target.closest("[data-print]")) { window.print(); return; }
  if (e.target.closest("[data-copy]")) {
    const k = currentClass(), en = entry();
    const absent = k ? (k.students || []).filter(st => en.absent.indexOf(st.id) > -1) : [];
    const t = absent.length ? absent.map(st => slipText(studentName(st))).join("\n\n———\n\n") : slipText("");
    navigator.clipboard.writeText(t).then(() => toast("Copied")).catch(() => toast("Press ⌘C to copy"));
  }
});

document.addEventListener("input", e => {
  if (e.target.dataset.k) { const p = {}; p[e.target.dataset.k] = e.target.value; saveEntry(p); repaint(); }
});
document.addEventListener("change", e => {
  if (e.target.hasAttribute("data-cls"))  { classId = e.target.value; render(); }
  if (e.target.hasAttribute("data-date")) { date = e.target.value || todayISO(); render(); }
});

(function boot() {
  if (!window.TeacherPlate) return setTimeout(boot, 40);
  if (TP().onChange) TP().onChange(() => render());
  render();
})();
