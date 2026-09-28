import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const script = readFileSync(new URL('../backend/public/workspace.js', import.meta.url), 'utf8');
function boot({ stored, dark = false, blocked = false } = {}) {
  const dom = new JSDOM('<html><body><button data-theme-toggle hidden></button></body></html>', { url: 'https://example.com/workspace', runScripts: 'outside-only' });
  if (stored) dom.window.localStorage.setItem('workspace-theme', stored);
  if (blocked) Object.defineProperty(dom.window, 'localStorage', { get() { throw new Error('blocked'); } });
  let systemChanged;
  dom.window.matchMedia = () => ({ matches: dark, addEventListener(type, fn) { systemChanged = fn; } });
  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, changeSystem: matches => systemChanged({ matches }), button: dom.window.document.querySelector('button'), root: dom.window.document.documentElement };
}
test('workspace follows system theme until a user chooses, then persists choice', () => {
  const ui = boot({ dark: true });
  assert.equal(ui.root.dataset.theme, 'dark');
  ui.changeSystem(false);assert.equal(ui.root.dataset.theme, 'light');
  ui.button.click();assert.equal(ui.root.dataset.theme, 'dark');
  assert.equal(ui.button.getAttribute('aria-pressed'), 'true');
  assert.equal(ui.dom.window.localStorage.getItem('workspace-theme'), 'dark');
  ui.changeSystem(false);assert.equal(ui.root.dataset.theme, 'dark');ui.dom.window.close();
});
test('workspace restores a saved preference over the system', () => {
  const ui = boot({ stored: 'light', dark: true });assert.equal(ui.root.dataset.theme, 'light');assert.equal(ui.button.hidden, false);ui.dom.window.close();
});
test('workspace theme remains operable when storage is unavailable', () => {
  const ui = boot({ blocked: true });ui.button.click();assert.equal(ui.root.dataset.theme, 'dark');ui.dom.window.close();
});
