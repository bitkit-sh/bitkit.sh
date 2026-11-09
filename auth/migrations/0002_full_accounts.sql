-- Full accounts: password sign-in, verified email, and the profile Stripe needs for billing and tax.
ALTER TABLE accounts ADD COLUMN name TEXT;
ALTER TABLE accounts ADD COLUMN password_hash TEXT;
ALTER TABLE accounts ADD COLUMN email_verified_at INTEGER;
ALTER TABLE accounts ADD COLUMN company TEXT;
ALTER TABLE accounts ADD COLUMN phone TEXT;
ALTER TABLE accounts ADD COLUMN country TEXT;
ALTER TABLE accounts ADD COLUMN address_line1 TEXT;
ALTER TABLE accounts ADD COLUMN address_line2 TEXT;
ALTER TABLE accounts ADD COLUMN city TEXT;
ALTER TABLE accounts ADD COLUMN region TEXT;
ALTER TABLE accounts ADD COLUMN postal_code TEXT;
ALTER TABLE accounts ADD COLUMN tax_id TEXT;
ALTER TABLE accounts ADD COLUMN terms_accepted_at INTEGER;
ALTER TABLE accounts ADD COLUMN updated_at INTEGER;
