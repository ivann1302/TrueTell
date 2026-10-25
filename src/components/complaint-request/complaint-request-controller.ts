import { formatPhone, maskPhone, deletePhoneDigit } from '../contact-request/contact-phone.ts';
import { normalizeTelegramContact } from '../contact-request/contact-request-controller.ts';
import { initComplaintSelect } from './complaint-select-picker.ts';

const methods = { telegram: 'Telegram', phone: 'Телефон', max: 'Телефон в MAX', whatsapp: 'Телефон в WhatsApp' } as const;

export function initComplaintForm(doc: Document) {
  const form = doc.querySelector<HTMLFormElement>('[data-complaint-form]');
  const win = doc.defaultView;
  if (!form || !win || form.dataset.initialized) return;
  form.dataset.initialized = 'true';
  const application = form.elements.namedItem('application') as HTMLSelectElement;
  const method = form.elements.namedItem('contact_method') as HTMLSelectElement;
  const contact = form.elements.namedItem('contact') as HTMLInputElement;
  const name = form.elements.namedItem('name') as HTMLInputElement;
  const message = form.elements.namedItem('message') as HTMLTextAreaElement;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-complaint-status]')!;
  const success = doc.querySelector<HTMLElement>('[data-complaint-success]')!;
  const prefix = form.querySelector<HTMLElement>('[data-contact-prefix]');
  const app = new URLSearchParams(win.location.search).get('app');
  application.value = [...application.options].some(option => option.value === app) ? app! : '';
  const selectors = new Map([application, method].map(select => [select.name, initComplaintSelect(select)?.control || select]));
  let key = win.crypto.randomUUID();
  let previousPayload: string | null = null;
  let pending = false;
  let previousMethod = method.value;
  const contacts: Record<string, string> = {};
  const isPhone = () => method.value !== 'telegram';

  function formatContactPhone(mask = false) {
    const digits = contact.value.replace(/\D/g, '');
    const country = contact.value.trim().match(/^\+\s*(\d)/)?.[1];
    if ((country && country !== '7') || digits.length > 11 || (digits.length === 11 && !/^[78]/.test(digits))) {
      contact.setCustomValidity('Введите номер с кодом +7: +7 (999) 999-99-99, без лишних цифр.');
      return false;
    }
    if (mask) maskPhone(contact);
    else contact.value = formatPhone(contact.value);
    return true;
  }

  function validateContact() {
    const value = contact.value.trim();
    const valid = isPhone() ? /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value)
      : /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(normalizeTelegramContact(value));
    contact.setCustomValidity(!value || valid ? '' : isPhone() ? 'Введите номер полностью: +7 (999) 999-99-99.' : 'Введите корректное имя пользователя Telegram.');
  }
  function updateMethod() {
    contacts[previousMethod] = contact.value;
    previousMethod = method.value;
    contact.value = contacts[method.value] || '';
    contact.type = isPhone() ? 'tel' : 'text';
    contact.inputMode = isPhone() ? 'tel' : 'text';
    contact.autocomplete = isPhone() ? 'tel' : 'off';
    contact.maxLength = isPhone() ? 25 : 255;
    contact.placeholder = isPhone() ? '+7 (999) 999-99-99' : 'username';
    form!.querySelector('[data-contact-label]')!.textContent = methods[method.value as keyof typeof methods];
    if (prefix) prefix.hidden = isPhone();
    contact.parentElement?.toggleAttribute('data-has-prefix', !isPhone());
    if (isPhone() && !formatContactPhone()) return;
    validateContact();
  }
  method.addEventListener('change', updateMethod);
  contact.addEventListener('beforeinput', event => {
    if (isPhone() && contact.value.startsWith('+7') && contact.value.replace(/\D/g, '').length <= 11) deletePhoneDigit(event as InputEvent, contact);
  });
  contact.addEventListener('input', () => {
    if (isPhone()) { if (!formatContactPhone(true)) return; }
    else {
      const normalized = normalizeTelegramContact(contact.value);
      if (normalized.startsWith('@')) contact.value = normalized.slice(1);
    }
    validateContact();
  });
  for (const field of [name, message]) field.addEventListener('input', () => field.setCustomValidity(field.value.trim() ? '' : 'Заполните поле.'));
  submit.disabled = false;
  updateMethod();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    for (const select of [application, method]) {
      if (select.value && [...select.options].some(option => option.value === select.value && !option.disabled)) continue;
      const control = selectors.get(select.name)!;
      control.setAttribute('aria-invalid', 'true');
      form.querySelector(`[data-field-error="${select.name}"]`)!.textContent = select === application ? 'Выберите приложение.' : 'Выберите способ связи.';
      control.focus();
      return;
    }
    for (const field of [name, message]) field.setCustomValidity(field.value.trim() ? '' : 'Заполните поле.');
    if (isPhone() && !formatContactPhone()) { form.reportValidity(); return; }
    validateContact();
    if (!form.reportValidity()) return;
    pending = true;
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    form.setAttribute('aria-busy', 'true');
    status.hidden = true;
    form.querySelectorAll('[data-field-error]').forEach(error => { error.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    const data = new win.FormData(form);
    const payload = {
      application: application.value, name: name.value.trim(), message: message.value.trim(),
      contact_method: method.value, contact: isPhone() ? contact.value.trim() : normalizeTelegramContact(contact.value),
      consent: data.get('consent') === 'on', website: String(data.get('website') || ''),
      page_path: '/complaints/', idempotency_key: key,
    };
    const fingerprint = JSON.stringify({ ...payload, idempotency_key: undefined });
    if (previousPayload !== null && previousPayload !== fingerprint) payload.idempotency_key = key = win.crypto.randomUUID();
    previousPayload = fingerprint;
    try {
      const session = await win.fetch('/api/lead-session', { credentials: 'same-origin', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
      const { csrf_token: token } = session.ok ? await session.json() : {};
      if (typeof token !== 'string' || !token) throw new Error('Не удалось подготовить отправку. Попробуйте ещё раз.');
      const response = await win.fetch('/api/complaints', {
        method: 'POST', credentials: 'same-origin', signal: AbortSignal.timeout(20000),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': token }, body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 422) {
        let first: HTMLElement | null = null;
        for (const field of ['application', 'name', 'contact_method', 'contact', 'message', 'consent']) {
          const errors = result.errors?.[field];
          if (!Array.isArray(errors) || typeof errors[0] !== 'string') continue;
          const control = selectors.get(field) || form.elements.namedItem(field) as HTMLElement;
          control.setAttribute('aria-invalid', 'true');
          form.querySelector(`[data-field-error="${field}"]`)!.textContent = errors[0];
          first ||= control;
        }
        first?.focus();
        throw new Error('Проверьте заполненные поля.');
      }
      if (response.status === 429) throw new Error('Слишком много попыток. Подождите немного и повторите отправку.');
      if (response.status === 419) throw new Error('Сессия истекла. Нажмите «Отправить жалобу» ещё раз.');
      if (response.status === 409) {
        key = win.crypto.randomUUID();
        previousPayload = null;
        throw new Error('Данные обращения изменились. Нажмите «Отправить жалобу» ещё раз.');
      }
      if (!response.ok || result.ok !== true) throw new Error('Не удалось отправить жалобу. Попробуйте ещё раз.');
      form.reset();
      key = win.crypto.randomUUID();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      status.textContent = error instanceof Error && error.name === 'Error' ? error.message : 'Нет ответа от сервера. Проверьте соединение и попробуйте ещё раз.';
      status.hidden = false;
    } finally {
      pending = false;
      submit.disabled = false;
      submit.textContent = 'Отправить жалобу';
      form.removeAttribute('aria-busy');
    }
  });
}
