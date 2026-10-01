/* S3 Dashboard, S4 Recipes (from the admin), S6 Recipe Detail, S8 Trial Detail. Same for every account (D-023).
   Students do not create, edit or delete recipes: the catalogue comes from the admin backend (D-028, PRD v0.5 CR-04).
   Every account gets the same screens (D-023); there are no read-only or Chef versions (D-026).
   Stories: REC-02, REC-05, TRL-05, HIS-01, STB-01, CPY-01, CMP-01, TRL-03, TRL-04, MET-01, CHF-03. */
(function () {
  "use strict";
  var App = window.App, DB = window.DB, L = window.RAGI, h = App.h, ic = App.ic, esc = App.esc;

  /* ---------------- S3 Student Dashboard ---------------- */
  App.defineScreen({
    id: "S3", name: "Beranda", group: "Resep", role: "both", stories: ["PRD §5.2"], tabbar: true, tab: "beranda",
    states: [["auto", "Data nyata"], ["empty", "Kosong (pertama kali)"], ["loading", "Memuat"], ["error", "Error"]],
    render: function (c) {
      var u = App.user, first = u.name.split(" ")[0];
      var recipes = c.state === "empty" ? [] : DB.triedOf(u.id);
      var head = h.tabHeader("Beranda", '<span class="appbar__aside">' + DB.fmtDate(DB.today) + "</span>");
      if (c.state === "loading") return head + '<div class="pad"><div class="skeleton" style="height:150px;border-radius:var(--r-xl)"></div></div><div class="mt-6">' + h.skeletons(3) + "</div>";
      if (c.state === "error") return head + h.errorBlock();
      var hero = '<div class="pad"><div class="card card--hero"><div class="t-caption">Selamat datang kembali</div><div class="t-title-l" style="margin:var(--s-1) 0 var(--s-4)">Halo, ' + esc(first) + "! " + (recipes.length ? "Siap bereksperimen lagi?" : "Pilih resep dan catat trial pertamamu.") + '</div><button class="btn btn--primary" data-act="newTrialAny">' + ic("plus") + '<span class="btn__label">Trial baru</span></button></div></div>';
      if (!recipes.length) return head + hero + '<div class="pad">' + h.empty({ icon: "book-open", title: "Belum ada trial", body: "Pilih salah satu resep dari RAGI, lalu catat percobaan pertamamu.", cta: { label: "Lihat resep", act: "tab", attrs: 'data-id="resep"', icon: "book-open" } }) + "</div>";
      var nTrials = recipes.reduce(function (a, r) { return a + r.trials.length; }, 0), nStable = recipes.filter(function (r) { return r.stableNo; }).length;
      return head + hero +
        '<div class="pad grid2 mt-3" style="gap:var(--s-3)"><div class="text-card"><div class="t-number" style="font-size:var(--t-title-l-size)">' + recipes.length + '</div><div class="t-caption body-c">resep dicoba</div></div><div class="text-card"><div class="t-number" style="font-size:var(--t-title-l-size)">' + nTrials + '</div><div class="t-caption body-c">trial · ' + nStable + " Stable</div></div></div>" +
        '<div class="sect-head"><h2 class="section-title">Terakhir dicoba</h2><button class="btn btn--text btn--sm" data-act="tab" data-id="resep"><span class="btn__label">Lihat semua</span></button></div><div class="list pad">' + recipes.slice(0, 5).map(function (r) { return h.recipeRow(r); }).join("") + "</div>";
    }
  });
  App.act("newTrialAny", function () { App.pickRecipe(function (id) { App.startTrial(id); }); });

  /* ---------------- S4 Recipes (catalogue from the admin) ---------------- */
  var S4 = { q: "", cat: "Semua" };
  function recipeList(c) {
    var st = c ? c.state : App.stateOf("S4");
    var all = st === "empty" ? [] : DB.recipesOf();
    var q = S4.q.trim().toLowerCase();
    var list = all.filter(function (r) { return (S4.cat === "Semua" || r.category === S4.cat) && (!q || r.name.toLowerCase().indexOf(q) >= 0); });
    if (st === "noresults") list = [];
    if (!all.length) return h.empty({ icon: "book-open", title: "Belum ada resep", body: "Resep disiapkan oleh admin RAGI. Coba lagi nanti." });
    if (!list.length) return h.empty({ icon: "search", title: "Tidak ada hasil", body: "Coba kata kunci lain atau hapus filter.", cta: st === "noresults" || q || S4.cat !== "Semua" ? { label: "Hapus filter", act: "recClear", kind: "secondary" } : null });
    return '<div class="list">' + list.map(function (r) { return h.recipeRow(r); }).join("") + "</div>";
  }
  App.defineScreen({
    id: "S4", name: "Resep", group: "Resep", role: "both", stories: ["REC-02"], tabbar: true, tab: "resep",
    states: [["auto", "Data nyata"], ["empty", "Kosong"], ["noresults", "Tanpa hasil"], ["loading", "Memuat"], ["error", "Error"]],
    render: function (c) {
      var top = h.tabHeader("Resep");
      if (c.state === "loading") return top + h.skeletons(4);
      if (c.state === "error") return top + h.errorBlock();
      var cats = ["Semua"].concat(DB.CATEGORIES);
      return top + '<div class="pad stack"><div class="input-wrap search">' + ic("search") + '<input class="input" type="search" placeholder="Cari resep" aria-label="Cari resep" value="' + esc(c.state === "noresults" ? "zzzz" : S4.q) + '" data-in="recQ"></div></div>' +
        '<div class="chip-row pad" style="padding-top:var(--s-3)" role="group" aria-label="Filter kategori">' + cats.map(function (k) { return '<button class="chip" aria-pressed="' + (S4.cat === k) + '" data-act="recCat" data-c="' + k + '">' + k + "</button>"; }).join("") + "</div>" +
        '<div class="pad mt-4" id="rec-list">' + recipeList(c) + "</div>";
    }
  });
  App.inp("recQ", function (el) { S4.q = el.value; var box = App.$("#rec-list"); if (box) box.innerHTML = recipeList(); });
  App.act("recCat", function (el) { S4.cat = el.dataset.c; App.render(); });
  App.act("recClear", function () { S4.q = ""; S4.cat = "Semua"; App.states.S4 = "auto"; App.render(); });

  /* ---------------- S6 Recipe Detail (+ S15 read-only) ---------------- */
  function pickRecipeForState(c) {
    var id = c.params.recipeId, filter = c.params.filter || "all";
    if (c.state === "notrials") id = "r4"; if (c.state === "nostable") id = "r2";
    if (c.state === "filterempty") { id = "r5"; filter = "gagal"; }
    return { r: DB.recipe(id) || DB.recipe("r1"), filter: filter };
  }
  function recipeDetail(c) {
    var st = c.state; var s = pickRecipeForState(c), r = s.r, filter = s.filter, ro = false;
    var back = h.appbar({ title: st === "loading" || st === "error" ? "Resep" : r.name, back: true, right: "" });
    if (st === "loading") return back + '<div class="pad"><div class="skeleton" style="aspect-ratio:16/10;border-radius:var(--r-xl)"></div></div><div class="mt-4">' + h.skeletons(3, 96) + "</div>";
    if (st === "error") return back + h.errorBlock();
    var trials = DB.trialsDesc(r), stable = DB.stable(r), berhasil = trials.some(function (t) { return t.verdict === "berhasil"; });
    var shown = trials.filter(function (t) { return filter === "all" || t.verdict === filter; });
    var owner = "";
    var stableCard;
    if (stable) {
      var m = L.metrics(stable.rows);
      stableCard = '<div class="card card--stable" role="button" tabindex="0" data-act="openTrial" data-r="' + r.id + '" data-n="' + stable.no + '"><div class="hstack hstack--between"><span class="badge badge--stable">' + ic("star") + 'Stable Trial</span><span class="t-caption">' + DB.fmtDate(stable.date) + '</span></div><div class="t-title-l" style="margin:var(--s-3) 0 var(--s-1)">Trial #' + stable.no + '</div><div class="t-body">' + stable.portions + " porsi" + (m.hasFlour ? " · hidrasi " + L.fmtPct(m.hydration) + " · lemak " + L.fmtPct(m.fat) : "") + "</div></div>";
    } else stableCard = '<div class="card card--empty-stable"><div class="t-title-s">Belum ada Stable Trial</div><p class="t-caption" style="margin:var(--s-1) 0 0">' + (ro ? "Belum ada trial yang ditandai stabil." : "Beri verdict Berhasil pada sebuah trial, lalu jadikan Stable.") + "</p></div>";
    var actions = "";
    if (!ro) {
      actions = '<div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(0,1fr))"><button class="btn btn--gold btn--sm" data-act="newTrial" data-id="' + r.id + '">' + ic("plus", "icon--sm") + '<span class="btn__label">Trial baru</span></button>' +
        (trials.length >= 2 ? '<button class="btn btn--secondary btn--sm" data-act="compareRecipe" data-id="' + r.id + '">' + ic("git-compare", "icon--sm") + '<span class="btn__label">Bandingkan</span></button>' : "") + "</div>" +
        (berhasil ? '<button class="btn btn--tonal btn--sm btn--block" data-act="nextBatch" data-id="' + r.id + '">' + ic("copy") + '<span class="btn__label">Gunakan untuk batch berikutnya</span></button>' : "");
    } else if (trials.length >= 2) actions = '<button class="btn btn--secondary btn--block" data-act="compareRecipe" data-id="' + r.id + '">' + ic("git-compare") + '<span class="btn__label">Bandingkan</span></button>';
    var base = "";
    if (r.base && r.base.length) {
      base = '<div class="sect-head"><h2 class="section-title">Bahan resep</h2><span class="badge badge--source">' + ic("badge-check") + "Dari admin</span></div>" +
        '<div class="pad stack stack--sm"><p class="base-note">Untuk ' + r.basePortions + " porsi · " + r.base.length + " bahan · diatur admin RAGI, tidak bisa diubah di sini.</p>" + h.ingTable(r.base) +
        '<button class="btn btn--tonal btn--sm btn--block" data-act="startBase" data-id="' + r.id + '">' + ic("book-open", "icon--sm") + '<span class="btn__label">Mulai trial dari bahan ini</span></button></div>';
    }
    var list;
    if (!trials.length) list = h.empty({ icon: "flask-conical", title: "Belum ada trial", body: ro ? "Belum ada trial untuk resep ini." : "Catat percobaan pertamamu di sini.", cta: ro ? null : { label: "Buat trial pertama", act: "newTrial", attrs: 'data-id="' + r.id + '"', icon: "plus" } });
    else if (!shown.length) list = h.empty({ icon: "search", title: "Belum ada trial dengan verdict ini", body: "Pilih filter lain untuk melihat trial lainnya." });
    else list = '<div class="list">' + shown.map(function (t) { return h.trialRow(r, t, { menu: !ro }); }).join("") + "</div>";
    return back + '<div class="pad">' + h.photo(r) + '</div><div class="pad stack mt-4"><div class="hstack">' + h.cat(r.category) + '<span class="t-caption body-c">' + r.trials.length + " trial</span>" + owner + "</div>" + stableCard + actions + "</div>" + base +
      '<div class="sect-head"><h2 class="section-title">Riwayat trial</h2></div>' + (trials.length ? h.verdictFilter(filter) : "") + '<div class="pad mt-4">' + list + "</div>";
  }
  App.defineScreen({
    id: "S6", name: "Detail resep", group: "Resep", role: "both", stories: ["REC-04", "REC-05", "HIS-01", "STB-01", "CPY-01", "CMP-01", "CHF-03"], tag: "CR-02", tab: "resep",
    tabbar: true,
    states: [["auto", "Data nyata"], ["notrials", "Belum ada trial"], ["nostable", "Belum ada Stable"], ["filterempty", "Filter kosong"], ["loading", "Memuat"], ["error", "Error"]],
    defaults: function () { return { recipeId: "r1" }; },
    render: function (c) { return recipeDetail(c); }
  });
  App.act("vfilter", function (el) { App.top().params.filter = el.dataset.v; if (App.stateOf(App.top().id) === "filterempty") App.states[App.top().id] = "auto"; App.render(); });
  App.act("newTrial", function (el) { App.startTrial(el.dataset.id); });
  App.act("startBase", function (el) { App.go("S7", { recipeId: el.dataset.id, mode: "base" }); });
  App.act("nextBatch", function (el) {
    var r = DB.recipe(el.dataset.id), src = DB.stable(r) || DB.trialsDesc(r).filter(function (t) { return t.verdict === "berhasil"; })[0];
    if (src) App.go("S7", { recipeId: r.id, mode: "copy", from: src.no });
  });
  App.act("compareRecipe", function (el) { App.compareFromRecipe(el.dataset.id); });
  App.act("trialMenu", function (el) {
    var r = el.dataset.r, n = el.dataset.n;
    App.sheet('<h4 class="sheet__title">Trial #' + n + '</h4><div class="stack--sm stack"><button class="link-row" data-act="menuOpen" data-r="' + r + '" data-n="' + n + '">' + ic("notebook-pen") + 'Buka detail</button><button class="link-row" data-act="menuCopy" data-r="' + r + '" data-n="' + n + '">' + ic("copy") + 'Salin ke trial baru</button><button class="link-row" data-act="menuScale" data-r="' + r + '" data-n="' + n + '">' + ic("scaling") + "Skalakan</button></div>");
  });
  App.act("menuOpen", function (el) { App.closeOvl(); App.go("S8", { recipeId: el.dataset.r, no: Number(el.dataset.n) }); });
  App.act("menuCopy", function (el) { App.closeOvl(); App.go("S7", { recipeId: el.dataset.r, mode: "copy", from: Number(el.dataset.n) }); });
  App.act("menuScale", function (el) { var t = DB.trial(el.dataset.r, Number(el.dataset.n)); App.openScale({ rows: t.rows, portions: t.portions, mode: "detail", recipeId: el.dataset.r, no: t.no }); });

  /* ---------------- S8 Trial Detail ---------------- */
  /* Actions follow the trial's state: one primary, the three next-most-likely ones as quiet tiles, everything else in the ⋮ sheet.
       belum dinilai  Beri verdict   | Salin, Bandingkan, Ekspor PDF
       gagal          Salin          | Beri verdict, Bandingkan, Ekspor PDF
       berhasil       Gunakan untuk batch berikutnya | Jadikan Stable Trial, Bandingkan, Ekspor PDF
       Stable         Gunakan untuk batch berikutnya | Skalakan, Bandingkan, Ekspor PDF
     "Salin" is not offered next to "Gunakan untuk batch berikutnya": PRD CPY-01 makes them the same action (D-029). Bandingkan needs two trials (CMP-01). */
  var TA = {
    next: { act: "useNext", menu: "menuCopy", icon: "copy", label: "Gunakan untuk batch berikutnya" },
    copy: { act: "copyTrial", menu: "menuCopy", icon: "copy", label: "Salin" },
    verdict: { act: "giveVerdict", menu: "menuVerdict", icon: "circle-check", label: "Beri verdict" },
    stable: { act: "makeStable", menu: "menuMakeStable", icon: "star", label: "Jadikan Stable Trial" },
    unstable: { act: "unstable", menu: "menuUnstable", icon: "star", label: "Lepas status Stable" },
    scale: { act: "scaleTrial", menu: "menuScale", icon: "scaling", label: "Skalakan" },
    compare: { act: "compareTrial", icon: "git-compare", label: "Bandingkan" },
    pdf: { act: "exportPdf", icon: "file-text", label: "Ekspor PDF" }
  };
  function trialPlan(r, t) {
    var v = t.verdict, stable = r.stableNo === t.no, two = r.trials.length >= 2;
    var lead = v === "berhasil" ? (stable ? "scale" : "stable") : v === "gagal" ? "verdict" : "copy";
    var plan = { primary: v === "berhasil" ? "next" : v === "gagal" ? "copy" : "verdict", tiles: [lead].concat(two ? ["compare"] : [], ["pdf"]) };
    plan.sheet = ["verdict", "scale", stable ? "unstable" : "stable", "copy"].filter(function (k) { return k !== plan.primary && plan.tiles.indexOf(k) < 0; });
    return plan;
  }
  function sheetRow(k, t, d) {
    var a = TA[k];
    if (k === "stable" && t.verdict !== "berhasil") // STB-01: disabled, with the reason
      return '<button class="link-row link-row--sub" disabled><span class="link-row__ic">' + ic(a.icon) + '</span><span class="link-row__text"><span>' + a.label + '</span><span class="link-row__sub">Beri verdict Berhasil terlebih dahulu</span></span></button>';
    return '<button class="link-row" data-act="' + a.menu + '" ' + d + ">" + ic(a.icon) + a.label + "</button>";
  }
  function pickTrialForState(c) {
    var rid = c.params.recipeId, no = c.params.no, st = c.state;
    var map = { stable: ["r1", 3], gagal: ["r1", 5], belum: ["r1", 6], copysrc: ["r1", 6], scalesrc: ["r1", 4], noflour: ["r5", 1]};
    if (map[st]) { rid = map[st][0]; no = map[st][1]; }
    var r = DB.recipe(rid) || DB.recipe("r1"), t = DB.trial(r.id, no) || DB.trial("r1", 3);
    return { r: DB.recipe(r.id), t: t };
  }
  function trialDetail(c) {
    var st = c.state, s = pickTrialForState(c), r = s.r, t = s.t;
    var isStable = r.stableNo === t.no;
    var kebab = h.iconBtn("ellipsis-vertical", "Menu trial", "trialDetailMenu", 'data-r="' + r.id + '" data-n="' + t.no + '"');
    var bar = h.appbar({ title: st === "loading" || st === "error" ? "Trial" : "Trial #" + t.no, back: true, right: kebab });
    if (st === "loading") return bar + '<div class="pad"><div class="skeleton" style="height:120px;border-radius:var(--r-lg)"></div></div><div class="mt-4">' + h.skeletons(3, 70) + "</div>";
    if (st === "error") return bar + h.errorBlock();
    var badges = h.vbadge(t.verdict) + (isStable ? (App.justStable ? '<span class="celebrate">' + h.stableBadge() + '<span class="spark" style="left:26px;top:12px"></span><span class="spark" style="left:26px;top:12px"></span><span class="spark" style="left:26px;top:12px"></span><span class="spark" style="left:26px;top:12px"></span></span>' : h.stableBadge()) : "") + h.sourceBadge(t.source);
    App.justStable = false;
    var head = '<div class="text-card"><div class="hstack" style="flex-wrap:wrap;gap:var(--s-2)">' + badges + '</div><dl class="kv mt-4"><dt>Resep</dt><dd>' + esc(r.name) + "</dd><dt>Tanggal</dt><dd>" + DB.fmtDate(t.date) + "</dd><dt>Porsi</dt><dd>" + t.portions + "</dd></dl></div>";
    var plan = trialPlan(r, t), d = 'data-r="' + r.id + '" data-n="' + t.no + '"', P = TA[plan.primary];
    var actions = '<button class="btn btn--gold btn--block" data-act="' + P.act + '" ' + d + ">" + ic(P.icon) + '<span class="btn__label">' + P.label + "</span></button>" +
      '<div class="act-row">' + plan.tiles.map(function (k) { var a = TA[k]; return '<button class="act-tile" data-act="' + a.act + '" ' + d + ">" + ic(a.icon) + "<span>" + a.label + "</span></button>"; }).join("") + "</div>";
    return bar + '<div class="pad stack">' + head + '<div class="stack--sm stack">' + actions + "</div>" +
      '<div class="sec"><h2 class="section-title">Bahan</h2>' + h.ingTable(t.rows) + "</div>" + h.metrics(t.rows) +
      h.textCard("Hasil", t.result) + h.textCard("Catatan", t.notes) + h.textCard("Perubahan untuk trial berikutnya", t.next) + "</div>";
  }
  App.defineScreen({
    id: "S8", name: "Detail trial", group: "Resep", role: "both", stories: ["TRL-03", "TRL-04", "STB-01", "HIS-01", "CPY-01", "SCL-01", "PDF-01", "MET-01", "CMP-01", "CHF-03"], tag: "CR-01", tab: "resep", tabbar: true,
    states: [["auto", "Data nyata"], ["stable", "Stable Trial"], ["gagal", "Verdict Gagal"], ["belum", "Belum dinilai"], ["copysrc", "Label Salinan"], ["scalesrc", "Label Skala"], ["noflour", "Tanpa tepung"], ["loading", "Memuat"], ["error", "Error"]],
    defaults: function () { return { recipeId: "r1", no: 3 }; },
    render: function (c) { return trialDetail(c); }
  });
  App.act("trialDetailMenu", function (el) {
    var r = DB.recipe(el.dataset.r), n = Number(el.dataset.n), t = DB.trial(r.id, n), d = 'data-r="' + r.id + '" data-n="' + n + '"';
    App.sheet('<h4 class="sheet__title">Trial #' + n + '</h4><div class="stack--sm stack">' + trialPlan(r, t).sheet.map(function (k) { return sheetRow(k, t, d); }).join("") +
      '<button class="link-row" data-act="menuEditTrial" ' + d + ">" + ic("pencil") + 'Edit trial</button><button class="link-row" data-act="menuDelTrial" ' + d + ' style="color:var(--c-gagal-ink)">' + ic("trash-2") + "Hapus trial</button></div>");
  });
  App.act("menuVerdict", function (el) { App.openVerdict(el.dataset.r, Number(el.dataset.n)); });
  App.act("menuMakeStable", function (el) { App.closeOvl(); App.actions.makeStable(el); });
  App.act("menuUnstable", function (el) { App.closeOvl(); App.actions.unstable(el); });
  App.act("menuEditTrial", function (el) { App.closeOvl(); App.go("S7", { recipeId: el.dataset.r, mode: "edit", from: Number(el.dataset.n) }); });
  App.act("menuDelTrial", function (el) { App.openConfirm("deleteTrial", { recipeId: el.dataset.r, no: Number(el.dataset.n) }); });
  App.act("useNext", function (el) { App.go("S7", { recipeId: el.dataset.r, mode: "copy", from: Number(el.dataset.n) }); });
  App.act("copyTrial", function (el) { App.go("S7", { recipeId: el.dataset.r, mode: "copy", from: Number(el.dataset.n) }); });
  App.act("scaleTrial", function (el) { var t = DB.trial(el.dataset.r, Number(el.dataset.n)); App.openScale({ rows: t.rows, portions: t.portions, mode: "detail", recipeId: el.dataset.r, no: t.no }); });
  App.act("giveVerdict", function (el) { App.openVerdict(el.dataset.r, Number(el.dataset.n)); });
  App.act("makeStable", function (el) {
    var r = DB.recipe(el.dataset.r), n = Number(el.dataset.n);
    if (r.stableNo && r.stableNo !== n) App.openConfirm("moveStable", { recipeId: r.id, from: r.stableNo, to: n });
    else App.setStable(r.id, n);
  });
  App.setStable = function (rid, n) { var r = DB.recipe(rid); r.stableNo = n; r.updated = DB.today; App.justStable = true; App.render(); App.snack("Trial #" + n + " jadi Stable Trial", { icon: "star" }); };
  App.act("unstable", function (el) { var r = DB.recipe(el.dataset.r); r.stableNo = null; App.render(); App.snack("Status Stable dilepas", { icon: "info" }); });
  App.act("compareTrial", function (el) { App.compareFromTrial(el.dataset.r, Number(el.dataset.n)); });
  App.act("exportPdf", function (el) { App.go("S10", { recipeId: el.dataset.r, no: Number(el.dataset.n) }); });
})();
