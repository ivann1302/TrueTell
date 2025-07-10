import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './slider-section.module.scss';

export const SliderSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const autoplayRef = useRef<number | null>(null);
  const AUTOPLAY_DELAY = 3000; // 3 секунды

  const slides = [
    {
      id: 1,
      content: 'Слайд 1 - Заглушка'
    },
    {
      id: 2,
      content: 'Слайд 2 - Заглушка'
    },
    {
      id: 3,
      content: 'Слайд 3 - Заглушка'
    }
  ];

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

  // 🔄 Управление автопрокруткой через useEffect
  useEffect(() => {
    startAutoplay();
    return stopAutoplay; // Cleanup при размонтировании
  }, [startAutoplay, stopAutoplay]);

  // 📱 Пауза при потере фокуса вкладки
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (!isHovered) {
        startAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isHovered, startAutoplay, stopAutoplay]);

  return (
    <section className={styles.sliderSection}>
      <div className={styles.container}>
        <div 
          className={styles.sliderWrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.slideContainer}>
            <div 
              className={styles.slidesTrack}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className={styles.slide}>
                  <div className={styles.slideContent}>
                    {slide.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Стрелки навигации */}
          {isHovered && (
            <>
              <button 
                className={`${styles.navButton} ${styles.navButtonPrev}`}
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className={`${styles.navButton} ${styles.navButtonNext}`}
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
        <div className={styles.dotsContainer}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SliderSection; 