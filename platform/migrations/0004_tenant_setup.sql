-- One-time owner setup links for EmDash sites.
ALTER TABLE tenants ADD COLUMN setup_hash TEXT;
