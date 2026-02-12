-- Migration: update contacts table to include new fields
-- Generated for MySQL

ALTER TABLE contacts ADD COLUMN owner_id INT NULL;
ALTER TABLE contacts ADD COLUMN lead_id INT NULL;
ALTER TABLE contacts ADD COLUMN deal_id INT NULL;
ALTER TABLE contacts ADD COLUMN tags TEXT NULL;
ALTER TABLE contacts ADD COLUMN notes TEXT NULL;
