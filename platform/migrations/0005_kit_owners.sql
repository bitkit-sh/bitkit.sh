-- Kits belong to accounts from the shared identity backend.
ALTER TABLE kits ADD COLUMN owner_id TEXT;
CREATE INDEX IF NOT EXISTS kits_owner ON kits(owner_id);
