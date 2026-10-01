/* RAGI prototype logic: number format, dough metrics (MET-01), scaling (SCL-01), compare (CMP-01).
   Pure functions, no DOM. Works in the browser (window.RAGI) and in Node (module.exports) for the tests.
   Rules come from PRD §6.3 G, L and M. Everything is grams (BR-06). */
(function (root) {
  "use strict";

  var TYPES = ["Tepung", "Cairan", "Lemak", "Gula", "Garam", "Ragi", "Telur", "Lainnya"];
  var DEFAULT_WATER = { Tepung: 0, Cairan: 100, Lemak: 0, Gula: 0, Garam: 0, Ragi: 0, Telur: 75, Lainnya: 0 };

  // half-up rounding without float drift (1.005 -> 1.01)
  function round(n, d) {
    var sign = n < 0 ? -1 : 1, a = Number(Math.abs(n).toPrecision(15)); // toPrecision removes float noise (83.32499999 -> 83.325)
    return sign * Number(Math.round(Number(a + "e" + d)) + "e-" + d);
  }

  // input accepts "," or "." as the decimal separator (BR-05); returns NaN when invalid
  function parseNum(s) {
    if (typeof s === "number") return s;
    s = String(s).trim();
    if (!s) return NaN;
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, ""); // 1.000,5 -> 1000,5
    s = s.replace(",", ".");
    return /^\d*\.?\d+$/.test(s) ? Number(s) : NaN;
  }

  // 250 -> "250", 12.5 -> "12,5", 1250 -> "1.250" (decimal comma, thousands dot, up to 2 decimals)
  function fmtNum(n, maxDec) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    var v = round(n, maxDec === undefined ? 2 : maxDec);
    var parts = String(v).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }
  function fmtG(n) { return fmtNum(n) + " g"; }
  function fmtPct(n) { return n === null || isNaN(n) ? "—" : fmtNum(n, 1).replace(/^(-?\d+)$/, "$1,0") + " %"; }
  function fmtPctPlain(n) { return fmtPct(n); }
  function fmtDiff(n, unit) {
    if (n === 0) return "0 " + unit;
    return (n > 0 ? "+" : "−") + fmtNum(Math.abs(n), unit === "pp" ? 1 : 2) + " " + unit;
  }

  // ---- MET-01 ----
  function metrics(rows) {
    var g = function (r) { return Number(r.grams) || 0; };
    var sum = function (f) { return rows.filter(f).reduce(function (a, r) { return a + g(r); }, 0); };
    var flour = sum(function (r) { return r.type === "Tepung"; });
    var dough = rows.reduce(function (a, r) { return a + g(r); }, 0);
    var water = rows.reduce(function (a, r) {
      var wc = r.water === undefined || r.water === null ? DEFAULT_WATER[r.type] || 0 : r.water;
      return a + (g(r) * wc) / 100;
    }, 0);
    var pct = function (x) { return flour > 0 ? (x / flour) * 100 : null; };
    return {
      flour: flour, dough: dough, water: water, hasFlour: flour > 0,
      hydration: pct(water),
      fat: pct(sum(function (r) { return r.type === "Lemak"; })),
      sugar: pct(sum(function (r) { return r.type === "Gula"; })),
      salt: pct(sum(function (r) { return r.type === "Garam"; })),
      yeast: pct(sum(function (r) { return r.type === "Ragi"; })),
      rowPct: function (r) { return pct(g(r)); }
    };
  }

  // ---- SCL-01 / SCL-02 ----
  function validPortions(s) {
    var n = typeof s === "number" ? s : Number(String(s).trim());
    return Number.isInteger(n) && n >= 1 && n <= 9999 ? n : NaN;
  }
  function scale(rows, srcPortions, targetPortions) {
    var factor = targetPortions / srcPortions;
    return {
      factor: factor,
      rows: rows.map(function (r) {
        var q = round((Number(r.grams) || 0) * factor, 2);
        var copy = {}; for (var k in r) copy[k] = r[k];
        copy.grams = q; copy.tooSmall = q === 0 && Number(r.grams) > 0;
        return copy;
      })
    };
  }

  // ---- CMP-01 ----
  function compare(a, b) {
    var key = function (r) { return String(r.name).trim().toLowerCase(); };
    var used = {}, out = [];
    var byKey = function (rows) { var m = {}; rows.forEach(function (r) { (m[key(r)] = m[key(r)] || []).push(r); }); return m; };
    var mb = byKey(b.rows), ma = byKey(a.rows);
    var ta = metrics(a.rows), tb = metrics(b.rows);
    var seen = {};
    a.rows.forEach(function (r) {
      var k = key(r); seen[k] = (seen[k] || 0) + 1;
      var other = (mb[k] || [])[seen[k] - 1] || null;
      out.push(row(r, other));
      if (other) used[k] = (used[k] || 0) + 1;
    });
    var seenB = {};
    b.rows.forEach(function (r) {
      var k = key(r); seenB[k] = (seenB[k] || 0) + 1;
      if (!(ma[k] && ma[k][seenB[k] - 1])) out.push(row(null, r));
    });
    function row(x, y) {
      var px = x && ta.hasFlour ? ta.rowPct(x) : null, py = y && tb.hasFlour ? tb.rowPct(y) : null;
      var changed = !x || !y || Number(x.grams) !== Number(y.grams) || (x.brand || "") !== (y.brand || "") || x.type !== y.type || (x.water || 0) !== (y.water || 0);
      return {
        name: (x || y).name, a: x, b: y, pctA: px, pctB: py,
        onlyIn: !x ? "B" : !y ? "A" : null, changed: changed,
        dGrams: x && y ? round(Number(y.grams) - Number(x.grams), 2) : null,
        dPct: px !== null && py !== null ? round(round(py, 1) - round(px, 1), 1) : null
      };
    }
    var d = function (p) { return ta[p] !== null && tb[p] !== null ? round(round(tb[p], 1) - round(ta[p], 1), 1) : null; };
    return {
      rows: out, ta: ta, tb: tb,
      diff: { dough: round(tb.dough - ta.dough, 2), flour: round(tb.flour - ta.flour, 2), hydration: d("hydration"), fat: d("fat"), sugar: d("sugar"), salt: d("salt"), yeast: d("yeast") },
      portionsDiffer: a.portions !== b.portions
    };
  }

  var api = { TYPES: TYPES, DEFAULT_WATER: DEFAULT_WATER, round: round, parseNum: parseNum, fmtNum: fmtNum, fmtG: fmtG, fmtPct: fmtPct, fmtPctPlain: fmtPctPlain, fmtDiff: fmtDiff, metrics: metrics, validPortions: validPortions, scale: scale, compare: compare };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.RAGI = Object.assign(root.RAGI || {}, api);
})(typeof window !== "undefined" ? window : globalThis);
