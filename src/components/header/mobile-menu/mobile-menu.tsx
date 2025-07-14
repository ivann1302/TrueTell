import { useState, useEffect } from 'react';
import styles from './mobile-menu.module.scss';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  // Close menu when clicking outside and manage body overflow
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(`.${styles.mobileMenu}`)) {
        setIsOpen(false);
      }
    };

    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle link click
  const handleLinkClick = (linkId: string) => {
    setActiveLink(linkId);
    setIsOpen(false);
  };

  return (
    <div className={styles.mobileMenu}>
      <button
        className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <span className={`${styles.burgerIcon} ${isOpen ? styles.active : ''}`}></span>
      </button>

      <nav className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          <li className={styles.mobileNavItem}>
            <a 
              href="#features" 
              className={`${styles.mobileNavLink} ${activeLink === 'features' ? styles.active : ''}`} 
              onClick={() => handleLinkClick('features')}
            >
              Возможности
            </a>
          </li>
          <li className={styles.mobileNavItem}>
            <a 
              href="#pricing" 
              className={`${styles.mobileNavLink} ${activeLink === 'pricing' ? styles.active : ''}`} 
              onClick={() => handleLinkClick('pricing')}
            >
              Цены
            </a>
          </li>
          <li className={styles.mobileNavItem}>
            <a 
              href="#cases" 
              className={`${styles.mobileNavLink} ${activeLink === 'cases' ? styles.active : ''}`} 
              onClick={() => handleLinkClick('cases')}
            >
              Кейсы
            </a>
          </li>
          <li className={styles.mobileNavItem}>
            <a 
              href="#demo" 
              className={`${styles.mobileNavLink} ${activeLink === 'demo' ? styles.active : ''}`} 
              onClick={() => handleLinkClick('demo')}
            >
              Бесплатное демо
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
