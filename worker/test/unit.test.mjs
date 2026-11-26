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

test("gratuit : 3 dernières ventes + moyenne / min / max, pas le reste", () => {
  const ventes = [1, 2, 3, 4, 5].map((n) =>
    vente({ id: String(n), prix: n * 10, date: "2026-11-0" + n })
  );
  const payload = buildPayload({
    pack: { slug: "pikachu", nom: "Pikachu", ventes },
    filtre: {},
    abonne: false,
    q: "Pikachu",
  });
  assert.equal(payload.abonne, false);
  assert.equal(payload.total, 5);
  assert.equal(payload.visible, LIBRE_N);
  assert.equal(payload.masquees, 2);
  assert.equal(payload.ventes.length, 3);
  assert.deepEqual(
    payload.ventes.map((v) => v.id),
    ["5", "4", "3"]
  );
  const st = payload.stats[0];
  assert.equal(st.n, 5);
  assert.equal(st.min, 10);
  assert.equal(st.max, 50);
  assert.equal(st.moyen, 30);
  assert.ok(statsOf(ventes)[0]);
  assert.equal(lastN(ventes, 1)[0].id, "5");
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

test("GET /api/ventes sans session ne renvoie que 3 ventes", async () => {
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
  assert.equal(body.ventes.length, 3);
  assert.equal(body.masquees, 1);
  assert.equal(body.stats[0].max, 4);
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
