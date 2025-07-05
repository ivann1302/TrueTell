import styles from './hero-section.module.scss';

function HeroPage () {

    return (
        <div className={styles.container}>
            <div className={styles.mainBlock}>
                <h1>Не закупайте<br /> неликвид</h1>
                <p className={styles.mainDescription}></p>
            </div>
            <div className={styles.doubleBlock}>
                <div className={styles.logoBlock}>
                    <img src="" alt="" />
                    <img src="" alt="" />
                </div>
                <div className={styles.demoBlock}>
                    <h2>Попробуйте сами</h2>
                     <button>Протестировать демо</button>
                     <p className={styles.demoDescription}>займет 1 минуту, мы не просим ваши контакты</p>
                </div>
            </div>
        </div>
    )
}

export default HeroPage;