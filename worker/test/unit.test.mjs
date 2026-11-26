import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { verifyStripeSignature } from "../src/stripe.js";
import { buildPayload, lastN, statsOf, LIBRE_N } from "../src/ventes.js";
import { testEnv, stripeSignature, seedPokemon, vente } from "./helpers.mjs";
import { startMockStripe } from "./mock-stripe.mjs";

function req(url, init, env) {
  return worker.fetch(new Request(url, init), env, {});
}

test("signature Stripe valide et rejet si altérée", async () => {
  const payload = "{\"id\":\"evt_1\"}";
  const secret = "whsec_abc";
  const sig = await stripeSignature(secret, payload, Math.floor(Date.now() / 1000));
  assert.equal(await verifyStripeSignature(payload, sig, secret), true);
  assert.equal(await verifyStripeSignature(payload + "x", sig, secret), false);
  assert.equal(await verifyStripeSignature(payload, sig, "whsec_other"), false);
  assert.equal(await verifyStripeSignature(payload, "", secret), false);
});

test("gratuit : toutes les ventes, sans aucun prix ni stats de prix", () => {
  const ventes = [1, 2, 3, 4, 5].map((n) =>
    vente({ id: "11223344" + n, prix: n * 10, date: "2026-11-0" + n, carte: "Pikachu " + n + " 25 €", lien: "https://www.ebay.fr/itm/11223344" + n })
  );
  const payload = buildPayload({
    pack: { slug: "pikachu", nom: "Pikachu", ventes },
    filtre: {},
    abonne: false,
    q: "Pikachu",
  });
  assert.equal(payload.abonne, false);
  assert.equal(payload.prix_reserves, true);
  assert.equal(payload.total, 5);
  assert.equal(payload.visible, 5);
  assert.equal(payload.masquees, 0);
  assert.equal(payload.ventes.length, 5);
  assert.deepEqual(payload.stats, []);
  assert.deepEqual(payload.ventes.map((v) => v.date), ["2026-11-05", "2026-11-04", "2026-11-03", "2026-11-02", "2026-11-01"]);
  for (const v of payload.ventes) {
    assert.equal(v.prix, undefined);
    assert.equal(v.devise, undefined);
    assert.equal(v.id, undefined);
    assert.equal(v.lien, undefined);
    assert.ok(!/€/.test(v.carte), v.carte);
    assert.match(v.carte, /^Pikachu \d$/);
  }
  for (const info of Object.values(payload.onglets)) assert.deepEqual(Object.keys(info), ["n"]);
  const brut = JSON.stringify({ ventes: payload.ventes, onglets: payload.onglets, stats: payload.stats });
  assert.ok(!/"(?:prix|moyen|min|max|devise|lien)"/.test(brut), brut);
  assert.ok(!/11223344/.test(brut));
  // Les calculs côté abonné restent disponibles.
  assert.equal(statsOf(ventes)[0].max, 50);
  assert.equal(lastN(ventes, 1)[0].id, "112233445");
  assert.equal(LIBRE_N, 3);
});

test("gratuit : pagination offset / limit", () => {
  const ventes = Array.from({ length: 130 }, (_, i) =>
    vente({ id: String(i), prix: i, date: "2026-" + String(1 + (i % 12)).padStart(2, "0") + "-01" })
  );
  const p1 = buildPayload({ pack: { slug: "p", nom: "P", ventes }, filtre: {}, abonne: false, q: "P" });
  assert.equal(p1.ventes.length, 60);
  assert.equal(p1.suivant, 60);
  const p3 = buildPayload({ pack: { slug: "p", nom: "P", ventes }, filtre: {}, abonne: false, q: "P", offset: "120", limit: "60" });
  assert.equal(p3.ventes.length, 10);
  assert.equal(p3.suivant, null);
  const gros = buildPayload({ pack: { slug: "p", nom: "P", ventes }, filtre: {}, abonne: false, q: "P", limit: "99999" });
  assert.equal(gros.ventes.length, 130 > 240 ? 240 : 130);
});

test("fail-closed : abonne doit valoir true exactement", () => {
  const ventes = [vente({ id: "1", prix: 9, date: "2026-11-01" })];
  for (const abonne of [undefined, null, "true", 1, {}]) {
    const p = buildPayload({ pack: { slug: "p", nom: "P", ventes }, filtre: {}, abonne, q: "P" });
    assert.equal(p.abonne, false);
    assert.equal(p.ventes[0].prix, undefined);
  }
});

test("abonné : toutes les ventes", () => {
  const ventes = [1, 2, 3, 4].map((n) => vente({ id: String(n), date: "2026-11-0" + n }));
  const payload = buildPayload({
    pack: { slug: "pikachu", nom: "Pikachu", ventes },
    filtre: {},
    abonne: true,
    q: "Pikachu",
  });
  assert.equal(payload.masquees, 0);
  assert.equal(payload.ventes.length, 4);
});

test("GET /api/ventes sans session : toutes les ventes, sans prix", async () => {
  const env = testEnv();
  await seedPokemon(env, "pikachu", [
    vente({ id: "a", prix: 1, date: "2026-11-01" }),
    vente({ id: "b", prix: 2, date: "2026-11-02" }),
    vente({ id: "c", prix: 3, date: "2026-11-03" }),
    vente({ id: "d", prix: 4, date: "2026-11-04" }),
  ], "Pikachu");
  const res = await req("http://127.0.0.1:8787/api/ventes?q=Pikachu", {}, env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.abonne, false);
  assert.equal(body.total, 4);
  assert.equal(body.ventes.length, 4);
  assert.equal(body.masquees, 0);
  assert.deepEqual(body.stats, []);
  assert.ok(body.ventes.every((v) => v.prix === undefined));
  assert.equal(res.headers.get("cache-control"), "private, no-store");
});

test("webhook checkout.session.completed enregistre l'abonné ; /moi puis ventes complètes", async () => {
  const stripe = await startMockStripe();
  try {
    const env = testEnv({ STRIPE_API_BASE: stripe.base });
    await seedPokemon(env, "pikachu", [
      vente({ id: "1", date: "2026-11-01" }),
      vente({ id: "2", date: "2026-11-02" }),
      vente({ id: "3", date: "2026-11-03" }),
      vente({ id: "4", date: "2026-11-04" }),
    ], "Pikachu");

    const chk = await req(
      "http://127.0.0.1:8787/api/checkout",
      {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ email: "abonne@example.com" }),
      },
      env
    );
    assert.equal(chk.status, 200);
    const created = await chk.json();
    assert.ok(created.url.startsWith("https://checkout.stripe.com/"));
    const sessionId = created.id;

    const event = {
      id: "evt_test",
      type: "checkout.session.completed",
      data: { object: stripe.state.sessions.get(sessionId) },
    };
    const payload = JSON.stringify(event);
    const sig = await stripeSignature(env.STRIPE_WEBHOOK_SECRET, payload);
    const wh = await req(
      "http://127.0.0.1:8787/api/webhook/stripe",
      { method: "POST", headers: { "stripe-signature": sig }, body: payload },
      env
    );
    assert.equal(wh.status, 200, await wh.clone().text());

    const merci = await req(
      "http://127.0.0.1:8787/api/merci?session_id=" + sessionId,
      {},
      env
    );
    assert.equal(merci.status, 200);
    const merciBody = await merci.json();
    assert.equal(merciBody.abonne, true);
    const setCookie = merci.headers.get("set-cookie") || "";
    assert.ok(setCookie.includes("mq_session="));
    assert.ok(/HttpOnly/i.test(setCookie));
    assert.ok(/SameSite=Lax/i.test(setCookie));
    assert.ok(!/Secure/i.test(setCookie), "pas de Secure sur http local");

    const cookie = setCookie.split(";")[0];
    const moi = await req("http://127.0.0.1:8787/api/moi", { headers: { cookie } }, env);
    const moiBody = await moi.json();
    assert.equal(moiBody.abonne, true);
    assert.equal(moiBody.email, "abonne@example.com");

    const full = await req(
      "http://127.0.0.1:8787/api/ventes?q=Pikachu",
      { headers: { cookie } },
      env
    );
    const fullBody = await full.json();
    assert.equal(fullBody.abonne, true);
    assert.equal(fullBody.ventes.length, 4);
    assert.equal(fullBody.masquees, 0);
    assert.ok(fullBody.ventes.every((v) => typeof v.prix === "number"));
    assert.ok(fullBody.stats.length > 0);
  } finally {
    await stripe.close();
  }
});

test("webhook sans signature valide est rejeté", async () => {
  const env = testEnv();
  const payload = JSON.stringify({ type: "checkout.session.completed", data: { object: {} } });
  const res = await req(
    "http://127.0.0.1:8787/api/webhook/stripe",
    { method: "POST", headers: { "stripe-signature": "t=1,v1=deadbeef" }, body: payload },
    env
  );
  assert.equal(res.status, 400);
});

test("lien magique restaure la session d'un abonné actif", async () => {
  const env = testEnv();
  await env.DB.prepare(
    "INSERT INTO subscribers (email, customer_id, subscription_id, status, period_end, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind("abonne@example.com", "cus_1", "sub_1", "active", 1999999999, 1)
    .run();
  const login = await req(
    "http://127.0.0.1:8787/api/login",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "abonne@example.com" }),
    },
    env
  );
  const body = await login.json();
  assert.equal(login.status, 200);
  assert.ok(body.dev_link);
  const cb = await req(body.dev_link, { redirect: "manual" }, env);
  assert.equal(cb.status, 303);
  const setCookie = cb.headers.get("set-cookie") || "";
  assert.ok(setCookie.includes("mq_session="));
  const cookie = setCookie.split(";")[0];
  const moi = await req("http://127.0.0.1:8787/api/moi", { headers: { cookie } }, env);
  assert.equal((await moi.json()).abonne, true);
});

test("abonnement résilié retire l'accès", async () => {
  const env = testEnv();
  await env.DB.prepare(
    "INSERT INTO subscribers (email, customer_id, subscription_id, status, period_end, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind("abonne@example.com", "cus_1", "sub_1", "active", 1999999999, 1)
    .run();
  const login = await req(
    "http://127.0.0.1:8787/api/login",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "abonne@example.com" }),
    },
    env
  );
  const link = (await login.json()).dev_link;
  const cb = await req(link, { redirect: "manual" }, env);
  const cookie = (cb.headers.get("set-cookie") || "").split(";")[0];

  const event = {
    type: "customer.subscription.deleted",
    data: { object: { id: "sub_1", customer: "cus_1", status: "canceled" } },
  };
  const payload = JSON.stringify(event);
  const sig = await stripeSignature(env.STRIPE_WEBHOOK_SECRET, payload);
  const wh = await req(
    "http://127.0.0.1:8787/api/webhook/stripe",
    { method: "POST", headers: { "stripe-signature": sig }, body: payload },
    env
  );
  assert.equal(wh.status, 200);
  const moi = await req("http://127.0.0.1:8787/api/moi", { headers: { cookie } }, env);
  assert.equal((await moi.json()).abonne, false);
});
