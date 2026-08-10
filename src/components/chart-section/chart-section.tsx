import React, { memo, useRef, useState, useEffect } from 'react';
import { useMemo } from 'react';
import styles from './chart-section.module.scss';
import Chart from '../hero/chart/chart';
import { useChartData } from '../../hooks/useChartData';
import { COLORS } from '../../styles/colors';
import { useMobileTablet } from '../../hooks/useMediaQuery';
import howItLookMobile from '../../images/mobile-charts/howItLook.jpg';
import throwOffBallastMobile from '../../images/mobile-charts/throwOffBallast.jpg';
import aimForProfitMobile from '../../images/mobile-charts/aimForProfit.jpg';
import { assetPath } from '../../utils/functions/assetPath';

export interface ChartSectionProps {
  /** Основной заголовок раздела */
  title: string;
  /** Дополнительный подзаголовок (опциональный) */
  subtitle?: string;
  /** Индекс чарта из конфигурации */
  chartIndex: number;
  /** Дополнительные классы для стилизации */
  className?: string;
  /** Пользовательский цвет фона */
  backgroundColor?: string;
  /** Пользовательский цвет заголовка */
  titleColor?: string;
  /** Пользовательский цвет подзаголовка */
  subtitleColor?: string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  subtitle,
  chartIndex,
  className = '',
  backgroundColor = COLORS.BACKGROUND_WHITE,
  titleColor = COLORS.TEXT_PRIMARY,
  subtitleColor = COLORS.TEXT_SECONDARY,
}) => {
  const { getChartByIndex } = useChartData();
  const chartItem = useMemo(() => getChartByIndex(chartIndex), [getChartByIndex, chartIndex]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobileOrTablet = useMobileTablet();

  // Function to get the appropriate mobile image based on the title or chartIndex
  const getMobileImage = () => {
    if (title === "Сбросьте балласт") {
      return throwOffBallastMobile;
    } else if (title === "Нацельтесь на прибыль") {
      return aimForProfitMobile;
    } else if (title === "Как это выглядит") {
      return howItLookMobile;
    }
    // Default fallback based on chartIndex
    switch (chartIndex) {
      case 3:
        return aimForProfitMobile;
      case 4:
        return throwOffBallastMobile;
      default:
        return howItLookMobile;
    }
  };

  useEffect(() => {
    // Skip if chart item doesn't exist
    if (!chartItem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // When section becomes visible
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Once visible, no need to observe anymore
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        // Start loading when chart is 300px away from viewport
        rootMargin: '300px',
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [chartItem]);

  if (!chartItem) {
    console.warn(`Chart index ${chartIndex} not found`);
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className={`${styles['chart-section']} ${className}`}
      style={{ backgroundColor }}
    >
      <div className={styles['chart-section__header']}>
        <h2 
          className={styles['chart-section__title']}
          style={{ color: titleColor }}
        >
          {title}
        </h2>
        {subtitle && (
          <h3 
            className={styles['chart-section__subtitle']}
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </h3>
        )}
      </div>
      <div className={styles['chart-section__content']}>
        {isVisible && (
          isMobileOrTablet ? (
            <img 
              src={assetPath(getMobileImage())}
              alt={title} 
              className={`${styles['chart-section__mobile-image']} ${
                title === "Сбросьте балласт" ? styles['chart-section__mobile-image--throwOffBallast'] :
                title === "Нацельтесь на прибыль" ? styles['chart-section__mobile-image--aimForProfit'] : ''
              }`} 
            />
          ) : (
            <Chart chart={chartItem} />
          )
        )}
      </div>
    </section>
  );
};

// Мемоизируем компонент для предотвращения ненужных перерендеров
export default memo(ChartSection); 
