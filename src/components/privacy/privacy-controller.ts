import { CONSENT_KEY, makeConsent, readConsent, type Consent } from './consent-state';
const COUNTER_ID = 103366745;
type Metrika = ((id: number, method: string, options?: Record<string, unknown>) => void) & { a?: unknown[][]; l?: number };
declare global { interface Window { ym?: Metrika } }

export function initializePrivacy() {
  const root = document.querySelector<HTMLElement>('[data-privacy-root]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const banner = root.querySelector<HTMLElement>('[data-cookie-banner]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-cookie-dialog]')!;
  const toggle = root.querySelector<HTMLInputElement>('[data-cookie-toggle]')!;
  const status = root.querySelector<HTMLElement>('[data-cookie-status]')!;
  const spacer = root.querySelector<HTMLElement>('[data-cookie-spacer]')!;
  let consent: Consent | null = null;
  let script: HTMLScriptElement | null = null;
  let started = false;
  let memoryOnly = false;
  let timer: number | undefined;
  let statusTimer: number | undefined;
  let expiryTimer: number | undefined;
  let returnFocus: HTMLElement | null = null;
  let oldOverflow = '';
  const production = root.dataset.production === 'true'
    && !['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
  const permitted = () => consent?.analytics === true && consent.expiresAt > Date.now();
  const announce = (message: string) => {
    window.clearTimeout(statusTimer);
    status.textContent = message;
    statusTimer = window.setTimeout(() => { status.textContent = ''; }, 6000);
  };
  const updateSpace = () => {
    const height = banner.hidden ? 0 : banner.getBoundingClientRect().height + 48;
    spacer.style.setProperty('--cookie-space', `${height}px`);
    document.documentElement.style.scrollPaddingBottom = `${height}px`;
  };
  const cleanCookies = () => {
    const domains = location.hostname.split('.').map((_, index, parts) => parts.slice(index).join('.'));
    const paths = location.pathname.split('/').map((_, index, parts) => parts.slice(0, index + 1).join('/') || '/');
    for (const item of document.cookie.split(';')) {
      const name = item.split('=')[0].trim();
      if (!name.startsWith('_ym_')) continue;
      for (const path of new Set(['/', ...paths])) {
        document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`;
        for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=${path}; Domain=${domain}; SameSite=Lax`;
      }
    }
    try {
      for (const key of Object.keys(localStorage)) if (key.startsWith('_ym')) localStorage.removeItem(key);
    } catch { /* Browser storage can be unavailable. */ }
  };
  const stop = () => {
    window.clearTimeout(timer);
    timer = undefined;
    if (started) {
      try { window.ym?.(COUNTER_ID, 'destruct'); } catch { /* Blocked analytics must not break the page. */ }
    }
    if (window.ym?.a) window.ym.a = [];
    script?.remove();
    script = null;
    started = false;
    cleanCookies();
  };
  const start = () => {
    if (!production || !permitted() || script || timer !== undefined || started) return;
    timer = window.setTimeout(() => {
      timer = undefined;
      if (!permitted()) return;
      const tag = document.createElement('script');
      script = tag;
      const queue: Metrika = (...args) => { (queue.a ??= []).push(args); };
      queue.l = Date.now();
      window.ym ??= queue;
      tag.async = true;
      tag.src = 'https://mc.yandex.ru/metrika/tag.js';
      tag.onload = () => {
        if (script !== tag || !permitted()) return;
        window.ym?.(COUNTER_ID, 'init', {
          webvisor: false, clickmap: false, trackLinks: false, accurateTrackBounce: true,
          ecommerce: false, disableYtm: true,
        });
        started = true;
      };
      tag.onerror = () => { tag.remove(); if (script === tag) script = null; };
      document.head.append(tag);
    }, 0);
  };
  const render = () => {
    banner.hidden = consent !== null || dialog.open;
    updateSpace();
    window.clearTimeout(expiryTimer);
    if (consent) expiryTimer = window.setTimeout(refresh, Math.min(Math.max(consent.expiresAt - Date.now(), 0), 2147483647));
  };
  const close = () => { if (dialog.open) dialog.close(); };
  const save = (analytics: boolean) => {
    consent = makeConsent(analytics);
    let stored = true;
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch {
      stored = false;
      // Quota/write failures must not leave a previous grant in storage.
      try { localStorage.removeItem(CONSENT_KEY); } catch { /* Storage is entirely unavailable. */ }
    }
    memoryOnly = !stored;
    if (analytics) start(); else stop();
    close();
    render();
    announce(stored ? 'Настройки cookie сохранены' : 'Выбор действует на этой странице: браузер не сохраняет настройки.');
  };
  function refresh() {
    try {
      if (!memoryOnly) consent = readConsent(localStorage.getItem(CONSENT_KEY));
      else if (consent && consent.expiresAt <= Date.now()) consent = null;
    } catch {
      if (consent && consent.expiresAt <= Date.now()) consent = null;
    }
    if (permitted()) start(); else stop();
    if (dialog.open) toggle.checked = permitted();
    render();
  }
  const open = (trigger: HTMLElement) => {
    if (dialog.open) return;
    returnFocus = trigger;
    toggle.checked = permitted();
    dialog.querySelector('details')?.removeAttribute('open');
    oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    render();
  };
  document.querySelectorAll<HTMLElement>('[data-cookie-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => { event.preventDefault(); open(trigger); });
  });
  root.querySelector('[data-cookie-accept]')!.addEventListener('click', () => save(true));
  root.querySelector('[data-cookie-reject]')!.addEventListener('click', () => save(false));
  root.querySelector('[data-cookie-save]')!.addEventListener('click', () => save(toggle.checked));
  root.querySelector('[data-cookie-close]')!.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll<HTMLElement>('button, input, summary, a[href]')]
      .filter((element) => element.checkVisibility());
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = oldOverflow;
    render();
    if (returnFocus?.getClientRects().length) returnFocus.focus({ preventScroll: true });
    else document.querySelector<HTMLElement>('footer [data-cookie-open]')?.focus({ preventScroll: true });
  });
  window.addEventListener('storage', (event) => { if (event.key === CONSENT_KEY || event.key === null) { memoryOnly = false; refresh(); } });
  window.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  new ResizeObserver(updateSpace).observe(banner);
  refresh();
}
