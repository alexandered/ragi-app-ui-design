/* S1 Splash, S2 Login, S11 Profile, S12 Change password. Stories: AUTH-01 to AUTH-05. */
(function () {
  "use strict";
  var App = window.App, DB = window.DB, h = App.h, ic = App.ic, esc = App.esc;

  /* ---------------- S1 Splash ---------------- */
  App.defineScreen({
    id: "S1", name: "Splash / cek sesi", group: "Akun", role: "both", stories: ["AUTH-01"], dark: true, flush: true,
    states: [["auto", "Lanjut otomatis"], ["loading", "Memuat (tahan)"], ["expired", "Token kedaluwarsa"]],
    render: function (c) {
      var body = c.state === "expired"
        ? '<div class="banner banner--info" style="max-width:300px">' + ic("info") + "<span>Sesi berakhir, silakan login kembali</span></div><button class=\"btn btn--gold\" data-act=\"toLogin\" data-n=\"expired\"><span class=\"btn__label\">Ke halaman login</span></button>"
        : '<div class="spinner" role="status" aria-label="Memeriksa sesi"></div>';
      return '<div class="splash"><span class="splash__blob"></span><span class="splash__blob splash__blob--2"></span><img src="assets/ragi-logo.png" alt="RAGI Baking Course dan Consultancy">' + body + "</div>";
    },
    mount: function (c) {
      clearTimeout(App.timers.splash);
      if (c.state === "auto") App.timers.splash = setTimeout(function () {
        if (App.top().id === "S1" && App.stateOf("S1") === "auto") App.go(App.role ? App.home() : "S2", {}, { replace: true });
      }, 1800);
    }
  });
  App.act("toLogin", function (el) { App.go("S2", { notice: el.dataset.n || "" }, { replace: true }); });

  /* ---------------- S2 Login ---------------- */
  var S2 = { email: "", pw: "", show: false, err: null, loading: false };
  App.defineScreen({
    id: "S2", name: "Login", group: "Akun", role: "both", stories: ["AUTH-01", "AUTH-02"], dark: true, flush: true,
    states: [["auto", "Formulir"], ["validation", "Validasi"], ["wrong", "Kredensial salah"], ["network", "Error jaringan"], ["expired", "Sesi berakhir"]],
    defaults: function () { return {}; },
    render: function (c) {
      var err = S2.err || (c.state !== "auto" ? c.state : null);
      if (!err && c.params.notice) err = c.params.notice;
      var val = err === "validation" && c.state === "validation" && !S2.email && !S2.pw;
      var eEmail = err === "validation" && (val || !/.+@.+/.test(S2.email)) ? "Isi email yang valid" : "";
      var ePw = err === "validation" && (val || !S2.pw) ? "Isi password" : "";
      var banner = "";
      if (err === "wrong") banner = '<div class="banner banner--error" role="alert">' + ic("circle-alert") + "<span>Email atau password salah</span></div>";
      if (err === "network") banner = '<div class="banner banner--error" role="alert">' + ic("wifi-off") + '<span>Tidak bisa terhubung. Periksa internetmu.</span><button type="button" class="btn btn--sm btn--danger banner__action" data-act="login">Coba lagi</button></div>';
      if (err === "expired") banner = '<div class="banner banner--info" role="status">' + ic("info") + "<span>Sesi berakhir, silakan login kembali</span></div>";
      if (err === "disabled") banner = '<div class="banner banner--error" role="alert">' + ic("circle-alert") + "<span>Akunmu dinonaktifkan. Hubungi admin RAGI Academy.</span></div>";
      return '<div class="login-top"><span class="splash__blob"></span><span class="splash__blob splash__blob--2"></span><img src="assets/ragi-logo.png" alt="RAGI Baking Course dan Consultancy"></div>' +
        '<form class="login-sheet stack" data-form="login" novalidate><div><h1 class="t-title-l" style="margin:0">Masuk</h1><p class="body-c" style="margin:var(--s-1) 0 0">Selamat datang kembali. Yuk lanjut bereksperimen.</p></div>' + banner +
        h.field({ id: "lg-email", label: "Email", error: eEmail, control: '<div class="input-wrap">' + ic("mail") + '<input class="input" id="lg-email" type="email" inputmode="email" autocomplete="off" placeholder="nama@ragi.id" value="' + esc(S2.email) + '" data-in="loginEmail"></div>' }) +
        h.field({ id: "lg-pw", label: "Password", error: ePw, control: '<div class="input-wrap input-wrap--right"><input class="input" id="lg-pw" type="' + (S2.show ? "text" : "password") + '" autocomplete="off" value="' + esc(S2.pw) + '" data-in="loginPw"><button type="button" class="btn-icon" data-act="loginShow" aria-label="' + (S2.show ? "Sembunyikan password" : "Tampilkan password") + '">' + ic(S2.show ? "eye-off" : "eye") + "</button></div>" }) +
        '<button type="submit" class="btn btn--primary btn--block' + (S2.loading ? " is-loading" : "") + '" ' + (S2.loading ? "disabled" : "") + '><span class="btn__label">Masuk</span></button>' +
        '<p class="field__hint center" style="margin:0">Lupa password? Hubungi admin RAGI Academy</p>' +
        '<div class="hint-card">' + ic("info", "icon--sm") + '<div class="stack--sm" style="gap:var(--s-2)"><span>Prototipe: isi akun demo</span><span class="demo-chips"><button type="button" class="chip" data-act="demoFill" data-r="student">Siswa</button><button type="button" class="chip" data-act="demoFill" data-r="chef">Chef</button></span></div></div></form>';
    },
    mount: function (c, root) { var f = App.$("[data-form=login]", root); if (f) f.addEventListener("submit", function (e) { e.preventDefault(); App.actions.login(); }); }
  });
  App.inp("loginEmail", function (el) { S2.email = el.value; });
  App.inp("loginPw", function (el) { S2.pw = el.value; });
  App.act("loginShow", function () { S2.show = !S2.show; App.render(); });
  App.act("demoFill", function (el) { S2.email = el.dataset.r === "chef" ? "chef@ragi.id" : "siswa@ragi.id"; S2.pw = DB.PASSWORD; S2.err = null; App.states.S2 = "auto"; App.render(); });
  App.act("login", function () {
    S2.err = null; App.states.S2 = "auto";
    if (!/.+@.+/.test(S2.email) || !S2.pw) { S2.err = "validation"; App.render(); return; }
    S2.loading = true; App.render();
    setTimeout(function () {
      S2.loading = false;
      if (App.offline) { S2.err = "network"; App.render(); return; }
      var e = S2.email.trim().toLowerCase();
      var role = e === "siswa@ragi.id" ? "student" : e === "chef@ragi.id" ? "chef" : null;
      if (role && S2.pw === DB.PASSWORD) { S2.pw = ""; App.loginAs(role); } else { S2.err = "wrong"; App.render(); }
    }, 800);
  });

  /* ---------------- S11 Profile ---------------- */
  var S11 = { name: null, phone: null, saving: false, failed: false, err: false };
  App.defineScreen({
    id: "S11", name: "Profil", group: "Akun", role: "both", stories: ["AUTH-04", "AUTH-05"], tabbar: true, tab: "profil",
    states: [["auto", "Formulir"], ["validation", "Validasi"], ["saving", "Menyimpan"], ["failure", "Gagal simpan"]],
    render: function (c) {
      var u = App.user; if (S11.name === null) { S11.name = u.name; S11.phone = u.phone; }
      var bad = c.state === "validation" || S11.err, saving = c.state === "saving" || S11.saving, fail = c.state === "failure" || S11.failed;
      var nameVal = c.state === "validation" ? "" : S11.name;
      return h.tabHeader("Profil") + '<div class="pad stack stack--lg">' +
        '<div class="hstack">' + h.avatar(u.name, true) + '<div class="grow stack--sm stack"><div class="t-title-m">' + esc(u.name) + "</div><div>" + h.roleBadge(u) + "</div></div></div>" +
        '<div class="stack">' +
        (fail ? '<div class="banner banner--error" role="alert">' + ic("circle-alert") + "<span>Gagal menyimpan. Isianmu tetap ada, coba lagi.</span></div>" : "") +
        h.field({ id: "pf-name", label: "Nama lengkap", req: true, error: bad ? "Nama wajib diisi" : "", control: '<input class="input" id="pf-name" value="' + esc(nameVal) + '" data-in="pfName" maxlength="100">' }) +
        h.field({ id: "pf-phone", label: "Nomor telepon", control: '<div class="input-wrap">' + ic("phone") + '<input class="input" id="pf-phone" inputmode="tel" value="' + esc(S11.phone) + '" data-in="pfPhone"></div>' }) +
        h.field({ id: "pf-email", label: "Email", hint: "Email dan peran diatur oleh admin RAGI Academy", control: '<input class="input" id="pf-email" value="' + esc(u.email) + '" disabled>' }) +
        '<button class="btn btn--primary btn--block' + (saving ? " is-loading" : "") + '" data-act="pfSave" ' + (saving ? "disabled" : "") + '><span class="btn__label">Simpan</span></button></div>' +
        '<div class="stack stack--sm"><h2 class="section-title" style="margin:0">Akun</h2><button class="link-row" data-act="goPw">' + ic("key-round") + "Ubah password" + ic("chevron-right", "chev") + '</button><button class="link-row" data-act="logoutAsk" style="color:var(--c-gagal-ink)">' + ic("log-out", "") + "Keluar</button></div></div>";
    }
  });
  App.inp("pfName", function (el) { S11.name = el.value; });
  App.inp("pfPhone", function (el) { S11.phone = el.value; });
  App.act("pfSave", function () {
    S11.err = false; S11.failed = false; App.states.S11 = "auto";
    if (!S11.name.trim()) { S11.err = true; App.render(); return; }
    S11.saving = true; App.render();
    setTimeout(function () {
      S11.saving = false;
      if (App.offline) { S11.failed = true; App.render(); return; }
      App.user.name = S11.name.trim(); App.user.phone = S11.phone; App.render(); App.snack("Profil diperbarui", { icon: "circle-check" });
    }, 700);
  });
  App.act("goPw", function () { App.go("S12", {}); });
  App.act("logoutAsk", function () { App.openConfirm("logout"); });

  /* ---------------- S12 Change password ---------------- */
  var S12 = { cur: "", nw: "", cf: "", err: null };
  App.defineScreen({
    id: "S12", name: "Ubah password", group: "Akun", role: "both", stories: ["AUTH-03"], tab: "profil",
    states: [["auto", "Formulir"], ["validation", "Validasi"], ["wrong", "Password lama salah"], ["success", "Berhasil"]],
    render: function (c) {
      var st = S12.err || c.state, e = { cur: "", nw: "", cf: "" };
      if (st === "validation") { e.cur = S12.cur ? "" : "Isi password saat ini"; e.nw = S12.nw.length >= 8 ? "" : "Minimal 8 karakter"; e.cf = S12.cf && S12.cf === S12.nw ? "" : "Konfirmasi harus sama dengan password baru"; if (c.state === "validation" && !S12.cur && !S12.nw) { e.cur = "Isi password saat ini"; e.nw = "Minimal 8 karakter"; e.cf = "Konfirmasi harus sama dengan password baru"; } }
      if (st === "wrong") e.cur = "Password saat ini salah";
      var pw = function (id, label, k, err, hint) { return h.field({ id: id, label: label, req: true, error: err, hint: hint, control: '<input class="input" id="' + id + '" type="password" autocomplete="off" value="' + esc(S12[k]) + '" data-in="pw_' + k + '">' }); };
      return h.appbar({ title: "Ubah password", back: true }) + '<div class="pad stack">' +
        (st === "success" ? '<div class="banner banner--info" role="status">' + ic("circle-check") + "<span>Password berhasil diubah. Kamu tetap masuk.</span></div>" : "") +
        pw("pw-cur", "Password saat ini", "cur", e.cur) + pw("pw-new", "Password baru", "nw", e.nw, "Minimal 8 karakter") + pw("pw-cf", "Ulangi password baru", "cf", e.cf) +
        '<button class="btn btn--primary btn--block" data-act="pwSave"><span class="btn__label">Simpan password</span></button></div>';
    }
  });
  App.inp("pw_cur", function (el) { S12.cur = el.value; });
  App.inp("pw_nw", function (el) { S12.nw = el.value; });
  App.inp("pw_cf", function (el) { S12.cf = el.value; });
  App.act("pwSave", function () {
    S12.err = null; App.states.S12 = "auto";
    if (!S12.cur || S12.nw.length < 8 || S12.nw !== S12.cf) { S12.err = "validation"; App.render(); return; }
    if (S12.cur !== DB.PASSWORD) { S12.err = "wrong"; App.render(); return; }
    DB.PASSWORD = S12.nw; S12.cur = S12.nw = S12.cf = ""; App.back(); App.snack("Password berhasil diubah", { icon: "circle-check" });
  });
})();
