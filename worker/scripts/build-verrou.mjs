#!/usr/bin/env node
/**
 * Cadenas des ventes terminées (fiches Pokémon et pages de sets).
 *
 * 1. Lit les ventes encore publiques : fichiers data-<pokemon>-ventes.js,
 *    data-set-de-base-ventes.js, ventes-*.js et tableaux « var C=[…] » des pages de sets.
 * 2. Écrit worker/data/verrou-bulk.json (clés KV « verrou:f:<clé> » = toutes les ventes,
 *    « verrou:l:<clé> » = 3 ventes libres + comptes), à charger dans KV VENTES.
 * 3. Avec --appliquer : réécrit les fichiers publics sans les ventes et branche
 *    verrou-ventes.js (les pages relisent les ventes via /api/verrou).
 *
 * Refuse de tourner sur des fichiers déjà vidés (sinon KV serait écrasé par du vide).
 *
 * Usage (depuis worker/) :
 *   node scripts/build-verrou.mjs                # KV seulement (sources = racine du dépôt)
 *   node scripts/build-verrou.mjs --appliquer    # KV + réécriture des fichiers publics
 *   node scripts/build-verrou.mjs --sources <dossier privé> # relire des sources gardées hors dépôt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const root = path.resolve(opt("--root", path.join(__dirname, "../..")));
const sources = path.resolve(opt("--sources", root));
const outDir = path.resolve(opt("--out", path.join(__dirname, "../data")));
const APPLIQUER = args.includes("--appliquer");
const LIBRES = 3;
const VERSION = "20261127p";
const TAG = '<script src="verrou-ventes.js?v=' + VERSION + '"></script>';

const PRIX = ["p", "prix", "prix_eur"];
const DATE = ["d", "date", "date_vente"];
const estVente = (x) =>
  x && typeof x === "object" && !Array.isArray(x) && PRIX.some((k) => k in x) && DATE.some((k) => k in x);
const estTableauVentes = (a) => Array.isArray(a) && a.length > 0 && a.every(estVente);

function dateIso(v) {
  const d = String(v.date || v.d || v.date_vente || "").trim();
  let m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + "-" + m[2] + "-" + m[3];
  m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0");
  return "";
}
const prixDe = (v) => Number(v.p != null ? v.p : v.prix != null ? v.prix : v.prix_eur) || 0;

/** Retire les tableaux de ventes de obj (en place) et renvoie [[chemin, index, vente], …]. */
function extraire(obj) {
  const out = [];
  (function walk(o, p) {
    if (Array.isArray(o)) {
      if (estTableauVentes(o)) {
        o.forEach((v, i) => out.push([p.slice(), i, v]));
        o.length = 0;
        return;
      }
      o.forEach((x, i) => walk(x, p.concat(i)));
    } else if (o && typeof o === "object") {
      for (const k of Object.keys(o)) walk(o[k], p.concat(k));
    }
  })(obj, []);
  return out;
}

function recentes(list) {
  return list
    .filter((e) => !(e[2] && e[2].lot === true) && dateIso(e[2]))
    .sort((a, b) => {
      const da = dateIso(a[2]), db = dateIso(b[2]);
      if (da !== db) return da < db ? 1 : -1;
      return prixDe(b[2]) - prixDe(a[2]);
    });
}

function libre(list, parCarte) {
  const val = { total: list.length, ajouts: recentes(list).slice(0, LIBRES) };
  if (parCarte) {
    const g = {};
    for (const e of list) {
      const k = e[0].slice(0, parCarte).join("/");
      (g[k] = g[k] || []).push(e);
    }
    val.cartes = {};
    for (const k of Object.keys(g)) val.cartes[k] = { total: g[k].length, ajouts: recentes(g[k]).slice(0, LIBRES) };
  }
  return val;
}

function lireAssign(src) {
  const m = src.match(/window\.([A-Z0-9_]+)\s*=\s*/);
  if (!m) return null;
  const start = m.index + m[0].length;
  const end = finJson(src, start);
  return { nom: m[1], start, end, obj: JSON.parse(src.slice(start, end)) };
}
/** Fin d'une valeur JSON qui commence à i (tableau ou objet), en respectant les chaînes. */
function finJson(s, i) {
  let depth = 0, inStr = false;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (inStr) {
      if (c === "\\") j++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") {
      depth--;
      if (depth === 0) return j + 1;
    }
  }
  throw new Error("JSON non terminé");
}

const kv = [];
const resume = [];
const reecritures = new Map(); // fichier -> contenu
function ajouterCle(cle, list, parCarte) {
  kv.push({ key: "verrou:f:" + cle, value: JSON.stringify({ total: list.length, ajouts: list }) });
  kv.push({ key: "verrou:l:" + cle, value: JSON.stringify(libre(list, parCarte)) });
}
function lire(f) {
  return fs.readFileSync(path.join(sources, f), "utf8");
}
function lirePublic(f) {
  return reecritures.has(f) ? reecritures.get(f) : fs.readFileSync(path.join(root, f), "utf8");
}

// ---------- 1. Fichiers de données (globales) ----------
const fichiers = fs.readdirSync(sources).filter((f) => /^data-.+-ventes\.js$/.test(f) || /^ventes-(30anniv|chaos|equilibre|nuit-noire)\.js$/.test(f));
const globales = {}; // NOM_GLOBAL -> clé
for (const f of fichiers.sort()) {
  const src = lire(f);
  if (src.includes("verrou-ventes")) throw new Error(f + " déjà vidé : utilisez --sources");
  const a = lireAssign(src);
  if (!a) continue;
  const list = extraire(a.obj);
  if (!list.length) continue; // rien à verrouiller : fichier laissé tel quel
  const pk = f.match(/^data-(.+)-ventes\.js$/);
  const cle = pk ? (pk[1] === "set-de-base" ? "set-de-base" : "pkmn:" + pk[1]) : f.replace(/\.js$/, "");
  const parCarte = pk && pk[1] !== "set-de-base" ? 3 : 0; // langues/<lang>/<index>
  ajouterCle(cle, list, parCarte);
  globales[a.nom] = cle;
  resume.push({ fichier: f, cle, ventes: list.length });
  const note = "/* Ventes terminées retirées de ce fichier public : elles sont servies par /api/verrou (cadenas abonnés). */\n";
  reecritures.set(f, note + src.slice(0, a.start) + JSON.stringify(a.obj) + src.slice(a.end));
}
if (globales.PKMN_VENTES) delete globales.PKMN_VENTES;

// ---------- 2. Pages HTML ----------
function enrober(html, i0, i1, cles, avant, apres, cibles) {
  // html.slice(i0, i1) = contenu du <script> ; on l'enrobe dans MQV.attendre.
  const corps = html.slice(i0, i1);
  const nouveau =
    "MQV.attendre(" + JSON.stringify(cles) + ",function(){" + avant + corps + apres + "}," + JSON.stringify({ cibles }) + ");";
  return html.slice(0, i0) + nouveau + html.slice(i1);
}
function ajouterTag(html, posScript) {
  if (html.includes("verrou-ventes.js")) return html;
  return html.slice(0, posScript) + TAG + "\n" + html.slice(posScript);
}

const pagesHtml = fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort();
for (const f of pagesHtml) {
  if (f === "carte-pikachu.html") continue; // fiche : branchée à la main (chargement dynamique)
  let html = lirePublic(f);
  const srcHtml = sources === root ? html : fs.existsSync(path.join(sources, f)) ? lire(f) : html;
  if (html.includes("verrou-ventes.js")) throw new Error(f + " déjà branché");
  const re = /<script>([\s\S]*?)<\/script>/g;
  let m, changed = false;
  const blocs = [];
  while ((m = re.exec(html))) blocs.push({ start: m.index, i0: m.index + 8, i1: m.index + 8 + m[1].length, body: m[1] });
  for (const b of blocs.reverse()) {
    let body = b.body;
    const cles = [];
    let avant = "";
    let cibles = [];
    // a) tableau de cartes inline
    const cm = body.indexOf("(function(){var C=[");
    let cleC = null;
    if (cm === 0 || (cm > 0 && body.slice(0, cm).trim() === "")) {
      const s0 = cm + "(function(){var C=".length;
      const s1 = finJson(body, s0);
      const C = JSON.parse(body.slice(s0, s1));
      // source privée éventuelle (même page)
      let Csrc = C;
      if (srcHtml !== html) {
        const k = srcHtml.indexOf("(function(){var C=[");
        Csrc = JSON.parse(srcHtml.slice(k + 18, finJson(srcHtml, k + 18)));
      }
      const list = extraire(Csrc === C ? C : Csrc);
      if (Csrc !== C) extraire(C);
      if (list.length) {
        cleC = "page:" + f.replace(/\.html$/, "");
        ajouterCle(cleC, list, 0);
        resume.push({ fichier: f, cle: cleC, ventes: list.length });
        body = body.slice(0, s0) + JSON.stringify(C) + ";MQV.injecter(" + JSON.stringify(cleC) + ",C)" + body.slice(s1).replace(/^;/, ";");
        cles.push(cleC);
        cibles = [{ avant: "#list" }, { dans: "#vp-in" }];
      }
    }
    // b) globales de données utilisées par ce script
    for (const [nom, cle] of Object.entries(globales)) {
      const reN = new RegExp("\\b" + nom + "\\b");
      if (!reN.test(body)) continue;
      cles.push(cle);
      avant += "MQV.injecter(" + JSON.stringify(cle) + ",window." + nom + ");";
      if (cle.startsWith("pkmn:")) cibles = [{ dans: "#dernieres-ventes" }];
      else if (!cibles.length) {
        if (html.includes('id="ep-grid"')) cibles = [{ avant: "#ep-grid" }];
        else if (html.includes('id="list"')) cibles = [{ avant: "#list" }, { dans: "#vp-in" }];
      }
    }
    if (!cles.length) continue;
    // page Vendre : pas de bandeau (outil de prix), données réduites pour les non-abonnés
    if (f === "vendre.html") cibles = [];
    // corps sans la première ligne vide éventuelle
    html = html.slice(0, b.i0) + body + html.slice(b.i1);
    html = enrober(html, b.i0, b.i0 + body.length, cles, avant, "", cibles);
    html = ajouterTag(html, b.start);
    changed = true;
  }
  if (changed) reecritures.set(f, html);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "verrou-bulk.json"), JSON.stringify(kv));
fs.writeFileSync(path.join(outDir, "verrou-resume.json"), JSON.stringify(resume, null, 1));
const total = resume.reduce((s, r) => s + r.ventes, 0);
console.log("Clés KV :", kv.length, "· sources :", resume.length, "· ventes :", total);
console.log("Fichiers publics à réécrire :", reecritures.size);
if (APPLIQUER) {
  for (const [f, c] of reecritures) fs.writeFileSync(path.join(root, f), c);
  console.log("Réécrit.");
} else {
  console.log("(simulation : ajouter --appliquer pour réécrire les fichiers publics)");
}
