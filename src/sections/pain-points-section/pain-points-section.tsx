import React from 'react';
import styles from './pain-points-section.module.scss';
import cross from './../../images/icons/cross.svg';

export const PainPointsSection: React.FC = () => {
  return (
    <section className={styles.painPointsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Какие боли мы закрываем?</h2>
        
        <div className={styles.content}>
          {/* Первый блок */}
          <div className={styles.painBlock}>
            <img src={cross} alt="cross" className={styles.cross}/>
            <div className={styles.textContent}>
              <h3 className={styles.blockTitle}>Товары-«мертвецы»</h3>
              <p className={styles.blockText}>
                20-30% ассортимента не продается,<br />
                но менеджеры продолжают их<br />
                заказывать.
              </p>
            </div>
          </div>

          {/* Второй блок */}
          <div className={styles.painBlock}>
            <img src={cross} alt="cross" className={styles.cross}/>
            <div className={styles.textContent}>
              <h3 className={styles.blockTitle}>Поставщики впаривают неликвид</h3>
              <p className={styles.blockText}>
                Менеджеры по продажам поставщиков<br />
                работают на свои KPI
              </p>
            </div>
          </div>

          {/* Третий блок */}
          <div className={styles.painBlock}>
            <img src={cross} alt="cross" className={styles.cross}/>
            <div className={styles.textContent}>
              <h3 className={styles.blockTitle}>Погрешности в заказах:</h3>
              <p className={styles.blockText}>
                Как вы сейчас принимаете решения?<br />
                На глазок или по данным?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection; 