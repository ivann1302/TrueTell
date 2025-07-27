import type { TChartItem } from '../types/types';

// Создаём мемоизированную версию функции
const memoizedGenerateIdMap = new Map<string, number>();

export function generateIdFromSrc(src: string): number {
  if (memoizedGenerateIdMap.has(src)) {
    return memoizedGenerateIdMap.get(src)!;
  }

  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    const char = src.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const result = Math.abs(hash);
  memoizedGenerateIdMap.set(src, result);
  return result;
}

// Мемоизация для convertConfigToChartItems
const memoizedConvertConfigMap = new Map<string, TChartItem[]>();

export function convertConfigToChartItems(config: Array<{
  src: string;
  params: Record<string, string | undefined>;
  dimensions: { width: string; height: string };
  title: string;
}>): TChartItem[] {
  // Создаем ключ для кэширования на основе входных данных
  const cacheKey = JSON.stringify(config);

  // Проверяем, есть ли результат в кэше
  if (memoizedConvertConfigMap.has(cacheKey)) {
    return memoizedConvertConfigMap.get(cacheKey)!;
  }

  const result = config.map((item) => {
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

  // Сохраняем результат в кэш
  memoizedConvertConfigMap.set(cacheKey, result);
  return result;
}

