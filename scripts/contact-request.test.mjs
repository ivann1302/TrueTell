import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initContactRequest, normalizeTelegramContact } from '../src/components/contact-request/contact-request-controller.ts';

function setup(fetch) {
  const fields = ['name', 'contact_method', 'contact', 'message', 'consent'];
  const dom = new JSDOM(`<a href="#contact-request">Open</a><dialog data-contact-dialog><button data-contact-close>Close</button><span data-contact-label></span><form><input name="name"><select name="contact_method"><option value="phone">Phone</option><option value="email">Email</option><option value="telegram">Telegram</option><option value="max">MAX</option></select><input name="contact" value="+79991234567" required><details><summary>Comment</summary><textarea name="message">Test message</textarea></details><input name="consent" type="checkbox" checked required><input name="website">${fields.map(field => `<span data-field-error="${field}"></span>`).join('')}<p data-contact-status hidden></p><button type="submit">Send</button></form><div data-contact-success hidden tabindex="-1"></div></dialog>`, { url: 'https://example.test/product/?utm_source=test&email=private' });
  const { window } = dom;
  window.fetch = fetch;
  const dialog = window.document.querySelector('dialog');
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new window.Event('close')); };
  initContactRequest(window.document);
  const form = window.document.querySelector('form');
  const submit = () => form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  return { window, form, dialog, submit };
}
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const session = () => ({ ok: true, json: async () => ({ csrf_token: 'token' }) });

test('failed submission retains inputs and idempotency key; success clears data only after server acknowledgement', async () => {
  const requests = [];
  let succeed = false;
  const app = setup(async (url, options) => {
    assert.equal(options.credentials, 'same-origin');
    if (url === '/api/lead-session') return session();
    requests.push(JSON.parse(options.body));
    assert.equal(options.headers['X-CSRF-TOKEN'], 'token');
    return { ok: succeed, status: succeed ? 201 : 500, json: async () => ({ ok: succeed }) };
  });
  app.submit(); await tick();
  assert.equal(app.form.elements.contact.value, '+79991234567');
  assert.equal(app.form.hidden, false);
  succeed = true; app.submit(); await tick();
  assert.equal(app.form.hidden, true);
  assert.equal(requests[0].idempotency_key, requests[1].idempotency_key);
  assert.deepEqual(requests[0].utm, { utm_source: 'test' });
  assert.equal(requests[0].page_path, '/product/');
  assert.equal(requests[0].consent, true);
  app.window.close();
});

test('prevents duplicate requests while pending and refuses false success', async () => {
  let release; let calls = 0;
  const app = setup(async url => {
    calls++;
    if (url === '/api/lead-session') return await new Promise(resolve => { release = () => resolve(session()); });
    return { ok: true, status: 200, json: async () => ({ ok: false }) };
  });
  app.submit(); app.submit(); assert.equal(calls, 1);
  release(); await tick(); assert.equal(calls, 2);
  assert.equal(app.form.hidden, false);
  assert.equal(app.form.querySelector('[data-contact-status]').hidden, false);
  app.window.close();
});

test('validation errors are inline and focus the field without losing content', async () => {
  const app = setup(async url => url === '/api/lead-session' ? session() : { ok: false, status: 422, json: async () => ({ errors: { contact: ['Проверьте контакт'] } }) });
  app.window.document.querySelector('a').click();
  assert.equal(app.dialog.open, true);
  app.submit(); await tick();
  assert.equal(app.form.elements.contact.getAttribute('aria-invalid'), 'true');
  assert.equal(app.form.querySelector('[data-field-error="contact"]').textContent, 'Проверьте контакт');
  assert.equal(app.form.elements.message.value, 'Test message');
  app.dialog.close();
  assert.equal(app.window.document.activeElement.tagName, 'A');
  assert.equal(app.window.document.documentElement.style.overflow, '');
  app.window.close();
});

test('switching contact method preserves each value and updates email validation', () => {
  const app = setup(async () => session());
  app.form.elements.contact_method.value = 'email';
  app.form.elements.contact_method.dispatchEvent(new app.window.Event('change'));
  assert.equal(app.form.elements.contact.type, 'email');
  assert.equal(app.form.elements.contact.maxLength, 254);
  app.form.elements.contact.value = 'hello@example.test';
  app.form.elements.contact_method.value = 'phone';
  app.form.elements.contact_method.dispatchEvent(new app.window.Event('change'));
  assert.equal(app.form.elements.contact.value, '+79991234567');
  app.window.close();
});


test('normalizes only canonical Telegram usernames and safe t.me profile links', () => {
  for (const value of ['example_user', '@example_user', 't.me/example_user', 'https://t.me/example_user']) {
    assert.equal(normalizeTelegramContact(value), '@example_user');
  }
  for (const value of ['https://evil.test/example_user', 'https://t.me.evil.test/example_user', 'https://t.me/example_user?start=123', 'https://t.me/example_user#hash', 'https://t.me/example_user/extra', 'https://t.me/12345', 'https://t.me/abcd']) {
    assert.equal(normalizeTelegramContact(value), value);
  }
});

test('bounds attribution and sends canonical Telegram without changing inputs on server failure', async () => {
  let payload;
  const app = setup(async (url, options) => {
    if (url === '/api/lead-session') return session();
    payload = JSON.parse(options.body);
    return { ok: false, status: 500, json: async () => ({}) };
  });
  app.window.document.title = 'x'.repeat(250);
  app.window.history.replaceState({}, '', `/${'p'.repeat(600)}?utm_source=${'s'.repeat(250)}`);
  app.window.document.querySelector('a').click();
  app.form.elements.contact_method.value = 'telegram';
  app.form.elements.contact_method.dispatchEvent(new app.window.Event('change'));
  app.form.elements.contact.value = 'https://t.me/example_user';
  app.submit(); await tick();
  assert.equal(payload.contact, '@example_user');
  assert.equal(payload.source.length, 200);
  assert.equal(payload.page_path.length, 512);
  assert.equal(payload.utm.utm_source.length, 200);
  assert.equal(app.form.elements.contact.value, 'https://t.me/example_user');
  app.window.close();
});


test('MAX sends a phone contact and preserves it after a failed request', async () => {
  let payload;
  const app = setup(async (url, options) => {
    if (url === '/api/lead-session') return session();
    payload = JSON.parse(options.body);
    return { ok: false, status: 500, json: async () => ({}) };
  });
  app.form.elements.contact_method.value = 'max';
  app.form.elements.contact_method.dispatchEvent(new app.window.Event('change'));
  assert.equal(app.form.elements.contact.type, 'tel');
  app.form.elements.contact.value = '+79991234567';
  app.submit(); await tick();
  assert.equal(payload.contact_method, 'max');
  assert.equal(payload.contact, '+79991234567');
  assert.equal(app.form.elements.contact.value, '+79991234567');
  app.window.close();
});

test('a comment error opens the collapsed field and focuses it', async () => {
  const app = setup(async url => url === '/api/lead-session' ? session() : { ok: false, status: 422, json: async () => ({ errors: { message: ['Too long'] } }) });
  app.window.document.querySelector('a').click();
  assert.equal(app.form.querySelector('details').open, false);
  app.submit(); await tick();
  assert.equal(app.form.querySelector('details').open, true);
  assert.equal(app.window.document.activeElement, app.form.elements.message);
  app.window.close();
});
