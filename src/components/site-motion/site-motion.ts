/** Progressive enhancement: server-rendered content is visible before this runs. */
export function initSiteMotion(root: HTMLElement) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !window.IntersectionObserver) return;

  const candidates = [...root.querySelectorAll<HTMLElement>('[data-reveal], main h2, main figure')]
    .filter((target) => {
      if (target.closest('form, dialog, details, [hidden], [role="tabpanel"], [data-motion-skip], [data-intro]')) return false;
      if (target.matches('h1') || target.querySelector('h1')) return false;
      const track = target.closest('[data-carousel-track]');
      return !track || track === target;
    });
  const candidateSet = new Set(candidates);
  const targets = candidates.filter((target) => {
    for (let parent = target.parentElement; parent && parent !== root; parent = parent.parentElement) {
      if (candidateSet.has(parent)) return false;
    }
    return true;
  });
  targets.forEach((target) => {
    if (!target.hasAttribute('data-reveal')) target.setAttribute('data-reveal', '');
  });
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    });
  }, { threshold: 0 });

  function reveal(target: HTMLElement, immediate = false) {
    // Queued observer callbacks must not restart a finished or focus-skipped reveal.
    if (immediate || target.dataset.revealState === 'pending') {
      target.dataset.revealState = immediate ? 'instant' : 'revealed';
    }
    observer.unobserve(target);
  }

  function revealAnchor() {
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const anchor = root.ownerDocument.getElementById(id);
    if (!anchor || !root.contains(anchor)) return;
    const section = anchor.closest('section') ?? anchor;
    targets.forEach((target) => {
      if (section.contains(target) || target.contains(section)) reveal(target, true);
    });
  }

  function revealFocus(event: FocusEvent) {
    const focused = event.target;
    if (!(focused instanceof window.Element)) return;
    targets.forEach((target) => {
      if (target.contains(focused)) reveal(target, true);
    });
  }

  function cleanup() {
    targets.forEach((target) => reveal(target, true));
    observer.disconnect();
    motion.removeEventListener('change', onMotionChange);
    root.removeEventListener('focusin', revealFocus);
    window.removeEventListener('hashchange', revealAnchor);
    window.removeEventListener('pagehide', cleanup);
  }

  function onMotionChange() {
    if (motion.matches) cleanup();
  }

  revealAnchor();
  targets.forEach((target) => {
    // Preserve the first paint, restored scroll positions and responsive hidden panels.
    if (target.dataset.revealState || !target.getClientRects().length) return;
    if (target.getBoundingClientRect().top < window.innerHeight) return;
    target.dataset.revealState = 'pending';
    observer.observe(target);
  });
  root.addEventListener('focusin', revealFocus);
  window.addEventListener('hashchange', revealAnchor);
  window.addEventListener('pagehide', cleanup, { once: true });
  motion.addEventListener('change', onMotionChange);
}
