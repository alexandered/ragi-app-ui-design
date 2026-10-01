/* Mock data for the prototype. Invented sample data (students, recipes, trials); the dough example is the PRD's MET-01 / CMP-01 example.
   Demo accounts exist only in this prototype. */
(function () {
  "use strict";
  var L = window.RAGI;
  var uid = 0;
  function row(name, type, grams, water, brand) {
    return { id: "row" + (++uid), name: name, brand: brand || "", type: type, grams: grams, water: water === undefined ? L.DEFAULT_WATER[type] : water };
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var rotiRows3 = [
    row("Tepung terigu", "Tepung", 500, 0, "Cakra Kembar"),
    row("Tepung (tangzhong)", "Tepung", 33.33),
    row("Air (tangzhong)", "Cairan", 66.67),
    row("Susu cair", "Cairan", 250, 87, "Ultra"),
    row("Gula pasir", "Gula", 40),
    row("Garam", "Garam", 9),
    row("Ragi instan", "Ragi", 7, 0, "Fermipan"),
    row("Butter", "Lemak", 50, 16, "Anchor")
  ];
  var rotiRows1 = [
    row("Tepung terigu", "Tepung", 500, 0, "Cakra Kembar"),
    row("Air", "Cairan", 300),
    row("Gula pasir", "Gula", 40),
    row("Garam", "Garam", 8),
    row("Ragi instan", "Ragi", 6, 0, "Fermipan"),
    row("Butter", "Lemak", 40, 16, "Anchor")
  ];
  var rotiRows2 = [
    row("Tepung terigu", "Tepung", 500, 0, "Cakra Kembar"),
    row("Tepung (tangzhong)", "Tepung", 33.33),
    row("Air (tangzhong)", "Cairan", 66.67),
    row("Susu cair", "Cairan", 280, 87, "Ultra"),
    row("Gula pasir", "Gula", 40),
    row("Garam", "Garam", 9),
    row("Ragi instan", "Ragi", 7, 0, "Fermipan"),
    row("Butter", "Lemak", 40, 16, "Anchor")
  ];
  var rotiRows4 = L.scale(rotiRows3, 12, 24).rows.map(function (r) { var c = clone(r); delete c.tooSmall; c.id = "row" + (++uid); return c; });
  var rotiRows5 = clone(rotiRows3).map(function (r) { r.id = "row" + (++uid); if (r.name === "Butter") r.grams = 60; return r; });
  rotiRows5.push(row("Susu bubuk", "Lainnya", 20));
  var rotiRows6 = clone(rotiRows3).map(function (r) { r.id = "row" + (++uid); return r; });

  function trial(no, date, portions, verdict, rows, x) {
    x = x || {};
    return { no: no, date: date, portions: portions, verdict: verdict, rows: rows, result: x.result || "", notes: x.notes || "", next: x.next || "", source: x.source || { kind: "new" } };
  }

  var seed = [  // per-account trial history (the recipes themselves are the shared catalogue below)
    { id: "r1", ownerId: "u1", name: "Roti sobek keju", category: "Roti", updated: "2026-09-30", stableNo: 3, nextNo: 7, trials: [
      trial(1, "2026-09-02", 12, "gagal", rotiRows1, { result: "Adonan terlalu lengket, roti padat dan kurang mengembang.", notes: "Uleni 8 menit. Proofing 45 menit.", next: "Tambahkan tangzhong dan kurangi air 30 g." }),
      trial(2, "2026-09-09", 12, "gagal", rotiRows2, { result: "Lebih empuk, tapi bagian bawah agak gosong.", notes: "Tangzhong dimasak sampai 65°C.", next: "Turunkan suhu oven 10°C dan pakai rak tengah.", source: { kind: "copy", from: 1 } }),
      trial(3, "2026-09-15", 12, "berhasil", rotiRows3, { result: "Empuk, mengembang sempurna, remah halus, kulit tipis.", notes: "Proofing 60 menit. Oven 170°C selama 25 menit, rak tengah.", next: "Coba tambah keju cheddar 20 g di dalam adonan.", source: { kind: "copy", from: 2 } }),
      trial(4, "2026-09-22", 24, "berhasil", rotiRows4, { result: "Hasil sama baiknya di porsi besar. Waktu ulen perlu 2 menit lebih lama.", notes: "Dua loyang, oven 175°C.", next: "", source: { kind: "scale", from: 3, a: 12, b: 24 } }),
      trial(5, "2026-09-28", 12, "gagal", rotiRows5, { result: "Terlalu berminyak, tekstur berat dan basah di tengah.", notes: "Butter dinaikkan, ditambah susu bubuk.", next: "Kembali ke butter 50 g dan tanpa susu bubuk.", source: { kind: "copy", from: 3 } }),
      trial(6, "2026-09-30", 12, "belum", rotiRows6, { source: { kind: "copy", from: 3 } })
    ] },
    { id: "r2", ownerId: "u1", name: "Brioche vanila", category: "Roti", updated: "2026-09-25", stableNo: null, nextNo: 3, trials: [
      trial(1, "2026-09-18", 8, "gagal", [row("Tepung terigu", "Tepung", 400, 0, "Segitiga Biru"), row("Telur ayam", "Telur", 200), row("Butter", "Lemak", 200, 16), row("Gula pasir", "Gula", 50), row("Garam", "Garam", 8), row("Ragi instan", "Ragi", 6)], { result: "Adonan terlalu lembek, tidak bisa dibentuk.", notes: "", next: "Kurangi telur 30 g dan dinginkan adonan semalam." }),
      trial(2, "2026-09-25", 8, "berhasil", [row("Tepung terigu", "Tepung", 400, 0, "Segitiga Biru"), row("Telur ayam", "Telur", 170), row("Butter", "Lemak", 200, 16), row("Gula pasir", "Gula", 50), row("Garam", "Garam", 8), row("Ragi instan", "Ragi", 6)], { result: "Lembut dan harum, bentuk rapi.", notes: "Adonan didinginkan 12 jam.", next: "Coba tambah esens vanila.", source: { kind: "copy", from: 1 } })
    ] },
    { id: "r3", ownerId: "u1", name: "Choco chip cookies", category: "Cookies", updated: "2026-09-27", stableNo: null, nextNo: 2, trials: [
      trial(1, "2026-09-27", 20, "belum", [row("Tepung terigu", "Tepung", 300), row("Butter", "Lemak", 170, 16), row("Gula pasir", "Gula", 100), row("Gula palem", "Gula", 100), row("Telur ayam", "Telur", 50), row("Baking soda", "Lainnya", 3), row("Garam", "Garam", 4), row("Choco chip", "Lainnya", 200)], { notes: "Sudah dipanggang, belum dicicipi." })
    ] },
    { id: "r4", ownerId: "u1", name: "Cheesecake", category: "Dessert", updated: null, stableNo: null, nextNo: 1, trials: [] },
    { id: "r5", ownerId: "u1", name: "Panna cotta", category: "Dessert", updated: "2026-09-12", stableNo: 1, nextNo: 2, trials: [
      trial(1, "2026-09-12", 6, "berhasil", [row("Susu cair", "Cairan", 300, 87), row("Krim kental", "Lemak", 200, 60), row("Gula pasir", "Gula", 60), row("Gelatin bubuk", "Lainnya", 8), row("Vanila", "Lainnya", 2)], { result: "Bergetar sempurna dan lembut.", notes: "Dinginkan 6 jam.", next: "" })
    ] },
    { id: "r9", ownerId: "c1", name: "Croissant demo kelas", category: "Pastry", updated: "2026-09-26", stableNo: 2, nextNo: 3, trials: [
      trial(1, "2026-09-19", 10, "gagal", [row("Tepung terigu", "Tepung", 500), row("Air", "Cairan", 240), row("Butter", "Lemak", 280, 16), row("Gula pasir", "Gula", 60), row("Garam", "Garam", 10), row("Ragi instan", "Ragi", 8)], { result: "Butter bocor saat dipanggang.", next: "Dinginkan adonan 30 menit di antara lipatan." }),
      trial(2, "2026-09-26", 10, "berhasil", [row("Tepung terigu", "Tepung", 500), row("Air", "Cairan", 240), row("Butter", "Lemak", 280, 16), row("Gula pasir", "Gula", 60), row("Garam", "Garam", 10), row("Ragi instan", "Ragi", 8)], { result: "Lapisan rapi dan renyah. Dipakai untuk demo kelas.", notes: "Lipat 3 kali, istirahat 30 menit.", source: { kind: "copy", from: 1 } })
    ] },
    { id: "r10", ownerId: "c1", name: "Chiffon pandan", category: "Cake", updated: "2026-09-14", stableNo: null, nextNo: 2, trials: [
      trial(1, "2026-09-14", 8, "belum", [row("Tepung terigu", "Tepung", 120), row("Telur ayam", "Telur", 200), row("Gula pasir", "Gula", 100), row("Minyak", "Lemak", 60, 0), row("Santan", "Cairan", 80, 85)], {})
    ] }
  ];

  // Food photos: local copies in assets/photos/ of Wikimedia Commons files (CC0, public domain or CC BY / CC BY-SA), downloaded 2026-10-01.
  // Credits and licences: photo-credits.html. In the real app these come from the admin backend together with the recipe.
  var PHOTOS = {
  "r1": {
    "hero": "assets/photos/r1-hero.jpg",
    "thumb": "assets/photos/r1-thumb.jpg",
    "license": "CC0",
    "artist": "Daderot",
    "page": "https://commons.wikimedia.org/wiki/File:Japanese_milk_bread_as_buns,_homemade_-_Massachusetts.jpg"
  },
  "r2": {
    "hero": "assets/photos/r2-hero.jpg",
    "thumb": "assets/photos/r2-thumb.jpg",
    "license": "CC BY-SA 3.0",
    "artist": "Wikimedia Commons contributor (see file page)",
    "page": "https://commons.wikimedia.org/wiki/File:Brioche.jpg"
  },
  "r3": {
    "hero": "assets/photos/r3-hero.jpg",
    "thumb": "assets/photos/r3-thumb.jpg",
    "license": "CC0",
    "artist": "Mshuang2",
    "page": "https://commons.wikimedia.org/wiki/File:Chocolate_chip_cookies_on_cutting_board.jpg"
  },
  "r4": {
    "hero": "assets/photos/r4-hero.jpg",
    "thumb": "assets/photos/r4-thumb.jpg",
    "license": "CC0",
    "artist": "Muago",
    "page": "https://commons.wikimedia.org/wiki/File:New_York_cheesecake_3.jpg"
  },
  "r5": {
    "hero": "assets/photos/r5-hero.jpg",
    "thumb": "assets/photos/r5-thumb.jpg",
    "license": "CC0",
    "artist": "Andy Li",
    "page": "https://commons.wikimedia.org/wiki/File:ELDERFLOWER_PANNA_COTTA_-_The_Meeting_Place_2025-06-28.jpg"
  },
  "r9": {
    "hero": "assets/photos/r9-hero.jpg",
    "thumb": "assets/photos/r9-thumb.jpg",
    "license": "CC0",
    "artist": "Herry Wibisono (herryway)",
    "page": "https://commons.wikimedia.org/wiki/File:Croissants_au_beurre_(18953292873).jpg"
  },
  "r10": {
    "hero": "assets/photos/r10-hero.jpg",
    "thumb": "assets/photos/r10-thumb.jpg",
    "license": "CC BY 3.0",
    "artist": "Midori",
    "page": "https://commons.wikimedia.org/wiki/File:Sifon_pandan.JPG"
  }
};

  var users = {
    u1: { id: "u1", name: "Sari Wulandari", email: "siswa@ragi.id", phone: "0812 3456 7890", role: "student" },
    c1: { id: "c1", name: "Rina Hartono", email: "chef@ragi.id", phone: "0811 2233 4455", role: "chef" }
  };


  // Recipe base ingredients as the admin backend would provide them: read-only for students, the starting point of a new trial.
  var BASES = {
    r1: { portions: 12, rows: function () { return [row("Tepung terigu", "Tepung", 500, 0, "Cakra Kembar"), row("Tepung (tangzhong)", "Tepung", 33.33), row("Air (tangzhong)", "Cairan", 66.67), row("Susu cair", "Cairan", 250, 87, "Ultra"), row("Gula pasir", "Gula", 40), row("Garam", "Garam", 9), row("Ragi instan", "Ragi", 7, 0, "Fermipan"), row("Butter", "Lemak", 50, 16, "Anchor")]; } },
    r2: { portions: 8, rows: function () { return [row("Tepung terigu", "Tepung", 400, 0, "Segitiga Biru"), row("Telur ayam", "Telur", 180), row("Butter", "Lemak", 200, 16), row("Gula pasir", "Gula", 50), row("Garam", "Garam", 8), row("Ragi instan", "Ragi", 6), row("Vanila", "Lainnya", 3)]; } },
    r3: { portions: 20, rows: function () { return [row("Tepung terigu", "Tepung", 300), row("Butter", "Lemak", 170, 16), row("Gula pasir", "Gula", 100), row("Gula palem", "Gula", 100), row("Telur ayam", "Telur", 50), row("Baking soda", "Lainnya", 3), row("Garam", "Garam", 4), row("Choco chip", "Lainnya", 200)]; } },
    r4: { portions: 10, rows: function () { return [row("Cream cheese", "Lemak", 500, 55), row("Gula pasir", "Gula", 130), row("Telur ayam", "Telur", 150), row("Krim kental", "Lemak", 120, 60), row("Biskuit", "Lainnya", 150), row("Butter", "Lemak", 70, 16)]; } },
    r5: { portions: 6, rows: function () { return [row("Susu cair", "Cairan", 300, 87), row("Krim kental", "Lemak", 200, 60), row("Gula pasir", "Gula", 60), row("Gelatin bubuk", "Lainnya", 8), row("Vanila", "Lainnya", 2)]; } },
    r9: { portions: 10, rows: function () { return [row("Tepung terigu", "Tepung", 500), row("Air", "Cairan", 240), row("Butter", "Lemak", 280, 16), row("Gula pasir", "Gula", 60), row("Garam", "Garam", 10), row("Ragi instan", "Ragi", 8)]; } },
    r10: { portions: 8, rows: function () { return [row("Tepung terigu", "Tepung", 120), row("Telur ayam", "Telur", 200), row("Gula pasir", "Gula", 100), row("Minyak", "Lemak", 60, 0), row("Santan", "Cairan", 80, 85), row("Pasta pandan", "Lainnya", 10)]; } }
  };
  // The catalogue is what the admin backend serves: the same recipes for every student. Trials and the Stable designation belong to the account.
  var catalog = [], catMap = {};
  seed.forEach(function (r) {
    if (catMap[r.id]) return; var b = BASES[r.id];
    var c = { id: r.id, name: r.name, category: r.category, photo: PHOTOS[r.id] || null, basePortions: b ? b.portions : null, base: b ? b.rows() : null };
    catMap[r.id] = c; catalog.push(c);
  });
  var recs = {};
  function make(uid, rid, st) {
    recs[uid] = recs[uid] || {};
    return (recs[uid][rid] = Object.assign({}, catMap[rid], { ownerId: uid, trials: st ? st.trials : [], stableNo: st ? st.stableNo : null, nextNo: st ? st.nextNo : 1, updated: st ? st.updated : null }));
  }
  function rec(uid, rid) { return (recs[uid] && recs[uid][rid]) || make(uid, rid, null); }
  seed.forEach(function (r) { make(r.ownerId, r.id, r); });
  // the Chef demo account gets the same history as the Student demo account, so every screen state works for both
  seed.filter(function (r) { return r.ownerId === "u1"; }).forEach(function (r) { make("c1", r.id, JSON.parse(JSON.stringify({ trials: r.trials, stableNo: r.stableNo, nextNo: r.nextNo, updated: r.updated }))); });

  var CATEGORIES = ["Roti", "Cake", "Pastry", "Cookies", "Dessert", "Lainnya"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  var db = {
    today: "2026-09-30",
    PASSWORD: "ragi1234",
    CATEGORIES: CATEGORIES,
    PHOTOS: PHOTOS,
    users: users,
    me: function () { return (window.App && window.App.user && window.App.user.id) || "u1"; },
    catalog: catalog,
    // every recipe of the catalogue as this account sees it: tried ones first (newest trial first), then the rest in the admin's order
    recipesOf: function (uid) {
      var list = catalog.map(function (c) { return rec(uid || db.me(), c.id); });
      return list.filter(function (r) { return r.trials.length; }).sort(function (a, b) { return b.updated.localeCompare(a.updated); }).concat(list.filter(function (r) { return !r.trials.length; }));
    },
    triedOf: function (uid) { return db.recipesOf(uid).filter(function (r) { return r.trials.length; }); },
    recipe: function (id) { return catMap[id] ? rec(db.me(), id) : undefined; },
    trial: function (rid, no) { var r = db.recipe(rid); return r && r.trials.filter(function (t) { return t.no === no; })[0]; },
    trialsDesc: function (r) { return r.trials.slice().sort(function (a, b) { return b.no - a.no; }); },
    stable: function (r) { return r.stableNo ? db.trial(r.id, r.stableNo) : null; },
    ownerOf: function (r) { return users[r.ownerId]; },
    addTrial: function (rid, t) { var r = db.recipe(rid); t.no = r.nextNo++; r.trials.push(t); r.updated = db.today; return t; },
    fmtDate: function (iso) { var p = iso.split("-"); return Number(p[2]) + " " + MONTHS[Number(p[1]) - 1] + " " + p[0]; },
    clone: clone,
    newRow: function (o) { o = o || {}; return { id: "row" + (++uid), name: o.name || "", brand: o.brand || "", type: o.type || "", grams: o.grams === undefined ? "" : o.grams, water: o.water === undefined ? null : o.water }; }
  };
  window.DB = db;
})();
