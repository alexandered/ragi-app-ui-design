/* S7 Trial Editor (new / copy / scaled / edit) and S9 Scale sheet.
   Stories: TRL-01, TRL-02, ING-01, ING-02, ING-03 [CR-01], SCL-01, SCL-02, CPY-01, MET-01 [CR-01]. */
(function () {
  "use strict";
  var App = window.App, DB = window.DB, L = window.RAGI, h = App.h, ic = App.ic, esc = App.esc, $ = App.$, $$ = App.$$;
  var MAX = 2000;

  /* ------------------------------------------------------------ draft */
  function rowFrom(r) { return { id: DB.newRow().id, name: r.name, brand: r.brand || "", type: r.type, grams: r.grams, gramsText: L.fmtNum(r.grams), water: r.water === L.DEFAULT_WATER[r.type] ? null : r.water, adv: false }; }
  function blankRow() { var r = DB.newRow(); r.gramsText = ""; r.adv = false; return r; }
  function newDraft(c) {
    var p = c.params, d = { date: DB.today, portions: "", rows: [], verdict: "belum", result: "", notes: "", next: "", source: { kind: "new" }, dirty: false, errors: false, saving: false, failed: false, seeded: c.state };
    var src = p.from ? DB.trial(p.recipeId, p.from) : null;
    var rec = DB.recipe(p.recipeId);
    if (p.mode === "base" && rec && rec.base) { d.portions = String(rec.basePortions); d.rows = rec.base.map(rowFrom); d.source = { kind: "base" }; }
    else if (p.mode === "copy" && src) { d.portions = String(src.portions); d.rows = src.rows.map(rowFrom); d.source = { kind: "copy", from: src.no }; }
    else if (p.mode === "scale" && p.scaled) { d.portions = String(p.scaled.b); d.rows = p.scaled.rows.map(rowFrom); d.source = { kind: "scale", from: p.from, a: p.scaled.a, b: p.scaled.b }; }
    else if (p.mode === "edit" && src) { d.date = src.date; d.portions = String(src.portions); d.rows = src.rows.map(rowFrom); d.verdict = src.verdict; d.result = src.result; d.notes = src.notes; d.next = src.next; d.source = src.source; }
    else d.rows = [blankRow()];
    if (c.state === "noflour") { var pc = DB.trial("r5", 1); d.portions = "6"; d.rows = pc.rows.map(rowFrom); d.source = { kind: "new" }; }
    if (c.state === "validation") {
      d.portions = ""; d.errors = true;
      d.rows = [Object.assign(blankRow(), { name: "Gula pasir", type: "", grams: 40, gramsText: "40" }), Object.assign(blankRow(), { name: "", type: "Tepung", grams: "", gramsText: "" })];
    }
    if (p.demo === "suggest") { d.rows = [Object.assign(blankRow(), { name: "Te" })]; }
    return d;
  }
  function draftOf(c) {
    var p = c.params;
    if (!p.draft || (["validation", "noflour"].indexOf(c.state) >= 0 && p.draft.seeded !== c.state) || (p.draft.seeded !== c.state && ["validation", "noflour"].indexOf(p.draft.seeded) >= 0)) p.draft = newDraft(c);
    return p.draft;
  }
  function D() { return App.top().params.draft; }
  function numRows(d) { return d.rows.map(function (r) { return { type: r.type, grams: Number(r.grams) || 0, water: r.water }; }); }
  function validRow(r) { return r.name.trim() && r.type && Number(r.grams) > 0; }

  /* ------------------------------------------------------------ row rendering */
  /* Two lines (D-031): name + grams, then type, baker's % and Lanjutan. The left rail holds the drag handle (line 1) and delete (line 2). */
  function rowHTML(r, i, d) {
    var m = L.metrics(numRows(d)), bad = d.errors, n = i + 1, id = r.id;
    var eName = bad && !r.name.trim() ? "Isi nama bahan" : "", eType = bad && !r.type ? "Pilih tipe" : "", eG = bad && !(Number(r.grams) > 0) ? "Jumlah harus lebih dari 0" : "";
    var def = r.type ? L.DEFAULT_WATER[r.type] : 0, wc = r.water === null || r.water === undefined ? def : r.water;
    var adv = isAdv(r);
    var pct = m.hasFlour && Number(r.grams) > 0 ? L.fmtPct(m.rowPct({ grams: Number(r.grams) })) : "—";
    var bl = r.dragDemo ? " is-dragging" : "";
    var inv = function (msg, k) { return msg ? ' aria-invalid="true" aria-describedby="' + k + id + '"' : ""; };
    var err = function (msg, k) { return msg ? '<span class="field__error" role="alert" id="' + k + id + '">' + ic("circle-alert", "icon--sm") + esc(msg) + "</span>" : ""; };
    var notes = (r.brand && !adv ? '<span class="ing__brand t-caption">' + esc(r.brand) + "</span>" : "") + err(eName, "en-") + err(eType, "et-") + err(eG, "eg-");
    return '<div class="ing' + (eName || eType || eG ? " is-invalid" : "") + bl + '" data-row="' + id + '" role="group" aria-label="Bahan ' + n + '"' + (r.dragDemo ? ' style="transform:translateY(-6px) rotate(-1deg) scale(1.02)"' : "") + ">" +
      '<span class="ing__handle" role="button" tabindex="0" aria-label="Urutkan bahan ' + n + ': geser, atau tekan panah atas dan bawah">' + ic("grip-vertical") + "</span>" +
      '<div class="ing__top"><div class="ing__main">' +
      '<div class="field ing__name' + (eName ? " is-error" : "") + '"><input class="input" id="n' + id + '" autocomplete="off" maxlength="60" placeholder="mis. Tepung terigu" aria-label="Nama bahan" value="' + esc(r.name) + '" data-in="ingName" data-id="' + id + '"' + inv(eName, "en-") + "></div>" +
      '<div class="field ing__grams' + (eG ? " is-error" : "") + '"><div class="gram"><input id="g' + id + '" inputmode="decimal" autocomplete="off" placeholder="0" value="' + esc(r.gramsText) + '" data-in="ingGrams" data-id="' + id + '" aria-label="Jumlah dalam gram"' + inv(eG, "eg-") + '><span class="gram__unit">g</span></div></div>' +
      '</div><div id="sg-' + id + '"></div></div>' +
      '<button class="btn-icon ing__del" data-act="ingDel" data-id="' + id + '" aria-label="Hapus bahan ' + esc(r.name || n) + '">' + ic("trash-2") + "</button>" +
      '<div class="ing__meta"><div class="field ing__type' + (eType ? " is-error" : "") + '"><button class="select" id="t' + id + '" data-act="ingType" data-id="' + id + '" aria-label="Tipe bahan"' + inv(eType, "et-") + '><span class="select__value' + (r.type ? "" : " is-empty") + '">' + (r.type || "Pilih tipe") + "</span>" + ic("chevron-down", "icon--sm") + "</button></div>" +
      '<span class="pct" data-pct="' + id + '" title="Baker\'s %">' + pct + "</span>" +
      '<button class="ing__toggle" data-act="ingAdv" data-id="' + id + '" aria-expanded="' + !!adv + '">' + ic("sliders-horizontal", "icon--sm") + "Lanjutan</button></div>" +
      (notes ? '<div class="ing__notes">' + notes + "</div>" : "") +
      (adv ? '<div class="ing__adv">' + h.field({ id: "b" + r.id, label: "Merek (opsional)", control: '<input class="input" id="b' + r.id + '" maxlength="60" value="' + esc(r.brand) + '" data-in="ingBrand" data-id="' + r.id + '">' }) +
        h.field({ id: "w" + r.id, label: "Kadar air", hint: r.type ? "Bawaan " + r.type + ": " + def + " %. Mengubah tipe mengembalikan nilai bawaan." : "Pilih tipe dulu", control: '<div class="gram"><input id="w' + r.id + '" inputmode="decimal" value="' + esc(L.fmtNum(wc)) + '" data-in="ingWater" data-id="' + r.id + '"><span class="gram__unit">%</span></div>' }) + "</div>" : "") + "</div>";
  }
  function isAdv(r) { var def = r.type ? L.DEFAULT_WATER[r.type] : 0, wc = r.water === null || r.water === undefined ? def : r.water; return !!(r.adv || (r.type && wc !== def)); }
  function rowsHTML(d) { return d.rows.map(function (r, i) { return rowHTML(r, i, d); }).join(""); }
  function renderRows() { var d = D(), box = $("#ed-rows"); if (box) { box.innerHTML = rowsHTML(d); updateMetrics(false); updateScaleBtn(); } }
  function updateMetrics(anim) {
    var d = D(), box = $("#ed-metrics"); if (!box) return;
    var m = L.metrics(numRows(d));
    box.outerHTML = h.metrics(numRows(d), "ed-metrics"); box = $("#ed-metrics");
    if (anim) { box.classList.remove("is-changing"); void box.offsetWidth; box.classList.add("is-changing"); }
    d.rows.forEach(function (r) { var el = $('[data-pct="' + r.id + '"]'); if (el) el.textContent = m.hasFlour && Number(r.grams) > 0 ? L.fmtPct(m.rowPct({ grams: Number(r.grams) })) : "—"; });
  }
  function updateScaleBtn() {
    var d = D(), b = $("#ed-scale"); if (!b) return;
    var ok = !isNaN(L.validPortions(d.portions)) && d.rows.some(validRow); b.disabled = !ok;
  }
  function rowById(id) { return D().rows.filter(function (r) { return r.id === id; })[0]; }
  function mark() { var d = D(); if (d) d.dirty = true; }

  /* ------------------------------------------------------------ screen */
  function heading(c) { var p = c.params; return p.mode === "edit" ? "Ubah Trial #" + p.from : "Trial baru"; }
  App.defineScreen({
    id: "S7", name: "Editor trial", group: "Resep", role: "both", stories: ["TRL-01", "TRL-02", "ING-01", "ING-02", "ING-03", "SCL-02", "CPY-01", "MET-01"], tag: "CR-01", tab: "resep",
    states: [["auto", "Data nyata"], ["validation", "Validasi"], ["noflour", "Tanpa tepung"], ["saving", "Menyimpan"], ["failure", "Gagal simpan"], ["guard", "Buang perubahan?"]],
    defaults: function () { return { recipeId: "r1", mode: "copy", from: 3 }; },
    render: function (c) {
      var p = c.params, r = DB.recipe(p.recipeId), d = draftOf(c);
      var saving = c.state === "saving" || d.saving, fail = c.state === "failure" || d.failed;
      var pOk = !isNaN(L.validPortions(d.portions)), ePort = d.errors && !pOk ? "Isi bilangan bulat 1 sampai 9.999" : "";
      var noRows = d.errors && !d.rows.length;
      var invalid = d.errors && (ePort || d.rows.some(function (x) { return !x.name.trim() || !x.type || !(Number(x.grams) > 0); }) || !d.rows.length);
      var html = h.appbar({ title: heading(c), back: "close", backAct: "edBack" }) + '<div class="pad stack" id="ed-form">' +
        '<div class="hstack" style="flex-wrap:wrap;gap:var(--s-2)"><span class="t-caption body-c">' + esc(r.name) + "</span>" + (d.source.kind !== "new" ? h.sourceBadge(d.source) : "") + "</div>" +
        (invalid ? '<div class="banner banner--error" role="alert">' + ic("circle-alert") + "<span>Periksa isian yang ditandai.</span></div>" : "") +
        (fail ? '<div class="banner banner--error" role="alert">' + ic("circle-alert") + "<span>" + (App.offline ? "Kamu sedang offline. Perubahan belum tersimpan." : "Gagal menyimpan.") + " Isianmu tetap ada, coba lagi.</span></div>" : "") +
        '<div class="grid2">' + h.field({ id: "ed-date", label: "Tanggal", control: '<button class="select" id="ed-date" data-act="edDate">' + '<span class="select__value">' + DB.fmtDate(d.date) + "</span>" + ic("calendar", "icon--sm") + "</button>" }) +
        h.field({ id: "ed-port", label: "Porsi", req: true, error: ePort, control: '<input class="input" id="ed-port" inputmode="numeric" autocomplete="off" placeholder="mis. 12" value="' + esc(d.portions) + '" data-in="edPortions">' }) + "</div>" +
        '<div class="sec"><div class="hstack hstack--between"><h2 class="section-title" style="margin:0">Bahan (gram)</h2><button class="btn btn--tonal btn--sm" id="ed-scale" data-act="edScale">' + ic("scaling", "icon--sm") + '<span class="btn__label">Skalakan</span></button></div>' +
        (otherTrials(r, p).length ? '<button class="btn btn--tonal btn--sm btn--block mt-2" data-act="edTakaran">' + ic("history", "icon--sm") + '<span class="btn__label">Pakai takaran dari trial sebelumnya</span></button>' : "") + "</div>" +
        '<div class="list" id="ed-rows">' + rowsHTML(d) + "</div>" +
        (noRows ? '<span class="field__error" role="alert">' + ic("circle-alert", "icon--sm") + "Tambahkan minimal 1 bahan</span>" : "") +
        '<button class="btn btn--secondary btn--block" data-act="ingAdd">' + ic("plus") + '<span class="btn__label">Tambah bahan</span></button>' +
        h.metrics(numRows(d), "ed-metrics") +
        '<div class="field field--section"><span class="field__label" id="vp-l">Verdict</span><div class="verdict-picker" role="group" aria-labelledby="vp-l">' + ["berhasil", "gagal", "belum"].map(function (v) { return '<button data-v="' + v + '" aria-pressed="' + (d.verdict === v) + '" data-act="edVerdict">' + ic(h.V[v].icon) + h.V[v].label + "</button>"; }).join("") + "</div></div>" +
        ta("ed-result", "Hasil", "Apa hasilnya dan kenapa kamu memberi verdict itu?", d.result, "edResult") + ta("ed-notes", "Catatan", "Catatan proses, suhu, waktu…", d.notes, "edNotes") + ta("ed-next", "Perubahan untuk trial berikutnya", "Apa yang mau kamu ubah?", d.next, "edNext") + "</div>";
      var footer = '<div class="actionbar"><button class="btn btn--primary' + (saving ? " is-loading" : "") + '" data-act="edSave" ' + (saving ? "disabled" : "") + '><span class="btn__label">Simpan trial</span></button></div>';
      return { html: html, footer: footer };
    },
    mount: function (c, root) {
      var d = c.params.draft; updateScaleBtn();
      if (c.state === "guard" && !d.guardShown) { d.guardShown = true; d.dirty = true; App.openConfirm("discard"); }
      if (c.params.demo === "suggest" && !d.sugShown) { d.sugShown = true; showSuggest(d.rows[0].id, "Te"); }
      if (c.params.demo === "drag" && !d.dragShown) { d.dragShown = true; d.rows[1] && (d.rows[1].dragDemo = true); renderRows(); }
    }
  });
  function ta(id, label, ph, val, key) {
    return '<div class="field"><label class="field__label" for="' + id + '">' + label + '</label><textarea class="textarea" id="' + id + '" maxlength="' + MAX + '" placeholder="' + esc(ph) + '" data-in="' + key + '">' + esc(val) + '</textarea><span class="textarea__count" id="cnt-' + id + '">' + L.fmtNum(val.length, 0) + " / " + L.fmtNum(MAX, 0) + "</span></div>";
  }
  function cnt(id, el) { var c = $("#cnt-" + id); if (c) c.textContent = L.fmtNum(el.value.length, 0) + " / " + L.fmtNum(MAX, 0); }
  App.inp("edResult", function (el) { D().result = el.value; mark(); cnt("ed-result", el); });
  App.inp("edNotes", function (el) { D().notes = el.value; mark(); cnt("ed-notes", el); });
  App.inp("edNext", function (el) { D().next = el.value; mark(); cnt("ed-next", el); });
  App.inp("edPortions", function (el) { D().portions = el.value.replace(/[^\d]/g, ""); mark(); updateScaleBtn(); });
  App.act("edVerdict", function (el) { D().verdict = el.dataset.v; mark(); $$(".verdict-picker button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === el)); }); });
  App.act("edBack", function () { if (D().dirty) App.openConfirm("discard"); else App.back(); });
  App.act("edDate", function () { var d = D(); App.pickDate(d.date, function (iso) { d.date = iso; mark(); App.render(); }); });

  /* ------------------------------------------------------------ ingredient rows */
  App.inp("ingName", function (el) { var r = rowById(el.dataset.id); r.name = el.value; mark(); showSuggest(r.id, el.value); });
  App.inp("ingBrand", function (el) { rowById(el.dataset.id).brand = el.value; mark(); });
  App.inp("ingGrams", function (el) { var r = rowById(el.dataset.id); r.gramsText = el.value; var v = L.parseNum(el.value); r.grams = isNaN(v) ? "" : v; mark(); updateMetrics(true); updateScaleBtn(); });
  App.inp("ingWater", function (el) { var r = rowById(el.dataset.id), v = L.parseNum(el.value); r.water = isNaN(v) ? null : Math.min(100, v); mark(); updateMetrics(true); });
  App.act("ingAdv", function (el) { var r = rowById(el.dataset.id); r.adv = !isAdv(r); renderRows(); });
  App.act("ingType", function (el) {
    var r = rowById(el.dataset.id);
    App.pickType(r.type, function (t) { r.type = t; r.water = null; mark(); renderRows(); });
  });
  App.act("ingAdd", function () { var d = D(), r = blankRow(); d.rows.push(r); mark(); renderRows(); var f = $("#n" + r.id); if (f) { f.focus(); f.scrollIntoView({ block: "center" }); } });
  App.act("ingDel", function (el) {
    var d = D(), i = d.rows.map(function (r) { return r.id; }).indexOf(el.dataset.id); if (i < 0) return;
    var gone = d.rows.splice(i, 1)[0]; mark(); renderRows();
    App.snack("Bahan “" + (gone.name || "tanpa nama") + "” dihapus", { action: "Urungkan", fn: function () { if (App.top().id !== "S7") return; d.rows.splice(Math.min(i, d.rows.length), 0, gone); renderRows(); } });
  });
  function names() {
    var map = {};
    DB.recipesOf(App.user.id).forEach(function (r) { r.trials.forEach(function (t) { t.rows.forEach(function (x) { var k = x.name.trim().toLowerCase(); if (!k) return; var e = map[k] = map[k] || { name: x.name, n: 0, type: x.type, water: x.water }; e.n++; e.type = x.type; e.water = x.water; }); }); });
    return Object.keys(map).map(function (k) { return map[k]; });
  }
  function showSuggest(id, q) {
    var box = $("#sg-" + id); if (!box) return;
    q = (q || "").trim().toLowerCase();
    if (q.length < 2) { box.innerHTML = ""; return; }
    var list = names().filter(function (e) { return e.name.toLowerCase().indexOf(q) >= 0 && e.name.toLowerCase() !== q; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 8);
    box.innerHTML = list.length ? '<div class="suggest" role="listbox" style="margin-top:var(--s-1)">' + list.map(function (e) {
      return '<button role="option" data-act="sgPick" data-id="' + id + '" data-name="' + esc(e.name) + '" data-type="' + e.type + '" data-water="' + e.water + '"><span>' + esc(e.name) + '</span><span class="hint">' + e.type + (e.water !== L.DEFAULT_WATER[e.type] ? " · " + e.water + " %" : "") + "</span></button>";
    }).join("") + "</div>" : "";
  }
  App.act("sgPick", function (el) {
    var r = rowById(el.dataset.id); r.name = el.dataset.name; r.type = el.dataset.type; var w = Number(el.dataset.water); r.water = w === L.DEFAULT_WATER[r.type] ? null : w; mark(); renderRows();
    var f = $("#g" + r.id); if (f) f.focus();
  });
  document.addEventListener("focusout", function (e) { if (e.target && e.target.matches && e.target.matches('[data-in="ingName"]')) { var id = e.target.dataset.id; setTimeout(function () { var b = $("#sg-" + id); if (b && !(App.top().params.demo === "suggest")) b.innerHTML = ""; }, 200); } });

  /* drag to reorder (pointer) and keyboard alternative */
  var drag = null;
  document.addEventListener("pointerdown", function (e) {
    var hd = e.target.closest && e.target.closest(".ing__handle"); if (!hd || App.top().id !== "S7") return;
    var el = hd.closest(".ing"), box = $("#ed-rows"); e.preventDefault();
    var rect = el.getBoundingClientRect(); drag = { el: el, box: box, grab: e.clientY - rect.top }; el.classList.add("is-dragging");
  });
  document.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var el = drag.el; el.style.transform = "none";
    var sibs = $$(".ing", drag.box).filter(function (x) { return x !== el; }), y = e.clientY, before = null;
    for (var i = 0; i < sibs.length; i++) { var r = sibs[i].getBoundingClientRect(); if (y < r.top + r.height / 2) { before = sibs[i]; break; } }
    if (before) drag.box.insertBefore(el, before); else drag.box.appendChild(el);
    var nat = el.getBoundingClientRect().top, want = y - drag.grab;
    el.style.transform = "translateY(" + ((want - nat) / App.scale) + "px) rotate(-1deg) scale(1.02)";
  });
  function endDrag() {
    if (!drag) return; var d = D(), order = $$(".ing", drag.box).map(function (x) { return x.dataset.row; });
    d.rows.sort(function (a, b) { return order.indexOf(a.id) - order.indexOf(b.id); }); drag = null; mark(); renderRows();
  }
  document.addEventListener("pointerup", endDrag); document.addEventListener("pointercancel", endDrag);
  document.addEventListener("keydown", function (e) {
    var hd = e.target.closest && e.target.closest(".ing__handle"); if (!hd || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
    e.preventDefault(); var d = D(), id = hd.closest(".ing").dataset.row, i = d.rows.map(function (r) { return r.id; }).indexOf(id), j = i + (e.key === "ArrowUp" ? -1 : 1);
    if (j < 0 || j >= d.rows.length) return; var t = d.rows[i]; d.rows[i] = d.rows[j]; d.rows[j] = t; mark(); renderRows();
    var nh = $('.ing[data-row="' + id + '"] .ing__handle'); if (nh) nh.focus();
  });

  /* ------------------------------------------------------------ save */
  App.act("edSave", function () {
    var c = App.ctx(App.top()), p = c.params, d = p.draft, r = DB.recipe(p.recipeId);
    App.states.S7 = "auto"; d.failed = false;
    var ok = !isNaN(L.validPortions(d.portions)) && d.rows.length && d.rows.every(validRow);
    if (!ok) { d.errors = true; App.render(); var first = $(".is-invalid, .is-error"); if (first) first.scrollIntoView({ block: "center" }); return; }
    if (p.mode === "edit" && r.stableNo === p.from && d.verdict !== "berhasil") { App.openConfirm("stableVerdict", { onOk: function () { commit(true); } }); return; }
    commit(false);
  });
  function commit(dropStable) {
    var c = App.ctx(App.top()), p = c.params, d = p.draft, r = DB.recipe(p.recipeId);
    d.saving = true; App.render();
    setTimeout(function () {
      d.saving = false;
      if (App.offline) { d.failed = true; App.render(); return; }
      var rows = d.rows.map(function (x) { var wc = x.water === null || x.water === undefined ? L.DEFAULT_WATER[x.type] : x.water; return { id: x.id, name: x.name.trim(), brand: x.brand.trim(), type: x.type, grams: Number(x.grams), water: wc }; });
      var data = { date: d.date, portions: Number(d.portions), verdict: d.verdict, rows: rows, result: d.result, notes: d.notes, next: d.next, source: d.source };
      if (p.mode === "edit") {
        var t = DB.trial(r.id, p.from); Object.assign(t, data); if (dropStable) r.stableNo = null; r.updated = DB.today; App.back(); App.snack("Trial #" + t.no + " diperbarui", { icon: "circle-check" });
      } else {
        var n = DB.addTrial(r.id, Object.assign({ no: 0 }, data)); App.go("S8", { recipeId: r.id, no: n.no }, { replace: true }); App.snack("Trial #" + n.no + " tersimpan", { icon: "circle-check" });
      }
    }, 800);
  }
  App.commitTrial = commit;

  /* ------------------------------------------------------------ S9 Scale sheet */
  var SC = null;
  function scaleBody() {
    var t = SC.target, n = L.validPortions(t), bad = isNaN(n), s = bad ? null : L.scale(SC.rows, SC.portions, n);
    var tiny = s && s.rows.some(function (r) { return r.tooSmall; });
    return '<div class="hstack hstack--between"><span class="t-caption body-c">' + SC.portions + ' porsi sekarang</span><span class="scale-factor" aria-live="polite">× ' + (bad ? "—" : L.fmtNum(s.factor, 2)) + "</span></div>" +
      (bad ? "" : '<div class="mt-2">' + s.rows.map(function (r, i) { return '<div class="scale-row' + (r.tooSmall ? " is-warn" : "") + '"><span>' + esc(SC.rows[i].name) + '</span><span class="from">' + L.fmtG(SC.rows[i].grams) + '</span><span aria-hidden="true">→</span><span class="to">' + (r.tooSmall ? "&lt; 0,01 g" : L.fmtG(r.grams)) + "</span></div>"; }).join("") + "</div>") +
      (tiny ? '<div class="banner banner--warn mt-2">' + ic("triangle-alert") + "<span>Ada bahan yang hasilnya kurang dari 0,01 g.</span></div>" : "") +
      '<p class="hint-card mt-4" style="margin-bottom:0">' + ic("info", "icon--sm") + "<span>Semua tetap dalam gram. Baker's % dan hidrasi tidak berubah. <span class=\"badge badge--cr\">CR-01</span></span></p>";
  }
  function scaleShell() {
    var bad = isNaN(L.validPortions(SC.target));
    return '<h4 class="sheet__title">Skalakan resep</h4><div class="stack">' +
      h.field({ id: "sc-t", label: "Porsi tujuan", error: bad ? "Isi bilangan bulat 1 sampai 9.999" : "", control: '<input class="input" id="sc-t" inputmode="numeric" autocomplete="off" value="' + esc(SC.target) + '" data-in="scTarget">' }) +
      '<div id="sc-body">' + scaleBody() + "</div>" +
      '<button class="btn btn--primary btn--block" id="sc-go" data-act="scGo" ' + (bad ? "disabled" : "") + '><span class="btn__label">' + (SC.mode === "editor" ? "Gunakan" : "Gunakan sebagai trial baru") + "</span></button></div>";
  }
  App.openScale = function (o) {
    SC = { rows: o.rows, portions: o.portions, mode: o.mode, recipeId: o.recipeId, no: o.no, target: String(o.target !== undefined ? o.target : o.portions * 2) };
    App.sheet(scaleShell());
  };
  App.inp("scTarget", function (el) {
    SC.target = el.value; var bad = isNaN(L.validPortions(el.value));
    $("#sc-body").innerHTML = scaleBody(); $("#sc-go").disabled = bad; var f = el.closest(".field"); f.classList.toggle("is-error", bad);
    var er = f.querySelector(".field__error"); if (bad && !er) f.insertAdjacentHTML("beforeend", '<span class="field__error" role="alert">' + ic("circle-alert", "icon--sm") + "Isi bilangan bulat 1 sampai 9.999</span>"); if (!bad && er) er.remove();
  });
  function otherTrials(r, p) { return r.trials.filter(function (t) { return !(p.mode === "edit" && t.no === p.from); }); }
  // Take the grams (and brand, water content) of a previous trial of the same recipe: rows are matched by name; the portions follow that trial.
  App.applyQuantities = function (no) {
    var p = App.top().params, d = D(), t = DB.trial(p.recipeId, no), used = {}, hit = 0;
    var key = function (n) { return String(n).trim().toLowerCase(); };
    d.rows.forEach(function (r) {
      var m = t.rows.filter(function (x, i) { return key(x.name) === key(r.name) && !used[i]; })[0];
      if (!m) return; used[t.rows.indexOf(m)] = true; hit++;
      r.grams = m.grams; r.gramsText = L.fmtNum(m.grams); r.brand = m.brand || r.brand;
      var def = r.type ? L.DEFAULT_WATER[r.type] : 0; r.water = m.water === def ? null : m.water;
    });
    var extra = t.rows.filter(function (x, i) { return !used[i]; });
    extra.forEach(function (x) { d.rows.push(rowFrom(x)); });
    d.portions = String(t.portions); d.source = { kind: "copy", from: no }; mark(); App.render();
    App.snack("Takaran Trial #" + no + " dipakai: " + hit + " bahan diisi" + (extra.length ? ", " + extra.length + " ditambah" : ""), { icon: "history" });
  };
  App.act("edTakaran", function () {
    var p = App.top().params;
    App.pickTrial({ recipeId: p.recipeId, title: "Pakai takaran dari…", noTag: true, exclude: p.mode === "edit" ? [p.from] : [], onPick: function (n) { App.applyQuantities(n); } });
  });
  App.act("edScale", function () {
    var d = D(), n = L.validPortions(d.portions), rows = d.rows.filter(validRow).map(function (r) { return { name: r.name, type: r.type, grams: Number(r.grams) }; });
    if (isNaN(n) || !rows.length) return;
    App.openScale({ rows: rows, portions: n, mode: "editor" });
  });
  App.act("scGo", function () {
    var n = L.validPortions(SC.target); if (isNaN(n)) return; var s = L.scale(SC.rows, SC.portions, n); App.closeOvl();
    if (SC.mode === "detail") App.go("S7", { recipeId: SC.recipeId, mode: "scale", from: SC.no, scaled: { rows: s.rows, a: SC.portions, b: n } });
    else {
      var d = D(), a = SC.portions, from = d.source.from;
      var k = 0;
      d.rows.forEach(function (r) { if (validRow(r)) { var q = s.rows[k++]; r.grams = q.grams; r.gramsText = L.fmtNum(q.grams); } });
      d.portions = String(n); if (from) d.source = { kind: "scale", from: from, a: d.source.kind === "scale" ? d.source.a : a, b: n }; mark(); App.render();
    }
  });
  App.defineOverlay({
    id: "S9", name: "Skalakan (sheet)", group: "Resep", stories: ["SCL-01", "SCL-02"],
    variants: [["valid", "Pratinjau valid"], ["invalid", "Porsi tidak valid"], ["tiny", "Hasil < 0,01"], ["editor", "Dari editor"]],
    demo: function (v) {
      v = v || "valid"; App.activeOverlay = { id: "S9", variant: v };
      if (v === "editor") { App.jump("S7", { recipeId: "r1", mode: "copy", from: 3 }); var t = DB.trial("r1", 3); App.activeOverlay = { id: "S9", variant: v }; App.openScale({ rows: t.rows, portions: 12, mode: "editor", target: 30 }); return; }
      App.jump("S8"); var tr = DB.trial("r1", 3); App.activeOverlay = { id: "S9", variant: v };
      if (v === "tiny") App.openScale({ rows: [{ name: "Tepung terigu", type: "Tepung", grams: 500 }, { name: "Telur", type: "Telur", grams: 150 }, { name: "Ragi instan", type: "Ragi", grams: 0.3 }], portions: 100, mode: "detail", recipeId: "r1", no: 3, target: 1 });
      else App.openScale({ rows: tr.rows, portions: 12, mode: "detail", recipeId: "r1", no: 3, target: v === "invalid" ? "0" : 30 });
    }
  });
})();
