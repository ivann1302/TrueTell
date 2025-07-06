import React from 'react';
import styles from './demo-button.module.scss';

interface DemoButtonProps {
  onClick?: () => void;
  className?: string;
}

export const DemoButton: React.FC<DemoButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      className={`${styles.demoButton} ${className}`}
      onClick={onClick}
    >
      Протестировать демо
    </button>
  );
};

export default DemoButton; 