import { json } from "./util.js";

/**
 * GET /api/verrou?k=<clé>[,<clé>…][&carte=<langues/fr/12>]
 * Ventes terminées des fiches Pokémon et des pages de sets.
 * - abonné : toutes les ventes (texte KV renvoyé tel quel, sans re-parse) ;
 * - sinon : 3 ventes les plus récentes (de la page, ou de la carte demandée) SANS PRIX + nombre masqué.
 * Fail-closed : sans KV ou en cas d'erreur, aucune vente n'est renvoyée.
 */
const CLE_OK = /^(?:pkmn|page):[a-z0-9-]{1,80}$|^(?:set-de-base|ventes-30anniv|ventes-chaos|ventes-equilibre|ventes-nuit-noire)$|^prix:(?:top-semaine|ventes-sets|psa10|registre|registre-page|accueil)$/;
/** Clés « prix: » : seulement les montants retirés des fichiers publics (top ventes, PSA 10, registre…).
 *  Abonné : valeurs KV « verrou:f:prix:<nom> » ; sinon rien (aucune lecture KV, aucun montant). */
const PRIX_SEULS = /^prix:/;
const PRIX = "2,99 € / semaine";
const NO_STORE = { "cache-control": "private, no-store" };
const CHAMPS_PRIX = ["p", "prix", "prix_eur", "price"];

/** Ventes libres pour non-abonnés : mêmes champs, mais prix mis à null (aucun montant envoyé). */
export function sansPrix(ajouts) {
  return (ajouts || []).map((a) => {
    const v = { ...(a[2] || {}) };
    for (const k of CHAMPS_PRIX) if (k in v) v[k] = null;
    v.prix_masque = true;
    return [a[0], a[1], v];
  });
}

export async function handleVerrou(env, request, session) {
  const u = new URL(request.url);
  const cles = [...new Set((u.searchParams.get("k") || "").split(",").map((s) => s.trim()).filter(Boolean))].slice(0, 6);
  if (!cles.length || !cles.every((c) => CLE_OK.test(c))) {
    return json({ error: "Clé invalide" }, 400, NO_STORE);
  }
  const carte = (u.searchParams.get("carte") || "").trim();
  if (carte && !/^langues\/(fr|ja|en)\/\d{1,5}$/.test(carte)) {
    return json({ error: "Carte invalide" }, 400, NO_STORE);
  }
  const abonne = !!(session && session.abonne);

  if (abonne) {
    // Concaténation des valeurs KV brutes : pas de JSON.parse sur les grosses pages.
    const parts = [];
    for (const c of cles) {
      const raw = await env.VENTES.get("verrou:f:" + c, "text");
      parts.push(JSON.stringify(c) + ":" + (raw || '{"total":0,"ajouts":[]}'));
    }
    const body = '{"abonne":true,"prix":' + JSON.stringify(PRIX) + ',"cles":{' + parts.join(",") + "}}";
    return new Response(body, {
      headers: { "content-type": "application/json; charset=utf-8", ...NO_STORE },
    });
  }

  const out = {};
  for (const c of cles) {
    if (PRIX_SEULS.test(c)) {
      out[c] = { total: 0, ajouts: [], masquees: 0, prix_masques: true };
      continue;
    }
    const val = await env.VENTES.get("verrou:l:" + c, "json");
    if (!val) {
      out[c] = { total: 0, ajouts: [], masquees: 0, absent: true };
      continue;
    }
    if (carte && val.cartes) {
      const sous = val.cartes[carte] || { total: 0, ajouts: [] };
      out[c] = {
        total: val.total,
        total_carte: sous.total,
        ajouts: sansPrix(sous.ajouts),
        masquees: Math.max(0, sous.total - sous.ajouts.length),
        masquees_page: Math.max(0, val.total - sous.ajouts.length),
      };
    } else {
      out[c] = {
        total: val.total,
        ajouts: sansPrix(val.ajouts),
        masquees: Math.max(0, val.total - val.ajouts.length),
      };
    }
  }
  return json({ abonne: false, prix: PRIX, libres: 3, prix_masques: true, cles: out }, 200, NO_STORE);
}
