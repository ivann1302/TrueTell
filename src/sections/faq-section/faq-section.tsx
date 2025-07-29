import React, { useState } from 'react';
import styles from './faq-section.module.scss';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'У нас маленький бизнес — зачем это?',
      answer: (
        <p className={styles.answerText}>
          Именно небольшие сети теряют больше всего из-за ошибок в заказах. <br />
          Проверьте: сколько у вас товаров лежит &gt;3 месяцев?
        </p>
      )
    },
    {
      question: 'Можно ли добавить свои метрики?',
      answer: (
        <p className={styles.answerText}>
          Да! Например: <br className={styles.br}/>
          1. «Маржинальность по категориям» с учетом логистики <br className={styles.br}/>
          2. «LTV клиента» с данными из CRM «Настроим под ваш уникальный KPI».
        </p>
      )
    },
    {
      question: 'Почему мы должны доверять этой аналитике?',
      answer: (
        <div>
          <p className={styles.answerText}>
            Самое тяжелое в аналитике — последствия решений, принятых на основе ложных данных.<br className={styles.br}/>
            Данные у нас обрабатываются алгоритмами. Если произойдет какая-то ошибка, то она точно<br className={styles.br}/>
            будет заметна — показатели уйдут в 0 или в красную зону. Вы точно не примете неверного решения.
          </p>
          <p className={styles.answerText}>
            Ручная аналитика → много звеньев погрешностей → сложно заметить → неверные решения
          </p>
        </div>
      )
    }
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>FAQ</h2>
        
        <div className={styles.accordionContainer}>
          {faqItems.map((item, index) => (
            <div key={index} className={styles.accordionItem}>
              <div className={styles.divider}></div>
              <button 
                className={styles.accordionHeader}
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span 
                  className={`${styles.plusIcon} ${openIndex === index ? styles.rotated : ''}`}
                ></span>
              </button>
              {openIndex === index && (
                <div className={styles.accordionContent}>
                  {item.answer}
                </div>
              )}
              <div className={styles.divider}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 