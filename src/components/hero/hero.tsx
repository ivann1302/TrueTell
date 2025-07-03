import HeroContainer from "./hero-container/hero-container";
import styles from './hero.module.scss';
function Hero() {
  return (
    <section className={styles.hero}>
    <h1>Заголовок</h1>
    <HeroContainer />
    </section>
  );
}

export default Hero;
