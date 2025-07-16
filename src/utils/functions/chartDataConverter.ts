import type { TChartItem } from '../types/types';

export function convertConfigToChartItems(config: Array<{
  src: string;
  params: Record<string, string | undefined>;
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
    // Дефолтные значения для всех возможных параметров
    const defaultParams = {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    };

    // Фильтруем undefined значения из входящих параметров
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
        ...defaultParams,
        ...filteredParams, // Перезаписываем дефолтные значения
      },
      dimensions: item.dimensions,
      title: item.title,
    };
  });
}

export function parseIframeToChartList(
  iframeHtmlArray: string[],
  titles: string[] = [],
): TChartItem[] {
  function generateIdFromSrc(src: string): number {
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
      const char = src.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  function parseIframeHtml(iframeHtml: string, index: number): TChartItem | null {
    try {
      const srcMatch = iframeHtml.match(/src="([^"]+)"/);
      if (!srcMatch) {
        console.warn(`No src attribute found in iframe at index ${index}`);
        return null;
      }

      const fullSrc = srcMatch[1];
      const [baseUrl, queryString] = fullSrc.split('?');

      if (!baseUrl) {
        console.warn(`Invalid base URL in iframe at index ${index}`);
        return null;
      }

      const params: Record<string, string> = {};
      if (queryString) {
        queryString.split('&').forEach((pair) => {
          const [key, value = ''] = pair.split('=');
          if (key) {
            params[key] = decodeURIComponent(value);
          }
        });
      }

      const widthMatch = iframeHtml.match(/width="([^"]+)"/);
      const heightMatch = iframeHtml.match(/height="([^"]+)"/);

      // Дефолтные значения для всех параметров
      const defaultParams = {
        clients: '',
        date_group_param: '__eq_День',
        date_param: '__interval___relative_-15d___relative_-1d',
        retail_store_name_j4ew: '',
        _embedded: '1',
        _no_controls: '1',
        hour_group_param: '',
      };

      return {
        id: generateIdFromSrc(baseUrl),
        src: baseUrl,
        params: {
          ...defaultParams,
          ...params, // Фактические параметры перезаписывают дефолтные
        },
        dimensions: {
          width: widthMatch ? widthMatch[1] : '1171px',
          height: heightMatch ? heightMatch[1] : '444px',
        },
        title: titles[index] || `Chart ${index + 1}`,
      };
    } catch (error) {
      console.error(`Error parsing iframe at index ${index}:`, error);
      return null;
    }
  }

  return iframeHtmlArray
    .map((iframeHtml, index) => parseIframeHtml(iframeHtml, index))
    .filter((item): item is TChartItem => item !== null);
}