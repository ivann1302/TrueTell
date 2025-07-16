export type TParams = {
  clients: string;
  date_group_param: string;
  date_param: string;
  retail_store_name_j4ew: string;
  _embedded: string;
  _no_controls: string;
  [key: string]: string | undefined;
};

export type TChartItem = {
  id: number;
  src: string;
  params: TParams;
  dimensions: {
    width: string;
    height: string;
  };
  title: string;
};

export interface ChartProps {
  chart: TChartItem;
}

export interface ChartSectionData {
  title: string;
  subtitle?: string;
  chartIndex: number;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

