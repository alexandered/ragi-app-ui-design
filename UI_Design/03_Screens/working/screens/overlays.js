/* Overlays O1 to O12: verdict sheet, type / category / date / trial pickers, confirm dialogs, snackbar, app icon gallery. */
(function () {
  "use strict";
  var App = window.App, DB = window.DB, L = window.RAGI, h = App.h, ic = App.ic, esc = App.esc, $ = App.$;
  var CB = {};

  /* ---------------- recipe picker (Beranda: "Trial baru" asks for a recipe first) ---------------- */
  App.pickRecipe = function (cb) {
    CB.recipe = cb;
    App.sheet('<h4 class="sheet__title">Trial untuk resep mana?</h4><div class="list">' + DB.recipesOf().map(function (r) {
      return '<div class="row" role="button" tabindex="0" data-act="rpPick" data-id="' + r.id + '">' + h.thumb(r) + '<div class="row__main"><span class="row__title">' + esc(r.name) + '</span><span class="row__meta">' + (r.trials.length ? r.trials.length + " trial" : "Belum ada trial") + "</span></div>" + ic("chevron-right", "chev") + "</div>";
    }).join("") + "</div>");
  };
  App.act("rpPick", function (el) { App.closeOvl(); CB.recipe(el.dataset.id); });

  /* ---------------- O3 category filter (chips on the Recipes list; the category sheet went with recipe creation) ---------------- */
  App.defineOverlay({ id: "O3", name: "Filter kategori (chip)", group: "Resep", stories: ["REC-02"], demo: function () { App.jump("S4"); App.activeOverlay = { id: "O3", variant: "" }; } });

  /* ---------------- O2 type picker ---------------- */
  var TICON = { Tepung: "wheat", Cairan: "droplet", Telur: "egg" };
  App.pickType = function (cur, cb) {
    CB.type = cb;
    App.sheet('<h4 class="sheet__title">Tipe bahan <span class="badge badge--cr cr-mark">CR-01</span></h4><div class="chip-grid" role="group" aria-label="Tipe bahan">' + L.TYPES.map(function (t) { return '<button class="chip' + (t === cur ? " is-selected" : "") + '" aria-pressed="' + (t === cur) + '" data-act="typePick" data-t="' + t + '">' + (TICON[t] ? ic(TICON[t], "icon--sm") : "") + t + "</button>"; }).join("") + '</div><p class="hint-card mt-4" style="margin-bottom:0">' + ic("info", "icon--sm") + "<span>Kadar air bawaan: Cairan 100 %, Telur 75 %, lainnya 0 %. Bisa diubah di “Lanjutan”.</span></p>");
  };
  App.act("typePick", function (el) { App.closeOvl(); CB.type(el.dataset.t); });
  App.defineOverlay({ id: "O2", name: "Pemilih tipe + Lanjutan", tag: "CR-01", group: "Resep", stories: ["ING-03"], variants: [["picker", "Pemilih tipe"], ["advanced", "Kadar air (Lanjutan)"]],
    demo: function (v) { v = v || "picker"; App.jump("S7", { recipeId: "r1", mode: "copy", from: 3 }); App.activeOverlay = { id: "O2", variant: v };
      if (v === "advanced") { var d = App.top().params.draft; d.rows[3].adv = true; App.render(); var el = $('[data-row="' + d.rows[3].id + '"]'); if (el) el.scrollIntoView({ block: "center" }); } else App.pickType("Tepung", function () {}); } });

  /* ---------------- O4 date picker (no future dates) ---------------- */
  var CAL = null, DOW = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"], MON = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  function calHTML() {
    var y = CAL.y, m = CAL.m, first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate(), t = DB.today.split("-").map(Number);
    var isNow = y === t[0] && m === t[1] - 1, cells = "";
    for (var i = 0; i < first; i++) cells += "<span></span>";
    for (var d = 1; d <= days; d++) {
      var iso = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0"), fut = iso > DB.today;
      cells += '<button data-act="calPick" data-iso="' + iso + '" ' + (fut ? "disabled aria-label=\"" + d + " (tidak bisa dipilih, tanggal mendatang)\"" : "") + ' aria-pressed="' + (iso === CAL.sel) + '">' + d + "</button>";
    }
    return '<div class="hstack hstack--between"><button class="btn-icon" data-act="calPrev" aria-label="Bulan sebelumnya">' + ic("chevron-right") + '</button><strong class="t-title-s" aria-live="polite">' + MON[m] + " " + y + '</strong><button class="btn-icon" data-act="calNext" aria-label="Bulan berikutnya" ' + (isNow ? "disabled" : "") + ">" + ic("chevron-right") + '</button></div><div class="cal mt-2">' + DOW.map(function (x) { return '<span class="cal__dow">' + x + "</span>"; }).join("") + cells + '</div><p class="field__hint mt-2">Tanggal mendatang tidak bisa dipilih.</p>';
  }
  App.pickDate = function (cur, cb) {
    var p = cur.split("-").map(Number); CAL = { y: p[0], m: p[1] - 1, sel: cur }; CB.date = cb;
    App.sheet('<h4 class="sheet__title">Tanggal trial</h4><div id="cal">' + calHTML() + "</div>");
    var prev = $('[data-act="calPrev"]'); if (prev) prev.firstElementChild.style.transform = "rotate(180deg)";
  };
  function calRedraw() { $("#cal").innerHTML = calHTML(); var prev = $('[data-act="calPrev"]'); if (prev) prev.firstElementChild.style.transform = "rotate(180deg)"; }
  App.act("calPrev", function () { CAL.m--; if (CAL.m < 0) { CAL.m = 11; CAL.y--; } calRedraw(); });
  App.act("calNext", function () { CAL.m++; if (CAL.m > 11) { CAL.m = 0; CAL.y++; } calRedraw(); });
  App.act("calPick", function (el) { App.closeOvl(); CB.date(el.dataset.iso); });
  App.defineOverlay({ id: "O4", name: "Pemilih tanggal", group: "Resep", stories: ["TRL-01"], demo: function () { App.jump("S7", { recipeId: "r1", mode: "new" }); App.activeOverlay = { id: "O4", variant: "" }; App.pickDate(DB.today, function (iso) { App.top().params.draft.date = iso; App.render(); }); } });

  /* ---------------- O5 trial picker + compare entry ---------------- */
  var TP = null;
  function tpList() {
    var r = DB.recipe(TP.rid), items = DB.trialsDesc(r).filter(function (t) { return TP.exclude.indexOf(t.no) < 0 && (TP.filter === "all" || t.verdict === TP.filter); });
    if (!items.length) return h.empty({ icon: "search", title: "Belum ada trial dengan verdict ini" });
    return '<div class="list">' + items.map(function (t) {
      return '<div class="row" role="button" tabindex="0" data-act="tpPick" data-n="' + t.no + '"><div class="row__main"><span class="row__title">Trial #' + t.no + " · " + t.portions + ' porsi</span><span class="row__meta">' + DB.fmtDate(t.date) + '</span><span class="row__tags">' + h.vbadge(t.verdict) + (r.stableNo === t.no ? h.stableBadge() : "") + "</span></div>" + ic("chevron-right", "chev") + "</div>";
    }).join("") + "</div>";
  }
  function tpOpen() { App.sheet('<h4 class="sheet__title">' + esc(TP.title) + (TP.noTag ? "" : ' <span class="badge badge--cr cr-mark">CR-02</span>') + '</h4><div id="tp-filter" style="margin:0 calc(var(--gutter) * -1) var(--s-3)">' + h.verdictFilter(TP.filter).replace(/data-act="vfilter"/g, 'data-act="tpFilter"') + '</div><div id="tp-list">' + tpList() + "</div>"); }
  App.pickTrial = function (o) { TP = { rid: o.recipeId, title: o.title, exclude: o.exclude || [], filter: "all", cb: o.onPick, noTag: !!o.noTag }; tpOpen(); };
  App.act("tpFilter", function (el) { TP.filter = el.dataset.v; $("#tp-filter").innerHTML = h.verdictFilter(TP.filter).replace(/data-act="vfilter"/g, 'data-act="tpFilter"'); $("#tp-list").innerHTML = tpList(); });
  App.act("tpPick", function (el) { var n = Number(el.dataset.n), cb = TP.cb; App.closeOvl(); cb(n); });
  App.compareFromTrial = function (rid, a) { App.pickTrial({ recipeId: rid, title: "Bandingkan Trial #" + a + " dengan…", exclude: [a], onPick: function (b) { App.go("S19", { recipeId: rid, a: a, b: b }); } }); };
  App.compareFromRecipe = function (rid) {
    App.pickTrial({ recipeId: rid, title: "Pilih trial pertama", onPick: function (a) { App.pickTrial({ recipeId: rid, title: "Pilih trial kedua", exclude: [a], onPick: function (b) { App.go("S19", { recipeId: rid, a: a, b: b }); } }); } });
  };
  App.defineOverlay({ id: "O5", name: "Pemilih trial (Bandingkan)", tag: "CR-02", group: "Resep", stories: ["CMP-01"], variants: [["from-trial", "Dari Detail Trial"], ["from-recipe", "Dari Detail Resep"]],
    demo: function (v) { v = v || "from-trial"; if (v === "from-recipe") { App.jump("S6"); App.activeOverlay = { id: "O5", variant: v }; App.compareFromRecipe("r1"); } else { App.jump("S8"); App.activeOverlay = { id: "O5", variant: v }; App.compareFromTrial("r1", 3); } } });
  App.defineOverlay({ id: "O6", name: "Filter verdict", group: "Resep", stories: ["HIS-01"], demo: function () { App.jump("S6", { recipeId: "r1", filter: "gagal" }); App.activeOverlay = { id: "O6", variant: "" }; } });

  /* ---------------- O1 verdict sheet ---------------- */
  var VD = null;
  App.openVerdict = function (rid, no) {
    var t = DB.trial(rid, no); VD = { rid: rid, no: no, v: t.verdict, text: t.result };
    App.sheet('<h4 class="sheet__title">Beri verdict · Trial #' + no + '</h4><div class="stack"><div class="verdict-picker" role="group" aria-label="Verdict">' + ["berhasil", "gagal", "belum"].map(function (v) { return '<button data-v="' + v + '" aria-pressed="' + (VD.v === v) + '" data-act="vdPick">' + ic(h.V[v].icon) + h.V[v].label + "</button>"; }).join("") + "</div>" +
      '<div class="field"><label class="field__label" for="vd-text">Hasil</label><textarea class="textarea" id="vd-text" maxlength="2000" placeholder="Apa hasilnya dan kenapa kamu memberi verdict itu?" data-in="vdText">' + esc(VD.text) + '</textarea></div><button class="btn btn--primary btn--block" data-act="vdSave"><span class="btn__label">Simpan</span></button></div>');
  };
  App.inp("vdText", function (el) { VD.text = el.value; });
  App.act("vdPick", function (el) { VD.v = el.dataset.v; App.$$(".ovl .verdict-picker button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === el)); }); });
  App.act("vdSave", function () {
    var r = DB.recipe(VD.rid), t = DB.trial(VD.rid, VD.no), v = VD.v, text = VD.text, drop = r.stableNo === t.no && v !== "berhasil";
    var apply = function (dropStable) { t.verdict = v; t.result = text; if (dropStable) r.stableNo = null; r.updated = DB.today; App.closeOvl(); App.render(); App.snack("Verdict disimpan: " + h.V[v].label, { icon: "circle-check" }); };
    if (drop) { App.closeOvl(); App.openConfirm("stableVerdict", { onOk: function () { apply(true); } }); } else apply(false);
  });
  App.defineOverlay({ id: "O1", name: "Sheet verdict", group: "Resep", stories: ["TRL-04"], variants: [["sheet", "Sheet"], ["stable", "Trial Stable (peringatan)"]],
    demo: function (v) { v = v || "sheet"; App.jump("S8", { recipeId: "r1", no: v === "stable" ? 3 : 6 }); App.activeOverlay = { id: "O1", variant: v }; App.openVerdict("r1", v === "stable" ? 3 : 6); } });

  /* ---------------- O7 confirm dialogs ---------------- */
  App.openConfirm = function (kind, p) {
    p = p || {};
    var cancel = function (l) { return { label: l || "Batal", kind: "secondary" }; };
    var r = p.recipeId ? DB.recipe(p.recipeId) : null;
    if (kind === "logout") App.dialog({ title: "Keluar dari akun?", body: "Kamu perlu login lagi untuk masuk ke aplikasi.", actions: [cancel(), { label: "Keluar", kind: "primary", fn: function () { App.logout(); } }] });
    if (kind === "deleteTrial") {
      var t = DB.trial(p.recipeId, p.no), st = r.stableNo === p.no;
      App.dialog({ title: "Hapus trial?", body: st ? "Ini adalah Stable Trial. Resep tidak akan punya Stable Trial setelah dihapus." : "Trial #" + p.no + " akan dihapus permanen.", actions: [cancel(), { label: "Hapus", kind: "danger", fn: function () { r.trials.splice(r.trials.indexOf(t), 1); if (st) r.stableNo = null; App.back(); App.snack("Trial dihapus", { icon: "trash-2" }); } }] });
    }
    if (kind === "discard") App.dialog({ title: "Buang perubahan?", body: "Perubahan yang belum disimpan akan hilang.", actions: [cancel("Lanjut mengedit"), { label: "Buang", kind: "danger", fn: function () { App.back(); } }] });
    if (kind === "moveStable") App.dialog({ title: "Pindahkan Stable Trial dari Trial #" + p.from + " ke Trial #" + p.to + "?", body: "Trial #" + p.from + " tidak lagi ditandai Stable.", actions: [cancel(), { label: "Pindahkan", kind: "primary", fn: function () { App.setStable(p.recipeId, p.to); } }] });
    if (kind === "stableVerdict") App.dialog({ title: "Ubah verdict?", body: "Trial ini adalah Stable Trial. Ubah verdict dan hapus status Stable?", actions: [cancel(), { label: "Ubah verdict", kind: "primary", fn: p.onOk || function () {} }] });
  };
  App.defineOverlay({ id: "O7", name: "Dialog konfirmasi", group: "Resep", stories: ["AUTH-05", "REC-04", "TRL-03", "TRL-01", "STB-01", "TRL-04"],
    variants: [["logout", "Keluar"], ["deleteTrial", "Hapus trial (Stable)"], ["discard", "Buang perubahan"], ["moveStable", "Pindahkan Stable"], ["stableVerdict", "Ubah verdict Stable"]],
    demo: function (v) {
      v = v || "logout"; var on = { logout: ["S11"], deleteTrial: ["S8", { recipeId: "r1", no: 3 }], discard: ["S7", { recipeId: "r1", mode: "copy", from: 3 }], moveStable: ["S8", { recipeId: "r1", no: 4 }], stableVerdict: ["S8", { recipeId: "r1", no: 3 }] }[v];
      App.jump(on[0], on[1]); App.activeOverlay = { id: "O7", variant: v };
      App.openConfirm(v, { recipeId: "r1", no: 3, from: 3, to: 4, onOk: function () {} });
    } });

  /* ---------------- O8 snackbar + toast ---------------- */
  App.defineOverlay({ id: "O8", name: "Snackbar dan toast", group: "Resep", stories: ["ING-01", "AUTH-03"], variants: [["undo", "Urungkan bahan"], ["toast", "Toast sukses"]],
    demo: function (v) { v = v || "undo"; App.jump("S7", { recipeId: "r1", mode: "copy", from: 3 }); App.activeOverlay = { id: "O8", variant: v };
      if (v === "toast") App.snack("Password berhasil diubah", { icon: "circle-check", ms: 9000 }); else App.snack("Bahan “Gula pasir” dihapus", { action: "Urungkan", ms: 9000 }); } });

  /* ---------------- O10, O11 demos (live in S7) ---------------- */
  App.defineOverlay({ id: "O10", name: "Saran nama bahan", group: "Resep", stories: ["ING-02"], demo: function () { App.jump("S7", { recipeId: "r1", mode: "new", demo: "suggest" }); App.activeOverlay = { id: "O10", variant: "" }; } });
  App.defineOverlay({ id: "O11", name: "Gestur baris bahan (urut, hapus)", group: "Resep", stories: ["ING-01"], demo: function () { App.jump("S7", { recipeId: "r1", mode: "copy", from: 3, demo: "drag" }); App.activeOverlay = { id: "O11", variant: "" }; } });

  /* ---------------- O13 start a trial: from the recipe's base ingredients, from a previous trial, or empty ---------------- */
  var choice = function (act, id, icon, title, sub, disabled) {
    return '<button class="link-row link-row--sub" data-act="' + act + '" data-id="' + id + '"' + (disabled ? " disabled" : "") + '><span class="link-row__ic">' + ic(icon) + '</span><span class="link-row__text"><span>' + title + '</span><span class="link-row__sub">' + sub + "</span></span>" + (disabled ? "" : ic("chevron-right", "chev")) + "</button>";
  };
  App.startTrial = function (rid) {
    var r = DB.recipe(rid), hasBase = !!(r.base && r.base.length), n = r.trials.length;
    if (!hasBase && !n) { App.go("S7", { recipeId: rid, mode: "new" }); return; }
    App.sheet('<h4 class="sheet__title">Mulai trial dari mana?</h4><div class="stack stack--sm">' +
      (hasBase ? choice("startBase2", rid, "book-open", "Bahan resep", r.basePortions + " porsi · " + r.base.length + " bahan · dari admin") : "") +
      choice("startPrev", rid, "history", "Trial sebelumnya", n ? "Pakai takaran dari salah satu trialmu (" + n + " trial)" : "Belum ada trial", !n) +
      choice("startBlank", rid, "plus", "Mulai kosong", "Isi semua bahan sendiri") + "</div>");
  };
  App.act("startBase2", function (el) { App.closeOvl(); App.go("S7", { recipeId: el.dataset.id, mode: "base" }); });
  App.act("startBlank", function (el) { App.closeOvl(); App.go("S7", { recipeId: el.dataset.id, mode: "new" }); });
  App.act("startPrev", function (el) {
    var rid = el.dataset.id; App.closeOvl();
    App.pickTrial({ recipeId: rid, title: "Pakai takaran dari…", noTag: true, onPick: function (n) { App.go("S7", { recipeId: rid, mode: "copy", from: n }); } });
  });
  App.defineOverlay({ id: "O13", name: "Mulai trial dari mana?", group: "Resep", stories: ["TRL-01", "CPY-01"], variants: [["both", "Ada bahan resep + trial"], ["noprev", "Belum ada trial"]],
    demo: function (v) { v = v || "both"; App.jump("S6", { recipeId: v === "noprev" ? "r4" : "r1" }); App.activeOverlay = { id: "O13", variant: v }; App.startTrial(v === "noprev" ? "r4" : "r1"); } });

  /* ---------------- O12 app icon and splash artwork ---------------- */
  App.defineScreen({
    id: "O12", name: "Ikon aplikasi dan splash", group: "Akun", role: "both", stories: ["PRD D4"], flush: false,
    states: [["auto", "Cadangan (logo emas di hitam)"]],
    render: function () {
      var icon = function (cls) { return '<div class="appicon ' + (cls || "") + '"><img src="assets/ragi-wordmark.png" alt=""></div>'; };
      return h.appbar({ title: "Ikon aplikasi", back: true }) + '<div class="pad stack"><div class="hint-card">' + ic("info", "icon--sm") + "<span>Desain cadangan sampai RAGI mengirim ikon resmi (PRD D4). Memakai berkas logo apa adanya di atas Blackout Black.</span></div>" +
        '<div class="hstack" style="align-items:flex-end;gap:var(--s-5)">' + icon() + icon("appicon--sm") + "</div>" +
        '<div><h2 class="section-title">Splash</h2><div style="background:var(--c-ink);border-radius:var(--r-xl);height:260px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden"><span class="splash__blob"></span><img src="assets/ragi-logo.png" style="width:150px" alt="Logo RAGI"></div></div></div>';
    }
  });
})();
