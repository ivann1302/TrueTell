export function initComplaintSelect(select: HTMLSelectElement) {
  const picker = select.closest<HTMLElement>('[data-complaint-select]');
  if (!picker) return;
  const toggle = picker.querySelector<HTMLButtonElement>('[data-select-toggle]')!;
  const menu = picker.querySelector<HTMLElement>('[data-select-options]')!;
  const options = [...menu.querySelectorAll<HTMLButtonElement>('[data-select-option]')];
  const doc = select.ownerDocument;
  let search = '';
  let lastSearch = 0;

  function close(focus = false) {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (focus) toggle.focus({ preventScroll: true });
  }
  function sync() {
    picker!.querySelector('[data-select-value]')!.textContent = select.selectedOptions[0]?.textContent || '';
    options.forEach(option => option.setAttribute('aria-selected', String(option.dataset.selectOption === select.value)));
  }
  function open(index = options.findIndex(option => option.dataset.selectOption === select.value)) {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    options[Math.max(0, index)]?.focus({ preventScroll: true });
    menu.scrollIntoView?.({ block: 'nearest' });
  }
  toggle.addEventListener('click', () => menu.hidden ? open() : close());
  toggle.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    open(event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : undefined);
  });
  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      select.value = option.dataset.selectOption!;
      select.dispatchEvent(new doc.defaultView!.Event('change', { bubbles: true }));
      close(true);
    });
    option.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % options.length;
      else if (event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else if (event.key === 'Tab') { close(true); return; }
      else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        search = Date.now() - lastSearch > 700 ? event.key : search + event.key;
        lastSearch = Date.now();
        next = options.findIndex(item => item.textContent?.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
        if (next < 0) return;
      } else return;
      event.preventDefault();
      options[next].focus({ preventScroll: true });
      options[next].scrollIntoView?.({ block: 'nearest' });
    });
  });
  picker.addEventListener('keydown', event => {
    if ((event as KeyboardEvent).key === 'Escape' && !menu.hidden) { event.preventDefault(); close(true); }
  });
  doc.addEventListener('click', event => { if (!picker.contains(event.target as Node)) close(); });
  picker.addEventListener('focusout', event => { if (!picker.contains(event.relatedTarget as Node)) close(); });
  select.addEventListener('change', () => {
    sync();
    toggle.removeAttribute('aria-invalid');
    const error = doc.querySelector(`[data-field-error="${select.name}"]`);
    if (error) error.textContent = '';
  });
  select.required = false;
  select.hidden = true;
  toggle.hidden = false;
  picker.querySelector('label')!.htmlFor = toggle.id;
  sync();
  return { control: toggle };
}
