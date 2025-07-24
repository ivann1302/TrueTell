import React from 'react';
import styles from './results-section.module.scss';
import checkmark from './../../images/icons/checkmark.svg';
import clientPhoto from './../../images/photos/clientPhoto.png';

export const ResultsSection: React.FC = () => {
  const results = [
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
  ];

  return (
    <section id="cases" className={styles.resultsSection}>
      <div className={styles.container}>
        <h3 className={styles.title}>Кейс клиента</h3>
        {/* Кейс клиента */}
        <div className={styles.clientCase}>
          <div className={styles.image}>
            <img src={clientPhoto} alt="Client Photo" className={styles.clientPhoto} />
          </div>
          <div className={styles.clientDescription}>
            <p className={styles.clientInfo}>Дмитрий Баржин</p>
            <p className={styles.clientInfo}>Владелец сети из 6-ти табачных магазинов AllSmoke</p>
          </div>
        </div>

        <h3 className={styles.title}>Результаты через месяц:</h3>
        
        <div className={styles.content}>
          {results.map((result, index) => (
            <div key={index} className={styles.resultBlock}>
              <img src={checkmark} alt="checkmark" className={styles.checkmark}/>
              <div className={styles.textContent}>
                <h4 className={styles.blockTitle}>{result.title}</h4>
                <p className={styles.blockText}>
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

export default ResultsSection; 