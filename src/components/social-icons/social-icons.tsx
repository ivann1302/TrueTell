import React from 'react';
import styles from './social-icons.module.scss';
import whatsappIcon from '../../images/icons/whatsapp.svg';
import telegramIcon from '../../images/icons/telegram.svg';
import { companyInfo } from '../../config/company';
import { assetPath } from '../../utils/functions/assetPath';

interface SocialIconsProps {
  className?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`${styles['social-icons']} ${className}`}>
      <a
        href={companyInfo.contacts.whatsapp.url}
        target="_blank" 
        rel="noopener noreferrer"
        className={styles['social-icon']}
      >
        <div className={styles['whatsapp-icon']}>
          <img src={assetPath(whatsappIcon)} alt="WhatsApp" />
        </div>
      </a>
      <a
        href={companyInfo.contacts.telegram.url}
        target="_blank" 
        rel="noopener noreferrer"
        className={styles['social-icon']}
      >
        <div className={styles['telegram-icon']}>
          <img src={assetPath(telegramIcon)} alt="Telegram" />
        </div>
      </a>
    </div>
  );
};

export default SocialIcons; 
