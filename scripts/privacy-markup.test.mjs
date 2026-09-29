import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

test('cookie banner stays compact and footer keeps privacy controls without email', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const banner = doc.querySelector('[data-cookie-banner]');
  assert(banner, 'Cookie banner missing');
  assert.equal(banner.querySelectorAll('button').length, 2);
  assert(banner.querySelector('[data-cookie-reject]'), 'Reject action missing');
  assert(banner.querySelector('[data-cookie-accept]'), 'Accept action missing');
  assert.equal(banner.querySelector('[data-cookie-open]'), null);

  const footer = doc.querySelector('footer');
  assert(footer?.querySelector('[data-cookie-open]'), 'Footer cookie settings link missing');
  assert.equal(footer.querySelector('a[href^="mailto:"]'), null);
});
