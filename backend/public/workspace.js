(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem('workspace-theme'); } catch {}
  const apply = (theme) => {
    root.dataset.theme = theme;
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      const dark = theme === 'dark';
      button.textContent = dark ? 'Светлая тема' : 'Тёмная тема';
      button.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
      button.setAttribute('aria-pressed', String(dark));
      button.hidden = false;
    }
  };
  apply(preference === 'dark' || preference === 'light' ? preference : system.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('workspace-theme', preference); } catch {}
      apply(preference);
    });
  });
  system.addEventListener('change', (event) => {
    if (preference !== 'dark' && preference !== 'light') apply(event.matches ? 'dark' : 'light');
  });
})();
