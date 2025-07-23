import React, { useState } from 'react';
import styles from './demo-button.module.scss';

interface DemoButtonProps {
  onClick?: () => void;
  className?: string;
}

const DemoButton: React.FC<DemoButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    if (onClick) {
      onClick();
    }

    // Сбросить состояние клика через небольшую задержку
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  return (
    <a 
      href="https://datalens.yandex/cts92knihou4y"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles['demo-button']} ${isClicked ? styles.clicked : ''} ${className}`}
      onClick={handleClick}
    >
      Протестировать демо
    </a>
  );
};

export default DemoButton; 
