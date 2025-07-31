import React from 'react';
import styles from './steps-section.module.scss';

export const StepsSection: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Обсуждаем',
      description: 'Текущее положение дел и описываем целевое состояние отчетности'
    },
    {
      number: '2',
      title: 'Заключаем договор'
    },
    {
      number: '3',
      title: <>Запускаем <br className={styles.br} />интеграцию</>
    }
  ];

  return (
    <section className={styles.stepsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Этапы внедрения</h2>
        
        <div className={styles.content}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepBlock}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              {step.description && (
                <p className={styles.stepDescription}>{step.description}</p>
              )}
              {index < steps.length - 1 && (
                <div className={styles.connector}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection; 