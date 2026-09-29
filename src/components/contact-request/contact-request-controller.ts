import { initContactMethodPicker } from './contact-method-picker.ts';
import { formatPhone, maskPhone, deletePhoneDigit } from './contact-phone.ts';

const methods = {
  phone: { label: 'Телефон', type: 'tel', autocomplete: 'tel', placeholder: '+7 (999) 999-99-99' },
  email: { label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'name@example.ru' },
  telegram: { label: 'Telegram', type: 'text', autocomplete: 'off', placeholder: 'username' },
  max: { label: 'Телефон в MAX', type: 'tel', autocomplete: 'tel', placeholder: '+7 (999) 999-99-99' },
} as const;

export function normalizeTelegramContact(value: string): string {
  const trimmed = value.trim();
  if (/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(trimmed)) return `@${trimmed.replace(/^@/, '')}`;
  if (!/^(?:https:\/\/)?t\.me\//i.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    if (url.hostname !== 't.me' || url.protocol !== 'https:' || url.port || url.username || url.password || url.search || url.hash) return trimmed;
    const username = url.pathname.slice(1);
    return /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(username) ? `@${username}` : trimmed;
  } catch {
    return trimmed;
  }
}

export function initContactRequest(doc: Document) {
  const dialog = doc.querySelector<HTMLDialogElement>('[data-contact-dialog]');
  const win = doc.defaultView;
  if (!dialog || !win || dialog.dataset.initialized) return;
  dialog.dataset.initialized = 'true';
  const form = dialog.querySelector<HTMLFormElement>('form')!;
  const method = form.elements.namedItem('contact_method') as HTMLSelectElement;
  const contact = form.elements.namedItem('contact') as HTMLInputElement;
  const name = form.elements.namedItem('name') as HTMLInputElement;
  const prefix = dialog.querySelector<HTMLElement>('[data-contact-prefix]');
  const syncPicker = initContactMethodPicker(dialog, method);
  const isPhone = () => method.value === 'phone' || method.value === 'max';
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-contact-status]')!;
  const success = dialog.querySelector<HTMLElement>('[data-contact-success]')!;
  let opener: HTMLElement | null = null;
  let source = doc.title;
  let key = win.crypto.randomUUID();
  let pending = false;
  let previousOverflow = '';
  const contacts: Record<string, string> = {};
  let previousMethod = method.value;

  function updateMethod() {
    contacts[previousMethod] = contact.value;
    previousMethod = method.value;
    const selected = methods[method.value as keyof typeof methods] || methods.phone;
    contact.type = selected.type;
    contact.maxLength = method.value === 'email' ? 254 : 255;
    contact.setAttribute('autocomplete', selected.autocomplete);
    contact.inputMode = isPhone() ? 'tel' : method.value === 'email' ? 'email' : 'text';
    contact.value = contacts[method.value] || '';
    if (isPhone()) contact.value = formatPhone(contact.value);
    if (prefix) prefix.hidden = method.value !== 'telegram';
    contact.parentElement?.toggleAttribute('data-has-prefix', method.value === 'telegram');
    contact.setCustomValidity('');
    dialog!.querySelector('[data-contact-label]')!.textContent = selected.label;
    contact.placeholder = selected.placeholder;
    contact.removeAttribute('aria-invalid');
    contact.setAttribute('aria-describedby', 'request-contact-error');
    form.querySelector('[data-field-error="contact"]')!.textContent = '';
  }
  method.addEventListener('change', updateMethod);
  function validateContact() {
    const value = contact.value.trim();
    let message = '';
    if (value && isPhone() && !/^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value)) message = 'Введите номер полностью: +7 (999) 999-99-99.';
    if (value && method.value === 'telegram' && !/^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(normalizeTelegramContact(value))) message = 'Введите имя пользователя Telegram: от 5 до 32 латинских букв, цифр или _.';
    if (value && method.value === 'email' && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value)) message = 'Введите email в формате name@example.ru.';
    contact.setCustomValidity(message);
  }
  name.addEventListener('input', () => name.setCustomValidity(name.value.trim() ? '' : 'Введите имя.'));
  contact.addEventListener('beforeinput', event => {
    if (isPhone()) { deletePhoneDigit(event as InputEvent, contact); validateContact(); }
  });
  contact.addEventListener('input', () => {
    if (isPhone()) maskPhone(contact);
    if (method.value === 'telegram') {
      const normalized = normalizeTelegramContact(contact.value);
      if (normalized.startsWith('@') || contact.value.startsWith('@')) contact.value = normalized.replace(/^@+/, '');
    }
    validateContact();
  });
  function open(trigger: HTMLElement | null) {
    if (dialog!.open) return;
    opener = trigger;
    source = trigger?.closest<HTMLElement>('[data-contact-source]')?.dataset.contactSource || doc.title;
    if (!form.hidden) status.hidden = true;
    previousOverflow = doc.documentElement.style.overflow;
    doc.documentElement.style.overflow = 'hidden';
    dialog!.showModal();
    if (form.hidden) success.focus();
  }
  doc.addEventListener('click', event => {
    const target = event.target as Element | null;
    const trigger = target?.closest<HTMLElement>('a[href="#contact-request"], [data-contact-open]');
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  });
  doc.querySelectorAll('a[href="#contact-request"]').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.removeAttribute('target');
  });
  dialog.querySelectorAll('[data-contact-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    doc.documentElement.style.overflow = previousOverflow;
    opener?.focus();
    if (form.hidden) {
      form.hidden = false;
      success.hidden = true;
      delete dialog!.dataset.success;
      dialog!.setAttribute('aria-labelledby', 'contact-request-title');
    }
  });
  if (win.location.hash === '#contact-request') open(null);
  win.addEventListener('hashchange', () => { if (win.location.hash === '#contact-request') open(null); });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    name.setCustomValidity(name.value.trim() ? '' : 'Введите имя.');
    if (isPhone()) contact.value = formatPhone(contact.value);
    validateContact();
    if (pending || !form.reportValidity()) return;
    pending = true;
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    form.setAttribute('aria-busy', 'true');
    status.hidden = true;
    form.querySelectorAll('[data-field-error]').forEach(error => { error.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    const data = new win.FormData(form);
    const query = new URLSearchParams(win.location.search);
    const utm: Record<string, string> = {};
    for (const field of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const value = query.get(field)?.trim().slice(0, 200);
      if (value) utm[field] = value;
    }
    const payload = {
      name: String(data.get('name') || '').trim(), contact_method: method.value,
      contact: method.value === 'telegram' ? normalizeTelegramContact(contact.value) : contact.value.trim(), message: String(data.get('message') || '').trim(),
      consent: data.get('consent') === 'on', website: String(data.get('website') || ''),
      page_path: win.location.pathname.slice(0, 512), source: source.slice(0, 200), utm, idempotency_key: key,
    };
    try {
      const session = await win.fetch('/api/lead-session', { credentials: 'same-origin', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
      if (!session.ok) throw new Error('Не удалось подготовить отправку. Попробуйте ещё раз.');
      const { csrf_token: token } = await session.json();
      if (typeof token !== 'string' || !token) throw new Error('Не удалось подготовить отправку. Попробуйте ещё раз.');
      const response = await win.fetch('/api/leads', {
        method: 'POST', credentials: 'same-origin', signal: AbortSignal.timeout(20000),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': token },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 422) {
        let first: HTMLElement | null = null;
        for (const field of ['name', 'contact_method', 'contact', 'message', 'consent']) {
          const messages = result.errors?.[field];
          if (!Array.isArray(messages) || typeof messages[0] !== 'string') continue;
          const control = (field === 'contact_method' ? dialog!.querySelector('[data-method-toggle]') : form.elements.namedItem(field)) as HTMLElement;
          control.setAttribute('aria-invalid', 'true');
          control.setAttribute('aria-describedby', `request-${field}-error`);
          form.querySelector(`[data-field-error="${field}"]`)!.textContent = messages[0];
          first ||= control;
        }
        first?.focus();
        throw new Error('Проверьте заполненные поля и отправьте заявку ещё раз.');
      }
      if (response.status === 429) throw new Error('Слишком много попыток. Подождите немного и повторите отправку.');
      if (response.status === 419) throw new Error('Сессия истекла. Нажмите «Отправить заявку» ещё раз.');
      if (!response.ok || result.ok !== true) throw new Error('Не удалось отправить заявку. Попробуйте ещё раз.');
      form.reset();
      for (const field of Object.keys(contacts)) delete contacts[field];
      updateMethod();
      syncPicker?.();
      key = win.crypto.randomUUID();
      form.hidden = true;
      success.hidden = false;
      dialog!.dataset.success = 'true';
      dialog!.setAttribute('aria-labelledby', 'contact-success-title');
      success.focus();
    } catch (error) {
      status.textContent = error instanceof Error && error.name === 'Error' ? error.message : 'Нет ответа от сервера. Проверьте соединение и попробуйте ещё раз.';
      status.hidden = false;
    } finally {
      pending = false;
      submit.disabled = false;
      submit.textContent = 'Отправить заявку';
      form.removeAttribute('aria-busy');
    }
  });
}
