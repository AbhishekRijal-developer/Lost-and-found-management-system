-- Run this once for existing databases that were created before registration OTP verification.
USE lostandfound;

ALTER TABLE users
  ADD COLUMN isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE AFTER password,
  ADD COLUMN emailVerificationOtp VARCHAR(64) DEFAULT NULL AFTER isEmailVerified,
  ADD COLUMN emailVerificationExpires DATETIME DEFAULT NULL AFTER emailVerificationOtp;

CREATE INDEX idx_isEmailVerified ON users (isEmailVerified);
CREATE INDEX idx_emailVerificationOtp ON users (emailVerificationOtp);

-- Backfill existing accounts as verified to avoid locking out users created before OTP flow.
UPDATE users
SET isEmailVerified = TRUE
WHERE emailVerificationOtp IS NULL
  AND emailVerificationExpires IS NULL;
