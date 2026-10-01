/* Prototype core: router, screen registry, overlays, events, control panel, shared UI kit (App.h).
   Every screen or overlay registers itself with App.defineScreen / App.defineOverlay in screens/*.js.
   Deviation from the workflow file: one JS module per screen group, not one HTML file per screen, because file:// cannot fetch fragments.
   All visible text is Bahasa Indonesia. */
(function () {
  "use strict";
  var L = window.RAGI, DB = window.DB;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var App = (window.App = {
    screens: {}, overlays: {}, actions: {}, inputs: {}, order: [],
    stack: [], states: {}, role: null, user: null, tab: null,
    offline: false, ts: 1, small: false, scale: 1, lastId: null, timers: {}
  });

  function esc(s) { return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ic(n, c) { return '<svg class="icon ' + (c || "") + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  App.esc = esc; App.ic = ic; App.$ = $; App.$$ = $$;

  /* ------------------------------------------------------------------ registry */
  App.defineScreen = function (d) { App.screens[d.id] = d; App.order.push(d.id); };
  App.defineOverlay = function (d) { App.overlays[d.id] = d; App.order.push(d.id); };
  App.act = function (name, fn) { App.actions[name] = fn; };
  App.inp = function (name, fn) { App.inputs[name] = fn; };

  /* ------------------------------------------------------------------ session + navigation */
  // One experience for everyone (D-023), no Cari tab and no Chef screens (D-026). The role is only a label in the profile.
  var TABS = [{ id: "beranda", label: "Beranda", icon: "house", screen: "S3" }, { id: "resep", label: "Resep", icon: "book-open", screen: "S4" }, { id: "profil", label: "Profil", icon: "user", screen: "S11" }];
  App.home = function () { return "S3"; };
  App.loginAs = function (role) {
    App.role = role; App.user = role === "chef" ? DB.users.c1 : DB.users.u1; App.states = {}; if (App.onLogin) App.onLogin();
    App.tab = TABS[0].id; App.stack = [{ id: App.home(), params: {} }]; App.closeOvl(); App.render();
  };
  App.logout = function (msg) {
    App.role = null; App.user = null; App.states = {}; App.closeOvl(); if (App.onLogin) App.onLogin();
    App.stack = [{ id: "S2", params: { notice: msg || "" } }]; App.render();
  };
  App.top = function () { return App.stack[App.stack.length - 1]; };
  App.go = function (id, params, opts) {
    opts = opts || {};
    var e = { id: id, params: params || {} };
    if (opts.replace) App.stack[App.stack.length - 1] = e; else App.stack.push(e);
    App.render(); scrollTop();
  };
  App.back = function () {
    if (App.stack.length > 1) App.stack.pop();
    else if (App.role) { App.stack = [{ id: App.home(), params: {} }]; App.tab = TABS[0].id; }
    App.render();
  };
  App.toTab = function (id) {
    var t = TABS.filter(function (x) { return x.id === id; })[0];
    if (!t) return; App.tab = id; App.stack = [{ id: t.screen, params: {} }]; App.render(); scrollTop();
  };
  App.jump = function (id, params) {
    if (App.overlays[id]) { App.overlays[id].demo(); return; }
    var d = App.screens[id]; if (!d) return;
    App.closeOvl();
    if (!App.role && id !== "S1" && id !== "S2") { App.role = "student"; App.user = DB.users.u1; }
    App.tab = TABS.some(function (t) { return t.id === d.tab; }) ? d.tab : "beranda";
    App.stack = [{ id: id, params: params || (d.defaults ? d.defaults() : {}) }];
    App.render(); scrollTop();
  };
  App.setState = function (id, s) { App.states[id] = s; App.closeOvl(); App.render(); };
  App.stateOf = function (id) { return App.states[id] || "auto"; };
  function scrollTop() { var s = $(".screen"); if (s) s.scrollTop = 0; }

  App.ctx = function (entry) {
    var d = App.screens[entry.id];
    return { id: entry.id, def: d, state: App.stateOf(entry.id), params: entry.params, App: App, DB: DB };
  };

  /* ------------------------------------------------------------------ render */
  App.render = function () {
    var entry = App.top(), d = App.screens[entry.id];
    if (!d) return;
    var view = $("#view"), old = $(".screen", view);
    var keep = old && App.lastId === entry.id ? old.scrollTop : 0;
    var ctx = App.ctx(entry);
    var out = d.render(ctx); if (typeof out === "string") out = { html: out };
    var dark = !!d.dark;
    view.className = "view" + (dark ? " on-ink" : "");
    $("#statusbar").className = "statusbar" + (dark ? " on-ink" : "");
    $(".homebar").className = "homebar" + (dark ? " on-ink" : "");
    var banner = App.offline ? '<div class="banner banner--offline" role="status">' + ic("wifi-off") + "<span>Kamu sedang offline. Perubahan tidak bisa disimpan.</span></div>" : "";
    view.innerHTML = banner + '<div class="screen' + (d.flush ? " screen--flush" : "") + '">' + out.html + "</div>" + (out.footer || "") + (d.tabbar && App.role ? tabbar() : "");
    var sc = $(".screen", view); if (sc) sc.scrollTop = keep;
    App.lastId = entry.id;
    if (d.mount) d.mount(ctx, view);
    if (App._pendingFocus !== undefined && App._pendingFocus !== null && $("#ovl").hidden) {
      var back = findBySignature(App._pendingFocus), title = $("h1, .appbar__title", view);
      App._pendingFocus = null;
      var target = back || title; if (target) { if (!back) target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
    }
    App.renderPanel(); syncUrl();
  };
  function tabbar() {
    var tabs = TABS;
    return '<nav class="tabbar" aria-label="Navigasi utama">' + tabs.map(function (t) {
      return '<button class="tab' + (App.tab === t.id ? " is-active" : "") + '" data-act="tab" data-id="' + t.id + '"' + (App.tab === t.id ? ' aria-current="page"' : "") + '><span class="tab__pill">' + ic(t.icon) + "</span>" + t.label + "</button>";
    }).join("") + "</nav>";
  }
  App.act("tab", function (el) { App.toTab(el.dataset.id); });
  App.act("back", function () { App.back(); });

  /* ------------------------------------------------------------------ overlays
     Modal focus contract (WCAG 2.4.3, 4.1.2): when a sheet or dialog opens, the screen behind it is inert, focus moves into the
     overlay, Tab wraps inside it, and on close focus goes back to what opened it (or, if a re-render replaced that control,
     to its twin in the new DOM, or to the screen title). */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function signature(el) {
    if (!el || el === document.body || !el.dataset) return null;
    var d = {}; for (var k in el.dataset) d[k] = el.dataset[k];
    return { tag: el.tagName, id: el.id || "", data: d };
  }
  function findBySignature(sig) {
    var view = $("#view"); if (!sig || !view) return null;
    if (sig.id) { var byId = document.getElementById(sig.id); if (byId && view.contains(byId)) return byId; }
    if (!sig.data.act) return null;
    var list = $$(sig.tag.toLowerCase() + '[data-act="' + sig.data.act + '"]', view);
    return list.filter(function (el) { return Object.keys(sig.data).every(function (k) { return el.dataset[k] === sig.data[k]; }); })[0] || null;
  }
  function overlayFocusables() {
    var box = $("#ovl .sheet, #ovl .dialog"); if (!box) return [];
    return $$(FOCUSABLE, box).filter(function (el) { return el.offsetParent !== null; });
  }
  function showOverlay(html, kind) {
    var o = $("#ovl"), view = $("#view");
    if (o.hidden) { // keep the first opener when overlays chain
      var ae = document.activeElement, pressed = App._lastAct && App._lastAct.isConnected && Date.now() - App._lastActAt < 1000 ? App._lastAct : null;
      var opener = ae && ae !== document.body && !o.contains(ae) ? ae : pressed;
      App._retEl = opener; App._retSig = signature(opener);
    }
    o.hidden = false; o.innerHTML = html; view.inert = true;
    var box = $(kind === "dialog" ? ".dialog" : ".sheet", o);
    if (kind === "sheet") { var t = $(".sheet__title", box); if (t) { t.id = "ovl-t"; box.setAttribute("aria-labelledby", "ovl-t"); } }
    box.setAttribute("tabindex", "-1");
    // alertdialog: start on the first (cancelling) action; sheet: start on the sheet itself so its title is announced and Tab reaches the first control next
    var first = kind === "dialog" ? $(".dialog__actions button", box) : box;
    if (first) first.focus({ preventScroll: true });
    return o;
  }
  function restoreFocus() {
    var el = App._retEl, sig = App._retSig; App._retEl = null; App._retSig = null;
    if (el && el.isConnected) el.focus({ preventScroll: true }); // the opener, or a control in the prototype panel
    App._pendingFocus = sig; setTimeout(function () { App._pendingFocus = null; }, 0); // a re-render in the same tick replaces the control: App.render re-finds it
  }
  App.sheet = function (html, mount) {
    var o = showOverlay('<div class="scrim" data-act="closeOvl"></div><div class="sheet" role="dialog" aria-modal="true"><div class="sheet__grab"></div>' + html + "</div>", "sheet");
    if (mount) mount(o);
  };
  App.dialog = function (o) {
    App._dlg = o.actions;
    showOverlay('<div class="scrim" data-act="closeOvl"></div><div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-b"><h4 class="dialog__title" id="dlg-t">' + esc(o.title) + '</h4><p class="dialog__body" id="dlg-b">' + esc(o.body) + '</p><div class="dialog__actions">' +
      o.actions.map(function (a, i) { return '<button class="btn btn--' + (a.kind || "secondary") + '" data-act="dlg" data-i="' + i + '"><span class="btn__label">' + esc(a.label) + "</span></button>"; }).join("") + "</div></div>", "dialog");
  };
  App.closeOvl = function () {
    var o = $("#ovl"), was = o && !o.hidden;
    if (o) { o.hidden = true; o.innerHTML = ""; }
    var view = $("#view"); if (view) view.inert = false;
    App.activeOverlay = null;
    if (was) restoreFocus();
  };
  App.act("closeOvl", function () { App.closeOvl(); });
  App.act("dlg", function (el) { var a = App._dlg[Number(el.dataset.i)]; App.closeOvl(); if (a && a.fn) a.fn(); });
  App.snack = function (msg, o) {
    o = o || {};
    var root = $("#snack"), n = document.createElement("div");
    n.className = "snackbar"; n.setAttribute("role", "status");
    n.innerHTML = (o.icon ? ic(o.icon) : "") + '<span class="snackbar__msg">' + esc(msg) + "</span>" + (o.action ? '<button class="snackbar__action">' + esc(o.action) + "</button>" : "");
    root.appendChild(n);
    var done = function () { if (n.parentNode) n.parentNode.removeChild(n); };
    if (o.action) n.querySelector("button").onclick = function () { done(); if (o.fn) o.fn(); };
    setTimeout(done, o.ms || 4500);
  };

  /* ------------------------------------------------------------------ events */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]"); if (!el) return;
    if (el.disabled || el.getAttribute("aria-disabled") === "true") return;
    App._lastAct = el; App._lastActAt = Date.now(); // Safari does not focus a button on click, so remember what was pressed
    var fn = App.actions[el.dataset.act]; if (fn) fn(el, e);
  });
  document.addEventListener("input", function (e) {
    var el = e.target.closest("[data-in]"); if (!el) return;
    var fn = App.inputs[el.dataset["in"]]; if (fn) fn(el, e);
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
    if (e.key === "Escape" && !$("#ovl").hidden) App.closeOvl();
    if (e.key === "Tab" && !$("#ovl").hidden) {
      var f = overlayFocusables(), box = $("#ovl .sheet, #ovl .dialog"), cur = document.activeElement;
      if (!f.length) { e.preventDefault(); if (box) box.focus(); return; }
      if (!box.contains(cur)) { e.preventDefault(); f[0].focus(); return; }
      if (e.shiftKey && (cur === f[0] || cur === box)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && cur === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ------------------------------------------------------------------ shared UI kit */
  var V = { berhasil: { label: "Berhasil", icon: "circle-check" }, gagal: { label: "Gagal", icon: "circle-x" }, belum: { label: "Belum dinilai", icon: "hourglass" } };
  var h = (App.h = {});
  h.V = V;
  h.vbadge = function (v) { return '<span class="badge badge--' + v + '">' + ic(V[v].icon) + V[v].label + "</span>"; };
  h.stableBadge = function () { return '<span class="badge badge--stable">' + ic("star") + "Stable</span>"; };
  h.cat = function (c) { return '<span class="badge badge--category">' + esc(c) + "</span>"; };
  h.cr = function (t) { return '<span class="badge badge--cr cr-mark">' + t + "</span>"; };
  h.sourceText = function (s) {
    if (!s || s.kind === "new") return "";
    if (s.kind === "base") return "Dari bahan resep";
    return s.kind === "copy" ? "Salinan Trial #" + s.from : "Skala dari Trial #" + s.from + ": " + s.a + " → " + s.b + " porsi";
  };
  h.sourceBadge = function (s) {
    var t = h.sourceText(s); if (!t) return "";
    return '<span class="badge badge--source">' + ic(s.kind === "copy" ? "copy" : s.kind === "base" ? "book-open" : "scaling") + esc(t) + "</span>";
  };
  h.avatar = function (name, lg) { var p = String(name).replace(/^Chef /, "").split(" "); return '<span class="avatar' + (lg ? " avatar--lg" : "") + '" aria-hidden="true">' + esc((p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase()) + "</span>"; };
  h.appbar = function (o) {
    var left = o.back ? '<button class="btn-icon" data-act="' + (o.backAct || "back") + '" aria-label="' + (o.back === "close" ? "Tutup" : "Kembali") + '">' + ic(o.back === "close" ? "x" : "arrow-left") + "</button>" : '<span style="width:var(--s-3)"></span>';
    return '<div class="appbar">' + left + '<div class="appbar__title">' + esc(o.title || "") + "</div>" + (o.right || "") + "</div>";
  };
  h.tabHeader = function (title, aside) { return '<div class="appbar appbar--large"><h1 class="appbar__display" style="margin:0">' + esc(title) + "</h1>" + (aside || "") + "</div>"; };
  h.iconBtn = function (icon, label, act, attrs) { return '<button class="btn-icon" aria-label="' + esc(label) + '" data-act="' + act + '" ' + (attrs || "") + ">" + ic(icon) + "</button>"; };
  h.empty = function (o) {
    return '<div class="empty"><div class="empty__art"' + (o.danger ? ' style="background:var(--c-gagal-fill);color:var(--c-gagal-ink)"' : "") + ">" + ic(o.icon) + '</div><h4 class="empty__title">' + esc(o.title) + '</h4><p class="empty__body">' + esc(o.body || "") + "</p>" +
      (o.cta ? '<button class="btn btn--' + (o.cta.kind || "gold") + '" data-act="' + o.cta.act + '" ' + (o.cta.attrs || "") + ">" + (o.cta.icon ? ic(o.cta.icon) : "") + '<span class="btn__label">' + esc(o.cta.label) + "</span></button>" : "") + "</div>";
  };
  h.errorBlock = function () { return h.empty({ icon: "circle-alert", danger: true, title: "Gagal memuat", body: "Periksa koneksi internetmu, lalu coba lagi.", cta: { label: "Coba lagi", act: "retry", kind: "secondary", icon: "refresh-cw" } }); };
  h.skeletons = function (n, hgt) { var s = ""; for (var i = 0; i < (n || 3); i++) s += '<div class="skeleton" style="height:' + (hgt || 84) + 'px;border-radius:var(--r-lg)"></div>'; return '<div class="list pad" aria-busy="true" aria-label="Memuat">' + s + "</div>"; };
  App.act("retry", function () { App.states[App.top().id] = "auto"; App.render(); });

  var CAT_ICON = { Roti: "wheat", Cake: "cake", Pastry: "croissant", Cookies: "cookie", Dessert: "dessert", Lainnya: "utensils" };
  // Food photo from the recipe. No photo (a recipe the student made) or a failed load falls back to a category icon on gold tint.
  h.thumb = function (r) {
    var cat = CAT_ICON[r.category] || "utensils";
    if (!r.photo) return '<span class="thumb is-fallback" aria-hidden="true">' + ic(cat) + "</span>";
    return '<span class="thumb" data-cat="' + cat + '" aria-hidden="true"><img src="' + esc(r.photo.thumb) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="App.imgFail(this)"></span>';
  };
  h.photo = function (r) {
    var cat = CAT_ICON[r.category] || "utensils";
    if (!r.photo) return '<div class="photo is-fallback" role="img" aria-label="Belum ada foto untuk ' + esc(r.name) + '">' + ic(cat) + "</div>";
    return '<div class="photo" data-cat="' + cat + '"><img src="' + esc(r.photo.hero) + '" alt="Foto ' + esc(r.name) + '" decoding="async" fetchpriority="high" referrerpolicy="no-referrer" onerror="App.imgFail(this)"></div>';
  };
  App.imgFail = function (img) { var box = img.parentNode; box.classList.add("is-fallback"); box.insertAdjacentHTML("beforeend", ic(box.dataset.cat || "utensils")); };
  h.recipeRow = function (r) {
    var st = r.stableNo;
    return '<div class="row" role="button" tabindex="0" data-act="openRecipe" data-id="' + r.id + '">' + h.thumb(r) + '<div class="row__main"><span class="row__title">' + esc(r.name) + '</span><span class="row__meta">' +
      (r.trials.length ? r.trials.length + " trial · terakhir " + DB.fmtDate(r.updated) : "Belum ada trial") + '</span><span class="row__tags">' + h.cat(r.category) + (st ? h.stableBadge() : "") + "</span></div>" + ic("chevron-right", "chev") + "</div>";
  };
  App.act("openRecipe", function (el) { App.go("S6", { recipeId: el.dataset.id }); });
  h.roleLabel = function (u) { return u.role === "chef" ? "Chef" : "Siswa"; };
  h.roleBadge = function (u) { return '<span class="badge badge--category">' + (u.role === "chef" ? ic("chef-hat") : "") + h.roleLabel(u) + "</span>"; };
  h.trialRow = function (r, t, o) {
    o = o || {}; var excerpt = (t.result || "").split("\n")[0];
    return '<div class="row" role="button" tabindex="0" data-act="openTrial" data-r="' + r.id + '" data-n="' + t.no + '"><div class="row__main"><span class="row__title">Trial #' + t.no + " · " + t.portions + ' porsi</span><span class="row__meta">' + DB.fmtDate(t.date) + "</span>" +
      (excerpt ? '<span class="row__excerpt">' + esc(excerpt) + "</span>" : "") + '<span class="row__tags">' + h.vbadge(t.verdict) + (r.stableNo === t.no ? h.stableBadge() : "") + h.sourceBadge(t.source) + "</span></div>" +
      (o.menu ? '<div class="row__end">' + h.iconBtn("ellipsis-vertical", "Aksi Trial #" + t.no, "trialMenu", 'data-r="' + r.id + '" data-n="' + t.no + '"') + "</div>" : ic("chevron-right", "chev")) + "</div>";
  };
  App.act("openTrial", function (el) { App.go("S8", { recipeId: el.dataset.r, no: Number(el.dataset.n) }); });

  h.verdictFilter = function (cur) {
    var items = [["all", "Semua", ""], ["berhasil", "Berhasil", "circle-check"], ["gagal", "Gagal", "circle-x"], ["belum", "Belum dinilai", "hourglass"]];
    return '<div class="chip-row" role="group" aria-label="Filter verdict">' + items.map(function (i) {
      return '<button class="chip" aria-pressed="' + (cur === i[0]) + '" data-act="vfilter" data-v="' + i[0] + '">' + (i[2] ? ic(i[2], "icon--sm") : "") + i[1] + "</button>";
    }).join("") + "</div>";
  };

  var METRIC_LABELS = { dough: "Berat adonan", flour: "Total tepung", water: "Total air", hydration: "Hidrasi", fat: "Lemak", sugar: "Gula", salt: "Garam", yeast: "Ragi" };
  App.METRIC_LABELS = METRIC_LABELS;
  h.metrics = function (rows, id) {
    var m = L.metrics(rows), cell = function (l, v) { return '<div class="metric"><span class="metric__label">' + l + '</span><span class="metric__value">' + v + "</span></div>"; };
    var u = function (n) { return L.fmtNum(n) + "<small>g</small>"; };
    return '<div class="metrics"' + (id ? ' id="' + id + '"' : "") + ' aria-live="polite"><div class="metrics__head"><h3>' + ic("calculator") + 'Metrik adonan</h3><span class="badge badge--cr">CR-01</span></div>' +
      '<div class="metrics__hero">' + cell(METRIC_LABELS.dough, u(m.dough)) + cell(METRIC_LABELS.flour, m.hasFlour ? u(m.flour) : "—") + cell(METRIC_LABELS.water, u(m.water)) + cell(METRIC_LABELS.hydration, m.hasFlour ? L.fmtPct(m.hydration) : "—") + "</div>" +
      (m.hasFlour ? '<div class="metrics__grid">' + cell(METRIC_LABELS.fat, L.fmtPct(m.fat)) + cell(METRIC_LABELS.sugar, L.fmtPct(m.sugar)) + cell(METRIC_LABELS.salt, L.fmtPct(m.salt)) + cell(METRIC_LABELS.yeast, L.fmtPct(m.yeast)) + "</div>"
        : '<p class="metrics__hint">' + ic("info", "icon--sm") + "Tambahkan bahan bertipe Tepung untuk menghitung baker's %</p>") + "</div>";
  };
  h.ingTable = function (rows) {
    var m = L.metrics(rows);
    return '<div class="itable">' + rows.map(function (r) {
      return '<div class="irow"><div class="irow__name">' + esc(r.name) + '</div><div class="irow__qty">' + L.fmtG(r.grams) + '</div><div class="irow__sub">' + esc(r.type) + (r.brand ? " · " + esc(r.brand) : "") + '</div><div class="irow__pct"><span class="pct">' + (m.hasFlour ? L.fmtPct(m.rowPct(r)) : "—") + "</span></div></div>";
    }).join("") + "</div>";
  };
  h.textCard = function (title, text) { return '<div class="text-card"><h3>' + esc(title) + "</h3>" + (text ? "<p>" + esc(text) + "</p>" : '<p class="none">Belum diisi</p>') + "</div>"; };
  h.field = function (o) {
    return '<div class="field' + (o.error ? " is-error" : "") + '"><label class="field__label" for="' + o.id + '">' + esc(o.label) + (o.req ? ' <span class="req">*</span>' : "") + "</label>" + o.control +
      (o.hint && !o.error ? '<span class="field__hint">' + esc(o.hint) + "</span>" : "") + (o.error ? '<span class="field__error" role="alert">' + ic("circle-alert", "icon--sm") + esc(o.error) + "</span>" : "") + (o.warn ? '<span class="field__warn">' + ic("triangle-alert", "icon--sm") + esc(o.warn) + "</span>" : "") + "</div>";
  };
  h.trialNo = function (t) { return "Trial #" + t.no; };
  h.tagsFor = function (d) { return d.tag ? h.cr(d.tag) : ""; };

  /* ------------------------------------------------------------------ control panel */
  App.renderPanel = function () {
    var p = $("#panel"), cur = App.top(), d = App.screens[cur.id];
    var opts = function (role) {
      return App.order.filter(function (id) { var x = App.screens[id]; return x && x.group === role; }).map(function (id) {
        var x = App.screens[id];
        return '<option value="' + id + '"' + (id === cur.id ? " selected" : "") + ">" + id + " · " + x.name + (x.tag ? " [" + x.tag + "]" : "") + "</option>";
      }).join("");
    };
    p.innerHTML = '<div><h1>RAGI <span>prototipe</span></h1><p class="p-meta">Fase 1 · UI/UX · data contoh · v0.1</p></div>' +
      '<div><h2>Akun demo (menu sama)</h2><div class="p-chips">' +
      '<button class="p-chip" data-act="pRole" data-role="student" aria-pressed="' + (App.role === "student") + '">Sari (Siswa)</button><button class="p-chip" data-act="pRole" data-role="chef" aria-pressed="' + (App.role === "chef") + '">Rina (Chef)</button><button class="p-chip" data-act="pRole" data-role="none" aria-pressed="' + (!App.role) + '">Keluar</button></div></div>' +
      '<div><h2>Loncat ke layar</h2><label class="sr-only" for="pJump">Layar</label><select id="pJump" data-in="pJump">' +
      '<optgroup label="Akun">' + opts("Akun") + '</optgroup><optgroup label="Resep dan trial">' + opts("Resep") + '</optgroup><optgroup label="Overlay">' +
      App.order.filter(function (id) { return App.overlays[id]; }).map(function (id) { return '<option value="' + id + '"' + (App.activeOverlay && App.activeOverlay.id === id ? " selected" : "") + ">" + id + " · " + App.overlays[id].name + (App.overlays[id].tag ? " [" + App.overlays[id].tag + "]" : "") + "</option>"; }).join("") + "</optgroup></select></div>" +
      '<div><h2>Kondisi layar ' + (d.tag ? '<span class="p-tag">' + d.tag + "</span>" : "") + '</h2><div class="p-chips">' +
      (d.states || [["auto", "Data nyata"]]).map(function (s) { return '<button class="p-chip" data-act="pState" data-s="' + s[0] + '" aria-pressed="' + (App.stateOf(cur.id) === s[0]) + '">' + s[1] + "</button>"; }).join("") + "</div>" +
      '<p class="p-meta mt-2"><b>' + cur.id + " · " + d.name + "</b><br>Cerita: " + (d.stories && d.stories.length ? d.stories.join(", ") : "—") + "</p></div>" +
      (App.activeOverlay && App.overlays[App.activeOverlay.id].variants ? '<div><h2>Kondisi overlay ' + App.activeOverlay.id + '</h2><div class="p-chips">' + App.overlays[App.activeOverlay.id].variants.map(function (v) { return '<button class="p-chip" data-act="pVariant" data-v="' + v[0] + '" aria-pressed="' + (App.activeOverlay.variant === v[0]) + '">' + v[1] + "</button>"; }).join("") + "</div></div>" : "") +
      '<div><h2>Uji</h2><div class="p-chips"><button class="p-chip" data-act="pText" aria-pressed="' + (App.ts > 1) + '">Teks 130 %</button><button class="p-chip" data-act="pSize" aria-pressed="' + App.small + '">360 × 640</button><button class="p-chip" data-act="pOffline" aria-pressed="' + App.offline + '">Offline</button></div></div>' +
      '<div><h2>Data</h2><div class="p-chips"><button class="p-chip" data-act="pReset">Reset data</button></div></div>' +
      '<p class="p-meta">Kata sandi demo untuk masuk: ' + DB.PASSWORD + '. Akun: siswa@ragi.id, chef@ragi.id.<br><a href="../../02_Design_System/reference/components.html">Lembar komponen</a> · <a href="report.html">Laporan A4 (cetak)</a> · <a href="photo-credits.html">Kredit foto</a></p>';
  };
  App.act("pRole", function (el) { if (el.dataset.role === "none") App.logout(); else App.loginAs(el.dataset.role); });
  App.act("pVariant", function (el) { App.overlays[App.activeOverlay.id].demo(el.dataset.v); });
  App.act("pState", function (el) { App.setState(App.top().id, el.dataset.s); });
  App.act("pText", function () { App.setTextScale(App.ts > 1 ? 1 : 1.3); });
  App.act("pSize", function () { App.small = !App.small; $("#phone").classList.toggle("phone--small", App.small); App.fit(); App.render(); });
  App.act("pOffline", function () { App.offline = !App.offline; App.render(); });
  App.act("pReset", function () { location.reload(); });
  App.inp("pJump", function (el) { App.jump(el.value); });

  App.setTextScale = function (s) { App.ts = s; document.documentElement.style.setProperty("--ts", String(s)); App.renderPanel(); syncUrl(); };
  App.fit = function () {
    var dev = $("#device"), ph = $("#phone"); ph.style.transform = "none"; ph.style.marginBottom = "0";
    var w = ph.offsetWidth + 24, hh = ph.offsetHeight + 24;
    var s = Math.min(1, (dev.clientHeight - 48) / hh, (dev.clientWidth - 16) / w); if (s <= 0 || !isFinite(s)) s = 1;
    App.scale = s; ph.style.transformOrigin = "top center"; ph.style.transform = s < 1 ? "scale(" + s + ")" : "none"; ph.style.marginBottom = s < 1 ? (-(1 - s) * ph.offsetHeight) + "px" : "0";
  };
  function syncUrl() {
    try {
      var q = new URLSearchParams(); var e = App.top();
      q.set("screen", e.id); if (App.stateOf(e.id) !== "auto") q.set("state", App.stateOf(e.id));
      if (App.role) q.set("role", App.role); if (App.ts > 1) q.set("ts", "1.3"); if (App.small) q.set("size", "small");
      history.replaceState(null, "", "?" + q.toString());
    } catch (err) { /* file:// or sandbox: ignore */ }
  }
  window.addEventListener("resize", function () { App.fit(); });
})();
