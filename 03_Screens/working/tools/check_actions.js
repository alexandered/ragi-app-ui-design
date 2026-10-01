// Fails if an element uses data-act / data-in that no App.act / App.inp defines. Run: node tools/check_actions.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const files = ["app.js", ...fs.readdirSync(path.join(root, "screens")).map((f) => "screens/" + f)];
const src = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
const used = (re) => new Set([...src.matchAll(re)].map((m) => m[1]));
const acts = used(/data-act=\\?"([A-Za-z0-9_]+)\\?"/g), ins = used(/data-in=\\?"([A-Za-z0-9_]+)\\?"/g);
const defAct = used(/App\.act\(\s*"([A-Za-z0-9_]+)"/g), defIn = used(/App\.inp\(\s*"([A-Za-z0-9_]+)"/g);
// dynamic names such as data-in="pw_' + k + '"
const dynIn = [...src.matchAll(/data-in="([A-Za-z0-9_]+)' \+/g)].map((m) => m[1]);
const missAct = [...acts].filter((a) => !defAct.has(a));
const missIn = [...ins].filter((a) => !defIn.has(a) && !dynIn.some((p) => defIn.has(p + "cur") || a === p));
const unused = [...defAct].filter((a) => !acts.has(a) && !/^(dlg|closeOvl|tab|back)$/.test(a));
console.log("data-act used:", acts.size, "defined:", defAct.size, "| data-in used:", ins.size, "defined:", defIn.size);
if (missAct.length) console.log("MISSING act:", missAct.join(", "));
if (missIn.length) console.log("MISSING inp:", missIn.join(", "));
if (unused.length) console.log("defined but never used:", unused.join(", "));
process.exit(missAct.length || missIn.length ? 1 : 0);
