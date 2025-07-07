import React from 'react';
import styles from './whoIsItFor.module.scss';

export const WhoIsItForSection: React.FC = () => {
  return (
    <section className={styles.WhoIsItFor}>
      <div className={styles.container}>
        <h2 className={styles.title}>Кому мы подходим?</h2>
        
        <div className={styles.content}>
          {/* Левая колонка */}
          <div className={styles.leftColumn}>
            <div className={styles.smallBlock}>
              Розница от 3 точек
            </div>
            <div className={styles.largeBlock}>
              Вы используете<br />
              Мой Склад
            </div>
          </div>

          {/* Центральное фото */}
          <div className={styles.centerImage}>
            <img 
              src="/src/images/photos/whoIsItFor.png" 
              alt="Business analytics" 
              className={styles.image}
            />
          </div>

          {/* Правая колонка */}
          <div className={styles.rightColumn}>
            <div className={styles.largeBlock}>
              У вас несколько<br />
              разных отчетов, их<br />
              делают люди
            </div>
            <div className={styles.smallBlock}>
              Либо отчета нет вообще
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItForSection; 