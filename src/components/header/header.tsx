import { useEffect, useRef, useState } from 'react';
import styles from './header.module.scss';
import MobileMenu from './mobile-menu/mobile-menu.tsx';
import logoImage from '../../images/logo/logo.svg';
import { assetPath } from '../../utils/functions/assetPath';

function AppHeader() {
  const [isHidden, setIsHidden] = useState(false);
  const revealTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(true);

      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
      }

      revealTimeoutRef.current = window.setTimeout(() => {
        setIsHidden(false);
        revealTimeoutRef.current = null;
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${isHidden ? styles.isHidden : ''}`}
      aria-hidden={isHidden}
      inert={isHidden}
    >
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <a href="/" className={styles.logoLink}>
            <img src={assetPath(logoImage)} alt="TrueTell Logo" className={styles.logo} />
          </a>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/products/" className={styles.navLink}>
                Решения
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/bi-analitika/#pricing" className={styles.navLink}>
                Цены
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/bi-analitika/#cases" className={styles.navLink}>
                Кейсы
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/blog/" className={styles.navLink}>
                Блог
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/bi-analitika/" className={styles.navLink}>
                BI-аналитика
              </a>
            </li>
          </ul>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}

export default AppHeader;
