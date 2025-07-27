import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import styles from './slider-section.module.scss';
import { useChartData } from '../../hooks/useChartData';

// Separate component for each slide to properly use hooks
const SlideItem = memo(({ slide, getChartByIndex }: { slide: { id: number, chartIndex: number }, getChartByIndex: (index: number) => any }) => {
  // Now useMemo is at the top level of this component
  const slideContent = useMemo(() => {
    const chart = getChartByIndex(slide.chartIndex);
    if (!chart) return <div>Chart not found</div>;

    const url = new URL(chart.src);
    // Фильтруем и добавляем только определенные параметры
    Object.entries(chart.params)
      .filter(([_, value]) => value !== undefined)
      .forEach(([key, value]) => {
        url.searchParams.set(key, value as string);
      });

    return (
      <iframe
        frameBorder="0"
        src={url.toString()}
        width={chart.dimensions.width}
        height={chart.dimensions.height}
        title={chart.title}
      />
    );
  }, [slide.chartIndex, getChartByIndex]);

  return (
    <div className={styles.slide}>
      <div className={styles['slide-content']}>
        {slideContent}
      </div>
    </div>
  );
});

export const SliderSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { getChartByIndex } = useChartData();

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const AUTOPLAY_DELAY = 3000; // 3 секунды

  // Using the new charts (indices 1, 2, 3 from CHART_IFRAMES)
  // Мемоизируем массив слайдов, чтобы избежать его пересоздания при каждом рендере
  const slides = useMemo(() => [
    {
      id: 0,
      chartIndex: 0 // Chart New 1
    },
    {
      id: 1,
      chartIndex: 1 // Chart New 2
    },
    {
      id: 2,
      chartIndex: 2 // Chart New 3
    }
  ], []);

  // 🔄 Автоматическое переключение
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // ⏰ Запуск автопрокрутки
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    if (!isHovered) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, AUTOPLAY_DELAY);
    }
  }, [isHovered, nextSlide]);

  // ⏹️ Остановка автопрокрутки
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // 🖱️ Hover handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    stopAutoplay(); // Останавливаем при наведении
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startAutoplay(); // Возобновляем после убирания мыши
  };

  // Intersection Observer для отслеживания видимости секции
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When section becomes visible
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Once visible, no need to observe anymore
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        // Start loading when slider is 300px away from viewport
        rootMargin: '300px',
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // 🔄 Управление автопрокруткой через useEffect
  useEffect(() => {
    if (isVisible) {
      startAutoplay();
      return stopAutoplay; // Cleanup при размонтировании
    }
  }, [isVisible, startAutoplay, stopAutoplay]);

  // 📱 Пауза при потере фокуса вкладки
  useEffect(() => {
    if (!isVisible) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (!isHovered) {
        startAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVisible, isHovered, startAutoplay, stopAutoplay]);

  return (
    <section ref={sectionRef} className={styles['slider-section']}>
      <div className={styles.container}>
        {isVisible ? (
          <>
            <div 
              className={styles['slider-wrapper']}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles['slide-container']}>
                <div 
                  className={styles['slides-track']}
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide) => (
                    <SlideItem 
                      key={slide.id} 
                      slide={slide} 
                      getChartByIndex={getChartByIndex} 
                    />
                  ))}
                </div>
              </div>

              {/* Стрелки навигации */}
              {isHovered && (
                <>
                  <button 
                    className={`${styles['nav-button']} ${styles['nav-button-prev']}`}
                    onClick={prevSlide}
                    aria-label="Previous slide"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className={`${styles['nav-button']} ${styles['nav-button-next']}`}
                    onClick={nextSlide}
                    aria-label="Next slide"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Точки навигации */}
            <div className={styles['dots-container']}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles['dot-active'] : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={styles['slider-placeholder']} style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>Загрузка слайдера...</div>
          </div>
        )}
      </div>
    </section>
  );
};

// Мемоизируем компонент для предотвращения ненужных перерендеров
export default memo(SliderSection); 
