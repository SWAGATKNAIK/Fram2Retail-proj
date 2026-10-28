/**
 * auth.js — Frontend-only demo account system
 *
 * Registered accounts are stored in localStorage under the key
 * "farm2retail_accounts".  Each account record contains:
 *   { id, fullName, email, role, passwordHash, salt, createdAt }
 *
 * Passwords are never stored in plaintext.  We use the browser's
 * Web Crypto API (SubtleCrypto) to produce a salted SHA-256 hash
 * before persisting anything.
 *
 * ⚠️  This is a frontend-only demo — it does NOT provide production-
 *     grade authentication.  Hashing in the browser only prevents
 *     casual plaintext inspection in DevTools; it is not a substitute
 *     for server-side auth.
 */

const ACCOUNTS_KEY = 'farm2retail_accounts';
const VALID_ROLES = ['farmer', 'retailer', 'landowner'];

/**
 * Normalize email for consistent lookup and storage.
 */
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

/**
 * Validate that a role is one of the allowed values.
 */
function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

// ---------------------------------------------------------------------------
// Helpers — password hashing with Web Crypto API
// ---------------------------------------------------------------------------

/**
 * Generate a random 16-byte salt encoded as a hex string.
 */
function generateSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Produce a SHA-256 hash of `salt + password` and return the hex digest.
 * Uses the browser's SubtleCrypto so no extra dependencies are needed.
 */
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Account storage helpers
// ---------------------------------------------------------------------------

/**
 * Read all registered accounts from localStorage.
 * Returns an array (empty if nothing stored yet).
 */
function getAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save the accounts array back to localStorage.
 */
function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export { VALID_ROLES, normalizeEmail, isValidRole };

/**
 * Look up an account by email (case-insensitive).
 * Returns the account object or undefined.
 */
export function findAccountByEmail(email) {
  const accounts = getAccounts();
  const needle = normalizeEmail(email);
  return accounts.find((a) => a.email === needle);
}

/**
 * Register a new demo account.
 *
 * @param {{ fullName: string, email: string, password: string, role: string }} data
 * @returns {Promise<{ success: boolean, error?: string, account?: object }>}
 */
export async function registerAccount({ fullName, email, password, role }) {
  const normalizedEmail = normalizeEmail(email);

  // Validate role
  if (!isValidRole(role)) {
    return { success: false, error: 'Invalid role selected' };
  }

  // Check for duplicate email
  if (findAccountByEmail(normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Hash the password with a unique salt
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  const account = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    fullName: fullName.trim(),
    email: normalizedEmail,
    role,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);

  return { success: true, account };
}

/**
 * Verify credentials for a registered account.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, error?: string, account?: object }>}
 */
export async function verifyAccount(email, password) {
  const account = findAccountByEmail(email);
  if (!account) {
    return { success: false, error: 'No account found with this email' };
  }

  const hash = await hashPassword(password, account.salt);
  if (hash !== account.passwordHash) {
    return { success: false, error: 'Incorrect password' };
  }

  return { success: true, account };
}

/**
 * Establish a demo session for the given account.
 * Stores role, display name, and email in sessionStorage.
 */
export function startSession(account) {
  if (!isValidRole(account.role)) {
    throw new Error('Invalid account role');
  }
  sessionStorage.setItem('demoRole', account.role);
  sessionStorage.setItem('demoName', account.fullName);
  sessionStorage.setItem('demoEmail', account.email);
}

/**
 * Clear the active demo session without removing registered accounts.
 */
export function clearSession() {
  sessionStorage.removeItem('demoRole');
  sessionStorage.removeItem('demoName');
  sessionStorage.removeItem('demoEmail');
}
