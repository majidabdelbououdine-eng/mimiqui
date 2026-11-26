import { hmacHex } from "../src/util.js";

export function memKV() {
  const m = new Map();
  return {
    async get(k, type) {
      const v = m.get(k);
      if (v == null) return null;
      if (type === "json") return JSON.parse(v);
      return v;
    },
    async put(k, v, _opt) {
      m.set(k, typeof v === "string" ? v : JSON.stringify(v));
    },
    async delete(k) {
      m.delete(k);
    },
    _map: m,
  };
}

export function memD1() {
  const subscribers = new Map();
  const magic = new Map();
  function exec(sql, args) {
    const s = sql.replace(/\s+/g, " ").trim();
    if (s.startsWith("INSERT INTO subscribers")) {
      const [email, customer_id, subscription_id, status, period_end, updated_at] = args;
      const prev = subscribers.get(email) || {};
      subscribers.set(email, {
        email,
        customer_id: customer_id ?? prev.customer_id,
        subscription_id: subscription_id ?? prev.subscription_id,
        status: status ?? prev.status,
        period_end: period_end ?? prev.period_end,
        updated_at,
      });
      return { success: true };
    }
    if (s.startsWith("SELECT * FROM subscribers WHERE email")) {
      return subscribers.get(args[0]) || null;
    }
    if (s.startsWith("SELECT * FROM subscribers WHERE customer_id")) {
      for (const row of subscribers.values()) if (row.customer_id === args[0]) return row;
      return null;
    }
    if (s.startsWith("SELECT * FROM subscribers WHERE subscription_id")) {
      for (const row of subscribers.values()) if (row.subscription_id === args[0]) return row;
      return null;
    }
    if (s.startsWith("INSERT INTO magic_links")) {
      magic.set(args[0], { token: args[0], email: args[1], exp: args[2] });
      return { success: true };
    }
    if (s.startsWith("SELECT * FROM magic_links")) {
      return magic.get(args[0]) || null;
    }
    if (s.startsWith("DELETE FROM magic_links")) {
      magic.delete(args[0]);
      return { success: true };
    }
    throw new Error("SQL non mocké: " + s);
  }
  return {
    prepare(sql) {
      const stmt = {
        _args: [],
        bind(...args) {
          stmt._args = args;
          return stmt;
        },
        async first() {
          return exec(sql, stmt._args);
        },
        async run() {
          return exec(sql, stmt._args);
        },
        async all() {
          const r = exec(sql, stmt._args);
          return { results: Array.isArray(r) ? r : r ? [r] : [] };
        },
      };
      return stmt;
    },
    _subscribers: subscribers,
    _magic: magic,
  };
}

export function testEnv(over = {}) {
  const stripeState = {
    sessions: new Map(),
    subscriptions: new Map(),
    portal: [],
    lastCheckout: null,
  };
  return {
    VENTES: memKV(),
    DB: memD1(),
    STRIPE_SECRET_KEY: "sk_test_fake",
    STRIPE_WEBHOOK_SECRET: "whsec_test_secret",
    SESSION_SECRET: "session-secret-test-abcdefghijklmnopqrstuvwxyz",
    PRICE_ID: "price_test_weekly",
    PUBLIC_ORIGIN: "http://127.0.0.1:8787",
    DEV_RETURN_MAGIC_LINK: "1",
    STRIPE_API_BASE: over.STRIPE_API_BASE,
    WEEKLY_PRICE_CENTS: "299",
    stripeState,
    ...over,
  };
}

export async function stripeSignature(secret, payload, ts) {
  const t = String(ts ?? Math.floor(Date.now() / 1000));
  const v1 = await hmacHex(secret, t + "." + payload);
  return "t=" + t + ",v1=" + v1;
}

export function seedPokemon(env, slug, ventes, nom) {
  const pack = {
    slug,
    nom: nom || slug,
    noms: [nom || slug],
    maj: "2026-11-26",
    ventes,
  };
  const index = { maj: "2026-11-26", slugs: [{ slug, nom: pack.nom, noms: pack.noms, n: ventes.length }] };
  return Promise.all([
    env.VENTES.put("vente:" + slug, JSON.stringify(pack)),
    env.VENTES.put("meta:index", JSON.stringify(index)),
  ]);
}

export function vente(partial) {
  return {
    id: "1",
    carte: "Pikachu",
    numero: "58",
    set: "Set de Base",
    langue: "fr",
    pokemon: "Pikachu",
    prix: 10,
    devise: "EUR",
    date: "2026-11-01",
    etat: "nm",
    photo: "",
    lien: "https://www.ebay.fr/itm/1",
    source: "Test",
    ...partial,
  };
}
