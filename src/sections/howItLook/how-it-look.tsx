import styles from './how-it-look.module.scss';
import howItLookImage from '../../images/howItLook.jpeg';

export const HowItLook: React.FC = () => {
  return (
    <section className={styles['how-it-look']}>
      <div className={styles['how-it-look__header']}>
        <h2 className={styles['how-it-look__title']}>
          Как это выглядит
        </h2>
      </div>
      <div className={styles['how-it-look__content']}>
        <img src={howItLookImage} alt="Как это выглядит" />
      </div>
    </section>
  )
}
