import React from 'react';
import styles from './results-section.module.scss';
import checkmark from './../../images/icons/checkmark.svg';

export const ResultsSection: React.FC = () => {
  return (
    <section className={styles.resultsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Результаты через месяц:</h2>
        
        <div className={styles.content}>
          {/* Первый блок */}
          <div className={styles.resultBlock}>
            <img src={checkmark} alt="checkmark" className={styles.checkmark}/>
            <div className={styles.textContent}>
              <h3 className={styles.blockTitle}>Сократил</h3>
              <p className={styles.blockText}>
                на 35% "мертвый" ассортимент
              </p>
            </div>
          </div>

          {/* Второй блок */}
          <div className={styles.resultBlock}>
            <img src={checkmark} alt="checkmark" className={styles.checkmark}/>
            <div className={styles.textContent}>
              <h3 className={styles.blockTitle}>Увеличил</h3>
              <p className={styles.blockText}>
                на 18% маржу за счет<br />
                перераспределения закупок
              </p>
            </div>
          </div>

          {/* Третий блок */}
          <div className={styles.resultBlock}>
            <img src={checkmark} alt="checkmark" className={styles.checkmark}/>
            <div className={styles.textContent}>
              <h3 className={styles.blockTitle}>Назначил KPI</h3>
              <p className={styles.blockText}>
                понятные для менеджеров, дал доступ<br />
                к дашборду и теперь сам меньше следит<br />
                за магазинами
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection; 