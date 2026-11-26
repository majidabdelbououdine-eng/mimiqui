import { norm, slugify, json } from "./util.js";

export const LIBRE_N = 3;

export function statsOf(ventes) {
  const byDev = {};
  for (const v of ventes || []) {
    const dev = String(v.devise || "EUR").toUpperCase();
    if (!byDev[dev]) byDev[dev] = [];
    byDev[dev].push(Number(v.prix));
  }
  return Object.keys(byDev)
    .sort()
    .map((devise) => {
      const p = byDev[devise].filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
      if (!p.length) return null;
      const somme = p.reduce((a, b) => a + b, 0);
      return {
        devise,
        n: p.length,
        moyen: somme / p.length,
        min: p[0],
        max: p[p.length - 1],
      };
    })
    .filter(Boolean);
}

export function lastN(ventes, n) {
  return (ventes || [])
    .slice()
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return (b.prix || 0) - (a.prix || 0);
    })
    .slice(0, n);
}

export function filterVentes(ventes, query) {
  const set = query.set || "";
  const langue = query.langue || "";
  const mois = query.mois || "";
  const q = norm(query.q || "");
  return (ventes || []).filter((v) => {
    if (set && v.set !== set) return false;
    if (langue && String(v.langue || "") !== langue) return false;
    if (mois && String(v.date || "").slice(0, 7) !== mois) return false;
    if (q) {
      const hay = v._q || norm([v.carte, v.pokemon, v.numero, v.set].filter(Boolean).join(" "));
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });
}

export async function loadIndex(env) {
  return (await env.VENTES.get("meta:index", "json")) || { slugs: [] };
}

export function findMatches(index, q) {
  const nq = norm(q);
  if (nq.length < 2) return [];
  const slugs = index.slugs || index || [];
  const exact = [];
  const start = [];
  const mid = [];
  for (const row of slugs) {
    const slug = row.slug || row;
    const noms = row.noms || [row.nom, slug].filter(Boolean);
    const hay = [slug, ...noms].map(norm);
    if (hay.some((h) => h === nq || slugify(h) === slugify(nq))) exact.push(row);
    else if (hay.some((h) => h.startsWith(nq))) start.push(row);
    else if (hay.some((h) => h.includes(nq))) mid.push(row);
  }
  return [...exact, ...start, ...mid];
}

export async function loadPokemon(env, slug) {
  return env.VENTES.get("vente:" + slug, "json");
}

export function uniqueValues(ventes, key) {
  const vu = {};
  const out = [];
  for (const v of ventes || []) {
    const val = v[key];
    if (!val || vu[val]) continue;
    vu[val] = 1;
    out.push(val);
  }
  return out;
}

export function monthsOf(ventes) {
  const vu = {};
  const out = [];
  for (const v of ventes || []) {
    const ym = String(v.date || "").slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(ym) || vu[ym]) continue;
    vu[ym] = 1;
    out.push(ym);
  }
  out.sort();
  return out;
}

export function sourcesOf(ventes) {
  const par = {};
  for (const v of ventes || []) {
    const s = v.source || "Autre";
    par[s] = (par[s] || 0) + 1;
  }
  return par;
}

// Aligné sur archive-ventes.js (ne pas interpréter un état absent).
const ETATS_BRUTS = { nm: 1, ex: 1, bon: 1, neuve: 1, occasion: 1 };
export const GROUPES = [
  { id: "brute-fr", titre: "Cartes brutes — Français", court: "Brutes FR" },
  { id: "brute-ja", titre: "Cartes brutes — Japonais", court: "Brutes JP" },
  { id: "brute-en", titre: "Cartes brutes — Anglais", court: "Brutes EN" },
  { id: "gradee", titre: "Cartes gradées", court: "Gradées" },
  { id: "autre", titre: "Autre / non précisé", court: "Autre / non précisé" },
];
const GRADEURS_TITRE = /\b(?:psa|pca|cgc|bgs)\b/i;

function texteDetection(v) {
  return [v && v.carte, v && v.numero, v && v.set, v && v.etat, v && v.edition, v && v.pokemon, v && v.source]
    .filter(Boolean)
    .join(" ");
}
export function etatClasse(v) {
  let e = String((v && v.etat) || "").trim();
  if (e === "—" || e === "-" || e === "–") e = "";
  const n = norm(e);
  if (n.indexOf("gradee") === 0) return "gradee";
  if (ETATS_BRUTS[n]) return "brute";
  if (GRADEURS_TITRE.test(texteDetection(v))) return "gradee";
  return "autre";
}
function langueDepuisTitre(v) {
  const t = " " + norm(texteDetection(v)) + " ";
  if (/\bfrancais(?:e|es)?\b|\bfrench\b|\bfr\b/.test(t)) return "fr";
  if (/\bjaponais(?:e|es)?\b|\bjapanese\b|\bjp\b|\bjpn\b/.test(t)) return "ja";
  if (/\banglais(?:e|es)?\b|\benglish\b/.test(t)) return "en";
  if (/\(\s*en\s*\)|\[\s*en\s*\]|\/\s*en(?:\s|\/|$)|(?:^|\s)en\s*\/|\blangue\s*en\b|\ben-us\b|\bus-en\b/.test(t)) return "en";
  return "";
}
export function langueClasse(v) {
  let code = String((v && v.langue) || "").toLowerCase().trim();
  if (code === "jp") code = "ja";
  if (code === "fr" || code === "ja" || code === "en") return code;
  if (!code) return langueDepuisTitre(v);
  return "";
}
export function groupeDe(v) {
  const et = etatClasse(v);
  if (et === "gradee") return "gradee";
  if (et === "brute") {
    const l = langueClasse(v);
    if (l) return "brute-" + l;
  }
  return "autre";
}
export function ongletsOf(ventes) {
  const map = {};
  for (const g of GROUPES) map[g.id] = [];
  for (const v of ventes || []) {
    const id = groupeDe(v);
    (map[id] || map.autre).push(v);
  }
  const out = {};
  for (const g of GROUPES) {
    const sous = map[g.id] || [];
    if (!sous.length) continue;
    out[g.id] = { n: sous.length, stats: statsOf(sous) };
  }
  return out;
}

/**
 * Réponse API : les stats portent sur toutes les ventes du Pokémon (filtre compris).
 * Les ventes renvoyées sont limitées à 3 si le visiteur n'est pas abonné.
 */
export function buildPayload({ pack, filtre, abonne, q, matches }) {
  if (matches) {
    return { abonne, q, matches, prix: "2,99 € / semaine" };
  }
  const toutes = filterVentes((pack && pack.ventes) || [], filtre);
  const onglet = filtre.onglet || "";
  const cible = onglet ? toutes.filter((v) => groupeDe(v) === onglet) : toutes;
  const stats = statsOf(toutes);
  const onglets = ongletsOf(toutes);
  const sets = uniqueValues(toutes, "set").sort((a, b) => a.localeCompare(b, "fr"));
  const langues = uniqueValues(toutes, "langue").sort();
  const mois = monthsOf(toutes);
  const sources = sourcesOf(toutes);
  const visible = abonne ? lastN(cible, 5000) : lastN(cible, LIBRE_N);
  const baseTotal = cible.length;
  return {
    abonne: !!abonne,
    q: q || "",
    slug: pack && pack.slug,
    nom: pack && pack.nom,
    onglet: onglet || "",
    total: toutes.length,
    total_onglet: baseTotal,
    visible: visible.length,
    masquees: abonne ? 0 : Math.max(0, baseTotal - visible.length),
    stats,
    onglets,
    sets,
    langues,
    mois,
    sources,
    ventes: visible,
    prix: "2,99 € / semaine",
    maj: pack && pack.maj,
  };
}

export async function handleVentes(env, request, session) {
  const u = new URL(request.url);
  const q = (u.searchParams.get("q") || u.searchParams.get("pokemon") || "").trim();
  const slugParam = (u.searchParams.get("slug") || "").trim();
  const filtre = {
    q: "",
    set: u.searchParams.get("set") || "",
    langue: u.searchParams.get("langue") || "",
    mois: u.searchParams.get("mois") || "",
    onglet: u.searchParams.get("onglet") || "",
  };
  const abonne = !!(session && session.abonne);

  if (!q && !slugParam) {
    return json({
      abonne,
      q: "",
      besoin: "pokemon",
      message: "Cherchez un Pokémon pour voir les ventes de l’archive.",
      prix: "2,99 € / semaine",
    });
  }

  const index = await loadIndex(env);
  let pack = null;
  if (slugParam) {
    pack = await loadPokemon(env, slugify(slugParam));
  }
  if (!pack && q) {
    const matches = findMatches(index, q);
    if (matches.length === 0) {
      return json({
        abonne,
        q,
        matches: [],
        total: 0,
        ventes: [],
        stats: [],
        message: "Aucune vente trouvée pour « " + q + " ».",
        prix: "2,99 € / semaine",
      });
    }
    if (matches.length > 1 && !matches.some((m) => norm(m.nom) === norm(q) || m.slug === slugify(q))) {
      return json({
        abonne,
        q,
        matches: matches.slice(0, 20).map((m) => ({
          slug: m.slug,
          nom: m.nom,
          n: m.n,
        })),
        prix: "2,99 € / semaine",
      });
    }
    const chosen = matches.find((m) => norm(m.nom) === norm(q) || m.slug === slugify(q)) || matches[0];
    pack = await loadPokemon(env, chosen.slug);
  }
  if (!pack) {
    return json({
      abonne,
      q,
      matches: [],
      total: 0,
      ventes: [],
      stats: [],
      message: "Aucune vente trouvée pour « " + (q || slugParam) + " ».",
      prix: "2,99 € / semaine",
    });
  }
  return json(buildPayload({ pack, filtre, abonne, q: q || pack.nom }));
}
