import styles from './not-found-page.module.scss';

function NotFoundPage () {
    return (
        <section className={styles.container}>
            <h1>К сожалению, страница не найдена. <a>Вернуться на главную</a></h1>
        </section>
    )
}

export default NotFoundPage;