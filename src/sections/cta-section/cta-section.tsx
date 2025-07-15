import React from 'react';
import styles from './cta-section.module.scss';
import DemoButton from '../../components/demo-button/demo-button';
import { SocialIcons } from '../../components/social-icons/social-icons';

export const CTASection: React.FC = () => {
  const handleDemoClick = () => {
    // Логика для демо
    console.log('Demo button clicked');
  };

  return (
    <section id="demo" className={styles.ctaSection}>
      <div className={styles.container}>
        {/* Верхний блок */}
        <div className={styles.topBlock}>
          <div className={styles.leftContent}>
            <h2 className={styles.title}>
              Поднимите прибыльность на 5% <br />
              уже в этом месяце!
            </h2>
          </div>
          <div className={styles.rightContent}>
            <h3 className={styles.subtitle}>Попробуйте сами</h3>
            <DemoButton onClick={handleDemoClick} />
            <p className={styles.description}>
              займет 1 минуту, мы не просим <br />
              ваши контакты
            </p>
          </div>
        </div>

        {/* Нижний блок */}
        <div className={styles.bottomBlock}>
          <div className={styles.contactBlock}>
            <h3 className={styles.contactTitle}>
              Или напишите нам, мы же люди!
            </h3>
          </div>
          <div className={styles.socialBlock}>
            <SocialIcons />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 