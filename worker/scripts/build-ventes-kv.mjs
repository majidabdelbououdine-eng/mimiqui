#!/usr/bin/env node
/**
 * Découpe les fichiers de ventes publics en un JSON par Pokémon,
 * prêt à être chargé dans KV (wrangler kv bulk put --local ou, plus tard, en prod).
 *
 * Usage (depuis worker/) :
 *   node scripts/build-ventes-kv.mjs
 *   node scripts/build-ventes-kv.mjs --root .. --out data
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const root = path.resolve(arg("--root", path.join(__dirname, "../..")));
const outDir = path.resolve(arg("--out", path.join(__dirname, "../data")));

const JOURS = 365;

function norm(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
function slugify(s) {
  return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "autre";
}
function isoToday() {
  const d = new Date();
  const p = (n) => (n < 10 ? "0" : "") + n;
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function fenetre() {
  const now = new Date();
  const fin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const debut = new Date(fin.getTime());
  debut.setDate(debut.getDate() - JOURS);
  const iso = (d) =>
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0");
  return { debut: iso(debut), fin: iso(fin) };
}

function extractAssign(src, name) {
  const re = new RegExp("window\\." + name + "\\s*=");
  const m = src.match(re);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (src[i] && /\s/.test(src[i])) i++;
  const raw = src.slice(i).trim().replace(/;?\s*$/, "");
  return JSON.parse(raw);
}

function readAssign(file, name) {
  const src = fs.readFileSync(file, "utf8");
  return extractAssign(src, name);
}

function deplieSite(d) {
  const out = [];
  if (!d || !Array.isArray(d.ventes) || !Array.isArray(d.cartes)) return out;
  const sources = Array.isArray(d.sources) ? d.sources : [];
  for (const r of d.ventes) {
    if (!Array.isArray(r)) continue;
    const c = d.cartes[r[1]];
    if (!Array.isArray(c)) continue;
    const id = String(r[0] || "");
    const com = r[7] === "com";
    const src = sources[r[2]] || [];
    out.push({
      id,
      carte: c[0] || "",
      numero: c[1] || "",
      set: c[2] || "",
      langue: c[3] || "",
      pokemon: c[4] || "",
      prix: Number(r[3]),
      devise: r[5] ? String(r[5]).toUpperCase() : "EUR",
      date: r[4] || "",
      etat: r[6] || "",
      photo: r[8] || c[5] || "",
      lien: id ? "https://www." + (com ? "ebay.com" : "ebay.fr") + "/itm/" + id : "",
      source: src[1] || "Site",
    });
  }
  return out;
}

function normaliseSdb(list) {
  const out = [];
  for (const v of list || []) {
    if (!v || typeof v !== "object") continue;
    let id = String(v.id || "").trim();
    let lien = String(v.lien || v.u || "").trim();
    if (!id) {
      const m = lien.match(/\/itm\/(\d+)/i);
      if (m) id = m[1];
    }
    if (!id) continue;
    let etat = String(v.etat || "");
    if (!etat && v.grade) etat = "gradee " + v.grade;
    out.push({
      id,
      carte: v.carte || v.nom || "",
      numero: v.numero || "",
      set: v.set || "Set de Base",
      langue: v.langue || "fr",
      pokemon: v.pokemon || "",
      prix: Number(v.prix),
      devise: String(v.devise || v.dev || "USD").toUpperCase(),
      date: v.date || "",
      etat,
      photo: v.photo || v.vignette || "",
      lien,
      source: "Set de Base",
    });
  }
  return out;
}

function canonLien(u) {
  const m = String(u || "").match(/\/itm\/(\d+)/);
  return m ? "https://www.ebay.fr/itm/" + m[1] : String(u || "");
}

function dedupe(list) {
  const seen = {};
  const out = [];
  for (const v of list) {
    const lien = canonLien(v && v.lien);
    const id = String((v && v.id) || "");
    const k1 = id ? "id:" + id : "";
    const k2 = lien ? "lien:" + lien : "";
    if ((k1 && seen[k1]) || (k2 && seen[k2])) continue;
    if (k1) seen[k1] = 1;
    if (k2) seen[k2] = 1;
    out.push(v);
  }
  return out;
}

function estSetDeBase(v) {
  return !!(v && (v.set === "Set de Base" || v.serie === "Set de Base"));
}

function dansFenetre(v, f) {
  const d = v && v.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || "")) return false;
  return d >= f.debut && d <= f.fin;
}

function baseNom(v) {
  if (v.pokemon && String(v.pokemon).trim()) return String(v.pokemon).trim();
  let n = String(v.carte || "").trim();
  n = n.replace(
    /\s+(?:VMAX|VSTAR|V-UNION|TAG\s*TEAM|GX|EX|ex|V|LV\.?X|δ|de la Team Rocket|de N|d['’]Alola|d['’]Galar|d['’]Hisui).*$/i,
    ""
  ).trim();
  return n || v.carte || "Autre";
}

const f = fenetre();
const sitePath = path.join(root, "data-archive-site-ventes.js");
const archPath = path.join(root, "archive-ventes-data.js");
const sdbPath = path.join(root, "data-set-de-base-ventes.js");

const site = fs.existsSync(sitePath) ? deplieSite(readAssign(sitePath, "ARCHIVE_SITE_VENTES")) : [];
const arch = fs.existsSync(archPath)
  ? (readAssign(archPath, "ARCHIVE_VENTES") || []).map((v) => ({
      ...v,
      source: v.source || "Ventes passées Spécial Mimiqui",
    }))
  : [];
const sdb = fs.existsSync(sdbPath)
  ? normaliseSdb(readAssign(sdbPath, "SET_DE_BASE_VENTES"))
  : [];

const toutes = dedupe(arch.concat(sdb, site));
const recentes = toutes.filter((v) => estSetDeBase(v) || dansFenetre(v, f));

const groupes = new Map();
for (const v of recentes) {
  const nom = baseNom(v);
  const slug = slugify(nom);
  if (!groupes.has(slug)) {
    groupes.set(slug, { slug, nom, noms: new Set([nom]), ventes: [] });
  }
  const g = groupes.get(slug);
  if (v.carte) g.noms.add(v.carte);
  if (v.pokemon) g.noms.add(v.pokemon);
  const { _q, ...rest } = {
    ...v,
    _q: undefined,
    pokemon: v.pokemon || nom,
  };
  g.ventes.push(rest);
}

fs.mkdirSync(path.join(outDir, "ventes"), { recursive: true });
const index = { maj: isoToday(), fenetre: f, slugs: [] };
const bulk = [];

for (const g of [...groupes.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"))) {
  g.ventes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.prix - a.prix));
  const pack = {
    slug: g.slug,
    nom: g.nom,
    noms: [...g.noms],
    maj: isoToday(),
    ventes: g.ventes,
  };
  const file = path.join(outDir, "ventes", g.slug + ".json");
  fs.writeFileSync(file, JSON.stringify(pack));
  index.slugs.push({ slug: g.slug, nom: g.nom, noms: pack.noms, n: g.ventes.length });
  bulk.push({ key: "vente:" + g.slug, value: JSON.stringify(pack) });
}
bulk.push({ key: "meta:index", value: JSON.stringify(index) });
fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index, null, 2));
fs.writeFileSync(path.join(outDir, "bulk.json"), JSON.stringify(bulk));

console.log(
  "Écrit",
  index.slugs.length,
  "Pokémon,",
  recentes.length,
  "ventes affichables /",
  toutes.length,
  "lues, fenêtre",
  f.debut,
  "→",
  f.fin
);
console.log("KV bulk :", path.join(outDir, "bulk.json"));
console.log(
  "Chargement local : npx wrangler kv bulk put data/bulk.json --binding VENTES --local"
);
