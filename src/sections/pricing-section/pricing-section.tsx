import React from 'react';
import styles from './pricing-section.module.scss';
import DemoButton from '../../components/demo-button/demo-button';

export const PricingSection: React.FC = () => {
  const handleDemoClick = () => {
    console.log('Demo button clicked');
  };

  const cards = [
    {
      type: 'intro',
      title: 'Испытайте перед покупкой',
      content: (
        <div className={styles.cardContent}>
          <DemoButton onClick={handleDemoClick} />
          <p className={styles.cardDescription}>
            Займет 1 минуту, мы не просим <br />
            ваши контакты
          </p>
        </div>
      )
    },
    {
      type: 'implementation',
      title: 'Внедрение',
      subtitle: <>в зависимости от <br /> числа источников</>,
      price: <>40 000 ₽ - <br className={styles.none}/>60 000 ₽</>,
    },
    {
      type: 'support',
      title: 'Поддержка',
      subtitle: <>обеспечение <br /> работоспособности, доработка запросов заказчика</>,
      price: '7 000 ₽ - 15 000 ₽',
      period: 'в месяц'
    }
  ];

  const renderCard = (card: typeof cards[0], index: number) => {
    const isIntroCard = card.type === 'intro';
    const cardClass = isIntroCard ? styles.card : styles.cardBlue;
    const titleClass = isIntroCard ? styles.cardTitle : styles.cardTitleWhite;

    return (
      <div key={index} className={cardClass}>
        <h3 className={titleClass}>{card.title}</h3>

        {isIntroCard ? (
          card.content
        ) : (
          <>
            <p className={`${styles.cardSubtitle} ${card.type === 'implementation' ? styles.mb45 : ''}`}>
              {card.subtitle}
            </p>
            <p className={styles.cardPrice}>
              {card.price}
              {card.period && (
                <>
                  <br />
                  <span className={styles.cardPeriod}> {card.period}</span>
                </>
              )}
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Начните прямо сейчас!</h2>
        <div className={styles.content}>
          {cards.map(renderCard)}
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 
