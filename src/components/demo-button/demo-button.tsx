import React, { useState } from 'react';
import styles from './demo-button.module.scss';

interface DemoButtonProps {
  onClick?: () => void;
  className?: string;
}

export const DemoButton: React.FC<DemoButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    if (onClick) onClick();

    // Сбросить состояние клика через небольшую задержку
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  return (
    <button 
      className={`${styles['demo-button']} ${isClicked ? styles.clicked : ''} ${className}`}
      onClick={handleClick}
    >
      Протестировать демо
    </button>
  );
};

export default DemoButton; 
