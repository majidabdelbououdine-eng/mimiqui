import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startMockStripe } from "./mock-stripe.mjs";
import { stripeSignature, vente } from "./helpers.mjs";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const runWrangler = process.env.MIMIQUI_TEST_WRANGLER === "1";

test("wrangler dev + Stripe mock (activé avec MIMIQUI_TEST_WRANGLER=1)", async (t) => {
  if (!runWrangler) {
    t.skip("Définir MIMIQUI_TEST_WRANGLER=1 après npm install pour lancer wrangler dev");
    return;
  }
  const stripe = await startMockStripe();
  const vars = [
    "STRIPE_SECRET_KEY=sk_test_fake",
    "STRIPE_WEBHOOK_SECRET=whsec_test_secret",
    "SESSION_SECRET=session-secret-test-abcdefghijklmnopqrstuvwxyz",
    "PRICE_ID=price_test_weekly",
    "DEV_RETURN_MAGIC_LINK=1",
    "STRIPE_API_BASE=" + stripe.base,
    "PUBLIC_ORIGIN=http://127.0.0.1:8787",
  ].join("\n") + "\n";
  fs.writeFileSync(path.join(root, ".dev.vars"), vars);
  const child = spawn("npx", ["wrangler", "dev", "--port", "8787", "--local"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });
  let out = "";
  child.stdout.on("data", (d) => { out += d.toString(); });
  child.stderr.on("data", (d) => { out += d.toString(); });
  const ready = await new Promise((resolve, reject) => {
    const tmo = setTimeout(() => reject(new Error("wrangler dev timeout\n" + out.slice(-2000))), 60000);
    const check = () => {
      if (/Ready on|localhost:8787|127\.0\.0\.1:8787/i.test(out)) {
        clearTimeout(tmo);
        resolve(true);
      }
    };
    child.stdout.on("data", check);
    child.stderr.on("data", check);
    child.on("exit", (c) => {
      clearTimeout(tmo);
      reject(new Error("wrangler exited " + c + "\n" + out.slice(-2000)));
    });
  });
  assert.ok(ready);
  try {
    const sante = await fetch("http://127.0.0.1:8787/api/sante");
    assert.equal(sante.status, 200);
    const j = await sante.json();
    assert.equal(j.ok, true);
  } finally {
    child.kill("SIGTERM");
    try { await once(child, "exit"); } catch (e) {}
    await stripe.close();
  }
});
