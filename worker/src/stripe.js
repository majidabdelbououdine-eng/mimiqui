import { hmacHex, timingSafeEqual } from "./util.js";

const STRIPE_VERSION = "2026-11-18.endive";

export function stripeBase(env) {
  return (env.STRIPE_API_BASE || "https://api.stripe.com").replace(/\/$/, "");
}

function flatten(params, prefix, out) {
  out = out || new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    const key = prefix ? prefix + "[" + k + "]" : k;
    if (v == null) continue;
    if (typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === "object") flatten(item, key + "[" + i + "]", out);
        else out.append(key + "[" + i + "]", String(item));
      });
    } else out.append(key, String(v));
  }
  return out;
}

export async function stripe(env, method, path, params) {
  if (!env.STRIPE_SECRET_KEY) {
    const err = new Error("STRIPE_SECRET_KEY manquante");
    err.status = 503;
    throw err;
  }
  const url = stripeBase(env) + path;
  const init = {
    method,
    headers: {
      authorization: "Bearer " + env.STRIPE_SECRET_KEY,
      "stripe-version": STRIPE_VERSION,
    },
  };
  if (method === "GET") {
    const q = flatten(params);
    const u = url + (q.toString() ? (url.includes("?") ? "&" : "?") + q.toString() : "");
    const res = await fetch(u, init);
    return parseStripe(res);
  }
  init.headers["content-type"] = "application/x-www-form-urlencoded";
  init.body = flatten(params);
  const res = await fetch(url, init);
  return parseStripe(res);
}

async function parseStripe(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: { message: text.slice(0, 400) } };
  }
  if (!res.ok) {
    const err = new Error((data.error && data.error.message) || "Erreur Stripe " + res.status);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/** Vérifie l'en-tête Stripe-Signature (schéma t=,v1=). */
export async function verifyStripeSignature(payload, header, secret) {
  if (!secret || !header) return false;
  const parts = {};
  String(header)
    .split(",")
    .forEach((p) => {
      const i = p.indexOf("=");
      if (i < 0) return;
      const k = p.slice(0, i).trim();
      const v = p.slice(i + 1).trim();
      if (!parts[k]) parts[k] = [];
      parts[k].push(v);
    });
  const t = parts.t && parts.t[0];
  const v1 = parts.v1 || [];
  if (!t || !v1.length) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(t));
  if (!Number.isFinite(Number(t)) || age > 300) return false;
  const expected = await hmacHex(secret, t + "." + payload);
  return v1.some((sig) => timingSafeEqual(expected, sig));
}

export async function createCheckoutSession(env, origin, email) {
  const price = env.PRICE_ID;
  if (!price) {
    const err = new Error("PRICE_ID manquant");
    err.status = 503;
    throw err;
  }
  const params = {
    mode: "subscription",
    success_url: origin + "/merci-abonnement.html?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/mon-compte.html",
    locale: "fr",
    line_items: [{ price, quantity: 1 }],
    client_reference_id: "mimiqui-archive",
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: {
        message:
          "J’accepte les conditions d’abonnement. J’autorise le démarrage immédiat de l’accès aux données de vente et je reconnais perdre mon droit de rétractation pour la période déjà commencée (art. L. 221-28 du Code de la consommation).",
      },
    },
    integration_identifier: "mimiqui-archive-chk-" + randomSuffix(),
  };
  if (email) params.customer_email = email;
  return stripe(env, "POST", "/v1/checkout/sessions", params);
}

function randomSuffix() {
  const b = new Uint8Array(4);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 8);
}

export async function retrieveSession(env, id) {
  return stripe(env, "GET", "/v1/checkout/sessions/" + encodeURIComponent(id), {
    expand: ["subscription", "customer"],
  });
}

export async function retrieveSubscription(env, id) {
  return stripe(env, "GET", "/v1/subscriptions/" + encodeURIComponent(id), {});
}

export async function createPortalSession(env, customerId, origin) {
  return stripe(env, "POST", "/v1/billing_portal/sessions", {
    customer: customerId,
    return_url: origin + "/mon-compte.html",
  });
}

export function periodEndFromSub(sub) {
  if (!sub || typeof sub !== "object") return null;
  return sub.current_period_end || (sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end) || null;
}

export function emailFromStripeObject(obj, fallback) {
  if (!obj) return (fallback || "").toLowerCase();
  const c = obj.customer_details || obj.customer;
  const email =
    obj.customer_email ||
    (c && typeof c === "object" && c.email) ||
    obj.email ||
    fallback ||
    "";
  return String(email).trim().toLowerCase();
}
