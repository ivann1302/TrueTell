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
    <div className={`${styles.socialIcons} ${className}`}>
      <a 
        href="https://wa.me/79932806441" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.socialIcon}
      >
        <div className={styles.whatsappIcon}>
          <img src={whatsappIcon} alt="WhatsApp" />
        </div>
      </a>
      <a 
        href="https://t.me/truetell" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.socialIcon}
      >
        <div className={styles.telegramIcon}>
          <img src={telegramIcon} alt="Telegram" />
        </div>
      </a>
    </div>
  );
};

export default SocialIcons; 