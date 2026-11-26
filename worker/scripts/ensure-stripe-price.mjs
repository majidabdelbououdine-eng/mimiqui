#!/usr/bin/env node
/**
 * Le prix live existe déjà : price_1Ub2KVRPA7ND4soIl9jsR9Ry
 * (produit prod_VcGsxG3KPu0cTb « Accès ventes mimiqui », 2,99 € / semaine).
 * Ne pas créer de second produit ou prix.
 * Ce script ne doit être lancé qu'en cas de disparition du prix, et jamais
 * pendant les tests automatiques.
 */
/**
 * Crée (ou réutilise) le prix d'abonnement 2,99 € / semaine.
 * À lancer avec une clé TEST ou LIVE — jamais affichée.
 *
 *   STRIPE_SECRET_KEY=sk_test_… node scripts/ensure-stripe-price.mjs
 *
 * Affiche le PRICE_ID à mettre dans wrangler secret / vars.
 */
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY manquante (ne la collez pas dans le chat).");
  process.exit(1);
}
if (process.env.MIMIQUI_REUSE_PRICE_ONLY === "1") {
  console.log("PRICE_ID=price_1Ub2KVRPA7ND4soIl9jsR9Ry");
  process.exit(0);
}
const base = (process.env.STRIPE_API_BASE || "https://api.stripe.com").replace(/\/$/, "");
const version = "2026-11-18.endive";

async function stripe(method, path, params) {
  const init = {
    method,
    headers: {
      authorization: "Bearer " + key,
      "stripe-version": version,
    },
  };
  let url = base + path;
  if (params && method === "GET") {
    url += "?" + new URLSearchParams(params);
  } else if (params) {
    init.headers["content-type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(params);
  }
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data.error && data.error.message) || "Stripe " + res.status);
  }
  return data;
}

const productName = "Archive des ventes – Le Coin de Mimiqui";
const products = await stripe("GET", "/v1/products", { limit: "100", active: "true" });
let product = (products.data || []).find((p) => p.name === productName || p.metadata?.mimiqui === "archive");
if (!product) {
  product = await stripe("POST", "/v1/products", {
    name: productName,
    "metadata[mimiqui]": "archive",
    description: "Accès à l’historique des ventes de l’archive (365 jours) sur mimiqui.fr.",
  });
  console.log("Produit créé :", product.id);
} else {
  console.log("Produit existant :", product.id);
}

const prices = await stripe("GET", "/v1/prices", {
  product: product.id,
  active: "true",
  limit: "20",
});
let price = (prices.data || []).find(
  (p) =>
    p.currency === "eur" &&
    p.unit_amount === 299 &&
    p.recurring &&
    p.recurring.interval === "week" &&
    p.recurring.interval_count === 1
);
if (!price) {
  price = await stripe("POST", "/v1/prices", {
    product: product.id,
    currency: "eur",
    unit_amount: "299",
    "recurring[interval]": "week",
    "recurring[interval_count]": "1",
    nickname: "2,99 € / semaine",
  });
  console.log("Prix créé :", price.id);
} else {
  console.log("Prix existant :", price.id);
}
console.log("PRICE_ID=" + price.id);
