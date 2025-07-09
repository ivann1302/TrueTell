import styles from './header.module.scss';
function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <a href="#home" className={styles.logoLink}>
            <img src="/src/images/logo/logo.svg" alt="TrueTell Logo" className={styles.logo} />
          </a>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#features" className={styles.navLink}>
                Возможности
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#pricing" className={styles.navLink}>
                Цены
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#cases" className={styles.navLink}>
                Кейсы
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#demo" className={styles.navLink}>
                Бесплатное демо
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
