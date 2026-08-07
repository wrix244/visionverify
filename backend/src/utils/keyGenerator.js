import crypto from 'crypto';

/**
 * Generate a Public Key (pk_live_...) and Secret Key (sk_live_...) pair
 */
export const generateKeyPair = () => {
  // Public Key (pk_live_...) - Safe to share and view in UI
  const pkRandom = crypto.randomBytes(16).toString('hex');
  const publicKey = `pk_live_${pkRandom}`;

  // Secret Key (sk_live_...) - Secret, displayed ONCE upon creation
  const skRandom = crypto.randomBytes(24).toString('hex');
  const secretKey = `sk_live_${skRandom}`;

  // Secret Key Prefix for display (sk_live_a1b2c3...****)
  const secretKeyPrefix = `${secretKey.substring(0, 14)}...`;

  // Cryptographically hashed Secret Key stored in Database
  const secretKeyHash = crypto.createHash('sha256').update(secretKey).digest('hex');

  return {
    publicKey,
    secretKey,           // Raw secret key returned ONCE
    secretKeyPrefix,     // Safe prefix for database & UI list
    secretKeyHash        // SHA-256 hashed value stored in DB
  };
};

/**
 * Hash an incoming secret key using SHA-256 for database lookup
 */
export const hashSecretKey = (secretKey) => {
  return crypto.createHash('sha256').update(secretKey).digest('hex');
};
