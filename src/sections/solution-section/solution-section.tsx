import React from 'react';
import styles from './solution-section.module.scss';
import advantage1 from './../../images/advantage1.svg';
import advantage2 from './../../images/advantage2.svg';
import advantage3 from './../../images/advantage3.svg';

export const SolutionSection: React.FC = () => {
  return (
    <section className={styles.solutionSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Решение</h2>
        <h3 className={styles.subtitle}>Дашборд, который показывает:</h3>
        
        <div className={styles.content}>
          {/* Первая карточка */}
          <div className={styles.card}>
            <img src={advantage1} alt="Analytics icon" className={styles.cardIcon}/>
            <p className={styles.cardText}>Что заказывают менеджеры</p>
            <p className={styles.vs}>VS</p>
            <p className={styles.cardText}>что продается</p>
          </div>

          {/* Вторая карточка */}
          <div className={styles.card}>
            <img src={advantage2} alt="Products icon" className={styles.cardIcon}/>
            <p className={styles.cardText}>Какие товары реально прибыльны</p>
            <br />
            <br />
            <p className={styles.cardText}>(а какие – нет)</p>
          </div>

          {/* Третья карточка */}
          <div className={styles.card}>
            <img src={advantage3} alt="Dashboard icon" className={styles.cardIcon}/>
            <p className={styles.cardText}>Инфо по всем точкам в одном окне</p>
            <p className={styles.cardText}>+ остатки онлайн*</p>
            <p className={styles.disclaimer}>*при использовании системы управленческого учета Мой Склад</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection; 