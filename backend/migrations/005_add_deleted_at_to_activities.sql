ALTER TABLE activities ADD COLUMN deleted_at DATETIME DEFAULT NULL;
CREATE INDEX idx_deleted_at ON activities(deleted_at);
