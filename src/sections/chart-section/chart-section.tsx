import styles from './chart-section.module.scss';
import type { ChartSectionProps } from '../../utils/types/chartTypes';
import React from 'react';

export const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  subtitle,
  chart,
  className = '',
  backgroundColor = '#ffffff',
  titleColor = '#333333',
  subtitleColor = '#666666',
}) => {
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
        {chart}
      </div>
    </section>
  );
};

export default ChartSection;