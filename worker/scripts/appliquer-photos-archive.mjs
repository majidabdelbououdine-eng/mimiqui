#!/usr/bin/env node
/**
 * Ajoute les photos manquantes déjà présentes sur les pages de sets
 * (et Set de Base / Transfert) dans data-archive-site-ventes.js,
 * sans inventer d'image. À lancer depuis la racine du dépôt, avec
 * le fichier source des ventes (retiré du site public) remis en local :
 *
 *   git show d273285:data-archive-site-ventes.js > data-archive-site-ventes.js
 *   node worker/scripts/appliquer-photos-archive.mjs
 *   npm --prefix worker run build:ventes
 *
 * Ne charge pas KV. Ensuite : wrangler kv bulk put data/bulk.json --binding VENTES
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const srcPath = path.join(root, "data-archive-site-ventes.js");
const patchPath = path.join(__dirname, "photos-archive-ajoutees.json");

if (!fs.existsSync(srcPath)) {
  console.error("Fichier introuvable :", srcPath);
  console.error("Rends-le en local (il n'est plus servi publiquement) puis relance.");
  process.exit(1);
}

const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
const src = fs.readFileSync(srcPath, "utf8");
const m = src.match(/window\.ARCHIVE_SITE_VENTES\s*=/);
if (!m) {
  console.error("window.ARCHIVE_SITE_VENTES introuvable.");
  process.exit(1);
}
const head = src.slice(0, m.index);
let i = m.index + m[0].length;
while (src[i] && /\s/.test(src[i])) i++;
const raw = src.slice(i).trim().replace(/;?\s*$/, "");
const data = JSON.parse(raw);

function norm(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s\-–]*\bex\b/g, " ex")
    .replace(/\s+/g, " ")
    .trim();
}

const map = new Map();
for (const c of patch.cartes) {
  map.set([norm(c.nom), String(c.numero || ""), c.set, (c.langue || "").toLowerCase()].join("|"), c.img);
}

let n = 0;
for (const c of data.cartes) {
  const img = c[5] || "";
  if (img) continue;
  const key = [norm(c[0]), String(c[1] || ""), c[2] || "", String(c[3] || "").toLowerCase()].join("|");
  const add = map.get(key);
  if (!add) continue;
  while (c.length < 6) c.push("");
  c[5] = add;
  n++;
}

function dump(v) {
  return JSON.stringify(v);
}
const parts = [
  "{",
  `"maj":${dump(data.maj)},`,
  `"sources":${dump(data.sources)},`,
  `"cartes":[`,
  data.cartes.map(dump).join(",\n"),
  "],",
  `"ventes":[`,
  data.ventes.map(dump).join(",\n"),
  "]",
  "}",
];
fs.writeFileSync(srcPath, head + "window.ARCHIVE_SITE_VENTES=" + parts.join("\n") + ";\n");
console.log("Photos ajoutées :", n, "/", patch.n);
if (n !== patch.n) {
  console.error("Attention : toutes les cartes du correctif n'ont pas été trouvées.");
  process.exit(1);
}
