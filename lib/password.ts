/**
 * Password strength calculator.
 *
 * Returns a score from 0-4 and a human-readable label.
 *
 * Scoring rules:
 *   +1 — length ≥ 8
 *   +1 — contains uppercase AND lowercase
 *   +1 — contains at least one digit
 *   +1 — contains at least one special character
 *
 * Levels:
 *   0   → "Too short"
 *   1   → "Weak"
 *   2   → "Fair"
 *   3   → "Good"
 *   4   → "Strong"
 */

export type PasswordStrengthLevel = "Too short" | "Weak" | "Fair" | "Good" | "Strong";

export interface PasswordStrengthResult {
  score: number;       // 0–4
  label: PasswordStrengthLevel;
  color: string;       // Tailwind text-color class
  barColor: string;    // Tailwind bg-color class
}

const LEVELS: Record<number, Omit<PasswordStrengthResult, "score">> = {
  0: { label: "Too short", color: "text-muted-foreground", barColor: "bg-muted" },
  1: { label: "Weak",      color: "text-red-500",           barColor: "bg-red-500" },
  2: { label: "Fair",      color: "text-orange-500",        barColor: "bg-orange-500" },
  3: { label: "Good",      color: "text-yellow-500",        barColor: "bg-yellow-500" },
  4: { label: "Strong",    color: "text-green-500",         barColor: "bg-green-500" },
};

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length < 8) {
    return { score: 0, ...LEVELS[0] };
  }

  let score = 1; // Base: length ≥ 8

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  return { score, ...LEVELS[score] };
}

/**
 * Returns true if the password is strong enough to submit.
 * We require at least "Fair" (score ≥ 2) so the user can register.
 */
export function isPasswordStrongEnough(password: string): boolean {
  return calculatePasswordStrength(password).score >= 2;
}
