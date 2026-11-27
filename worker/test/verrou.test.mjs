import test from "node:test";
import assert from "node:assert/strict";
import { handleVerrou } from "../src/verrou.js";

const ventes = [1, 2, 3, 4, 5].map((i) => [["langues", "fr", 0, "ventes"], i - 1, { prix: i, date: "2026-10-0" + i }]);
const store = {
  "verrou:f:pkmn:test": JSON.stringify({ total: 5, ajouts: ventes }),
  "verrou:l:pkmn:test": JSON.stringify({
    total: 5,
    ajouts: ventes.slice(2),
    cartes: { "langues/fr/0": { total: 5, ajouts: ventes.slice(2) } },
  }),
  "verrou:f:prix:top-semaine": JSON.stringify({ total: 0, ajouts: [], valeurs: [[["ventes", 0, "prix"], 3250]] }),
};
const env = {
  VENTES: {
    async get(k, type) {
      const v = store[k];
      if (v == null) return null;
      return type === "json" ? JSON.parse(v) : v;
    },
  },
};
const req = (q) => new Request("https://mimiqui.fr/api/verrou?" + q);

test("non abonné : 3 ventes et nombre masqué", async () => {
  const j = await (await handleVerrou(env, req("k=pkmn:test"), null)).json();
  assert.equal(j.abonne, false);
  assert.equal(j.cles["pkmn:test"].ajouts.length, 3);
  assert.equal(j.cles["pkmn:test"].masquees, 2);
  for (const a of j.cles["pkmn:test"].ajouts) {
    assert.equal(a[2].prix, null);
    assert.equal(a[2].prix_masque, true);
    assert.ok(a[2].date);
  }
  const brut = JSON.stringify(j);
  assert.doesNotMatch(brut, /"prix":\d/);
});
test("non abonné, carte précise", async () => {
  const j = await (await handleVerrou(env, req("k=pkmn:test&carte=langues/fr/0"), null)).json();
  assert.equal(j.cles["pkmn:test"].ajouts.length, 3);
  assert.equal(j.cles["pkmn:test"].masquees, 2);
});
test("abonné : toutes les ventes, sans cache", async () => {
  const r = await handleVerrou(env, req("k=pkmn:test"), { abonne: true });
  assert.match(r.headers.get("cache-control"), /no-store/);
  const j = await r.json();
  assert.equal(j.cles["pkmn:test"].ajouts.length, 5);
  assert.equal(j.cles["pkmn:test"].ajouts[4][2].prix, 5);
});
test("clé invalide refusée", async () => {
  const r = await handleVerrou(env, req("k=../x"), null);
  assert.equal(r.status, 400);
});
test("clé absente : aucune vente", async () => {
  const j = await (await handleVerrou(env, req("k=pkmn:absent"), null)).json();
  assert.equal(j.cles["pkmn:absent"].ajouts.length, 0);
});
test("clé prix : non abonné, aucun montant ni lecture KV", async () => {
  let lu = 0;
  const env2 = { VENTES: { async get(k, t) { lu++; return env.VENTES.get(k, t); } } };
  const j = await (await handleVerrou(env2, req("k=prix:top-semaine,prix:registre"), null)).json();
  assert.equal(lu, 0);
  assert.equal(j.cles["prix:top-semaine"].prix_masques, true);
  assert.equal(j.cles["prix:top-semaine"].valeurs, undefined);
  assert.doesNotMatch(JSON.stringify(j), /3250/);
});
test("clé prix : abonné reçoit les montants", async () => {
  const j = await (await handleVerrou(env, req("k=prix:top-semaine"), { abonne: true })).json();
  assert.deepEqual(j.cles["prix:top-semaine"].valeurs[0], [["ventes", 0, "prix"], 3250]);
});
test("clé prix inconnue refusée", async () => {
  const r = await handleVerrou(env, req("k=prix:autre"), null);
  assert.equal(r.status, 400);
});
