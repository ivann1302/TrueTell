export type TParams = {
  clients: string;
  date_group_param: string;
  date_param: string;
  retail_store_name_j4ew: string;
  _embedded: string;
  _no_controls: string;
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