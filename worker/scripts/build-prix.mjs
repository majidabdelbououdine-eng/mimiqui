#!/usr/bin/env node
/**
 * Retire les MONTANTS des ventes des fichiers publics (top ventes, ventes des sets, PSA 10,
 * registre Spécial Mimiqui, carte de la semaine de l'accueil) et prépare les clés KV
 * « verrou:f:prix:<nom> » servies aux seuls abonnés par /api/verrou (clés « prix: »).
 * Tout le reste (cartes, photos, titres, dates, liens eBay campid) reste public.
 *
 *   node scripts/build-prix.mjs --sources <dossier privé>              # KV seulement
 *   node scripts/build-prix.mjs --sources <dossier privé> --appliquer  # KV + fichiers publics
 *
 * Les originaux (avec prix) restent HORS dépôt : /home/box/mimiqui-verrou-sources/prix-avant-masquage/.
 * Sortie KV : worker/data/prix-bulk.json (ignoré par git) → wrangler kv bulk put --binding VENTES --remote.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, "../..");
const args = process.argv.slice(2);
const APPLIQUER = args.includes("--appliquer");
const iS = args.indexOf("--sources");
const SOURCES = iS >= 0 ? path.resolve(args[iS + 1]) : RACINE;
const RESERVE = "Prix réservé aux abonnés";

const DONNEES = [
  { nom: "top-semaine", fichier: "data-top-ventes-semaine.js", chemins: [["ventes", "*", "prix"]] },
  { nom: "ventes-sets", fichier: "ventes-sets-data.js", chemins: [["ventes", "*", "p"], ["grades", "*", "p"]] },
  {
    nom: "psa10", fichier: "psa10-donnees.js",
    chemins: [["cartes", "*", "ventes", "*", "p"], ["cartes", "*", "st", "min"], ["cartes", "*", "st", "max"], ["cartes", "*", "st", "med"], ["cartes", "*", "annonces", "*", "p"]],
  },
  { nom: "registre", fichier: "registre-ventes-data.js", chemins: [["*", "prix"]] },
];

function lireGlobal(src) {
  const m = /window\.([A-Z_0-9]+)\s*=\s*/.exec(src);
  if (!m) throw new Error("global introuvable");
  const debut = m.index + m[0].length;
  let i = debut, prof = 0, dansChaine = false, ech = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (dansChaine) { if (ech) ech = false; else if (c === "\\") ech = true; else if (c === '"') dansChaine = false; continue; }
    if (c === '"') dansChaine = true;
    else if (c === "{" || c === "[") prof++;
    else if (c === "}" || c === "]") { prof--; if (prof === 0) { i++; break; } }
  }
  return { nom: m[1], avant: src.slice(0, m.index), obj: JSON.parse(src.slice(debut, i)), apres: src.slice(i) };
}

function extraire(obj, motif) {
  const out = [];
  (function marcher(o, k, ch) {
    if (o == null) return;
    if (k === motif.length - 1) {
      const champ = motif[k];
      if (typeof o[champ] === "number") { out.push([[...ch, champ], o[champ]]); o[champ] = null; }
      return;
    }
    const seg = motif[k];
    if (seg === "*") { if (Array.isArray(o)) o.forEach((x, i) => marcher(x, k + 1, [...ch, i])); }
    else marcher(o[seg], k + 1, [...ch, seg]);
  })(obj, 0, []);
  return out;
}

const kv = [];
const rapport = [];
for (const d of DONNEES) {
  const g = lireGlobal(fs.readFileSync(path.join(SOURCES, d.fichier), "utf8"));
  const valeurs = d.chemins.flatMap((c) => extraire(g.obj, c));
  kv.push({ key: "verrou:f:prix:" + d.nom, value: JSON.stringify({ total: 0, ajouts: [], valeurs }) });
  rapport.push(d.fichier + " : " + valeurs.length + " montants retirés");
  if (APPLIQUER) {
    const entete = "/* Montants des ventes retirés de ce fichier public : réservés aux abonnés (/api/verrou, clé prix:" + d.nom + "). */\n";
    fs.writeFileSync(path.join(RACINE, d.fichier), entete + g.avant + "window." + g.nom + "=" + JSON.stringify(g.obj) + g.apres);
  }
}

// HTML : registre.html (récap « N ventes · X € à Y € » et chaque vente « <li><b>X €</b> »).
{
  const src = fs.readFileSync(path.join(SOURCES, "registre.html"), "utf8");
  const textes = [];
  const span = (txt, balise) => {
    textes.push(txt);
    return balise === "b"
      ? '<b class="mq-prix-reserve" data-mqp="registre-page:' + (textes.length - 1) + '">' + RESERVE + "</b>"
      : '<span class="mq-prix-reserve" data-mqp="registre-page:' + (textes.length - 1) + '">' + RESERVE + "</span>";
  };
  let html = src.replace(/<span class="rr">(\d+ ventes? · )([^<'"]*€)<\/span>/g, (m, a, b) => '<span class="rr">' + a + span(b, "span") + "</span>");
  html = html.replace(/<li><b>([0-9][0-9\s\u00a0\u202f.,]*€)<\/b>/g, (m, a) => "<li>" + span(a, "b"));
  kv.push({ key: "verrou:f:prix:registre-page", value: JSON.stringify({ total: 0, ajouts: [], textes }) });
  rapport.push("registre.html : " + textes.length + " montants retirés");
  if (APPLIQUER) fs.writeFileSync(path.join(RACINE, "registre.html"), html);
}
// HTML : index.html, carte de la semaine.
{
  const src = fs.readFileSync(path.join(SOURCES, "index.html"), "utf8");
  const textes = [];
  const html = src.replace(/<p class="mq-cs-prix">([^<]+)<\/p>/g, (m, a) => {
    textes.push(a.replace(/&nbsp;/g, "\u00a0"));
    return '<p class="mq-cs-prix"><span class="mq-prix-reserve" data-mqp="accueil:' + (textes.length - 1) + '">' + RESERVE + "</span></p>";
  });
  kv.push({ key: "verrou:f:prix:accueil", value: JSON.stringify({ total: 0, ajouts: [], textes }) });
  rapport.push("index.html : " + textes.length + " montant(s) retiré(s)");
  if (APPLIQUER) fs.writeFileSync(path.join(RACINE, "index.html"), html);
}

fs.mkdirSync(path.join(ICI, "../data"), { recursive: true });
fs.writeFileSync(path.join(ICI, "../data/prix-bulk.json"), JSON.stringify(kv));
console.log(rapport.join("\n"));
console.log(kv.length + " clés KV → worker/data/prix-bulk.json" + (APPLIQUER ? " ; fichiers publics réécrits" : ""));
