/* S18 Global states: offline banner, session expired, generic error (inline and full screen), force logout. Stories: BR-04, AUTH-01. */
(function () {
  "use strict";
  var App = window.App, h = App.h, ic = App.ic;
  App.defineScreen({
    id: "S18", name: "Status global", group: "Akun", role: "both", stories: ["BR-04", "AUTH-01"], tabbar: true, tab: "profil",
    states: [["auto", "Galeri"], ["error", "Error layar penuh"]],
    render: function (c) {
      if (c.state === "error") return h.appbar({ title: "Status global", back: true }) + h.errorBlock();
      var box = function (title, inner) { return '<div class="stack--sm stack"><h2 class="section-title" style="margin:0">' + title + "</h2>" + inner + "</div>"; };
      return h.appbar({ title: "Status global", back: true }) + '<div class="pad stack stack--lg">' +
        box("Offline", '<div class="banner banner--offline" style="border-radius:var(--r-md)">' + ic("wifi-off") + "<span>Kamu sedang offline. Perubahan tidak bisa disimpan.</span></div><p class=\"t-caption body-c\" style=\"margin:0\">Banner ini muncul di semua layar. Saat offline, simpan gagal dan isian tetap di layar (BR-04).</p><button class=\"btn btn--secondary btn--sm\" data-act=\"pOffline\">" + (App.offline ? "Matikan offline" : "Nyalakan offline") + "</button>") +
        box("Sesi berakhir", '<div class="banner banner--info">' + ic("info") + "<span>Sesi berakhir, silakan login kembali</span></div><button class=\"btn btn--secondary btn--sm\" data-act=\"g18Expire\">Simulasikan sesi berakhir</button>") +
        box("Error umum (inline)", '<div class="banner banner--error">' + ic("circle-alert") + '<span>Gagal memuat resep.</span><button class="btn btn--sm btn--danger banner__action">Coba lagi</button></div>') +
        box("Error umum (layar penuh)", '<div style="background:var(--c-surface);border-radius:var(--r-lg);box-shadow:var(--shadow-1)">' + h.errorBlock() + "</div>") +
        box("Dipaksa keluar", '<div class="banner banner--error">' + ic("circle-alert") + "<span>Akunmu dinonaktifkan. Hubungi admin RAGI Academy.</span></div><button class=\"btn btn--secondary btn--sm\" data-act=\"g18Force\">Simulasikan akun dinonaktifkan</button>") + "</div>";
    }
  });
  App.act("g18Expire", function () { App.logout("expired"); });
  App.act("g18Force", function () { App.logout("disabled"); });
})();
