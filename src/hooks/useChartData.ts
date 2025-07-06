import { useMemo } from 'react';
import { CHART_IFRAMES } from '../config/chartConfig';
import { convertConfigToChartItems } from '../utils/functions/chartDataConverter';
import type { TChartItem } from '../utils/types/types';

export function useChartData(): {
  chartData: TChartItem[];
  getChartByIndex: (index: number) => TChartItem | null;
  totalCharts: number;
} {
  const chartData = useMemo(() => {
    try {
      return convertConfigToChartItems(CHART_IFRAMES);
    } catch (error) {
      console.error('Error converting chart config:', error);
      return [];
    }
  }, []);

  const getChartByIndex = (index: number): TChartItem | null => {
    if (index < 0 || index >= chartData.length) {
      console.warn(`Chart index ${index} is out of bounds. Available charts: ${chartData.length}`);
      return null;
    }
    return chartData[index];
  };

  return {
    chartData,
    getChartByIndex,
    totalCharts: chartData.length,
  };
} 