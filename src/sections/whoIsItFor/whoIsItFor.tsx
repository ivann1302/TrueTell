import React from 'react';
import styles from './whoIsItFor.module.scss';
import whoIsItForImage from './../../images/photos/whoIsItFor.png';

export const WhoIsItForSection: React.FC = () => {
  return (
    <section className={styles.WhoIsItFor}>
      <div className={styles.container}>
        <h2 className={styles.title}>Кому мы подходим?</h2>

        <div className={styles.content}>
          {/* Левая колонка */}
          <div className={styles.firstColumn}>
            <div className={`${styles.smallBlock} ${styles.bwGradient}`}>
              Розница от 3 точек
            </div>
            <div className={`${styles.largeBlock} ${styles.bwGradient}`}>
              Вы используете систему управленческого учета Мой Склад
            </div>
          </div>

          {/* Центральное фото */}
          <div className={styles.centerImage}>
            <img 
              src={whoIsItForImage} 
              alt="Business analytics" 
              className={styles.image}
            />
          </div>

          {/* Правая колонка */}
          <div className={styles.secondColumn}>
            <div className={`${styles.largeBlock} ${styles.wbGradient}`}>
              У вас несколько  разных отчетов, их делают люди
            </div>
            <div className={`${styles.smallBlock} ${styles.wbGradient}`}>
              Либо отчета нет вообще
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItForSection; 
