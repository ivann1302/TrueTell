import type { ImageMetadata } from 'astro';
import bitrix24Icon from '../images/logo/bitrix24-app-icon.svg';
import moyskladIcon from '../images/logo/moysklad-app-icon.svg';
import {
  cleanerProduct, cleanerProductPath,
  fieldDirectoryProduct, fieldDirectoryProductPath,
  moyskladMcpProduct, moyskladMcpProductPath,
  moyskladOperationsProduct, moyskladOperationsProductPath, moyskladSalesForecastProduct,
  productRating, productRatingPath,
} from './products';

export const biProductPath = '/bi-analitika/';

type CatalogProduct = {
  title: string;
  description: string;
  action: string;
  href: string;
  platformIcon?: ImageMetadata;
  showcaseHref?: string;
};

export const productCatalog: CatalogProduct[] = [
  ...(moyskladMcpProduct.published ? [{
    title: moyskladMcpProduct.name,
    description: moyskladMcpProduct.catalogDescription,
    action: 'Посмотреть приложение',
    href: moyskladMcpProductPath,
    platformIcon: moyskladIcon,
  }] : []),
  {
    title: moyskladOperationsProduct.catalogName,
    description: moyskladOperationsProduct.catalogDescription,
    action: 'Открыть в МоемСкладе',
    href: moyskladOperationsProduct.marketplaceUrl,
    platformIcon: moyskladIcon,
    showcaseHref: moyskladOperationsProductPath,
  },
  {
    title: moyskladSalesForecastProduct.name,
    description: moyskladSalesForecastProduct.catalogDescription,
    action: 'Открыть в МоемСкладе',
    href: moyskladSalesForecastProduct.marketplaceUrl,
    platformIcon: moyskladIcon,
  },
  {
    title: cleanerProduct.name,
    description: cleanerProduct.catalogDescription,
    action: cleanerProduct.articleActionLabel,
    href: cleanerProductPath,
    platformIcon: bitrix24Icon,
  },
  {
    title: fieldDirectoryProduct.heading,
    description: fieldDirectoryProduct.catalogDescription,
    action: 'Посмотреть приложение',
    href: fieldDirectoryProductPath,
    platformIcon: bitrix24Icon,
  },
  {
    title: productRating.heading,
    description: productRating.catalogDescription,
    action: 'Посмотреть приложение',
    href: productRatingPath,
    platformIcon: bitrix24Icon,
  },
  {
    title: 'BI-аналитика для торговли',
    description: 'Продажи, остатки и маржинальность.',
    action: 'Посмотреть BI-решение',
    href: biProductPath,
  },
];
