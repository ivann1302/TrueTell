import './App.css';
import { Suspense, lazy } from 'react';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import HeroSection from './sections/hero-section/hero-section';
import { COLORS } from './styles/colors';

// Lazy load non-critical components
const ChartSection = lazy(() => import('./components/chart-section/chart-section'));
const WhoIsItForSection = lazy(() => import('./sections/whoIsItFor/whoIsItFor'));
const PainPointsSection = lazy(() => import('./sections/pain-points-section/pain-points-section'));
const SolutionSection = lazy(() => import('./sections/solution-section/solution-section'));
const ResultsSection = lazy(() => import('./sections/results-section/results-section'));
const SliderSection = lazy(() => import('./sections/slider-section/slider-section'));
const StepsSection = lazy(() => import('./sections/steps-section/steps-section'));
const FAQSection = lazy(() => import('./sections/faq-section/faq-section'));
const PricingSection = lazy(() => import('./sections/pricing-section/pricing-section'));
const HowItLook = lazy(() => import('./sections/howItLook/how-it-look').then(module => ({ default: module.HowItLook })));
const CTASection = lazy(() => import('./sections/cta-section/cta-section'));

function App() {
  return (
    <>
      <AppHeader />
      <HeroSection />

      <Suspense fallback={<div>Загрузка...</div>}>
        <ChartSection
          title="Сбросьте балласт"
          chartIndex={4}
          titleColor={COLORS.PRIMARY_BLUE}
        />

        <WhoIsItForSection />

        <PainPointsSection />

        <SolutionSection />

        <HowItLook />

        <ChartSection
          title="Нацельтесь на прибыль"
          subtitle="Показатели по всем точкам на одном экране"
          chartIndex={3}
          titleColor={COLORS.WHITE}
          subtitleColor={COLORS.PRIMARY_BLUE_LIGHT}
          backgroundColor={COLORS.PRIMARY_BLUE}
        />

        <PricingSection />

        <ResultsSection />

        <SliderSection />

        <StepsSection />

        <FAQSection />

        <CTASection />
      </Suspense>

      <AppFooter />
    </>
  );
}

export default App;
