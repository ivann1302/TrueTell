import test from 'node:test';
import assert from 'node:assert/strict';

const modulePath = new URL('../src/components/privacy/consent-state.ts', import.meta.url);
const load = () => import(modulePath.href);
const now = Date.parse('2026-09-26T12:00:00Z');

test('consent storage preserves explicit refusal and acceptance', async () => {
  const { readConsent, makeConsent } = await load();
  for (const analytics of [false, true]) {
    assert.equal(readConsent(JSON.stringify(makeConsent(analytics, now)), now).analytics, analytics);
  }
});

test('untrusted, outdated and expired consent never grants permission', async () => {
  const { readConsent } = await load();
  const record = { version: 1, analytics: true, savedAt: now, expiresAt: now + 10000 };
  for (const value of [null, '', '{', 'null', 'true', '[]', JSON.stringify({...record, analytics: 'true'}), JSON.stringify({...record, version: 0}), JSON.stringify({...record, expiresAt: now}), JSON.stringify({...record, savedAt: now + 1}), JSON.stringify({...record, expiresAt: 'tomorrow'}), JSON.stringify({...record, expiresAt: now + 1000 * 86400000})]) {
    assert.equal(readConsent(value, now), null, String(value));
  }
});

test('consent expires at its boundary instead of silently renewing', async () => {
  const { readConsent, makeConsent } = await load();
  const raw = JSON.stringify(makeConsent(true, now));
  assert.equal(readConsent(raw, now + 179 * 86400000).analytics, true);
  assert.equal(readConsent(raw, now + 180 * 86400000), null);
});
