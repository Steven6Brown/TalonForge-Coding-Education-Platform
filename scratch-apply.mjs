import fs from "node:fs";

// Appends each file in <dir> to content/lessons/<same name>, unless its first heading is already there.
const dir = process.argv[2];
let n = 0;
for (const g of fs.readdirSync(dir)) {
  const p = "content/lessons/" + g;
  if (!fs.existsSync(p)) {
    console.log("missing lesson", g);
    continue;
  }
  const o = fs.readFileSync(p, "utf8");
  const add = fs.readFileSync(dir + "/" + g, "utf8");
  const heading = add.split("\n").find((l) => l.startsWith("## "));
  if (heading && o.includes(heading)) {
    console.log("skip", g);
    continue;
  }
  fs.writeFileSync(p, o.replace(/\s+$/, "") + add);
  n++;
}
console.log("appended", n);
