// Run: node logic.test.js   (PRD §6.3 scenarios for MET-01, SCL-01, CMP-01 and number format)
const assert = require("assert");
const L = require("./logic.js");
let n = 0;
const t = (name, fn) => { fn(); n++; console.log("ok  " + name); };

const tang = [
  { name: "Tepung terigu", type: "Tepung", grams: 500 },
  { name: "Tepung (tangzhong)", type: "Tepung", grams: 33.33 },
  { name: "Air (tangzhong)", type: "Cairan", grams: 66.67 },
  { name: "Susu cair", type: "Cairan", grams: 250, water: 87 },
  { name: "Gula pasir", type: "Gula", grams: 40 },
  { name: "Garam", type: "Garam", grams: 9 },
  { name: "Ragi instan", type: "Ragi", grams: 7 },
  { name: "Butter", type: "Lemak", grams: 50, water: 16 },
];

t("format: decimal comma, thousands dot, hidden trailing zeros", () => {
  assert.strictEqual(L.fmtNum(250), "250");
  assert.strictEqual(L.fmtNum(12.5), "12,5");
  assert.strictEqual(L.fmtNum(0.33), "0,33");
  assert.strictEqual(L.fmtNum(1250), "1.250");
  assert.strictEqual(L.fmtG(1000), "1.000 g"); // never kg
  assert.strictEqual(L.fmtPct(93.75), "93,8 %");
  assert.strictEqual(L.fmtPct(50), "50,0 %");
  assert.strictEqual(L.round(1.005, 2), 1.01);
  assert.strictEqual(L.round(33.33 * 2.5, 2), 83.33); // half-up even when the float product is 83.32499999
  assert.strictEqual(L.round(66.67 * 2.5, 2), 166.68);
});
t("input: accepts comma or dot, rejects junk", () => {
  assert.strictEqual(L.parseNum("1,5"), 1.5);
  assert.strictEqual(L.parseNum("1.5"), 1.5);
  assert.strictEqual(L.parseNum("1.000,5"), 1000.5);
  assert.ok(isNaN(L.parseNum("abc")));
  assert.ok(isNaN(L.parseNum("")));
});
t("MET-01 tangzhong scenario", () => {
  const m = L.metrics(tang);
  assert.strictEqual(L.fmtNum(m.flour), "533,33");
  assert.strictEqual(L.fmtNum(m.dough), "956");
  assert.strictEqual(L.fmtPct(m.rowPct(tang[0])), "93,8 %");
  assert.strictEqual(L.fmtPct(m.rowPct(tang[1])), "6,2 %");
  assert.strictEqual(L.fmtNum(m.water), "292,17");
  assert.strictEqual(L.fmtPct(m.hydration), "54,8 %");
  assert.strictEqual(L.fmtPct(m.fat), "9,4 %");
  assert.strictEqual(L.fmtPct(m.sugar), "7,5 %");
  assert.strictEqual(L.fmtPct(m.salt), "1,7 %");
  assert.strictEqual(L.fmtPct(m.yeast), "1,3 %");
});
t("MET-01 recipe without flour: percentages are —, dough weight stays", () => {
  const m = L.metrics([{ name: "Susu", type: "Cairan", grams: 200 }, { name: "Gula", type: "Gula", grams: 30 }]);
  assert.strictEqual(m.hasFlour, false);
  assert.strictEqual(L.fmtPct(m.hydration), "—");
  assert.strictEqual(L.fmtNum(m.dough), "230");
});
t("SCL-01 scale up, down, ratios kept, invalid target", () => {
  let s = L.scale([{ name: "Tepung terigu", type: "Tepung", grams: 500 }], 12, 30);
  assert.strictEqual(L.fmtNum(s.rows[0].grams), "1.250");
  assert.strictEqual(L.fmtNum(s.factor, 1), "2,5");
  s = L.scale([{ name: "Telur", type: "Telur", grams: 150 }], 12, 7);
  assert.strictEqual(L.fmtNum(s.rows[0].grams), "87,5");
  const before = L.metrics(tang), after = L.metrics(L.scale(tang, 12, 18).rows);
  assert.ok(Math.abs(before.hydration - after.hydration) < 0.1);
  assert.strictEqual(L.fmtPct(after.rowPct(L.scale(tang, 12, 18).rows[0])), "93,8 %");
  assert.strictEqual(L.scale([{ name: "Ragi", type: "Ragi", grams: 0.4 }], 100, 1).rows[0].tooSmall, true);
  [0, -1, 1.5, "", "abc", 10000].forEach((v) => assert.ok(isNaN(L.validPortions(v)), String(v)));
  assert.strictEqual(L.validPortions("30"), 30);
});
t("CMP-01 failed batch vs Stable Trial", () => {
  const flour = [{ name: "Tepung terigu", type: "Tepung", grams: 500 }, { name: "Tepung (tangzhong)", type: "Tepung", grams: 33.33 }];
  const A = { portions: 12, rows: [...flour, { name: "Butter", type: "Lemak", grams: 50 }, { name: "Susu cair", type: "Cairan", grams: 250, water: 87 }] };
  const B = { portions: 12, rows: [...flour, { name: "Butter", type: "Lemak", grams: 60 }, { name: "Susu cair", type: "Cairan", grams: 250, water: 87 }, { name: "Susu bubuk", type: "Lainnya", grams: 20 }] };
  const c = L.compare(A, B);
  const butter = c.rows.find((r) => r.name === "Butter");
  assert.strictEqual(butter.changed, true);
  assert.strictEqual(L.fmtDiff(butter.dGrams, "g"), "+10 g");
  assert.strictEqual(L.fmtDiff(butter.dPct, "pp"), "+1,9 pp");
  assert.strictEqual(L.fmtDiff(c.diff.fat, "pp"), "+1,9 pp");
  assert.strictEqual(c.rows.find((r) => r.name === "Susu cair").changed, false);
  assert.strictEqual(c.rows.find((r) => r.name === "Susu bubuk").onlyIn, "B");
  assert.strictEqual(c.portionsDiffer, false);
});
console.log("\n" + n + " test groups passed");
