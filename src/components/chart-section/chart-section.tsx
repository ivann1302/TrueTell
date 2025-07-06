import React from 'react';
import styles from './chart-section.module.scss';
import Chart from '../hero/chart/chart';
import { useChartData } from '../../hooks/useChartData';
import { COLORS } from '../../styles/colors';

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
  const chartItem = getChartByIndex(chartIndex);

  if (!chartItem) {
    console.warn(`Chart index ${chartIndex} not found`);
    return null;
  }

  return (
    <section 
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
        <Chart chart={chartItem} />
      </div>
    </section>
  );
};

export default ChartSection; 