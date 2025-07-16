import styles from './chart.module.scss';
import type { ChartProps } from '../../../utils/types/types';

function Chart({ chart }: ChartProps) {
  const buildIframeUrl = (baseUrl: string, params: Record<string, string | undefined>) => {
    const filteredParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        filteredParams[key] = value;
      }
    }
    const queryString = new URLSearchParams(filteredParams).toString();
    return `${baseUrl}?${queryString}`;
  };

  return (
    <iframe
      className={styles.iframe}
      src={buildIframeUrl(chart.src, chart.params)}
      title={chart.title}
      width={chart.dimensions.width}
      height={chart.dimensions.height}
      allowFullScreen
      loading="lazy"
    />
  );
}


export default Chart;
