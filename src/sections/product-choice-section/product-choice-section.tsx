import { useState } from 'react';
import { products, type Product } from './product-choice-data';
import styles from './product-choice-section.module.scss';

const ProductPanel = ({ product }: { product: Product }) => (
  <article className={styles.panel}>
    <h3 className={styles.panelTitle}>{product.title}</h3>
    <p className={styles.panelDescription}>{product.description}</p>

    <div className={styles.details}>
      <h4 className={styles.detailsTitle}>{product.detailLabel}</h4>
      <ul className={styles.detailsList}>
        {product.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </div>

    <a
      className={styles.panelLink}
      href={product.href}
      target={product.href.startsWith('http') ? '_blank' : undefined}
      rel={product.href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {product.action}<span aria-hidden="true">↗</span>
    </a>
  </article>
);

const ProductChoiceDesktop = () => {
  const [activeId, setActiveId] = useState(products[0].id);

  return (
    <div className={styles.navigator}>
      <div className={styles.options} aria-label="Выбор направления">
        {products.map((product) => {
          const isActive = product.id === activeId;

          return (
            <div className={styles.optionGroup} key={product.id}>
              <button
                className={`${styles.option} ${isActive ? styles.active : ''}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(product.id)}
              >
                <span className={styles.optionText}>
                  <strong>{product.problem}</strong>
                  <span>{product.shortName}</span>
                </span>
                <span className={styles.optionArrow} aria-hidden="true">→</span>
              </button>
            </div>
          );
        })}

      </div>

      <div className={styles.desktopPanel} aria-live="polite">
        {products.map((product) => (
          <div
            className={styles.desktopPanelItem}
            hidden={product.id !== activeId}
            key={product.id}
          >
            <ProductPanel product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductChoiceDesktop;
