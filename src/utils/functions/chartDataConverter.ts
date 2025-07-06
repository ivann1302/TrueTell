import type { TChartItem } from '../types/types';

export function convertConfigToChartItems(config: Array<{
  src: string;
  params: Record<string, string>;
  dimensions: { width: string; height: string };
  title: string;
}>): TChartItem[] {
  function generateIdFromSrc(src: string): number {
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
      const char = src.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  return config.map((item) => ({
    id: generateIdFromSrc(item.src),
    src: item.src,
    params: {
      clients: item.params.clients || '',
      date_group_param: item.params.date_group_param || '__eq_День',
      date_param: item.params.date_param || '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: item.params.retail_store_name_j4ew || '',
      _embedded: item.params._embedded || '1',
      _no_controls: item.params._no_controls || '1',
      ...item.params,
    },
    dimensions: item.dimensions,
    title: item.title,
  }));
} 