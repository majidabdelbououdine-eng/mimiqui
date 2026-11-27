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
