import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initComplaintForm } from '../src/components/complaint-request/complaint-request-controller.ts';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function picker(name, choices) {
  return `<div data-complaint-select><label id="${name}-label" for="${name}">${name}</label><select id="${name}" name="${name}" required>${choices.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select><button type="button" id="${name}-toggle" data-select-toggle aria-expanded="false" hidden><span data-select-value></span></button><div data-select-options hidden>${choices.filter(([value]) => value).map(([value, label]) => `<button type="button" data-select-option="${value}" tabindex="-1">${label}</button>`).join('')}</div></div>`;
}
function setup(query, fetch) {
  const fields = ['application', 'name', 'contact_method', 'contact', 'message', 'consent'];
  const dom = new JSDOM(`<form data-complaint-form>${picker('application', [['', 'Выберите приложение'], ['cleaner', 'Массовое удаление лидов и сделок'], ['crm-fields', 'Справочник полей CRM']])}<input name="name" value="Анна" required>${picker('contact_method', [['telegram', 'Telegram'], ['phone', 'Телефон'], ['max', 'MAX'], ['whatsapp', 'WhatsApp']])}<label data-contact-label>Telegram</label><span data-contact-prefix>@</span><input name="contact" value="example_anna" required><textarea name="message" required>Не открывается список сделок</textarea><input name="website"><input name="consent" type="checkbox" checked required>${fields.map(field => `<span id="complaint-${field}-error" data-field-error="${field}"></span>`).join('')}<p data-complaint-status hidden></p><button type="submit">Отправить жалобу</button></form><div data-complaint-success hidden tabindex="-1"></div>`, { url: `https://example.test/complaints/${query}` });
  dom.window.fetch = fetch;
  initComplaintForm(dom.window.document);
  const form = dom.window.document.querySelector('form');
  const submit = () => form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  return { dom, form, submit };
}
const session = () => ({ ok: true, json: async () => ({ csrf_token: 'token' }) });

test('known application is selected from the link; missing and unknown applications stay empty', () => {
  for (const [query, expected] of [['?app=cleaner', 'cleaner'], ['?app=crm-fields', 'crm-fields'], ['?app=unknown', ''], ['?app=%3Cscript%3E', ''], ['', '']]) {
    const app = setup(query, async () => session());
    assert.equal(app.form.elements.application.value, expected);
    const toggle = app.form.querySelector('#application-toggle');
    assert.equal(toggle.hidden, false);
    assert.equal(toggle.textContent, app.form.elements.application.selectedOptions[0].textContent);
    app.dom.window.close();
  }
});

test('sends a complaint to the protected endpoint; preserves data and retry key on failure', async () => {
  const requests = [];
  let succeed = false;
  const app = setup('?app=cleaner', async (url, options) => {
    assert.equal(options.credentials, 'same-origin');
    if (url === '/api/lead-session') return session();
    assert.equal(url, '/api/complaints');
    assert.equal(options.headers['X-CSRF-TOKEN'], 'token');
    requests.push(JSON.parse(options.body));
    return { ok: succeed, status: succeed ? 201 : 500, json: async () => ({ ok: succeed }) };
  });
  app.submit(); await tick();
  assert.equal(requests.length, 1);
  assert.equal(app.form.elements.message.value, 'Не открывается список сделок');
  assert.equal(app.form.hidden, false);
  assert.equal(requests[0].application, 'cleaner');
  assert.equal(requests[0].contact, '@example_anna');
  succeed = true;
  app.submit(); await tick();
  assert.equal(requests[0].idempotency_key, requests[1].idempotency_key);
  assert.equal(app.form.hidden, true);
  assert.equal(app.dom.window.document.querySelector('[data-complaint-success]').hidden, false);
  app.dom.window.close();
});

test('unselected application and whitespace-only problem never send a request', async () => {
  let calls = 0;
  const app = setup('?app=unknown', async () => { calls++; return session(); });
  app.submit(); await tick();
  assert.equal(calls, 0);
  assert.equal(app.dom.window.document.activeElement.id, 'application-toggle');
  assert.equal(app.form.querySelector('#application-toggle').getAttribute('aria-invalid'), 'true');
  app.form.elements.application.value = 'cleaner';
  app.form.elements.message.value = '   ';
  app.submit(); await tick();
  assert.equal(calls, 0);
  app.dom.window.close();
});

test('custom selectors support keyboard selection, Escape, outside click and contact updates', () => {
  const app = setup('?app=cleaner', async () => session());
  const doc = app.dom.window.document;
  const key = (element, value) => element.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
  const toggle = doc.querySelector('#application-toggle');
  toggle.focus(); key(toggle, 'ArrowDown');
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(doc.activeElement.dataset.selectOption, 'cleaner');
  key(doc.activeElement, 'End');
  assert.equal(doc.activeElement.dataset.selectOption, 'crm-fields');
  doc.activeElement.click();
  assert.equal(app.form.elements.application.value, 'crm-fields');
  assert.equal(doc.activeElement, toggle);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  toggle.click(); key(doc.activeElement, 'Escape');
  assert.equal(doc.activeElement, toggle);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  toggle.click(); app.form.elements.name.click();
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  const methodToggle = doc.querySelector('#contact_method-toggle');
  methodToggle.click(); key(doc.activeElement, 'w'); doc.activeElement.click();
  assert.equal(app.form.elements.contact_method.value, 'whatsapp');
  assert.equal(methodToggle.textContent, 'WhatsApp');
  assert.equal(app.form.elements.contact.type, 'tel');
  assert.equal(app.form.elements.contact.placeholder, '+7 (999) 999-99-99');
  app.dom.window.close();
});

test('server selection errors focus the visible selector rather than the hidden native select', async () => {
  const app = setup('?app=cleaner', async url => url === '/api/lead-session' ? session() : ({ ok: false, status: 422, json: async () => ({ errors: { application: ['Выберите приложение.'] } }) }));
  app.submit(); await tick();
  const toggle = app.form.querySelector('#application-toggle');
  assert.equal(app.dom.window.document.activeElement, toggle);
  assert.equal(toggle.getAttribute('aria-invalid'), 'true');
  toggle.click(); app.form.querySelector('[data-select-option="crm-fields"]').click();
  assert.equal(toggle.hasAttribute('aria-invalid'), false);
  assert.equal(app.form.querySelector('[data-field-error="application"]').textContent, '');
  app.dom.window.close();
});

test('contact switches preserve values and validate phone messenger contacts', () => {
  const app = setup('?app=cleaner', async () => session());
  const method = app.form.elements.contact_method;
  method.value = 'whatsapp';
  method.dispatchEvent(new app.dom.window.Event('change'));
  assert.equal(app.form.elements.contact.type, 'tel');
  app.form.elements.contact.value = '79991234567';
  app.form.elements.contact.dispatchEvent(new app.dom.window.Event('input'));
  assert.equal(app.form.elements.contact.value, '+7 (999) 123-45-67');
  method.value = 'telegram';
  method.dispatchEvent(new app.dom.window.Event('change'));
  assert.equal(app.form.elements.contact.value, 'example_anna');
  app.dom.window.close();
});

test('an edited complaint gets a new retry key after an uncertain response', async () => {
  const requests = [];
  const app = setup('?app=cleaner', async (url, options) => {
    if (url === '/api/lead-session') return session();
    requests.push(JSON.parse(options.body));
    return { ok: false, status: 500, json: async () => ({}) };
  });
  app.submit(); await tick();
  app.form.elements.message.value = 'Уточнённая проблема';
  app.submit(); await tick();
  assert.equal(requests.length, 2);
  assert.notEqual(requests[0].idempotency_key, requests[1].idempotency_key);
  assert.equal(requests[1].message, 'Уточнённая проблема');
  app.dom.window.close();
});

test('foreign and excessive phone digits are rejected without changing the entered contact', async () => {
  for (const value of ['+1 (202) 555-0123', '+7 (999) 123-45-678']) {
    let calls = 0;
    const app = setup('?app=cleaner', async () => { calls++; return session(); });
    app.form.elements.contact_method.value = 'whatsapp';
    app.form.elements.contact_method.dispatchEvent(new app.dom.window.Event('change'));
    app.form.elements.contact.value = value;
    app.form.elements.contact.dispatchEvent(new app.dom.window.Event('input'));
    app.submit(); await tick();
    assert.equal(calls, 0);
    assert.equal(app.form.elements.contact.value, value);
    app.dom.window.close();
  }
});

test('backspace on a foreign raw number cannot turn it into a different +7 contact', async () => {
  let calls = 0;
  const app = setup('?app=cleaner', async () => { calls++; return session(); });
  app.form.elements.contact_method.value = 'phone';
  app.form.elements.contact_method.dispatchEvent(new app.dom.window.Event('change'));
  const contact = app.form.elements.contact;
  contact.value = '+1 (202) 555-0123';
  contact.dispatchEvent(new app.dom.window.Event('input'));
  contact.setSelectionRange(contact.value.length, contact.value.length);
  const event = new app.dom.window.InputEvent('beforeinput', { inputType: 'deleteContentBackward', bubbles: true, cancelable: true });
  contact.dispatchEvent(event);
  assert.equal(contact.value, '+1 (202) 555-0123');
  if (!event.defaultPrevented) contact.value = contact.value.slice(0, -1);
  contact.dispatchEvent(new app.dom.window.Event('input'));
  app.submit(); await tick();
  assert.equal(calls, 0);
  app.dom.window.close();
});
