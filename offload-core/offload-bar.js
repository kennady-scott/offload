/* ─────────────────────────────────────────────────────────────────────────
   Offload bar — the strip that makes ten separate tools feel like one product.
   Drop into any tool page:

     <script src="/offload-core/offload-bar.js"
             data-hub="/app.html"></script>

   Design constraints, learned from the host pages it has to live on:
   • Normal flow, NOT sticky. Tool pages have their own sticky headers, and
     Bellringers projects full-screen to a class — a pinned Offload bar would
     fight the header and hover over a lesson. Opt in with data-sticky="true".
   • Shadow DOM + self-contained palette. Host pages define their own --ink,
     --line, --paper; inheriting those would repaint the bar unpredictably.
   • Works signed out. Anonymous is the default state, not a degraded one.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  if (window.Offload) return;                       // idempotent

  var TAG  = document.currentScript;
  var HUB  = (TAG && TAG.dataset.hub)  || "/app.html";
  var PIN  = (TAG && TAG.dataset.sticky) === "true";
  var NS   = "offload.v1.";

  /* ── state ───────────────────────────────────────────────────────────── */
  // Seed data. Replaced by the Supabase `classes` read once auth lands;
  // the shape here is the contract the rest of the bar depends on.
  var CLASSES = [
    { id: "p1",  period: "Period 1",  name: "8th Grade ELA",  students: 24, color: "#3E9A6A" },
    { id: "p3",  period: "Period 3",  name: "8th Grade ELA",  students: 24, color: "#E8763A" },
    { id: "p5",  period: "Period 5",  name: "Intervention",   students: 12, color: "#7B5BD6" },
    { id: "adv", period: "Advisory",  name: "Homeroom",       students: 18, color: "#3567E8" }
  ];

  function read(k, fallback) {
    try { var v = localStorage.getItem(NS + k); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function write(k, v) {
    try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) {}
  }

  var user     = read("user", null);          // null = anonymous, the normal case
  var classId  = read("classId", null);
  var handlers = [];

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
  host.id = "offload-bar";
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
    .word{ position:relative; font-family:"Playfair Display",Georgia,serif; font-weight:800;
           font-size:17px; letter-spacing:-.02em; line-height:1; padding-bottom:3px }
    .word u{ position:absolute; left:0; right:2px; bottom:0; height:3px; border-radius:2px;
             background:var(--ob-yellow) }

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
    if (!k) return '<span class="swatch"></span><span class="label">Choose a class</span>' + CARET;
    return '<span class="swatch" style="background:' + k.color + '"></span>' +
           '<span class="label">' + k.period + ' <span class="sub">· ' + k.name + '</span></span>' + CARET;
  }

  function classMenuInner() {
    var out = '<div class="mhead">Your classes</div>';
    CLASSES.forEach(function (k) {
      out += '<button class="item" role="menuitemradio" data-pick="' + k.id + '" ' +
             'aria-checked="' + (k.id === classId) + '">' +
             '<span class="swatch" style="background:' + k.color + '"></span>' +
             '<span class="t"><b>' + k.period + ' · ' + k.name + '</b><span>' + k.students +
             ' students</span></span>' + TICK + '</button>';
    });
    out += '<div class="sep"></div>' +
           '<a class="item" href="' + HUB + '"><span class="t"><b>Manage classes</b></span></a>';
    return out;
  }

  function rightInner() {
    if (!user) {
      return '<span class="who">Using Offload without an account</span>' +
             '<button class="ghost" data-act="signin">Sign in</button>';
    }
    return '<div class="wrap">' +
           '<button class="av" data-menu="user" aria-haspopup="true" aria-expanded="false">' +
             '<i>' + user.initials + '</i><span class="who">signed in as <b>' + user.name + '</b></span>' +
             CARET +
           '</button>' +
           '<div class="menu to-end" data-panel="user" role="menu">' +
             '<a class="item" href="' + HUB + '"><span class="t"><b>Offload home</b></span></a>' +
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
          '<span class="word">Offload.<u></u></span>' +
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
    if (pick) { Offload.setClass(pick.dataset.pick); closeMenus(); return; }

    var act = e.target.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "signin")  Offload.signIn();
      if (act.dataset.act === "signout") Offload.signOut();
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
  window.Offload = {
    version: "0.1.0",
    user:         function () { return user; },
    classes:      function () { return CLASSES.slice(); },
    currentClass: currentClass,
    setClass: function (id) { classId = id; write("classId", id); render(); emit(); },
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
    if (!document.querySelector('link[data-offload-font]')) {
      var l = document.createElement("link");
      l.rel = "stylesheet"; l.setAttribute("data-offload-font", "");
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&" +
               "family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    emit();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
