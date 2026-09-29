export function initContactMethodPicker(dialog: HTMLDialogElement, method: HTMLSelectElement) {
  const picker = dialog.querySelector<HTMLElement>('[data-method-picker]');
  if (!picker) return;
  const toggle = picker.querySelector<HTMLButtonElement>('[data-method-toggle]')!;
  const menu = picker.querySelector<HTMLElement>('[data-method-options]')!;
  const options = [...menu.querySelectorAll<HTMLButtonElement>('[data-method-option]')];
  function close(focus = false) {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (focus) toggle.focus();
  }
  function sync() {
    picker!.querySelector('[data-method-value]')!.textContent = method.selectedOptions[0].textContent;
    options.forEach(option => option.setAttribute('aria-selected', String(option.dataset.methodOption === method.value)));
  }
  function open(index = options.findIndex(option => option.dataset.methodOption === method.value)) {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    options[Math.max(0, index)].focus({ preventScroll: true });
    // The list always opens below its trigger; scroll the dialog if space is limited.
    menu.scrollIntoView({ block: 'nearest' });
  }
  toggle.addEventListener('click', () => { if (menu.hidden) open(); else close(true); });
  toggle.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    open(event.key === 'End' || event.key === 'ArrowUp' ? options.length - 1 : 0);
  });
  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      method.value = option.dataset.methodOption!;
      method.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      close(true);
    });
    option.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % options.length;
      else if (event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else if (event.key === 'Tab') { close(true); return; }
      else if (event.key.length === 1 && event.key !== ' ') {
        const found = options.findIndex(item => item.textContent?.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
        if (found < 0) return;
        next = found;
      } else return;
      event.preventDefault();
      options[next].focus();
    });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  });
  dialog.addEventListener('click', event => {
    if (!picker.contains(event.target as Node)) close();
  });
  picker.addEventListener('focusout', event => {
    if (!picker.contains(event.relatedTarget as Node | null)) close();
  });
  dialog.addEventListener('close', () => close());
  method.addEventListener('change', sync);
  return sync;
}
