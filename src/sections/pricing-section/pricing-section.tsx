import React, { useState, useRef, useEffect } from 'react';
import styles from './pricing-section.module.scss';
import DemoButton from '../../components/demo-button/demo-button';
import { useMobileTablet } from '../../hooks/useMediaQuery';

export const PricingSection: React.FC = () => {
  const isMobileOrTablet = useMobileTablet();
  const [currentCard, setCurrentCard] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobileOrTablet && carouselRef.current) {
      // Force a reflow to ensure the carousel is properly positioned
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = 0;
        }
      }, 100);
    }
  }, [isMobileOrTablet]);

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
            Займет 1 минуту, мы не просим <br className={styles.br} />
            ваши контакты
          </p>
        </div>
      )
    },
    {
      type: 'implementation',
      title: 'Внедрение',
      subtitle: <>в зависимости от <br className={styles.br} /> числа источников</>,
      price: <>40 000 ₽ - <br className={styles.br}/>60 000 ₽</>,
    },
    {
      type: 'support',
      title: 'Поддержка',
      subtitle: <>обеспечение <br className={styles.br} /> работоспособности, доработка запросов заказчика</>,
      price: '7 000 ₽ - 15 000 ₽',
      period: 'в месяц'
    }
  ];

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {

      setCurrentCard(prev => (prev + 1) % cards.length);
    } else if (distance < -minSwipeDistance) {

      setCurrentCard(prev => (prev - 1 + cards.length) % cards.length);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const renderCard = (card: typeof cards[0], index: number) => {
    const isIntroCard = card.type === 'intro';
    const cardClass = isIntroCard ? styles.card : styles.cardBlue;
    const titleClass = isIntroCard ? styles.cardTitle : styles.cardTitleWhite;
    const isActive = index === currentCard;

    return (
      <div 
        key={index} 
        className={`${cardClass} ${isMobileOrTablet ? styles.carouselCard : ''} ${isActive && isMobileOrTablet ? styles.activeCard : ''}`}
      >
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
        {isMobileOrTablet ? (
          <>
            <div 
              ref={carouselRef}
              className={styles.carouselContainer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={styles.carouselTrack}
                style={{ 
                  transform: currentCard === 0 
                    ? `translateX(15%)` 
                    : currentCard === cards.length - 1 
                      ? `translateX(-125%)` 
                      : `translateX(-55%)`
                }}
              >
                {cards.map(renderCard)}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.content}>
            {cards.map(renderCard)}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection; 
