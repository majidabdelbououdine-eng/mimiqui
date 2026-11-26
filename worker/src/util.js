export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

export function text(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", ...headers },
  });
}

export function apiPath(request) {
  const u = new URL(request.url);
  let p = u.pathname;
  if (p.startsWith("/api/")) p = p.slice(4);
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

export function originOf(request, env) {
  const u = new URL(request.url);
  if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
    return u.origin;
  }
  return (env.PUBLIC_ORIGIN || "https://mimiqui.fr").replace(/\/$/, "");
}

export function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allow = allowedOrigin(origin, request, env);
  const h = {
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, stripe-signature",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
  if (allow) {
    h["access-control-allow-origin"] = allow;
    h["access-control-allow-credentials"] = "true";
  }
  return h;
}

function allowedOrigin(origin, request, env) {
  if (!origin) return null;
  try {
    const o = new URL(origin);
    const host = o.hostname;
    if (host === "mimiqui.fr" || host === "www.mimiqui.fr") return origin;
    if (host === "localhost" || host === "127.0.0.1") return origin;
    const pub = env.PUBLIC_ORIGIN ? new URL(env.PUBLIC_ORIGIN).hostname : "";
    if (pub && host === pub) return origin;
  } catch (e) {}
  return null;
}

export function withCors(request, env, response) {
  const c = corsHeaders(request, env);
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(c)) out.headers.set(k, v);
  return out;
}

export function norm(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function slugify(s) {
  return norm(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "autre";
}

export function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const aa = enc.encode(String(a));
  const bb = enc.encode(String(b));
  if (aa.byteLength !== bb.byteLength) return false;
  let out = 0;
  for (let i = 0; i < aa.byteLength; i++) out |= aa[i] ^ bb[i];
  return out === 0;
}

export async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function randomToken(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return [...buf].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function clientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  );
}

export async function rateLimit(env, key, max, windowSec) {
  if (!env.VENTES) return true;
  const k = "rl:" + key;
  const now = Math.floor(Date.now() / 1000);
  let rec = null;
  try {
    rec = await env.VENTES.get(k, "json");
  } catch (e) {}
  if (!rec || rec.exp < now) rec = { n: 0, exp: now + windowSec };
  rec.n += 1;
  await env.VENTES.put(k, JSON.stringify(rec), { expirationTtl: windowSec + 5 });
  return rec.n <= max;
}

export function isActiveStatus(status) {
  return status === "active" || status === "trialing";
}

export function parseCookies(request) {
  const raw = request.headers.get("Cookie") || "";
  const out = {};
  raw.split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i < 0) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

export function cookieHeader(name, value, request, maxAge) {
  const u = new URL(request.url);
  const secure = u.protocol === "https:";
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=" + String(maxAge),
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearCookieHeader(name, request) {
  const u = new URL(request.url);
  const secure = u.protocol === "https:";
  const parts = [`${name}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export async function readJson(request) {
  const t = await request.text();
  if (!t) return {};
  try {
    return JSON.parse(t);
  } catch (e) {
    return null;
  }
}

export function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}
