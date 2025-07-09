import React from 'react';
import styles from './hero-section.module.scss';
import DemoButton from '../../components/demo-button/demo-button';
import SocialIcons from '../../components/social-icons/social-icons';

export const HeroSection: React.FC = () => {
  const handleDemoClick = () => {
    // Логика для демо
    console.log('Demo button clicked');
  };

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>Не закупайте неликвид</h1>
          <p className={styles.subtitle}>
            TrueTell - помогаем<br />
            оффлайн-бизнесу выявлять<br />
            балласт вовремя
          </p>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.topBlock}>
            <SocialIcons />
          </div>
          <div className={styles.bottomBlock}>
            <h3 className={styles.ctaTitle}>Попробуйте<br />сами</h3>
            <div className={styles.buttonWrapper}>
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