/**
 * The password rule, mirroring the API exactly.
 *
 * The app used to check only that a password was 6 characters while the API required 10 and
 * several other things besides. The result was a form that accepted a password, submitted it,
 * and came back with a rejection the user had been given no chance to avoid. Checking the
 * same conditions here means the screen can say what is wrong before anything is sent.
 *
 * Copied from mobile-app/lib/password.ts. Any change here must be made there and in
 * InputGuard.ValidatePassword too. The server is what
 * enforces this; the copy below only exists so the user finds out sooner.
 */

/** The shortest password allowed on a new account. Must match InputGuard.MinPasswordLength. */
export const MIN_PASSWORD_LENGTH = 8;

/** ASCII punctuation and symbols: the printable characters that are not letters or digits. */
const SYMBOL = /[!-/:-@[-`{-~]/;
const DIGIT = /[0-9]/;
const SPACE = /\s/;

/**
 * The handful of passwords that dominate credential-stuffing lists.
 *
 * Matched as a substring, so "sabhijude2024" is rejected along with "sabhijude".
 */
const COMMON = [
  'password',
  '12345678',
  'qwerty',
  'letmein',
  'welcome',
  'admin123',
  'iloveyou',
  'sabhijude',
  'password123',
  '1234567890',
];

/**
 * Whether the password contains something letter-like.
 *
 * Anything that is not a digit, an ASCII symbol or whitespace counts. That is deliberately
 * broader than `[a-zA-Z]`: the server uses .NET's `char.IsLetter`, which is true for every
 * script, so restricting this to Latin here would reject a Devanagari or Cyrillic password
 * that the API would have accepted.
 */
const hasLetter = (password: string): boolean =>
  Array.from(password).some(
    (ch) => !DIGIT.test(ch) && !SYMBOL.test(ch) && !SPACE.test(ch)
  );

const hasDigitOrSymbol = (password: string): boolean =>
  DIGIT.test(password) || SYMBOL.test(password);

/**
 * Checks a new password.
 *
 * Returns `null` when it is acceptable, or the reason to show the user.
 */
export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }

  if (!hasLetter(password) || !hasDigitOrSymbol(password)) {
    return 'Password must contain letters and at least one number or symbol.';
  }

  const lowered = password.toLowerCase();
  if (COMMON.some((entry) => lowered.includes(entry))) {
    return 'That password is too easy to guess. Please choose another.';
  }

  return null;
}

/**
 * How strong a password looks, for the meter on the sign-up form.
 *
 * Deliberately not a security score. It exists so someone typing sees progress before they
 * submit, and it never contradicts `validatePassword` — a password the API would reject can
 * never show as `strong`, because the first thing this checks is whether it passes at all.
 */
export type PasswordStrength = 0 | 1 | 2 | 3;

export function passwordStrength(password: string): { score: PasswordStrength; label: string } {
  if (!password) return { score: 0, label: '' };

  // Anything the rule rejects is weak, whatever its length. Showing "strong" for a password
  // about to be refused is worse than showing nothing.
  if (validatePassword(password) !== null) {
    return { score: 1, label: 'Too weak' };
  }

  const variety =
    (DIGIT.test(password) ? 1 : 0) + (SYMBOL.test(password) ? 1 : 0) + (hasLetter(password) ? 1 : 0);

  if (password.length >= 12 && variety >= 3) return { score: 3, label: 'Strong' };
  return { score: 2, label: 'Good' };
}
