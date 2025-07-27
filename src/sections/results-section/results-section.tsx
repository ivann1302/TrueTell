import React, { memo } from 'react';
import { useMemo } from 'react';
import styles from './results-section.module.scss';
import checkmark from './../../images/icons/checkmark.svg';
import clientPhoto from './../../images/photos/clientPhoto.png';

export const ResultsSection: React.FC = () => {
  const results = useMemo(() =>
    [
      {
        title: 'Сократил',
        text: 'на 35% "мертвый" ассортимент'
      },
      {
        title: 'Увеличил',
        text: 'на 18% маржу за счет перераспределения закупок'
      },
      {
        title: 'Назначил KPI',
        text: 'понятные для менеджеров, дал доступ к дашборду и теперь сам меньше следит за магазинами'
      }
    ], []);

  return (
    <section id="cases" className={styles['results-section']}>
      <div className={styles.container}>
        <h3 className={styles['section-title']}>Кейс клиента</h3>
        {/* Кейс клиента */}
        <div className={styles['client-case']}>
          <div className={styles.image}>
            <img src={clientPhoto} alt="Client Photo" className={styles['client-photo']} />
          </div>
          <div className={styles['client-description']}>
            <p className={styles['client-info']}>Дмитрий Баржин</p>
            <p className={styles['client-info']}>Владелец сети из 6-ти табачных магазинов AllSmoke</p>
          </div>
        </div>

        <h4 className={styles.title}>Результаты через месяц:</h4>

        <div className={styles.content}>
          {results.map((result, index) => (
            <div key={index} className={styles['result-block']}>
              <img src={checkmark} alt="checkmark" className={styles.checkmark}/>
              <div className={styles['text-content']}>
                <h4 className={styles['block-title']}>{result.title}</h4>
                <p className={styles['block-text']}>
                  {result.text.includes('перераспределения') ? (
                    <>на 18% маржу за счет<br />перераспределения закупок</>
                  ) : result.text.includes('дашборду') ? (
                    <>понятные для менеджеров, дал доступ<br />к дашборду и теперь сам меньше следит<br />за магазинами</>
                  ) : (
                    result.text
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Мемоизируем компонент для предотвращения ненужных перерендеров
export default memo(ResultsSection); 
