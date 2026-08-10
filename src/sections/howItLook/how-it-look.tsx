import styles from './how-it-look.module.scss';
import howItLookImage from '../../images/howItLook.jpeg';
import howItLookMobileImage from '../../images/mobile-charts/howItLook.jpg';
import { useMobileTablet } from '../../hooks/useMediaQuery';
import { assetPath } from '../../utils/functions/assetPath';

export const HowItLook: React.FC = () => {
  const isMobileOrTablet = useMobileTablet();

  return (
    <section className={styles['how-it-look']}>
      <div className={styles['how-it-look__header']}>
        <h2 className={styles['how-it-look__title']}>
          Как это выглядит
        </h2>
      </div>
      <div className={styles['how-it-look__content']}>
        <img 
          src={assetPath(isMobileOrTablet ? howItLookMobileImage : howItLookImage)}
          alt="Как это выглядит" 
        />
      </div>
    </section>
  )
}
