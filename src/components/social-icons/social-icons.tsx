import React from 'react';
import styles from './social-icons.module.scss';
import whatsappIcon from '../../images/icons/whatsapp.svg';
import telegramIcon from '../../images/icons/telegram.svg';

interface SocialIconsProps {
  className?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`${styles['social-icons']} ${className}`}>
      <a 
        href="https://wa.me/" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles['social-icon']}
      >
        <div className={styles['whatsapp-icon']}>
          <img src={whatsappIcon} alt="WhatsApp" />
        </div>
      </a>
      <a 
        href="https://t.me/" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles['social-icon']}
      >
        <div className={styles['telegram-icon']}>
          <img src={telegramIcon} alt="Telegram" />
        </div>
      </a>
    </div>
  );
};

export default SocialIcons; 
