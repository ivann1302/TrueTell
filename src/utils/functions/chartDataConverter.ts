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

  return config.map((item) => {
    // Filter out undefined values from params
    const filteredParams: Record<string, string> = {};

    for (const [key, value] of Object.entries(item.params)) {
      if (value !== undefined) {
        filteredParams[key] = value;
      }
    }

    return {
      id: generateIdFromSrc(item.src),
      src: item.src,
      params: {
        ...filteredParams,
        clients: filteredParams.clients || '',
        date_group_param: filteredParams.date_group_param || '__eq_День',
        date_param: filteredParams.date_param || '__interval___relative_-15d___relative_-1d',
        retail_store_name_j4ew: filteredParams.retail_store_name_j4ew || '',
        _embedded: filteredParams._embedded || '1',
        _no_controls: filteredParams._no_controls || '1',
      },
      dimensions: item.dimensions,
      title: item.title,
    };
  });
} 
