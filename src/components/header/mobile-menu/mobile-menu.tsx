import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './mobile-menu.module.scss';

const navigationItems = [
  { id: 'products', href: '/#products', label: 'Решения' },
  { id: 'pricing', href: '/bi-analitika/#pricing', label: 'Цены' },
  { id: 'cases', href: '/bi-analitika/#cases', label: 'Кейсы' },
  { id: 'demo', href: '/bi-analitika/#demo', label: 'Бесплатное демо' },
];

const MobileMenu = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const focusTimer = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 769px)');
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    desktopMedia.addEventListener('change', closeOnDesktop);
    return () => desktopMedia.removeEventListener('change', closeOnDesktop);
  }, []);

  const closeMenu = (restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  const handleLinkClick = (linkId: string) => {
    setActiveLink(linkId);
    closeMenu(false);
  };

  return (
    <div className={styles.mobileMenu}>
      <button
        ref={menuButtonRef}
        className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        type="button"
      >
        <svg
          className={styles.menuIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3 5h18M3 12h18M3 19h18" />
        </svg>
      </button>

      {isMounted &&
        createPortal(
          <div
            ref={dialogRef}
            className={`${styles.mobileOverlay} ${isOpen ? styles.open : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Мобильная навигация"
            aria-hidden={!isOpen}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeMenu();
            }}
          >
            <div className={styles.menuTop}>
              <span className={styles.menuBrand}>TrueTell</span>
              <button
                ref={closeButtonRef}
                className={styles.closeButton}
                onClick={() => closeMenu()}
                aria-label="Закрыть меню"
                type="button"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>

            <nav id="mobile-navigation" className={styles.mobileNav} aria-label="Основная навигация">
              <ul className={styles.mobileNavList}>
                {navigationItems.map((item, index) => (
                  <li className={styles.mobileNavItem} key={item.id}>
                    <a
                      href={item.href}
                      className={`${styles.mobileNavLink} ${activeLink === item.id ? styles.active : ''}`}
                      onClick={() => handleLinkClick(item.id)}
                    >
                      <span className={styles.linkIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className={styles.menuNote}>MCP-серверы · BI-аналитика · интеграции</p>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MobileMenu;
