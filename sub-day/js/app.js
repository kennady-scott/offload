/* Sub Day — profile, wizard, plan.
   The profile is the whole reason this lives in the hub: routines, restroom
   policy, who's next door. Fill it once, never rebuild it. */

const view = document.getElementById("view");
const toastEl = document.getElementById("toast");
const P_KEY = "tp.v1.subDay.profile";
const S_KEY = "tp.v1.subDay.state";

const store = {
  read(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } },
  write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

let profile = store.read(P_KEY, {});
let state = Object.assign({ step: "energy", energy: null, when: "", classes: {} }, store.read(S_KEY, {}));
const save = () => store.write(S_KEY, state);

const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
let tTimer;
function toast(m) { toastEl.textContent = m; toastEl.hidden = false; clearTimeout(tTimer); tTimer = setTimeout(()=>toastEl.hidden = true, 1900); }

function classes() {
  const tp = window.TeacherPlate;
  return (tp && tp.classes) ? tp.classes() : [];
}
function tomorrow() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
/* Deterministic AND distinct. Seeding off each class id separately collided
   ("p1" and "p5" hashed to the same block), so seed once off the first class and
   walk forward — no two periods share a block until you teach more than six. */
function blockFor(classId, i, firstId) {
  const seed = (firstId || classId || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return BLOCKS[(seed + i) % BLOCKS.length];
}

/* ── step 1: energy ─────────────────────────────────────────────── */
function stepEnergy() {
  view.innerHTML =
    '<div class="step"><h2>You&rsquo;re out. Okay.</h2>' +
    '<p class="sub">How much can you give me right now? All three make a real plan.</p>' +
    '<div class="energy">' +
      ENERGY.map(e =>
        '<button class="elvl" data-energy="' + e.id + '">' +
          '<span class="e">' + e.emoji + '</span><b>' + esc(e.label) + '</b>' +
          '<span>' + esc(e.blurb) + '</span></button>').join("") +
    '</div>' +
    '<p class="steps-bar"><b>1. How you&rsquo;re doing</b><i></i>2. Your classes<i></i>3. The plan</p>' +
    '</div>';
}

/* ── step 2: classes + profile ──────────────────────────────────── */
function stepClasses() {
  const lvl = ENERGY.find(e => e.id === state.energy) || ENERGY[0];
  const ks = classes();
  const needsInput = lvl.needs !== "none";
  const label = lvl.needs === "topic" ? "What are they working on?" : "What should they do?";
  const ph = lvl.needs === "topic" ? "Unit 2 — character and dialogue" : "Finish the packet from Friday, then read chapter 4";

  view.innerHTML =
    '<div class="step">' +
    '<h2>Which classes, and when?</h2>' +
    '<p class="sub">' + esc(lvl.emoji + "  " + lvl.label) + ' &mdash; ' + esc(lvl.blurb) + '</p>' +

    '<div class="card"><h3>The day</h3>' +
      '<p class="hint">Times are optional. A sub can read a bell schedule; they can&rsquo;t guess your room.</p>' +
      '<div class="grid2"><div class="f"><label for="when">Which day are you out?</label>' +
      '<input id="when" data-s="when" value="' + esc(state.when || tomorrow()) + '"></div></div></div>' +

    '<div class="card"><h3>Classes</h3>' +
      '<p class="hint">Uncheck anything you don&rsquo;t teach that day.' +
        (ks.length ? '' : ' No classes yet &mdash; add them in Teacher Plate and they&rsquo;ll appear here.') + '</p>' +
      (ks.length ? ks.map(k => {
        const c = state.classes[k.id] || {};
        const on = c.on !== false;
        return '<div class="rowclass">' +
          '<label class="tick"><input type="checkbox" data-on="' + k.id + '"' + (on ? " checked" : "") + '></label>' +
          '<span class="swatch" style="background:' + k.color + '"></span>' +
          '<span class="nm">' + esc(k.period) + '<small>' + esc(k.name) + ' &middot; ' + (k.students||[]).length + ' students</small></span>' +
          '<input data-time="' + k.id + '" placeholder="8:30–9:20" value="' + esc(c.time || "") + '" style="max-width:130px">' +
          (needsInput ? '<input data-note="' + k.id + '" placeholder="' + esc(ph) + '" value="' + esc(c.note || "") + '">' : "") +
        '</div>';
      }).join("") : '<p class="hint" style="margin:0">Nothing to show yet.</p>') +
    '</div>' +

    '<div class="card"><h3>Things a sub always needs</h3>' +
      '<p class="hint">Saved for next time. You should only ever type this once.</p>' +
      '<div class="grid2">' +
        PROFILE_FIELDS.map(f =>
          '<div class="f' + (f.span === 2 ? " wide" : "") + '">' +
            '<label for="p_' + f.key + '">' + esc(f.label) + '</label>' +
            (f.span === 2
              ? '<textarea id="p_' + f.key + '" data-p="' + f.key + '" placeholder="' + esc(f.ph) + '">' + esc(profile[f.key] || "") + '</textarea>'
              : '<input id="p_' + f.key + '" data-p="' + f.key + '" placeholder="' + esc(f.ph) + '" value="' + esc(profile[f.key] || "") + '">') +
          '</div>').join("") +
      '</div></div>' +

    '<div class="actions">' +
      '<button class="btn primary" data-build>' +
        '<svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19.5 7"/></svg>Build my sub plan</button>' +
      '<button class="btn" data-step="energy">Back</button>' +
    '</div>' +
    '<p class="steps-bar">1. How you&rsquo;re doing<i></i><b>2. Your classes</b><i></i>3. The plan</p>' +
    '</div>';
}

/* ── step 3: the plan ───────────────────────────────────────────── */
function stepPlan() {
  const lvl = ENERGY.find(e => e.id === state.energy) || ENERGY[0];
  const ks = classes().filter(k => (state.classes[k.id] || {}).on !== false);
  const teacher = profile.teacherName || "Your teacher";

  const periods = ks.map((k, i) => {
    const c = state.classes[k.id] || {};
    const blk = blockFor(k.id, i, ks[0] && ks[0].id);
    const own = lvl.needs === "plan" && (c.note || "").trim();
    return { k, c, blk, own };
  });

  const list = (arr) => '<ul>' + arr.map(x => '<li>' + esc(x) + '</li>').join("") + '</ul>';

  view.innerHTML =
    '<div class="actions no-print" style="margin-top:24px">' +
      '<button class="btn primary" data-print><svg viewBox="0 0 24 24"><path d="M7 8.5V4.4h10v4.1"/>' +
        '<path d="M5 8.5h14a1.5 1.5 0 0 1 1.5 1.5v5H3.5v-5A1.5 1.5 0 0 1 5 8.5z"/><path d="M7 15h10v4.6H7z"/></svg>' +
        'Print or save as PDF</button>' +
      '<button class="btn" data-copyplan>Copy as text</button>' +
      '<button class="btn" data-step="classes">Change something</button>' +
      '<a class="ghostlink" href="/tools.html">All tools</a>' +
    '</div>' +

    '<div class="plan" id="planEl">' +
      '<div class="ph"><h2>Sub Plan &mdash; ' + esc(teacher) + '</h2>' +
        '<div class="meta">' + esc(state.when || tomorrow()) +
        (profile.room ? ' &nbsp;·&nbsp; Room ' + esc(profile.room) : '') +
        ' &nbsp;·&nbsp; ' + periods.length + ' class' + (periods.length === 1 ? '' : 'es') + '</div></div>' +

      '<div class="sec"><h3>Start here</h3>' +
        '<p>Thank you for being here. Everything in this plan works on paper and needs no logins. ' +
        'The work matters less than the room staying calm &mdash; if you only get one thing done, ' +
        'take attendance and keep them seated and working.</p>' +
        (profile.notes ? '<p><strong>Please know:</strong> ' + esc(profile.notes) + '</p>' : '') +
      '</div>' +

      '<div class="sec"><h3>The essentials</h3><dl class="kv">' +
        [["Room", profile.room], ["Conference period", profile.conference],
         ["Teacher next door", profile.neighbor], ["Who to call", profile.frontOffice],
         ["Restroom", profile.restroom], ["Seating", profile.seating],
         ["Phones", profile.phones], ["Dismissal", profile.dismissal]]
          .filter(r => r[1]).map(r => '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>').join("") +
      '</dl></div>' +

      '<div class="sec"><h3>Class by class</h3>' +
        (periods.length ? periods.map(p =>
          '<div class="per">' +
            '<div class="pt"><b>' + esc(p.k.period) + ' &mdash; ' + esc(p.k.name) + '</b>' +
              (p.c.time ? '<span class="when">' + esc(p.c.time) + '</span>' : '') +
              '<span class="when">' + plural((p.k.students||[]).length, 'student') + '</span>' +
              (p.own ? '<span class="tag">teacher&rsquo;s plan</span>' : '<span class="tag">no-prep</span>') +
            '</div>' +
            (p.own
              ? '<p class="blk">' + esc(p.c.note) + '</p>' +
                '<p class="fine">If they finish early or it falls apart, use this instead: <strong>' +
                esc(p.blk.title) + '</strong> &mdash; ' + esc(p.blk.materials) + '</p>'
              : '<p class="blk">' + esc(p.blk.title) + '</p>' +
                (p.c.note ? '<p class="fine">Currently working on: ' + esc(p.c.note) + '</p>' : '') +
                '<p class="fine"><strong>Materials:</strong> ' + esc(p.blk.materials) + '</p>' +
                '<ol>' + p.blk.timing.map(t => '<li>' + esc(t) + '</li>').join("") + '</ol>' +
                '<p class="fine"><strong>Done looks like:</strong> ' + esc(p.blk.done) + '</p>' +
                '<p class="fine"><strong>Early finishers:</strong> ' + esc(p.blk.extra) + '</p>') +
          '</div>').join("")
        : '<p>No classes selected.</p>') +
      '</div>' +

      '<div class="sec"><h3>Attendance</h3>' + list(BOILER.attendance) + '</div>' +
      '<div class="sec"><h3>If the technology fails</h3>' + list(BOILER.techFails) + '</div>' +
      '<div class="sec"><h3>Behavior &mdash; you have my authority</h3>' + list(BOILER.behavior) + '</div>' +
      '<div class="sec"><h3>Before you leave</h3>' + list(BOILER.checklist) + '</div>' +

      periods.filter(p => !p.own).map(p =>
        '<div class="handout"><h4>' + esc(p.blk.title) + '</h4>' +
        '<p class="for">Student directions &mdash; ' + esc(p.k.period) + ', ' + esc(p.k.name) +
        '. Read aloud or project.</p>' +
        '<ol>' + p.blk.student.map(l => '<li>' + esc(l) + '</li>').join("") + '</ol></div>').join("") +
    '</div>';
}

/* ── plain text export ──────────────────────────────────────────── */
function planText() {
  const el = document.getElementById("planEl");
  if (!el) return "";
  return el.innerText.replace(/\n{3,}/g, "\n\n").trim();
}

/* ── render + events ────────────────────────────────────────────── */
function render() {
  if (state.step === "classes") stepClasses();
  else if (state.step === "plan") stepPlan();
  else stepEnergy();
  window.scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const en = e.target.closest("[data-energy]");
  if (en) { state.energy = en.dataset.energy; state.step = "classes"; save(); render(); return; }

  const st = e.target.closest("[data-step]");
  if (st) { state.step = st.dataset.step; save(); render(); return; }

  if (e.target.closest("[data-build]")) { state.step = "plan"; save(); render(); toast("Plan ready"); return; }
  if (e.target.closest("[data-print]")) { window.print(); return; }
  if (e.target.closest("[data-copyplan]")) {
    const t = planText();
    navigator.clipboard.writeText(t).then(() => toast("Plan copied")).catch(() => toast("Press ⌘C to copy"));
  }
});

document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.p) { profile[t.dataset.p] = t.value; store.write(P_KEY, profile); return; }
  if (t.dataset.s) { state[t.dataset.s] = t.value; save(); return; }
  if (t.dataset.time) { (state.classes[t.dataset.time] = state.classes[t.dataset.time] || {}).time = t.value; save(); return; }
  if (t.dataset.note) { (state.classes[t.dataset.note] = state.classes[t.dataset.note] || {}).note = t.value; save(); return; }
});
document.addEventListener("change", e => {
  const on = e.target.dataset.on;
  if (on) { (state.classes[on] = state.classes[on] || {}).on = e.target.checked; save(); }
});

/* classes come from the bar, which mounts on DOMContentLoaded */
if (window.TeacherPlate && TeacherPlate.onChange) {
  TeacherPlate.onChange(() => { if (state.step !== "energy") render(); });
}
render();
