import styles from './chart.module.scss';

interface ChartProps {
  chart: {
    src: string;
    params: Record<string, string>;
    title: string;
    dimensions: {
      width: string;
      height: string;
    };
  };
}

function Chart({ chart }: ChartProps) {
  const buildIframeUrl = (baseUrl: string, params: Record<string, string>) => {
    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}?${queryString}`;
  };

  return (
    <iframe
      className={styles.iframe}
      src={buildIframeUrl(chart.src, chart.params)}
      title={chart.title}
      width={chart.dimensions.width}
      height={chart.dimensions.height}
      frameBorder="0"
      allowFullScreen
      loading="lazy"
    />
  );
}

export default Chart;
