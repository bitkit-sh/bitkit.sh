CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_via TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_login_at INTEGER,
  stripe_customer_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  plan_status TEXT,
  plan_renews_at INTEGER
);
