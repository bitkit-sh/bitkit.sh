-- Edit keys for MCP writes, kit links for tenants, and deploy requests.
ALTER TABLE kits ADD COLUMN key_hash TEXT;
ALTER TABLE kits ADD COLUMN updated_at INTEGER;
ALTER TABLE tenants ADD COLUMN kit_id TEXT;
CREATE TABLE IF NOT EXISTS deploy_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kit_id TEXT NOT NULL REFERENCES kits(id),
  status TEXT NOT NULL CHECK (status IN ('requested', 'building', 'live', 'failed')),
  created_at INTEGER NOT NULL
);
