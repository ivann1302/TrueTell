import styles from './hero-container.module.scss';
import Chart from '../chart/chart';
import { parseIframeToChartList } from '../../../utils/functions/iframeParser';
import { iframes, titles } from '../../../utils/types/iframes';

function HeroContainer() {
  const chartList = parseIframeToChartList(iframes, titles);

  return (
    <ul className={styles.heroContainer}>
      {chartList.map((chart) => (
        <li key={chart.id} className={styles.chartItem}>
          <Chart chart={chart} />
        </li>
      ))}
    </ul>
  );
}

export default HeroContainer;
