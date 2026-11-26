import {
  apiPath,
  corsHeaders,
  withCors,
  json,
  originOf,
  clientIp,
  rateLimit,
  isActiveStatus,
  readJson,
  validEmail,
} from "./util.js";
import {
  getSession,
  createSession,
  upsertSubscriber,
  getSubscriberByEmail,
  getSubscriberByCustomer,
  getSubscriberBySubscription,
  sessionResponse,
  logoutResponse,
  createMagicLink,
  consumeMagicLink,
  sendMagicEmail,
  devMagicEnabled,
} from "./auth.js";
import {
  verifyStripeSignature,
  createCheckoutSession,
  retrieveSession,
  retrieveSubscription,
  createPortalSession,
  periodEndFromSub,
  emailFromStripeObject,
} from "./stripe.js";
import { handleVentes } from "./ventes.js";

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    try {
      const res = await route(request, env, ctx);
      return withCors(request, env, res);
    } catch (err) {
      const status = err.status || 500;
      const message =
        status >= 500 && status !== 503
          ? "Erreur serveur"
          : err.message || "Erreur";
      return withCors(request, env, json({ error: message }, status));
    }
  },
};

async function route(request, env, ctx) {
  const path = apiPath(request);
  const method = request.method.toUpperCase();

  if (method === "GET" && (path === "/" || path === "/sante")) {
    return json({ ok: true, service: "mimiqui-api" });
  }

  if (method === "GET" && path === "/moi") {
    const session = await getSession(env, request);
    return json(publicSession(session));
  }

  if (method === "POST" && path === "/logout") {
    return logoutResponse(request);
  }

  if ((method === "GET" || method === "POST") && path === "/checkout") {
    return checkout(request, env);
  }

  if (method === "GET" && path === "/merci") {
    return merci(request, env);
  }

  if (method === "POST" && path === "/webhook/stripe") {
    return webhook(request, env);
  }

  if (method === "POST" && path === "/login") {
    return login(request, env);
  }

  if (method === "GET" && path === "/auth/callback") {
    return authCallback(request, env);
  }

  if ((method === "GET" || method === "POST") && (path === "/portail" || path === "/portal")) {
    return portail(request, env);
  }

  if (method === "GET" && path === "/ventes") {
    const session = await getSession(env, request);
    return handleVentes(env, request, session);
  }

  return json({ error: "Introuvable" }, 404);
}

function publicSession(session) {
  if (!session) return { abonne: false };
  return {
    abonne: !!session.abonne,
    email: session.email || "",
    status: session.status || "",
    period_end: session.period_end || null,
  };
}

async function checkout(request, env) {
  const ok = await rateLimit(env, "checkout:" + clientIp(request), 20, 3600);
  if (!ok) return json({ error: "Trop de tentatives, réessayez plus tard." }, 429);
  let email = "";
  if (request.method === "POST") {
    const body = await readJson(request);
    if (body === null) return json({ error: "JSON invalide" }, 400);
    email = (body.email || "").trim();
  } else {
    email = new URL(request.url).searchParams.get("email") || "";
  }
  if (email && !validEmail(email)) return json({ error: "E-mail invalide" }, 400);
  const origin = publicSiteOrigin(request, env);
  const session = await createCheckoutSession(env, origin, email || undefined);
  if (request.headers.get("accept") && request.headers.get("accept").includes("text/html")) {
    return Response.redirect(session.url, 303);
  }
  if (request.method === "GET" && !wantsJson(request)) {
    return Response.redirect(session.url, 303);
  }
  return json({ url: session.url, id: session.id });
}

function wantsJson(request) {
  const a = request.headers.get("accept") || "";
  return a.includes("application/json") && !a.includes("text/html");
}

function publicSiteOrigin(request, env) {
  const u = new URL(request.url);
  if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
    // En local, le Worker et le site peuvent être sur le même port de test.
    return env.PUBLIC_ORIGIN && env.PUBLIC_ORIGIN.includes("127.0.0.1")
      ? env.PUBLIC_ORIGIN.replace(/\/$/, "")
      : u.origin;
  }
  return (env.PUBLIC_ORIGIN || "https://mimiqui.fr").replace(/\/$/, "");
}

async function merci(request, env) {
  const id = new URL(request.url).searchParams.get("session_id") || "";
  if (!id || !id.startsWith("cs_")) {
    return json({ ok: false, abonne: false, error: "Session de paiement manquante." }, 400);
  }
  const cs = await retrieveSession(env, id);
  if (cs.mode && cs.mode !== "subscription") {
    return json({ ok: false, abonne: false, error: "Session invalide." }, 400);
  }
  const paid = cs.payment_status === "paid" || cs.status === "complete";
  const sub = typeof cs.subscription === "object" ? cs.subscription : null;
  const subId = sub ? sub.id : cs.subscription;
  let status = (sub && sub.status) || (paid ? "active" : "incomplete");
  let periodEnd = periodEndFromSub(sub);
  if (subId && !sub) {
    try {
      const full = await retrieveSubscription(env, subId);
      status = full.status || status;
      periodEnd = periodEndFromSub(full) || periodEnd;
    } catch (e) {}
  }
  const email = emailFromStripeObject(cs);
  const customerId = typeof cs.customer === "object" ? cs.customer.id : cs.customer || "";
  if (!email) {
    return json({ ok: false, abonne: false, error: "E-mail introuvable sur la session Stripe." }, 400);
  }
  await upsertSubscriber(env, {
    email,
    customer_id: customerId || "",
    subscription_id: subId || "",
    status,
    period_end: periodEnd,
  });
  if (!isActiveStatus(status) && cs.payment_status !== "paid") {
    return json({ ok: false, abonne: false, email, status });
  }
  const sess = await createSession(env, request, {
    email,
    customer_id: customerId || "",
    subscription_id: subId || "",
    status: isActiveStatus(status) ? status : "active",
    period_end: periodEnd,
  });
  return sessionResponse(request, { ok: true, abonne: true, email, status }, sess);
}

async function webhook(request, env) {
  const raw = await request.text();
  const sig = request.headers.get("stripe-signature") || request.headers.get("Stripe-Signature");
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return json({ error: "STRIPE_WEBHOOK_SECRET manquant" }, 503);
  const ok = await verifyStripeSignature(raw, sig, secret);
  if (!ok) return json({ error: "Signature invalide" }, 400);
  let event;
  try {
    event = JSON.parse(raw);
  } catch (e) {
    return json({ error: "JSON invalide" }, 400);
  }
  const type = event.type || "";
  const obj = event.data && event.data.object;
  try {
    if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
      await onCheckout(env, obj);
    } else if (type === "invoice.paid") {
      await onInvoicePaid(env, obj);
    } else if (type === "customer.subscription.updated" || type === "customer.subscription.deleted") {
      await onSubscription(env, obj);
    }
  } catch (err) {
    return json({ error: "Traitement échoué" }, 500);
  }
  return json({ received: true });
}

async function onCheckout(env, cs) {
  if (!cs) return;
  if (cs.payment_status && cs.payment_status !== "paid" && cs.payment_status !== "no_payment_required") {
    if (cs.status !== "complete") return;
  }
  const sub = typeof cs.subscription === "object" ? cs.subscription : null;
  const subId = sub ? sub.id : cs.subscription;
  let status = (sub && sub.status) || "active";
  let periodEnd = periodEndFromSub(sub);
  if (subId && !sub) {
    try {
      const full = await retrieveSubscription(env, subId);
      status = full.status || status;
      periodEnd = periodEndFromSub(full) || periodEnd;
    } catch (e) {}
  }
  const email = emailFromStripeObject(cs);
  const customerId = typeof cs.customer === "object" ? cs.customer.id : cs.customer || "";
  if (!email) return;
  await upsertSubscriber(env, {
    email,
    customer_id: customerId || "",
    subscription_id: subId || "",
    status,
    period_end: periodEnd,
  });
}

async function onInvoicePaid(env, invoice) {
  if (!invoice) return;
  const subId = typeof invoice.subscription === "object" ? invoice.subscription.id : invoice.subscription;
  const customerId = typeof invoice.customer === "object" ? invoice.customer.id : invoice.customer;
  let email = emailFromStripeObject(invoice, invoice.customer_email);
  if (!email && customerId) {
    const existing = await getSubscriberByCustomer(env, customerId);
    if (existing) email = existing.email;
  }
  let status = "active";
  let periodEnd = invoice.lines && invoice.lines.data && invoice.lines.data[0] && invoice.lines.data[0].period
    ? invoice.lines.data[0].period.end
    : null;
  if (subId) {
    try {
      const sub = await retrieveSubscription(env, subId);
      status = sub.status || status;
      periodEnd = periodEndFromSub(sub) || periodEnd;
      email = email || emailFromStripeObject(sub);
    } catch (e) {}
  }
  if (!email) return;
  const prev = (await getSubscriberByEmail(env, email)) || {};
  await upsertSubscriber(env, {
    email,
    customer_id: customerId || prev.customer_id || "",
    subscription_id: subId || prev.subscription_id || "",
    status,
    period_end: periodEnd,
  });
}

async function onSubscription(env, sub) {
  if (!sub) return;
  const customerId = typeof sub.customer === "object" ? sub.customer.id : sub.customer;
  let row = await getSubscriberBySubscription(env, sub.id);
  if (!row && customerId) row = await getSubscriberByCustomer(env, customerId);
  const email = (row && row.email) || emailFromStripeObject(sub);
  if (!email) return;
  await upsertSubscriber(env, {
    email,
    customer_id: customerId || (row && row.customer_id) || "",
    subscription_id: sub.id,
    status: sub.status || "inactive",
    period_end: periodEndFromSub(sub),
  });
}

async function login(request, env) {
  const ok = await rateLimit(env, "login:" + clientIp(request), 8, 3600);
  if (!ok) return json({ error: "Trop de tentatives, réessayez plus tard." }, 429);
  const body = await readJson(request);
  if (body === null) return json({ error: "JSON invalide" }, 400);
  const email = String((body && body.email) || "").trim().toLowerCase();
  if (!validEmail(email)) return json({ error: "E-mail invalide" }, 400);
  const sub = await getSubscriberByEmail(env, email);
  // Réponse volontairement identique si l'e-mail est inconnu, pour ne pas le révéler.
  const generic = {
    ok: true,
    message:
      "Si un abonnement actif est lié à cette adresse, un lien de connexion vient d’être envoyé. Il expire dans 15 minutes.",
  };
  if (!sub || !isActiveStatus(sub.status)) {
    return json(generic);
  }
  const magic = await createMagicLink(env, email);
  const origin = publicSiteOrigin(request, env);
  const url = origin + "/api/auth/callback?token=" + encodeURIComponent(magic.token);
  const sent = await sendMagicEmail(env, email, url);
  if (devMagicEnabled(env)) {
    return json({ ...generic, dev_link: url, mailed: sent.sent });
  }
  if (!sent.sent && sent.reason === "no-mailer") {
    return json(
      {
        ok: false,
        error:
          "L’envoi d’e-mail n’est pas encore configuré (clé Resend manquante). Le paiement reste possible ; l’accès se restaure après le retour Stripe.",
      },
      503
    );
  }
  return json(generic);
}

async function authCallback(request, env) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const site = publicSiteOrigin(request, env);
  const fail = site + "/mon-compte.html?acces=echec";
  const row = await consumeMagicLink(env, token);
  if (!row) return Response.redirect(fail, 303);
  const sub = await getSubscriberByEmail(env, row.email);
  if (!sub || !isActiveStatus(sub.status)) return Response.redirect(fail, 303);
  const sess = await createSession(env, request, sub);
  const okUrl = site + "/mon-compte.html?acces=ok";
  return new Response(null, {
    status: 303,
    headers: {
      location: okUrl,
      "set-cookie": sess.header,
    },
  });
}

async function portail(request, env) {
  const session = await getSession(env, request);
  let email = session && session.email;
  if (request.method === "POST") {
    const body = await readJson(request);
    if (body && body.email) email = String(body.email).trim();
  } else {
    const q = new URL(request.url).searchParams.get("email");
    if (q) email = q;
  }
  if (!email || !validEmail(email)) {
    return json({ error: "Connectez-vous ou indiquer l’e-mail de l’abonnement." }, 400);
  }
  const sub = await getSubscriberByEmail(env, email);
  if (!sub || !sub.customer_id) {
    return json({ error: "Aucun compte de facturation trouvé pour cet e-mail." }, 404);
  }
  const origin = publicSiteOrigin(request, env);
  const ps = await createPortalSession(env, sub.customer_id, origin);
  if (!wantsJson(request) && request.method === "GET") {
    return Response.redirect(ps.url, 303);
  }
  return json({ url: ps.url });
}
