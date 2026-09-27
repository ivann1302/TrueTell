export const CONSENT_KEY = 'truetell.privacy.v1';
export const CONSENT_TTL = 180 * 86400000;
export interface Consent {
  version: 1;
  analytics: boolean;
  savedAt: number;
  expiresAt: number;
}

export function makeConsent(analytics: boolean, now = Date.now()): Consent {
  return { version: 1, analytics, savedAt: now, expiresAt: now + CONSENT_TTL };
}

export function readConsent(raw: string | null, now = Date.now()): Consent | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (!value || value.version !== 1 || typeof value.analytics !== 'boolean'
      || !Number.isFinite(value.savedAt) || !Number.isFinite(value.expiresAt)
      || value.savedAt > now || value.expiresAt <= now
      || value.expiresAt <= value.savedAt || value.expiresAt - value.savedAt > CONSENT_TTL) return null;
    return value;
  } catch {
    return null;
  }
}
