import './App.css';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import ChartSection from './components/chart-section/chart-section';
import { COLORS } from './styles/colors';

function App() {
  return (
    <>
      <AppHeader />
      
      <ChartSection
        title="Сбросьте балласт"
        chartIndex={0}
        titleColor={COLORS.PRIMARY_BLUE}
      />
      
      <ChartSection
        title="Как это выглядит?"
        subtitle="Показатели по всем точкам на одном экране"
        chartIndex={1}
        backgroundColor={COLORS.PRIMARY_BLUE}
        titleColor={COLORS.WHITE}
        subtitleColor={COLORS.PRIMARY_BLUE_LIGHT}
      />
      
      <ChartSection
        title="Нацельтесь на прибыль"
        chartIndex={2}
        titleColor={COLORS.WHITE}
        backgroundColor={COLORS.PRIMARY_BLUE}
      />
      
      <AppFooter />
    </>
  );
}

export default App;