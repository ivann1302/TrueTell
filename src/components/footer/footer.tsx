import styles from './footer.module.scss';
import shortWhiteLogo from '../../images/logo/short-white-logo.svg';

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerBlock} ${styles.footerBlock1}`}>
        <div className={styles.footerBlockTitle}>Реквизиты</div>
        <div className={styles.footerBlockText}>ИП Митряев А. А.</div>
        <div className={styles.footerBlockText}>ИНН: 504511954505</div>
        <div className={styles.footerBlockText}>ОГРНИП: 317502200030027</div>
      </div>
      <div className={`${styles.footerBlock} ${styles.footerBlock2}`}>
        <div className={styles.footerBlockTitle}>Контакты</div>
        <div className={styles.footerBlockText}>+7 (993) 280-64-41</div>
        <div className={styles.footerBlockText}>truetell@bk.ru</div>
      </div>
      <div className={`${styles.footerBlock} ${styles.footerBlock3}`}>
        <img 
          src={shortWhiteLogo} 
          alt="TrueTell Logo" 
          className={styles.footerLogo}
        />
        <div className={styles.footerBlockText}>© Все права защищены</div>
      </div>
    </footer>
  );
}

export default AppFooter;
