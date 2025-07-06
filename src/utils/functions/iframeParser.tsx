import type { TChartItem } from '../types/types';

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

      return {
        id: generateIdFromSrc(baseUrl),
        src: baseUrl,
        params: {
          clients: params['clients'] || '',
          date_group_param: params['date_group_param'] || '__eq_День',
          date_param: params['date_param'] || '__interval___relative_-15d___relative_-1d',
          retail_store_name_j4ew: params['retail_store_name_j4ew'] || '',
          _embedded: params['_embedded'] || '1',
          _no_controls: params['_no_controls'] || '1',
          ...params, // Include any additional parameters
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
