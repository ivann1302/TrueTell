import { COLORS } from '../styles/colors';
import type { ChartSectionData } from './../utils/types/types.ts';

export const CHART_IFRAMES = [
  {
    src: 'https://datalens.yandex/q76ngy1mwhukc',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '1171px',
      height: '444px',
    },
    title: 'Продажи за последние 15 дней',
  },
  {
    src: 'https://datalens.yandex/6nm3wem74fvgs',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-30d___relative_-15d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart New 1',
  },
  {
    src: 'https://datalens.yandex/5ml2vdl63euer',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-30d___relative_-15d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart New 2',
  },
  {
    src: 'https://datalens.yandex/q76ngy9tkipkc',
    params: {
      clients: '',
      date_param: '__interval___relative_-30d___relative_-15d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
      date_group_param: '__eq_День',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart New 3',
  },
  {
    src: 'https://datalens.yandex/arq70ilgfms0w',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '500px',
      height: '400px',
    },
    title: 'Chart 2',
  },
  {
    src: 'https://datalens.yandex/4lk1ucfp9uooq',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart 3',
  },
  {
    src: 'https://datalens.yandex/6nm3wem74fvgs',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart 4',
  },
  {
    src: 'https://datalens.yandex/5ml2vdl63euer',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-15d___relative_-1d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart 5',
  },
  {
    src: 'https://datalens.yandex/6nm3wem74fvgs',
    params: {
      clients: '',
      date_group_param: '__eq_День',
      date_param: '__interval___relative_-30d___relative_-15d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      hour_group_param: '',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart 6',
  },
  {
    src: 'https://datalens.yandex/wdctm4evrabsi',
    params: {
      hour_group_param: '',
      clients: '',
      date_param: '__interval___relative_-30d___relative_-15d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1',
      date_group_param: '__eq_День',
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart 7',
  },
  {
    src: 'https://datalens.yandex/fwvc5nxy90mi1',
    params: {
      hour_group_param: '',
      clients: '',
      date_param: '__interval___relative_-30d___relative_-15d',
      retail_store_name_j4ew: '',
      _embedded: '1',
      _no_controls: '1', // Добавлено недостающее поле
      date_group_param: '__eq_День', // Добавлено недостающее поле
    },
    dimensions: {
      width: '100%',
      height: '400px',
    },
    title: 'Chart 8',
  },
];

export const CHART_SECTIONS: ChartSectionData[] = [
  {
    title: 'Сбросьте балласт',
    chartIndex: 0,
    titleColor: COLORS.PRIMARY_BLUE,
  },
  {
    title: 'Как это выглядит?',
    subtitle: 'Показатели по всем точкам на одном экране',
    chartIndex: 1,
    backgroundColor: COLORS.PRIMARY_BLUE,
    titleColor: COLORS.WHITE,
    subtitleColor: COLORS.PRIMARY_BLUE_LIGHT,
  },
  {
    title: 'Нацельтесь на прибыль',
    chartIndex: 2,
    titleColor: COLORS.WHITE,
    backgroundColor: COLORS.PRIMARY_BLUE,
  },
];