/* S19 Compare Trials [CR-02]. Both roles; read-only for the Chef. Story: CMP-01, CHF-03. Logic in 02_Design_System/reference/logic.js (compare). */
(function () {
  "use strict";
  var App = window.App, DB = window.DB, L = window.RAGI, h = App.h, ic = App.ic, esc = App.esc;

  function pair(c) {
    var p = c.params, st = c.state, r = DB.recipe(p.recipeId) || DB.recipe("r1"), a = DB.trial(r.id, p.a), b = DB.trial(r.id, p.b);
    if (st === "auto" && p.demoPair) { a = DB.trial("r1", 3); b = DB.trial("r1", 5); r = DB.recipe("r1"); }
    if (st === "nodiff") { r = DB.recipe("r1"); a = DB.trial("r1", 3); b = DB.clone(a); b.no = 9; }
    if (st === "portionsdiff") { r = DB.recipe("r1"); a = DB.trial("r1", 3); b = DB.trial("r1", 4); }
    if (!a || !b) { r = DB.recipe("r1"); a = DB.trial("r1", 3); b = DB.trial("r1", 5); }
    if (p.swap) { var x = a; a = b; b = x; }
    return { r: r, a: a, b: b };
  }
  /* The title bar (trial numbers) is its own sticky row, so the columns stay named while the table scrolls; verdict, Stable and date sit under it and scroll away. */
  function title(t) { return "<span>Trial #" + t.no + "</span>"; }
  function meta(t, r) {
    return '<div class="cmp__col-meta">' + h.vbadge(t.verdict) + (r.stableNo === t.no ? h.stableBadge() : "") + '<span class="cmp__when">' + DB.fmtDate(t.date) + " · " + t.portions + " porsi</span></div>";
  }
  /* What changed, as a short list before the table: one entry per changed ingredient. When the portions differ the grams are not comparable, so it falls back to baker's %. */
  function changes(cmp, nA, nB) {
    var useG = !cmp.portionsDiffer, out = [];
    cmp.rows.forEach(function (x) {
      if (!x.changed) return;
      var d;
      if (x.onlyIn) d = "hanya di Trial #" + (x.onlyIn === "A" ? nA : nB);
      else if (useG && x.dGrams) d = L.fmtDiff(x.dGrams, "g");
      else if (x.dPct) d = L.fmtDiff(x.dPct, "pp");
      else if (x.a.type !== x.b.type) d = "tipe berubah";
      else if ((x.a.brand || "") !== (x.b.brand || "")) d = "merek berubah";
      else if ((x.a.water || 0) !== (x.b.water || 0)) d = "kadar air berubah";
      else return; // the grams differ only because the portions do; the baker's % is the same
      out.push({ name: x.name, d: d });
    });
    return out;
  }
  function summary(list) {
    if (!list.length) return "";
    var MAX = 6;
    return '<section class="cmp-sum" aria-labelledby="cmp-sum-t"><h2 class="cmp-sum__title" id="cmp-sum-t">' + list.length + ' bahan berubah</h2><ul class="cmp-sum__list">' +
      list.slice(0, MAX).map(function (c) { return '<li class="cmp-sum__item"><span>' + esc(c.name) + "</span><b>" + c.d + "</b></li>"; }).join("") +
      (list.length > MAX ? '<li class="cmp-sum__item cmp-sum__item--more">+' + (list.length - MAX) + " lainnya</li>" : "") + "</ul></section>";
  }
  function cell(v, unit) { return v === null || v === undefined || isNaN(v) ? '<div class="cmp__cell is-none">—</div>' : '<div class="cmp__cell">' + (unit === "g" ? L.fmtG(v) : L.fmtPct(v)) + "</div>"; }
  function metricRow(label, va, vb, d, unit, only) {
    var ch = d !== null && d !== 0; if (only && !ch) return "";
    return '<div class="cmp__row' + (ch ? " is-changed" : " is-same") + '"><div class="cmp__name">' + label + (ch ? '<span class="cmp__diff">' + L.fmtDiff(d, unit === "g" ? "g" : "pp") + "</span>" : "") + "</div>" + cell(va, unit) + cell(vb, unit) + "</div>";
  }
  function ingRow(x, ta, tb, nA, nB) {
    var cellI = function (r, p) { return r ? '<div class="cmp__cell">' + L.fmtG(r.grams) + "<small>" + (p === null ? "—" : L.fmtPct(p)) + "</small></div>" : '<div class="cmp__cell is-none">—</div>'; };
    var tag = x.onlyIn ? '<span class="cmp__only">Hanya di Trial #' + (x.onlyIn === "A" ? nA : nB) + "</span>" : x.changed && x.dGrams !== null && (x.dGrams !== 0 || (x.dPct !== null && x.dPct !== 0)) ? '<span class="cmp__diff">' + L.fmtDiff(x.dGrams, "g") + (x.dPct !== null ? " · " + L.fmtDiff(x.dPct, "pp") : "") + "</span>" : "";
    var more = [];
    if (x.a && x.b) {
      if ((x.a.brand || "") !== (x.b.brand || "")) more.push("Merek: " + esc(x.a.brand || "—") + " → " + esc(x.b.brand || "—"));
      if (x.a.type !== x.b.type) more.push("Tipe: " + x.a.type + " → " + x.b.type);
      if (x.a.water !== x.b.water) more.push("Kadar air: " + L.fmtNum(x.a.water) + " % → " + L.fmtNum(x.b.water) + " %");
    }
    return '<div class="cmp__row' + (x.changed ? " is-changed" : " is-same") + '"><div class="cmp__name"><span>' + esc(x.name) + "</span>" + tag + "</div>" + cellI(x.a, x.pctA) + cellI(x.b, x.pctB) +
      (more.length ? '<div style="grid-column:1/-1;font:500 var(--t-caption-size)/var(--t-caption-line) var(--font-heading);color:var(--c-gold-deep)">' + more.join(" · ") + "</div>" : "") + "</div>";
  }
  function text2(title, a, b) {
    var blk = function (t, v) { return '<div><div class="t-caption" style="font-weight:700">Trial #' + t.no + "</div>" + (v ? "<p>" + esc(v) + "</p>" : '<p class="none">Belum diisi</p>') + "</div>"; };
    return '<div class="text-card"><h3>' + title + '</h3><div class="stack--sm stack">' + blk(a, a.text) + '<hr class="divider" style="margin:var(--s-1) 0">' + blk(b, b.text) + "</div></div>";
  }

  App.defineScreen({
    id: "S19", name: "Bandingkan trial", group: "Resep", role: "both", stories: ["CMP-01", "CHF-03"], tag: "CR-02", tabbar: true, tab: "resep",
    states: [["auto", "Trial #3 vs #5"], ["nodiff", "Tanpa perbedaan"], ["portionsdiff", "Porsi berbeda"], ["onetrial", "Hanya 1 trial"], ["loading", "Memuat"], ["error", "Error"]],
    defaults: function () { return { recipeId: "r1", a: 3, b: 5, demoPair: true }; },
    render: function (c) {
      var bar = h.appbar({ title: "Bandingkan", back: true, right: '<span class="badge badge--cr" style="margin-right:var(--s-3)">CR-02</span>' });
      if (c.state === "loading") return bar + '<div class="mt-2">' + h.skeletons(4, 96) + "</div>";
      if (c.state === "error") return bar + h.errorBlock();
      if (c.state === "onetrial") return bar + '<div class="pad">' + h.empty({ icon: "git-compare", title: "Belum bisa dibandingkan", body: "Resep ini baru punya satu trial. Buat satu trial lagi untuk membandingkan." }) + "</div>";
      var p = pair(c), a = p.a, b = p.b, r = p.r, cmp = L.compare(a, b), only = !!c.params.onlyDiff;
      var changedAny = cmp.rows.some(function (x) { return x.changed; }) || ["dough", "flour", "hydration", "fat", "sugar", "salt", "yeast"].some(function (k) { return cmp.diff[k] !== 0 && cmp.diff[k] !== null; });
      var M = App.METRIC_LABELS, ta = cmp.ta, tb = cmp.tb, d = cmp.diff;
      var metrics = metricRow(M.dough, ta.dough, tb.dough, d.dough, "g", only) + metricRow(M.flour, ta.flour, tb.flour, d.flour, "g", only) + metricRow(M.hydration, ta.hydration, tb.hydration, d.hydration, "%", only) + metricRow(M.fat, ta.fat, tb.fat, d.fat, "%", only) + metricRow(M.sugar, ta.sugar, tb.sugar, d.sugar, "%", only) + metricRow(M.salt, ta.salt, tb.salt, d.salt, "%", only) + metricRow(M.yeast, ta.yeast, tb.yeast, d.yeast, "%", only);
      var ings = cmp.rows.filter(function (x) { return !only || x.changed; }).map(function (x) { return ingRow(x, ta, tb, a.no, b.no); }).join("");
      return bar + '<div class="pad stack"><div class="hstack hstack--between" style="flex-wrap:wrap"><button class="btn btn--tonal btn--sm" data-act="cmpSwap">' + ic("arrow-left-right", "icon--sm") + '<span class="btn__label">Tukar</span></button><button class="chip" aria-pressed="' + only + '" data-act="cmpOnly">Hanya tampilkan perbedaan</button></div>' +
        (cmp.portionsDiffer ? '<div class="banner banner--warn">' + ic("triangle-alert") + "<span>Porsi berbeda (" + a.portions + " vs " + b.portions + "): bandingkan baker's %, bukan gram</span></div>" : "") +
        (!changedAny ? '<div class="banner banner--info">' + ic("info") + "<span>Tidak ada perbedaan antara kedua trial.</span></div>" : "") +
        summary(changes(cmp, a.no, b.no)) +
        '<div class="cmp"><div class="cmp__titles">' + title(a) + title(b) + '</div><div class="cmp__meta">' + meta(a, r) + meta(b, r) + "</div>" + '<div class="cmp__row" style="background:var(--c-gold-tint)"><div class="cmp__name t-overline" style="font-size:var(--t-overline-size)">Metrik adonan <span class="badge badge--cr">CR-01</span></div></div>' + (metrics || '<div class="cmp__row"><div class="cmp__name muted">Semua metrik sama</div></div>') +
        '<div class="cmp__row" style="background:var(--c-gold-tint)"><div class="cmp__name t-overline" style="font-size:var(--t-overline-size)">Bahan</div></div>' + (ings || '<div class="cmp__row"><div class="cmp__name muted">Semua bahan sama</div></div>') + "</div>" +
        text2("Hasil", { no: a.no, text: a.result }, { no: b.no, text: b.result }) + text2("Catatan", { no: a.no, text: a.notes }, { no: b.no, text: b.notes }) + text2("Perubahan untuk trial berikutnya", { no: a.no, text: a.next }, { no: b.no, text: b.next }) + "</div>";
    }
  });
  App.act("cmpSwap", function () { var p = App.top().params; p.swap = !p.swap; App.render(); });
  App.act("cmpOnly", function () { var p = App.top().params; p.onlyDiff = !p.onlyDiff; App.render(); });
})();
