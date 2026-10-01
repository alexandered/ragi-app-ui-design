/* PDF-01: A4 report layout (window.reportHTML, also used by report.html for printing) and S10 PDF Preview / Share. */
(function () {
  "use strict";
  var DB = window.DB, L = window.RAGI;
  function esc(s) { return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var VL = { berhasil: "Berhasil", gagal: "Gagal", belum: "Belum dinilai" };
  function src(s) { return !s || s.kind === "new" ? "Trial baru" : s.kind === "base" ? "Dari bahan resep" : s.kind === "copy" ? "Salinan Trial #" + s.from : "Skala dari Trial #" + s.from + ": " + s.a + " → " + s.b + " porsi"; }
  function pascal(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).map(function (w) { return w[0].toUpperCase() + w.slice(1); }).join(""); }

  window.reportFileName = function (rid, no) {
    var r = DB.recipe(rid), u = DB.ownerOf(r);
    return "RAGI_" + pascal(u.name) + "_" + pascal(r.name) + "_Trial" + no + "_" + DB.today.replace(/-/g, "") + ".pdf";
  };
  window.reportHTML = function (rid, no, o) {
    o = o || {};
    var r = DB.recipe(rid), t = DB.trial(rid, no), u = DB.ownerOf(r), m = L.metrics(t.rows), stable = r.stableNo === t.no;
    var rows = t.rows.map(function (x, i) {
      return "<tr><td>" + (i + 1) + "</td><td>" + esc(x.name) + "</td><td>" + esc(x.brand || "—") + "</td><td>" + x.type + '</td><td class="num">' + L.fmtNum(x.grams) + '</td><td class="num">' + (m.hasFlour ? L.fmtPct(m.rowPct(x)) : "—") + "</td></tr>";
    }).join("");
    var metric = function (l, v) { return "<div><b>" + v + "</b><span>" + l + "</span></div>"; };
    var met = '<div class="rp-metrics">' + metric("Berat adonan", L.fmtG(m.dough)) + metric("Total tepung", m.hasFlour ? L.fmtG(m.flour) : "—") + metric("Total air", L.fmtG(m.water)) + metric("Hidrasi", m.hasFlour ? L.fmtPct(m.hydration) : "—") +
      metric("Lemak", m.hasFlour ? L.fmtPct(m.fat) : "—") + metric("Gula", m.hasFlour ? L.fmtPct(m.sugar) : "—") + metric("Garam", m.hasFlour ? L.fmtPct(m.salt) : "—") + metric("Ragi", m.hasFlour ? L.fmtPct(m.yeast) : "—") + "</div>" +
      (m.hasFlour ? "" : '<p style="margin-top:2mm;font-size:9pt;color:var(--c-muted)">Tambahkan bahan bertipe Tepung untuk menghitung baker\'s %</p>');
    var sect = function (title, text) { return "<h2>" + title + "</h2><p>" + (text ? esc(text) : '<span style="color:var(--c-muted);font-style:italic">Belum diisi</span>') + "</p>"; };
    return '<div class="a4"><div class="rp-head"><img src="' + (o.base || "") + 'assets/ragi-wordmark.png" alt="RAGI Academy"><h1>Laporan Trial Resep</h1></div>' +
      "<h2>Siswa</h2><dl><dt>Nama</dt><dd>" + esc(u.name) + "</dd><dt>Email</dt><dd>" + esc(u.email) + "</dd></dl>" +
      "<h2>Resep</h2><dl><dt>Nama resep</dt><dd>" + esc(r.name) + "</dd><dt>Kategori</dt><dd>" + esc(r.category) + "</dd></dl>" +
      "<h2>Trial</h2><dl><dt>Nomor trial</dt><dd>Trial #" + t.no + "</dd><dt>Tanggal</dt><dd>" + DB.fmtDate(t.date) + "</dd><dt>Porsi</dt><dd>" + t.portions + '</dd><dt>Verdict</dt><dd><span class="rp-verdict rp-verdict--' + t.verdict + '">' + VL[t.verdict] + "</span></dd><dt>Stable Trial</dt><dd>" + (stable ? '<span class="rp-verdict rp-verdict--stable">Ya, Stable Trial</span>' : "Bukan") + "</dd><dt>Sumber</dt><dd>" + esc(src(t.source)) + "</dd></dl>" +
      '<h2>Bahan dan jumlah</h2><table><thead><tr><th>No</th><th>Bahan</th><th>Merek</th><th>Tipe</th><th class="num">Jumlah (g)</th><th class="num">Baker\'s %</th></tr></thead><tbody>' + rows + "</tbody></table>" +
      "<h2>Metrik adonan</h2>" + met + sect("Hasil trial", t.result) + sect("Catatan / jurnal", t.notes) + sect("Perubahan untuk trial berikutnya", t.next) +
      '<div class="rp-foot"><span>Dibuat ' + DB.fmtDate(DB.today) + ", 09:41</span><span>Halaman 1 dari 1</span></div></div>";
  };

  if (!window.App) return;
  var App = window.App, h = App.h, ic = App.ic;
  App.defineScreen({
    id: "S10", name: "Pratinjau PDF / bagikan", group: "Resep", role: "both", stories: ["PDF-01"], tab: "resep",
    states: [["auto", "Siap"], ["generating", "Membuat PDF"], ["error", "Gagal membuat"]],
    defaults: function () { return { recipeId: "r1", no: 3 }; },
    render: function (c) {
      var p = c.params, bar = h.appbar({ title: "Laporan PDF", back: "close" });
      var st = c.state === "auto" && !p.ready && !p.seen ? "generating" : c.state;
      if (st === "generating") return bar + '<div class="empty"><div class="spinner" role="status" aria-label="Membuat PDF"></div><h4 class="empty__title">Membuat PDF…</h4><p class="empty__body">Sebentar ya, laporanmu sedang disusun.</p></div>';
      if (st === "error") return bar + '<div class="pad">' + h.empty({ icon: "circle-alert", danger: true, title: "Gagal membuat PDF", body: "Terjadi masalah saat menyusun laporan. Coba lagi.", cta: { label: "Coba lagi", act: "pdfRetry", kind: "secondary", icon: "refresh-cw" } }) + "</div>";
      var t = DB.trial(p.recipeId, p.no);
      return bar + '<div class="pad stack"><div class="hint-card">' + ic("info", "icon--sm") + '<span>Kirim PDF ini ke Chef lewat WhatsApp, email, atau Files. Chef membacanya langsung dari PDF, tanpa akun atau aplikasi.</span></div><div class="text-card"><h3>Nama berkas</h3><p style="font:600 var(--t-caption-size)/var(--t-caption-line) var(--font-heading);word-break:break-all">' + window.reportFileName(p.recipeId, p.no) + '</p></div></div>' +
        '<div class="a4-wrap mt-4"><div class="a4-scale">' + window.reportHTML(p.recipeId, p.no) + '</div></div><p class="pad t-caption muted center mt-2" id="pv-cap">Pratinjau halaman 1 · A4 tegak · dibuat di perangkat</p>' +
        '<div class="pad stack mt-4"><button class="btn btn--primary btn--block" data-act="pdfShare">' + ic("share-2") + '<span class="btn__label">Bagikan</span></button><a class="btn btn--secondary btn--block" href="report.html?r=' + p.recipeId + "&n=" + p.no + '" target="_blank" rel="noopener">' + ic("download") + '<span class="btn__label">Buka versi cetak A4</span></a></div>';
    },
    mount: function (c) {
      var p = c.params, a = App.$(".a4");
      if (a) { var n = Math.max(1, Math.ceil((a.scrollHeight - 3) / (297 * 3.7795))), cap = App.$("#pv-cap"); if (cap) cap.textContent = "Pratinjau halaman 1 dari " + n + " · A4 tegak · dibuat di perangkat"; var f = a.querySelector(".rp-foot span:last-child"); if (f) f.textContent = "Halaman 1 dari " + n; }
      if (c.state === "auto" && !p.ready && !p.seen) { clearTimeout(App.timers.pdf); App.timers.pdf = setTimeout(function () { if (App.top() === App.stack[App.stack.length - 1] && App.top().id === "S10") { p.seen = true; App.render(); } }, 1100); }
    }
  });
  App.act("pdfRetry", function () { App.states.S10 = "generating"; App.render(); setTimeout(function () { App.states.S10 = "auto"; App.top().params.seen = true; App.render(); }, 1100); });
  App.act("pdfShare", function () { App.snack("Lembar berbagi perangkat terbuka (WhatsApp, email, Files)", { icon: "share-2", ms: 4000 }); });
})();
