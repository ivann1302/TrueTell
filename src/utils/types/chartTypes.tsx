import type { ReactNode } from "react";
export type ThemeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export type ChartSectionProps = {
  /** Основной заголовок раздела (обязательный) */
  title: string;
  /** Дополнительный подзаголовок (опциональный) */
  subtitle?: string;
  /** Компонент графика, который будет отрендерен */
  chart: ReactNode;
  /** Дополнительные классы для стилизации */
  className?: string;
  /** Пользовательский цвет фона */
  backgroundColor?: string;
  /** Пользовательский цвет текста */
  titleColor?: string;
  subtitleColor?: string;
};