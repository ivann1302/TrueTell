import styles from './footer.module.scss';
import shortWhiteLogo from '../../images/logo/short-white-logo.svg';

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerBlock} ${styles.footerBlock1}`}>
        <div className={styles.footerBlockTitle}>Реквизиты</div>
        <div className={styles.footerBlockText}>ИП Романов Р.М.</div>
        <div className={styles.footerBlockText}>ИНН: 300103420414</div>
        <div className={styles.footerBlockText}>ОГРНИП: 318302500015221</div>
      </div>
      <div className={`${styles.footerBlock} ${styles.footerBlock2}`}>
        <div className={styles.footerBlockTitle}>Контакты</div>
        <div className={styles.footerBlockText}>+7 (993) 280-64-41</div>
        <div className={styles.footerBlockText}>truetell@bk.ru</div>
      </div>
      <div className={`${styles.footerBlock} ${styles.footerBlock3}`}>
        <a href="#home">
          <img
            src={shortWhiteLogo}
            alt="TrueTell Logo"
            className={styles.footerLogo}
          />
        </a>
        <div className={styles.footerBlockText}>© Все права защищены</div>
      </div>
    </footer>
  );
}

export default AppFooter;
