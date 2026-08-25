/* ─────────────────────────────────────────────────────────────────────────
   Teacher Plate bar — the strip that makes ten separate tools feel like one product.
   Drop into any tool page:

     <script src="/core/bar.js"
             data-hub="/app.html"></script>

   Design constraints, learned from the host pages it has to live on:
   • Normal flow, NOT sticky. Tool pages have their own sticky headers, and
     Bellringers projects full-screen to a class — a pinned Teacher Plate bar would
     fight the header and hover over a lesson. Opt in with data-sticky="true".
   • Shadow DOM + self-contained palette. Host pages define their own --ink,
     --line, --paper; inheriting those would repaint the bar unpredictably.
   • Works signed out. Anonymous is the default state, not a degraded one.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  if (window.TeacherPlate) return;                       // idempotent

  var TAG  = document.currentScript;
  var HUB  = (TAG && TAG.dataset.hub)  || "/app.html";
  var PIN  = (TAG && TAG.dataset.sticky) === "true";
  var NS   = "tp.v1.";

  /* ── state ───────────────────────────────────────────────────────────── */
  /* The class store lives here on purpose. Tool pages get one script tag, and
     there is exactly one definition of what a class is. Local for now; this is
     the seam Supabase slots into without any tool changing. */
  var C_KEY = "tp.v1.classes";

  /* Instructional supports only. Never a diagnosis, never a label, never
     medical data — design around what the learner needs. */
  var SUPPORTS = [
    { id: "chunk",     label: "Chunk longer directions" },
    { id: "both",      label: "Written + verbal directions" },
    { id: "time",      label: "Extra processing time" },
    { id: "starters",  label: "Sentence starters help" },
    { id: "checkin",   label: "Check in early on tasks" },
    { id: "seat",      label: "Seat with fewer distractions" },
    { id: "less",      label: "Reduce the amount, not the difficulty" },
    { id: "aloud",     label: "Read prompts aloud" },
    { id: "move",      label: "Needs movement breaks" },
    { id: "preview",   label: "Preview vocabulary first" }
  ];

  var COLORS = ["#3E9A6A", "#E8763A", "#7B5BD6", "#3567E8", "#C4407F", "#2E8B96", "#B8862B", "#5B6BD6"];

  var EXAMPLES = [
    { period: "Period 1", name: "8th Grade ELA", grade: "8", time: "8:30–9:20",  unit: "Character & dialogue", color: "#3E9A6A" },
    { period: "Period 3", name: "8th Grade ELA", grade: "8", time: "10:05–10:55", unit: "Character & dialogue", color: "#E8763A" },
    { period: "Period 5", name: "Intervention",  grade: "8", time: "1:10–2:00",   unit: "Fluency & comprehension", color: "#7B5BD6" },
    { period: "Advisory", name: "Homeroom",      grade: "8", time: "2:05–2:25",   unit: "SEL check-ins", color: "#3567E8" }
  ];

  var CLASSES = [];

  function read(k, fallback) {
    try { var v = localStorage.getItem(NS + k); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function write(k, v) {
    try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) {}
  }

  function uid() {
    return "c" + Math.abs(Date.now() % 1e8).toString(36) + Math.abs((CLASSES.length + 1) * 7919).toString(36);
  }
  function loadClasses() {
    var raw = read("classes", null);
    CLASSES = (raw && raw.classes) ? raw.classes : [];
    CLASSES.forEach(function (k) { if (!k.students) k.students = []; });
    return CLASSES;
  }
  function saveClasses() {
    write("classes", { version: 1, classes: CLASSES });
    if (classId && !CLASSES.some(function (k) { return k.id === classId; })) {
      classId = null; write("classId", null);         // selected class was deleted
    }
  }

  var user     = read("user", null);          // null = anonymous, the normal case
  var classId  = read("classId", null);
  var handlers = [];
  loadClasses();

  function currentClass() {
    for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].id === classId) return CLASSES[i];
    return null;
  }
  function emit() {
    var payload = { user: user, klass: currentClass() };
    handlers.forEach(function (fn) { try { fn(payload); } catch (e) { console.error(e); } });
  }

  /* ── shell ───────────────────────────────────────────────────────────── */
  var host = document.createElement("div");
  host.id = "tp-bar";
  host.style.cssText = "display:block;width:100%;" +
    (PIN ? "position:sticky;top:0;z-index:40;" : "");
  var root = host.attachShadow({ mode: "open" });

  var CSS = `
    :host{ all:initial }
    *{ box-sizing:border-box }
    .bar{
      --ob-ink:#14213D; --ob-ink2:#3C4C6B; --ob-ink3:#7B87A0;
      --ob-line:rgba(20,33,61,.13); --ob-yellow:#FFD44D; --ob-blue:#3567E8;
      font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      font-size:13px; line-height:1.4; color:var(--ob-ink);
      background:#fff; border-bottom:1.5px solid var(--ob-line);
      display:flex; align-items:center; gap:10px; padding:0 16px; height:44px;
      -webkit-font-smoothing:antialiased;
    }
    button{ font:inherit; color:inherit; background:none; border:0; cursor:pointer; padding:0 }
    a{ color:inherit; text-decoration:none }

    .home{ display:flex; align-items:center; gap:7px; padding:5px 8px 5px 4px; border-radius:8px;
           transition:background .15s }
    .home:hover{ background:rgba(20,33,61,.05) }
    .home .chev{ width:14px; height:14px; stroke:var(--ob-ink3); fill:none; stroke-width:2;
                 stroke-linecap:round; stroke-linejoin:round; flex:none }
    .home:hover .chev{ stroke:var(--ob-ink) }
    .mark{ width:26px; height:26px; object-fit:contain; display:block; flex:none }
    .word{ font-weight:800; font-size:15px; letter-spacing:-.015em; line-height:1; white-space:nowrap }

    .dot{ width:3px; height:3px; border-radius:50%; background:var(--ob-ink3); opacity:.5; flex:none }

    .wrap{ position:relative }
    .chip{ display:flex; align-items:center; gap:8px; padding:6px 9px; border-radius:9px;
           border:1.5px solid var(--ob-line); transition:border-color .15s,background .15s;
           max-width:280px }
    .chip:hover{ background:rgba(20,33,61,.03); border-color:rgba(20,33,61,.24) }
    .chip[aria-expanded="true"]{ border-color:var(--ob-blue); background:rgba(53,103,232,.05) }
    .swatch{ width:8px; height:8px; border-radius:50%; flex:none; background:var(--ob-ink3) }
    .label{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:600 }
    .label .sub{ color:var(--ob-ink3); font-weight:500 }
    .caret{ width:11px; height:11px; stroke:var(--ob-ink3); fill:none; stroke-width:2.2;
            stroke-linecap:round; stroke-linejoin:round; flex:none }

    .menu{ position:absolute; top:calc(100% + 6px); left:0; min-width:250px; z-index:10;
           background:#fff; border:1.5px solid var(--ob-line); border-radius:13px;
           box-shadow:0 2px 4px rgba(20,33,61,.06),0 18px 34px -14px rgba(20,33,61,.28);
           padding:6px; display:none }
    .menu.open{ display:block }
    .menu.to-end{ left:auto; right:0 }
    .mhead{ font-size:10.5px; font-weight:700; letter-spacing:.07em; text-transform:uppercase;
            color:var(--ob-ink3); padding:7px 10px 5px }
    .item{ display:flex; align-items:center; gap:9px; width:100%; text-align:left;
           padding:8px 10px; border-radius:9px; transition:background .12s }
    .item:hover,.item:focus-visible{ background:rgba(20,33,61,.05); outline:none }
    .item .t{ flex:1; min-width:0 }
    .item .t b{ display:block; font-weight:600; white-space:nowrap; overflow:hidden;
                text-overflow:ellipsis }
    .item .t span{ font-size:11.5px; color:var(--ob-ink3) }
    .item .tick{ width:13px; height:13px; stroke:var(--ob-blue); fill:none; stroke-width:2.4;
                 stroke-linecap:round; stroke-linejoin:round; flex:none; opacity:0 }
    .item[aria-checked="true"] .tick{ opacity:1 }
    .sep{ height:1px; background:var(--ob-line); margin:6px 8px }

    .right{ margin-left:auto; display:flex; align-items:center; gap:8px }
    .ghost{ padding:7px 13px; border-radius:9px; border:1.5px solid var(--ob-line); font-weight:600;
            transition:border-color .15s,background .15s }
    .ghost:hover{ border-color:var(--ob-ink); background:rgba(20,33,61,.04) }
    .who{ color:var(--ob-ink3); white-space:nowrap }
    .who b{ color:var(--ob-ink); font-weight:600 }
    .av{ display:flex; align-items:center; gap:7px; padding:4px 8px 4px 4px; border-radius:999px;
         border:1.5px solid var(--ob-line) }
    .av:hover{ background:rgba(20,33,61,.04) }
    .av i{ width:26px; height:26px; border-radius:50%; background:var(--ob-ink); color:#fff;
           font-style:normal; font-size:10.5px; font-weight:700; letter-spacing:.03em;
           display:flex; align-items:center; justify-content:center; flex:none }

    @media (max-width:620px){
      .label .sub{ display:none }
      .who{ display:none }
      .chip{ max-width:160px }
    }
  `;

  var CARET = '<svg class="caret" viewBox="0 0 12 12"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  var TICK  = '<svg class="tick" viewBox="0 0 14 14"><path d="M2.2 7.4 5.4 10.4 11.8 3.6"/></svg>';

  function classChipInner() {
    var k = currentClass();
    if (!CLASSES.length) return '<span class="swatch"></span><span class="label">Add your classes</span>' + CARET;
    if (!k) return '<span class="swatch"></span><span class="label">Choose a class</span>' + CARET;
    return '<span class="swatch" style="background:' + k.color + '"></span>' +
           '<span class="label">' + k.period + ' <span class="sub">· ' + k.name + '</span></span>' + CARET;
  }

  function classMenuInner() {
    if (!CLASSES.length) {
      return '<div class="mhead">Your classes</div>' +
        '<div style="padding:4px 10px 10px;font-size:12.5px;color:var(--ob-ink3);line-height:1.5">' +
        'Nothing here yet. Set them up once and every tool knows your periods, ' +
        'your students, and your routines.</div>' +
        '<a class="item" href="/classes/"><span class="t"><b>Add your classes</b></span></a>';
    }
    var out = '<div class="mhead">Your classes</div>';
    CLASSES.forEach(function (k) {
      out += '<button class="item" role="menuitemradio" data-pick="' + k.id + '" ' +
             'aria-checked="' + (k.id === classId) + '">' +
             '<span class="swatch" style="background:' + k.color + '"></span>' +
             '<span class="t"><b>' + k.period + ' · ' + k.name + '</b><span>' +
             ((k.students || []).length) + (((k.students || []).length) === 1 ? ' student' : ' students') +
             (k.unit ? ' · ' + k.unit : '') + '</span></span>' + TICK + '</button>';
    });
    out += '<div class="sep"></div>' +
           '<a class="item" href="/classes/"><span class="t"><b>Manage classes</b></span></a>';
    return out;
  }

  function rightInner() {
    if (!user) {
      return '<span class="who">Using Teacher Plate without an account</span>' +
             '<button class="ghost" data-act="signin">Sign in</button>';
    }
    return '<div class="wrap">' +
           '<button class="av" data-menu="user" aria-haspopup="true" aria-expanded="false">' +
             '<i>' + user.initials + '</i><span class="who">signed in as <b>' + user.name + '</b></span>' +
             CARET +
           '</button>' +
           '<div class="menu to-end" data-panel="user" role="menu">' +
             '<a class="item" href="' + HUB + '"><span class="t"><b>Teacher Plate home</b></span></a>' +
             '<a class="item" href="' + HUB + '"><span class="t"><b>Saved</b></span></a>' +
             '<a class="item" href="' + HUB + '"><span class="t"><b>Recent</b></span></a>' +
             '<div class="sep"></div>' +
             '<button class="item" data-act="signout"><span class="t"><b>Sign out</b></span></button>' +
           '</div></div>';
  }

  function render() {
    root.innerHTML =
      '<style>' + CSS + '</style>' +
      '<div class="bar">' +
        '<a class="home" href="' + HUB + '">' +
          '<svg class="chev" viewBox="0 0 14 14"><path d="M8.5 3 5 7l3.5 4"/></svg>' +
          '<img class="mark" src="/img/teacher-plate-mark.png" alt=""><span class="word">Teacher Plate</span>' +
        '</a>' +
        '<span class="dot"></span>' +
        '<div class="wrap">' +
          '<button class="chip" data-menu="class" aria-haspopup="true" aria-expanded="false">' +
            classChipInner() +
          '</button>' +
          '<div class="menu" data-panel="class" role="menu">' + classMenuInner() + '</div>' +
        '</div>' +
        '<div class="right">' + rightInner() + '</div>' +
      '</div>';
  }

  /* ── interaction ─────────────────────────────────────────────────────── */
  function closeMenus() {
    root.querySelectorAll(".menu.open").forEach(function (m) { m.classList.remove("open"); });
    root.querySelectorAll("[aria-expanded]").forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
    });
  }

  root.addEventListener("click", function (e) {
    var open = e.target.closest("[data-menu]");
    if (open) {
      var panel = root.querySelector('[data-panel="' + open.dataset.menu + '"]');
      var was = panel.classList.contains("open");
      closeMenus();
      if (!was) { panel.classList.add("open"); open.setAttribute("aria-expanded", "true"); }
      return;
    }
    var pick = e.target.closest("[data-pick]");
    if (pick) { TeacherPlate.setClass(pick.dataset.pick); closeMenus(); return; }

    var act = e.target.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "signin")  TeacherPlate.signIn();
      if (act.dataset.act === "signout") TeacherPlate.signOut();
      closeMenus();
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target !== host) closeMenus();          // shadow events retarget to the host
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenus();
  });

  /* ── public API — the contract every tool codes against ──────────────── */
  window.TeacherPlate = {
    version: "0.1.0",
    user:         function () { return user; },
    classes:      function () { return CLASSES.slice(); },
    currentClass: currentClass,
    setClass: function (id) { classId = id; write("classId", id); render(); emit(); },

    /* ── class + roster CRUD ── */
    SUPPORTS: SUPPORTS,
    COLORS: COLORS,
    isEmpty: function () { return CLASSES.length === 0; },
    addClass: function (p) {
      var k = {
        id: uid(), period: (p && p.period) || "New class", name: (p && p.name) || "",
        grade: (p && p.grade) || "", time: (p && p.time) || "", unit: (p && p.unit) || "",
        notes: (p && p.notes) || "", color: (p && p.color) || COLORS[CLASSES.length % COLORS.length],
        students: []
      };
      CLASSES.push(k); saveClasses(); render(); emit(); return k;
    },
    updateClass: function (id, patch) {
      var k = CLASSES.filter(function (c) { return c.id === id; })[0];
      if (!k) return null;
      Object.keys(patch || {}).forEach(function (key) { k[key] = patch[key]; });
      saveClasses(); render(); emit(); return k;
    },
    removeClass: function (id) {
      CLASSES = CLASSES.filter(function (c) { return c.id !== id; });
      saveClasses(); render(); emit();
    },
    addStudent: function (cid, st) {
      var k = CLASSES.filter(function (c) { return c.id === cid; })[0];
      if (!k) return null;
      var s2 = { id: "s" + Date.now().toString(36) + k.students.length,
                 first: (st && st.first) || "", last: (st && st.last) || "",
                 supports: [], note: "" };
      k.students.push(s2); saveClasses(); render(); emit(); return s2;
    },
    updateStudent: function (cid, sid, patch) {
      var k = CLASSES.filter(function (c) { return c.id === cid; })[0];
      if (!k) return null;
      var s2 = k.students.filter(function (x) { return x.id === sid; })[0];
      if (!s2) return null;
      Object.keys(patch || {}).forEach(function (key) { s2[key] = patch[key]; });
      saveClasses(); emit(); return s2;
    },
    removeStudent: function (cid, sid) {
      var k = CLASSES.filter(function (c) { return c.id === cid; })[0];
      if (!k) return;
      k.students = k.students.filter(function (x) { return x.id !== sid; });
      saveClasses(); emit();
    },
    loadExamples: function () {
      EXAMPLES.forEach(function (e) {
        CLASSES.push({ id: uid() + Math.random().toString(36).slice(2, 5), period: e.period, name: e.name,
                       grade: e.grade, time: e.time, unit: e.unit, notes: "", color: e.color, students: [] });
      });
      saveClasses(); render(); emit();
    },
    onChange: function (fn) { handlers.push(fn); return function () {
      handlers = handlers.filter(function (h) { return h !== fn; }); }; },
    // Stubs until Supabase auth lands. Same signatures, so tools need no changes.
    signIn:  function () {
      user = { name: "Kennady", initials: "KS" };
      write("user", user); render(); emit();
    },
    signOut: function () { user = null; write("user", null); render(); emit(); }
  };

  /* ── mount ───────────────────────────────────────────────────────────── */
  function mount() {
    render();
    document.body.insertBefore(host, document.body.firstChild);
    if (!document.querySelector('link[data-tp-font]')) {
      var l = document.createElement("link");
      l.rel = "stylesheet"; l.setAttribute("data-tp-font", "");
      l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    emit();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
