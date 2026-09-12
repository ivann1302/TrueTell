import styles from './footer.module.scss';
import shortWhiteLogo from '../../images/logo/short-white-logo.svg';
import { companyInfo } from '../../config/company';
import { assetPath } from '../../utils/functions/assetPath';

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerBlock} ${styles.footerBlock1}`}>
        <div className={styles.footerBlockTitle}>Реквизиты</div>
        <div className={styles.footerBlockText}>{companyInfo.legal.name}</div>
        <div className={styles.footerBlockText}>ИНН: {companyInfo.legal.inn}</div>
        <div className={styles.footerBlockText}>{companyInfo.legal.registrationType}: {companyInfo.legal.registrationNumber}</div>
      </div>
      <div className={`${styles.footerBlock} ${styles.footerBlock2}`}>
        <div className={styles.footerBlockTitle}>Контакты</div>
        <div className={styles.footerBlockText}><a href={companyInfo.contacts.phone.href}>{companyInfo.contacts.phone.display}</a></div>
        <div className={styles.footerBlockText}>{companyInfo.contacts.email}</div>
      </div>
      <div className={`${styles.footerBlock} ${styles.footerBlock3}`}>
        <a href="#home">
          <img
            src={assetPath(shortWhiteLogo)}
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
