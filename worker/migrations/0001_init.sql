CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL DEFAULT '',
  subscription_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'inactive',
  period_end INTEGER,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscribers_customer ON subscribers(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_sub ON subscribers(subscription_id);

CREATE TABLE IF NOT EXISTS magic_links (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  exp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
