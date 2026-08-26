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

  /* Grade bands the teacher works in. Asked once, then every tool pre-applies it
     instead of making them pick again per tool per visit. Vocabulary matches the
     tags already in Before the Bell and Bellringers — do not invent new ids. */
  var GRADE_BANDS = [
    { id: "k2",  label: "K\u20132" },
    { id: "35",  label: "3\u20135" },
    { id: "68",  label: "6\u20138" },
    { id: "912", label: "9\u201312" }
  ];

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
    schedulePush();
    if (classId && !CLASSES.some(function (k) { return k.id === classId; })) {
      classId = null; write("classId", null);         // selected class was deleted
    }
  }

  var user     = null;                        // set from the session; anonymous is normal
  var bands    = read("gradeBands", []);
  var bandsAsked = read("gradeAsked", false);
  var classId  = read("classId", null);
  var handlers = [];
  loadClasses();

  function currentClass() {
    for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].id === classId) return CLASSES[i];
    return null;
  }
  function emit() {
    var payload = { user: user, klass: currentClass(), gradeBands: bands.slice() };
    handlers.forEach(function (fn) { try { fn(payload); } catch (e) { console.error(e); } });
  }

  /* ── accounts: config, session, sync ─────────────────────────────────────
     Plain fetch against Supabase's REST endpoints. No CDN bundle, because this
     file loads on every tool page and it promised no dependencies.

     With no config this whole section stays dormant and Teacher Plate works
     exactly as it does today, on localStorage. That is the normal state, not a
     degraded one. */
  var CFG = window.TP_CONFIG || {};
  function cfg() { return (CFG.supabaseUrl && CFG.supabaseAnonKey) ? CFG : null; }

  var session = read("session", null);
  var authNote = null;                       // transient UI message

  function api(path, opts) {
    var c = cfg();
    if (!c) return Promise.reject(new Error("accounts are not configured"));
    opts = opts || {};
    var h = { apikey: c.supabaseAnonKey, "Content-Type": "application/json" };
    Object.keys(opts.headers || {}).forEach(function (k) { h[k] = opts.headers[k]; });
    if (session && session.access_token && !opts.noAuth) h.Authorization = "Bearer " + session.access_token;
    return fetch(c.supabaseUrl + path, { method: opts.method || "GET", headers: h, body: opts.body })
      .then(function (r) {
        if (r.status === 204) return null;
        return r.text().then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
          if (!r.ok) {
            var msg = (j && (j.message || j.error_description || j.msg)) || r.status + " " + r.statusText;
            var err = new Error(msg); err.status = r.status; err.body = j; throw err;
          }
          return j;
        });
      });
  }

  function saveSession(x) { session = x; write("session", x); }
  function stale() { return !session || !session.expires_at || Date.now() > (session.expires_at - 60000); }
  function adopt(d) {
    saveSession({
      access_token: d.access_token,
      refresh_token: d.refresh_token || (session && session.refresh_token) || null,
      expires_at: Date.now() + ((d.expires_in || 3600) * 1000),
      user: d.user ? { id: d.user.id, email: d.user.email } : (session && session.user) || null
    });
  }
  function refresh() {
    if (!session || !session.refresh_token) return Promise.reject(new Error("signed out"));
    return api("/auth/v1/token?grant_type=refresh_token", {
      method: "POST", noAuth: true, body: JSON.stringify({ refresh_token: session.refresh_token })
    }).then(function (d) { adopt(d); });
  }
  function authed(fn) {
    if (!session) return Promise.reject(new Error("signed out"));
    return (stale() ? refresh() : Promise.resolve()).then(fn);
  }
  function userFrom() {
    if (!session || !session.user) return null;
    var e = session.user.email || "";
    var handle = e.split("@")[0].replace(/[._+-]+/g, " ").trim();
    var name = handle.split(" ").filter(Boolean).map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(" ") || e || "Teacher";
    var initials = name.split(" ").filter(Boolean).slice(0, 2).map(function (w) {
      return w.charAt(0).toUpperCase();
    }).join("") || "T";
    return { name: name, initials: initials, email: e };
  }

  /* ── sync. One teacher, one roster: whole-collection last-write-wins is
     correct here and far less to get wrong than per-row diffing. ── */
  function toRow(k, i) {
    return { teacher_id: session.user.id, local_id: k.id, period: k.period || "",
             subject: k.name || "", grade: k.grade || "", meets_at: k.time || "",
             unit: k.unit || "", notes: k.notes || "", color: k.color || "", sort: i };
  }
  function fromRows(cs, ss) {
    var byClass = {};
    (ss || []).forEach(function (x) { (byClass[x.class_id] = byClass[x.class_id] || []).push(x); });
    return (cs || []).map(function (c) {
      return { id: c.local_id, period: c.period || "", name: c.subject || "", grade: c.grade || "",
               time: c.meets_at || "", unit: c.unit || "", notes: c.notes || "", color: c.color || "",
               students: (byClass[c.id] || []).map(function (x) {
                 return { id: x.local_id, first: x.first || "", last: x.last || "",
                          supports: x.supports || [], note: x.note || "" };
               }) };
    });
  }
  function pull() {
    return authed(function () {
      return Promise.all([
        api("/rest/v1/classes?select=*&order=sort.asc"),
        api("/rest/v1/students?select=*&order=sort.asc")
      ]).then(function (r) { return fromRows(r[0], r[1]); });
    });
  }
  function push() {
    return authed(function () {
      var rows = CLASSES.map(toRow);
      var keep = CLASSES.map(function (k) { return k.id; });
      var up = rows.length
        ? api("/rest/v1/classes?on_conflict=teacher_id,local_id", {
            method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" },
            body: JSON.stringify(rows) })
        : Promise.resolve([]);
      return up.then(function (saved) {
        var q = keep.length ? "local_id=not.in.(" + keep.join(",") + ")" : "local_id=neq.__none__";
        return api("/rest/v1/classes?" + q, { method: "DELETE" }).then(function () { return saved; });
      }).then(function (saved) {
        var rowId = {};
        (saved || []).forEach(function (r) { rowId[r.local_id] = r.id; });
        var sp = [];
        CLASSES.forEach(function (k) {
          if (!rowId[k.id]) return;
          (k.students || []).forEach(function (st, si) {
            sp.push({ teacher_id: session.user.id, class_id: rowId[k.id], local_id: st.id,
                      first: st.first || "", last: st.last || "", supports: st.supports || [],
                      note: st.note || "", sort: si });
          });
        });
        var keepS = sp.map(function (x) { return x.local_id; });
        var upS = sp.length
          ? api("/rest/v1/students?on_conflict=teacher_id,local_id", {
              method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
              body: JSON.stringify(sp) })
          : Promise.resolve(null);
        return upS.then(function () {
          var q2 = keepS.length ? "local_id=not.in.(" + keepS.join(",") + ")" : "local_id=neq.__none__";
          return api("/rest/v1/students?" + q2, { method: "DELETE" });
        });
      });
    });
  }
  var pushTimer;
  function schedulePush() {
    if (!session || !cfg()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      push().catch(function (e) { console.warn("[TeacherPlate] sync failed:", e.message); });
    }, 900);
  }
  /* First sign-in on a machine that already has local classes: the account wins
     for anything it already knows, and local-only classes are kept and uploaded.
     Never silently discard what the teacher typed before signing in. */
  function mergeUp() {
    var local = CLASSES.slice();
    return pull().then(function (remote) {
      var seen = {};
      remote.forEach(function (k) { seen[k.id] = true; });
      local.forEach(function (k) { if (!seen[k.id]) remote.push(k); });
      CLASSES = remote;
      write("classes", { version: 1, classes: CLASSES });
      return push();
    });
  }

  /* Magic-link tokens come back in the URL fragment. They are only ever allowed
     to land on the hub, because tool pages use the fragment for routing
     (Bellringers is #/library) and would fight over it. */
  function consumeRedirect() {
    if (!location.hash || location.hash.indexOf("access_token=") < 0) return;
    var q = {};
    location.hash.replace(/^#/, "").split("&").forEach(function (kv) {
      var i = kv.indexOf("="); if (i > 0) q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    if (!q.access_token) return;
    adopt({ access_token: q.access_token, refresh_token: q.refresh_token,
            expires_in: parseInt(q.expires_in || "3600", 10) });
    history.replaceState(null, "", location.pathname + location.search);
    api("/auth/v1/user").then(function (u) {
      saveSession({ access_token: session.access_token, refresh_token: session.refresh_token,
                    expires_at: session.expires_at, user: { id: u.id, email: u.email } });
      user = userFrom(); render(); emit();
      return mergeUp();
    }).then(function () {
      render(); emit();
      var from = new URLSearchParams(location.search).get("from");
      if (from && from.charAt(0) === "/") location.replace(from);
    }).catch(function (e) {
      authNote = "Sign-in didn't finish: " + e.message; render();
    });
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
    /* Tokens live on :host, not .bar — the sign-in and grade sheets are SIBLINGS of
       .bar, so anything scoped to .bar left their var() borders silently invalid. */
    :host{
      --ob-ink:#14213D; --ob-ink2:#3C4C6B; --ob-ink3:#7B87A0;
      --ob-line:rgba(20,33,61,.13); --ob-yellow:#FFD44D; --ob-blue:#3567E8;
    }
    .bar{
      font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      font-size:13px; line-height:1.4; color:var(--ob-ink);
      background:#fff; border-bottom:1.5px solid var(--ob-line);
      display:flex; align-items:center; gap:10px; padding:0 16px; height:44px;
      -webkit-font-smoothing:antialiased;
    }
    button{ font:inherit; color:inherit; background:none; border:0; cursor:pointer; padding:0 }
    a{ color:inherit; text-decoration:none }

    .home{ display:flex; align-items:center; gap:7px; padding:5px 8px 5px 4px; border-radius:8px;
           transition:background .15s; flex:none }
    .home:hover{ background:rgba(20,33,61,.05) }
    .home .chev{ width:14px; height:14px; stroke:var(--ob-ink3); fill:none; stroke-width:2;
                 stroke-linecap:round; stroke-linejoin:round; flex:none }
    .home:hover .chev{ stroke:var(--ob-ink) }
    .mark{ width:26px; height:26px; object-fit:contain; display:block; flex:none }
    .word{ font-weight:800; font-size:15px; letter-spacing:-.015em; line-height:1; white-space:nowrap }

    .dot{ width:3px; height:3px; border-radius:50%; background:var(--ob-ink3); opacity:.5; flex:none }

    /* min-width:0 on both: flex items default to min-width:auto, which stops
       .label's ellipsis engaging and shoves .right off the right edge on a phone. */
    .wrap{ position:relative; min-width:0 }
    .chip{ display:flex; align-items:center; gap:8px; padding:6px 9px; border-radius:9px;
           border:1.5px solid var(--ob-line); transition:border-color .15s,background .15s;
           max-width:280px; min-width:0 }
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

    .right{ margin-left:auto; display:flex; align-items:center; gap:8px; flex:none }
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

    .scrim{ position:fixed; inset:0; background:rgba(20,33,61,.42); z-index:50;
            display:flex; align-items:center; justify-content:center; padding:20px }
    .sheet{ background:#fff; border-radius:16px; width:100%; max-width:392px; padding:22px 22px 20px;
            box-shadow:0 24px 60px -18px rgba(20,33,61,.55) }
    .sheet h3{ margin:0 0 5px; font-size:18px; font-weight:700; letter-spacing:-.015em }
    .sheet p{ margin:0 0 15px; font-size:13.5px; color:var(--ob-ink2); line-height:1.55 }
    .sheet input{ font:inherit; font-size:15px; padding:11px 12px; border:1.5px solid var(--ob-line);
                  border-radius:10px; width:100%; background:#FCFCFD; color:var(--ob-ink) }
    .sheet input:focus{ outline:none; border-color:var(--ob-blue); background:#fff }
    .sheet .row{ display:flex; gap:9px; margin-top:13px }
    .sheet .go2{ background:var(--ob-ink); color:#fff; border-radius:10px; padding:11px 17px;
                 font-weight:600; font-size:14.5px; flex:1 }
    .sheet .go2:hover{ background:#1B2C50 }
    .sheet .cancel{ border:1.5px solid var(--ob-line); border-radius:10px; padding:11px 15px;
                    font-weight:600; font-size:14.5px }
    .sheet .cancel:hover{ border-color:var(--ob-ink) }
    .sheet .msg{ margin:13px 0 0; font-size:13px; line-height:1.55; padding:10px 12px; border-radius:9px }
    .sheet .msg.ok{ background:#EAF7EE; color:#256B45 }
    .sheet .msg.bad{ background:#FFECEF; color:#A32744 }
    .sheet .fine{ margin:14px 0 0; font-size:11.5px; color:var(--ob-ink3); line-height:1.5 }
    .google{ display:flex; align-items:center; justify-content:center; gap:10px; width:100%;
             padding:11px 14px; border:1.5px solid var(--ob-line); border-radius:10px;
             font-weight:600; font-size:14.5px; background:#fff }
    .google:hover{ border-color:var(--ob-ink); background:rgba(20,33,61,.03) }
    .orline{ display:flex; align-items:center; gap:10px; margin:13px 0 12px;
             font-size:12px; color:var(--ob-ink3) }
    .orline::before,.orline::after{ content:""; flex:1; height:1px; background:var(--ob-line) }
    .bandrow{ display:flex; gap:8px; flex-wrap:wrap }
    .band{ font-size:14px; font-weight:600; padding:10px 16px; border-radius:10px;
           border:1.5px solid var(--ob-line); background:#fff }
    .band:hover{ border-color:rgba(20,33,61,.3) }
    .band.on{ background:var(--ob-ink); color:#fff; border-color:var(--ob-ink) }

    @media (max-width:620px){
      .label .sub{ display:none }
      .who{ display:none }
      .chip{ max-width:160px }
      .menu{ max-width:calc(100vw - 24px) }
    }
    @media (max-width:480px){
      /* Drop the wordmark, keep the mark — it is still the link home, and the
         class chip is the control that actually matters on a phone. */
      .word{ display:none }
      .bar{ padding:0 12px; gap:8px }
      .chip{ max-width:none }
    }
  `;

  var GOOGLE_MARK =
    '<svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">' +
    '<path fill="#4285F4" d="M17.6 9.2c0-.6-.05-1.2-.16-1.7H9v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/>' +
    '<path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.54-1.84.86-3.1.86-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"/>' +
    '<path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z"/>' +
    '<path fill="#EA4335" d="M9 3.6c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"/>' +
    '</svg>';
  var CARET = '<svg class="caret" viewBox="0 0 12 12"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  var TICK  = '<svg class="tick" viewBox="0 0 14 14"><path d="M2.2 7.4 5.4 10.4 11.8 3.6"/></svg>';

  function classChipInner() {
    var k = currentClass();
    if (!CLASSES.length) return '<span class="swatch"></span><span class="label">Add your classes</span>' + CARET;
    if (!k) return '<span class="swatch"></span><span class="label">Choose a class</span>' + CARET;
    return '<span class="swatch" style="background:' + k.color + '"></span>' +
           '<span class="label">' + k.period + ' <span class="sub">· ' + k.name + '</span></span>' + CARET;
  }

  function bandLabels() {
    return GRADE_BANDS.filter(function (g) { return bands.indexOf(g.id) > -1; })
                      .map(function (g) { return g.label; }).join(", ");
  }

  function classMenuInner() {
    if (!CLASSES.length) {
      return '<div class="mhead">Your classes</div>' +
        '<div style="padding:4px 10px 10px;font-size:12.5px;color:var(--ob-ink3);line-height:1.5">' +
        'Nothing here yet. Set them up once and every tool knows your periods, ' +
        'your students, and your routines.</div>' +
        '<a class="item" href="/classes/"><span class="t"><b>Add your classes</b></span></a>' +
        '<div class="sep"></div>' +
        '<button class="item" data-act="grades"><span class="t"><b>Grades I teach</b>' +
          '<span>' + (bands.length ? bandLabels() : "not set") + '</span></span></button>';
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
           '<button class="item" data-act="grades"><span class="t"><b>Grades I teach</b>' +
             '<span>' + (bands.length ? bandLabels() : "not set") + '</span></span></button>' +
           '<a class="item" href="/classes/"><span class="t"><b>Manage classes</b></span></a>';
    return out;
  }

  function rightInner() {
    if (!user) {
      // No project configured yet: don't offer a sign-in that cannot work.
      if (!cfg()) return '<span class="who">Using Teacher Plate without an account</span>';
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

  var sheetOpen = false, sheetState = "idle", sheetMode = "signin";

  function sheetInner() {
    if (!sheetOpen) return "";
    var body;
    if (sheetMode === "grades") {
      body = '<h3>What grades do you teach?</h3>' +
        '<p>Pick any that apply. Tools will lead with activities for your grades ' +
        'instead of asking every time. You can change it whenever.</p>' +
        '<div class="bandrow">' +
          GRADE_BANDS.map(function (g) {
            return '<button class="band' + (bands.indexOf(g.id) > -1 ? " on" : "") +
                   '" data-band="' + g.id + '">' + g.label + '</button>';
          }).join("") +
        '</div>' +
        '<div class="row">' +
          '<button class="go2" data-act="savebands">Save</button>' +
          '<button class="cancel" data-act="closesheet">Not now</button>' +
        '</div>' +
        '<p class="fine">Nothing is hidden from you \u2014 anything tagged for another grade ' +
        'still shows, just lower down.</p>';
      return '<div class="scrim" data-act="closesheet"><div class="sheet" data-stop>' + body + '</div></div>';
    }
    if (sheetState === "sent") {
      body = '<h3>Check your email</h3>' +
        '<p>We sent a sign-in link. Open it on any device and your classes come with you.</p>' +
        '<div class="row"><button class="cancel" data-act="closesheet" style="flex:1">Done</button></div>';
    } else {
      var methods = CFG.authMethods || ["magiclink"];
      var hasGoogle = methods.indexOf("google") > -1;
      var hasLink   = methods.indexOf("magiclink") > -1;
      body = '<h3>Sign in to Teacher Plate</h3>' +
        '<p>Free, and optional. Your classes, grades and saved work follow you from school ' +
        'to home instead of living in one browser. No password to remember.</p>' +
        (hasGoogle
          ? '<button class="google" data-act="google">' + GOOGLE_MARK + 'Continue with Google</button>' +
            (hasLink ? '<div class="orline"><span>or</span></div>' : '')
          : '') +
        (hasLink
          ? '<input id="tp-email" type="email" placeholder="you@school.org" autocomplete="email" ' +
              (sheetState === "sending" ? "disabled" : "") + '>'
          : '') +
        (authNote ? '<p class="msg bad">' + authNote + '</p>' : '') +
        '<div class="row">' +
          (hasLink
            ? '<button class="go2" data-act="sendlink"' + (sheetState === "sending" ? " disabled" : "") + '>' +
                (sheetState === "sending" ? "Sending…" : "Email me a link") + '</button>'
            : '') +
          '<button class="cancel" data-act="closesheet"' + (hasLink ? '' : ' style="flex:1"') + '>Not now</button>' +
        '</div>' +
        '<p class="fine">Everything keeps working without an account. Signing in only adds ' +
        'memory across devices.</p>';
    }
    return '<div class="scrim" data-act="closesheet"><div class="sheet" data-stop>' + body + '</div></div>';
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
      '</div>' + sheetInner();
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
    var bd = e.target.closest("[data-band]");
    if (bd) {
      var id = bd.dataset.band, i = bands.indexOf(id);
      if (i > -1) bands.splice(i, 1); else bands.push(id);
      render(); return;
    }
    var pick = e.target.closest("[data-pick]");
    if (pick) { TeacherPlate.setClass(pick.dataset.pick); closeMenus(); return; }

    if (e.target.closest("[data-stop]") && !e.target.closest("[data-act]")) return;
    var act = e.target.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "closesheet") {
        sheetOpen = false; authNote = null;
        if (sheetMode === "grades") { bandsAsked = true; write("gradeAsked", true); }
        render(); return;
      }
      if (act.dataset.act === "grades") {
        sheetMode = "grades"; sheetOpen = true; render(); return;
      }
      if (act.dataset.act === "savebands") {
        write("gradeBands", bands); bandsAsked = true; write("gradeAsked", true);
        sheetOpen = false; render(); emit(); return;
      }
      if (act.dataset.act === "google") { TeacherPlate.signInWithGoogle(); return; }
      if (act.dataset.act === "sendlink") {
        var f = root.querySelector("#tp-email");
        TeacherPlate.sendLink(f ? f.value.trim() : "").catch(function () {});
        return;
      }
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
    GRADE_BANDS: GRADE_BANDS,
    gradeBands: function () { return bands.slice(); },
    setGradeBands: function (a) {
      bands = (a || []).filter(function (x) {
        return GRADE_BANDS.some(function (g) { return g.id === x; });
      });
      write("gradeBands", bands); bandsAsked = true; write("gradeAsked", true);
      render(); emit();
    },
    askGrades: function () { sheetMode = "grades"; sheetOpen = true; render(); },
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
    signIn: function () {
      if (!cfg()) { console.warn("[TeacherPlate] accounts are not configured yet"); return; }
      // sheetMode is shared with the grades prompt — reset it, or opening that one
      // first makes the Sign in button keep reopening it.
      sheetMode = "signin"; authNote = null; sheetOpen = true; sheetState = "idle"; render();
      var el = root.getElementById ? null : root.querySelector("#tp-email");
      if (el) el.focus();
    },
    signInWithGoogle: function () {
      var c = cfg();
      if (!c) { console.warn("[TeacherPlate] accounts are not configured yet"); return; }
      var back = location.pathname + location.search;
      var to = location.origin + "/app.html?from=" + encodeURIComponent(back);
      // Tokens come back in the URL fragment and are consumed by consumeRedirect(),
      // exactly as with magic link — only the way in differs.
      location.href = c.supabaseUrl + "/auth/v1/authorize?provider=google&redirect_to=" +
                      encodeURIComponent(to);
    },
    sendLink: function (email) {
      var c = cfg();
      if (!c) return Promise.reject(new Error("accounts are not configured"));
      if (!email || email.indexOf("@") < 1) {
        authNote = "That doesn't look like an email address."; sheetState = "idle"; render();
        return Promise.reject(new Error("bad email"));
      }
      sheetState = "sending"; authNote = null; render();
      var back = location.pathname + location.search;
      var to = location.origin + "/app.html?from=" + encodeURIComponent(back);
      return api("/auth/v1/otp?redirect_to=" + encodeURIComponent(to), {
        method: "POST", noAuth: true,
        body: JSON.stringify({ email: email, create_user: true })
      }).then(function () { sheetState = "sent"; render(); })
        .catch(function (e) {
          authNote = e.message || "Could not send the link."; sheetState = "idle"; render(); throw e;
        });
    },
    signOut: function () {
      if (session) { api("/auth/v1/logout", { method: "POST" }).catch(function () {}); }
      saveSession(null); user = null; render(); emit();
    },
    refreshFromAccount: function () {
      return pull().then(function (remote) {
        CLASSES = remote; write("classes", { version: 1, classes: CLASSES }); render(); emit();
      });
    }
  };

  /* ── mount ───────────────────────────────────────────────────────────── */
  function mount() {
    user = userFrom();
    render();
    document.body.insertBefore(host, document.body.firstChild);
    if (!document.querySelector('link[data-tp-font]')) {
      var l = document.createElement("link");
      l.rel = "stylesheet"; l.setAttribute("data-tp-font", "");
      l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    emit();
    // Asked on first visit rather than gated behind an account: the preference is
    // useful immediately, and it syncs up whenever an account does exist.
    if (!bands.length && !bandsAsked) {
      setTimeout(function () { sheetMode = "grades"; sheetOpen = true; render(); }, 700);
    }
    if (cfg()) {
      consumeRedirect();
      // The marketing page has no bar, so its CTA sends teachers here with
      // ?signin=1 rather than making them find the button themselves.
      try {
        var q = new URLSearchParams(location.search);
        if (q.get("signin") === "1" && !user) {
          q.delete("signin");
          var rest = q.toString();
          history.replaceState(null, "", location.pathname + (rest ? "?" + rest : ""));
          setTimeout(function () { TeacherPlate.signIn(); }, 250);
        }
      } catch (e) {}
      if (session) {
        pull().then(function (remote) {
          if (remote.length || !CLASSES.length) {
            CLASSES = remote; write("classes", { version: 1, classes: CLASSES }); render(); emit();
          } else { return push(); }        // account is empty, this device has classes
        }).catch(function (e) { console.warn("[TeacherPlate] could not load your account:", e.message); });
      }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
