-- Run this once for existing databases that were created before forgot-password feature.
USE lostandfound;

ALTER TABLE users
  ADD COLUMN resetPasswordToken VARCHAR(64) DEFAULT NULL,
  ADD COLUMN resetPasswordExpires DATETIME DEFAULT NULL;

CREATE INDEX idx_resetPasswordToken ON users (resetPasswordToken);
