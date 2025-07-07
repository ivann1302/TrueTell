import './App.css';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import ChartSection from './components/chart-section/chart-section';
import CTASection from './sections/cta-section/cta-section';
import HeroSection from './sections/hero-section/hero-section';
import WhoIsItForSection from './sections/whoIsItFor/whoIsItFor';
import PainPointsSection from './sections/pain-points-section/pain-points-section';
import SolutionSection from './sections/solution-section/solution-section';
import ResultsSection from './sections/results-section/results-section';
import { COLORS } from './styles/colors';

function App() {
  return (
    <>
      <AppHeader />
      
      <HeroSection />
      
      <ChartSection
        title="Сбросьте балласт"
        chartIndex={0}
        titleColor={COLORS.PRIMARY_BLUE}
      />

              <WhoIsItForSection />
      
      <PainPointsSection />
      
      <SolutionSection />
        
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
      
      <ResultsSection />
      
      <CTASection />
      
      <AppFooter />
    </>
  );
}

export default App;