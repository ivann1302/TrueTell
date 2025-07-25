import React from 'react';
import styles from './hero-section.module.scss';
import DemoButton from '../../components/demo-button/demo-button';
import SocialIcons from '../../components/social-icons/social-icons';

export const HeroSection: React.FC = () => {
  const handleDemoClick = () => {
    // Логика для демо
  };

  return (
    <section id="home" className={styles['hero-section']}>
      <div className={styles.container}>
        <div className={styles.first}>
          <h1 className={styles.title}>Не закупайте неликвид</h1>
          <p className={styles.subtitle}>
            TrueTell - помогаем<br />
            оффлайн-бизнесу выявлять<br />
            балласт вовремя
          </p>
        </div>
        <div className={styles.second}>
          <div className={styles['social-block']}>
            <SocialIcons />
          </div>
          <div className={styles['button-block']}>
            <h2 className={styles['cta-title']}>Попробуйте <br />сами</h2>
            <div className={styles['button-wrapper']}>
              <DemoButton onClick={handleDemoClick} />
            </div>
            <p className={styles.description}>
              займет 1 минуту, мы не просим<br />
              ваши контакты
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
