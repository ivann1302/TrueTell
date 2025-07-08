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
    <section className={styles.resultsSection}>
      <div className={styles.container}>
        {/* Кейс клиента */}
        <div className={styles.caseSection}>
          <h2 className={styles.caseTitle}>Кейс клиента</h2>
          
                    <div className={styles.clientCase}>
            <div className={styles.clientPhotoWrapper}>
              <img src={clientPhoto} alt="Client photo" className={styles.clientPhoto}/>
              <div className={styles.clientNameContainer}>
                <p className={styles.clientName}>Дмитрий <br />Баржин</p>
              </div>
            </div>
            <div className={styles.clientInfo}>
              <p className={styles.clientDescription}>Владелец сети из 6-ти табачных магазинов AllSmoke</p>
            </div>
          </div>
        </div>

        <h2 className={styles.title}>Результаты через месяц:</h2>
        
        <div className={styles.content}>
          {results.map((result, index) => (
            <div key={index} className={styles.resultBlock}>
              <img src={checkmark} alt="checkmark" className={styles.checkmark}/>
              <div className={styles.textContent}>
                <h3 className={styles.blockTitle}>{result.title}</h3>
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