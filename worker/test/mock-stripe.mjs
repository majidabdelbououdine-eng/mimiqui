/** Mini serveur Stripe de test (Checkout, webhooks amont, portail). */
import http from "node:http";

export function startMockStripe(opts = {}) {
  const state = {
    sessions: new Map(),
    subscriptions: new Map(),
    customers: new Map(),
    ...opts.state,
  };
  let seq = 1;
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString("utf8");
    const params = Object.fromEntries(new URLSearchParams(raw));
    const send = (code, body) => {
      res.writeHead(code, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (!req.headers.authorization || !String(req.headers.authorization).startsWith("Bearer sk_")) {
      return send(401, { error: { message: "Unauthorized" } });
    }
    if (req.method === "POST" && url.pathname === "/v1/checkout/sessions") {
      const id = "cs_test_" + String(seq++).padStart(8, "0");
      const subId = "sub_test_" + String(seq++).padStart(8, "0");
      const cust = "cus_test_" + String(seq++).padStart(8, "0");
      const email = params.customer_email || "abonne@example.com";
      const periodEnd = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
      const sub = {
        id: subId,
        status: "active",
        customer: cust,
        current_period_end: periodEnd,
      };
      state.subscriptions.set(subId, sub);
      const session = {
        id,
        object: "checkout.session",
        mode: "subscription",
        status: "complete",
        payment_status: "paid",
        url: "https://checkout.stripe.com/c/pay/" + id,
        customer: cust,
        customer_email: email,
        customer_details: { email },
        subscription: sub,
      };
      state.sessions.set(id, session);
      state.lastCheckout = session;
      return send(200, session);
    }
    if (req.method === "GET" && url.pathname.startsWith("/v1/checkout/sessions/")) {
      const id = url.pathname.split("/").pop();
      const s = state.sessions.get(id);
      return s ? send(200, s) : send(404, { error: { message: "No such session" } });
    }
    if (req.method === "GET" && url.pathname.startsWith("/v1/subscriptions/")) {
      const id = url.pathname.split("/").pop();
      const s = state.subscriptions.get(id);
      return s ? send(200, s) : send(404, { error: { message: "No such subscription" } });
    }
    if (req.method === "POST" && url.pathname === "/v1/billing_portal/sessions") {
      const customer = params.customer;
      const urlP = "https://billing.stripe.com/p/session/test_" + customer;
      return send(200, { id: "bps_test", url: urlP, customer });
    }
    return send(404, { error: { message: "Unhandled " + req.method + " " + url.pathname } });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        server,
        port,
        base: "http://127.0.0.1:" + port,
        state,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}
