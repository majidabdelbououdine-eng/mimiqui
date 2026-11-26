import {
  cookieHeader,
  clearCookieHeader,
  parseCookies,
  randomToken,
  isActiveStatus,
  validEmail,
  hmacHex,
  timingSafeEqual,
  json,
} from "./util.js";

export const COOKIE = "mq_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 jours
const MAGIC_TTL = 60 * 15; // 15 minutes

export async function getSession(env, request) {
  const token = parseCookies(request)[COOKIE];
  if (!token || !env.VENTES) return null;
  const rec = await env.VENTES.get("session:" + token, "json");
  if (!rec) return null;
  if (rec.exp && rec.exp * 1000 < Date.now()) {
    await env.VENTES.delete("session:" + token);
    return null;
  }
  if (!isActiveStatus(rec.status)) return { ...rec, token, abonne: false };
  return { ...rec, token, abonne: true };
}

export async function createSession(env, request, rec) {
  const token = randomToken(32);
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = {
    email: rec.email,
    customer_id: rec.customer_id || "",
    subscription_id: rec.subscription_id || "",
    status: rec.status,
    period_end: rec.period_end || null,
    exp,
  };
  await env.VENTES.put("session:" + token, JSON.stringify(payload), {
    expirationTtl: SESSION_TTL,
  });
  const listKey = "sessions:" + rec.email.toLowerCase();
  let list = (await env.VENTES.get(listKey, "json")) || [];
  list = list.filter((t) => t !== token).slice(-19);
  list.push(token);
  await env.VENTES.put(listKey, JSON.stringify(list), { expirationTtl: SESSION_TTL });
  return { token, header: cookieHeader(COOKIE, token, request, SESSION_TTL), payload };
}

export async function revokeSessions(env, email) {
  if (!email) return;
  const listKey = "sessions:" + String(email).toLowerCase();
  const list = (await env.VENTES.get(listKey, "json")) || [];
  for (const t of list) {
    await env.VENTES.delete("session:" + t);
  }
  await env.VENTES.delete(listKey);
}

export async function upsertSubscriber(env, row) {
  const email = String(row.email || "").trim().toLowerCase();
  if (!email) return;
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    `INSERT INTO subscribers (email, customer_id, subscription_id, status, period_end, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       customer_id = excluded.customer_id,
       subscription_id = excluded.subscription_id,
       status = excluded.status,
       period_end = excluded.period_end,
       updated_at = excluded.updated_at`
  )
    .bind(
      email,
      row.customer_id || "",
      row.subscription_id || "",
      row.status || "inactive",
      row.period_end ?? null,
      now
    )
    .run();
  if (!isActiveStatus(row.status)) {
    await revokeSessions(env, email);
  }
}

export async function getSubscriberByEmail(env, email) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return null;
  return env.DB.prepare("SELECT * FROM subscribers WHERE email = ?").bind(e).first();
}

export async function getSubscriberByCustomer(env, customerId) {
  if (!customerId) return null;
  return env.DB.prepare("SELECT * FROM subscribers WHERE customer_id = ?")
    .bind(customerId)
    .first();
}

export async function getSubscriberBySubscription(env, subId) {
  if (!subId) return null;
  return env.DB.prepare("SELECT * FROM subscribers WHERE subscription_id = ?")
    .bind(subId)
    .first();
}

export function sessionResponse(request, data, session, status = 200) {
  const headers = { "content-type": "application/json; charset=utf-8" };
  if (session && session.header) headers["set-cookie"] = session.header;
  return new Response(JSON.stringify(data), { status, headers });
}

export function logoutResponse(request) {
  return new Response(JSON.stringify({ ok: true, abonne: false }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": clearCookieHeader(COOKIE, request),
    },
  });
}

export async function createMagicLink(env, email) {
  const token = randomToken(32);
  const exp = Math.floor(Date.now() / 1000) + MAGIC_TTL;
  await env.DB.prepare("INSERT INTO magic_links (token, email, exp) VALUES (?, ?, ?)")
    .bind(token, email.toLowerCase(), exp)
    .run();
  return { token, exp };
}

export async function consumeMagicLink(env, token) {
  if (!token) return null;
  const row = await env.DB.prepare("SELECT * FROM magic_links WHERE token = ?")
    .bind(token)
    .first();
  await env.DB.prepare("DELETE FROM magic_links WHERE token = ?").bind(token).run();
  if (!row) return null;
  if (row.exp < Math.floor(Date.now() / 1000)) return null;
  return row;
}

export async function sendMagicEmail(env, email, url) {
  const key = env.RESEND_API_KEY;
  const from = env.RESEND_FROM || "Le Coin de Mimiqui <noreply@mimiqui.fr>";
  if (!key) {
    return { sent: false, reason: "no-mailer" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: "Bearer " + key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Votre accès à l’archive des ventes – Le Coin de Mimiqui",
      text:
        "Bonjour,\n\nPour restaurer votre accès à l’archive des ventes du Coin de Mimiqui, ouvrez ce lien (valable 15 minutes) :\n\n" +
        url +
        "\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez ce message.\n",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    return { sent: false, reason: "resend-error", status: res.status, body: t.slice(0, 200) };
  }
  return { sent: true };
}

export function devMagicEnabled(env) {
  return env.DEV_RETURN_MAGIC_LINK === "1" || env.DEV_RETURN_MAGIC_LINK === "true";
}

export { validEmail, SESSION_TTL, MAGIC_TTL };
