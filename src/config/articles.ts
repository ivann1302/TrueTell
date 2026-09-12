export interface ArticleSummary {
  title: string;
  description: string;
  category?: string;
  hrefPath?: string;
}

export interface LinkedArticleSummary extends ArticleSummary {
  hrefPath: string;
}

export const blogArticles: ArticleSummary[] = [
  {
    title: 'Как снять все резервы в МоемСкладе и почему они зависают',
    description:
      'Как найти заказы, которые удерживают товар, снять резерв вручную и настроить безопасную автоматическую очистку.',
    category: 'МойСклад',
    hrefPath: 'kak-snyat-rezervy-moysklad/',
  },
  {
    title: 'BI-аналитика: что это простыми словами и зачем она бизнесу',
    description:
      'Как данные из CRM, продаж, склада и рекламы превращаются в понятные дашборды и помогают принимать решения.',
    category: 'BI-аналитика',
    hrefPath: 'bi-analitika-chto-eto-prostymi-slovami/',
  },
  {
    title: 'Как восстановить удаленные заказы и товары в МоемСкладе',
    description:
      'Где искать заказ после удаления, как вернуть товар из архива и чем внешняя резервная копия отличается от Excel-выгрузки.',
    category: 'МойСклад',
    hrefPath: 'kak-vosstanovit-udalennye-zakazy-tovary-moysklad/',
  },
];

export const reserveRelatedArticles: LinkedArticleSummary[] = [
  {
    category: 'МойСклад',
    title: 'Как восстановить удаленные заказы и товары',
    description: 'Что можно вернуть из корзины или архива и когда понадобится резервная копия.',
    hrefPath: 'kak-vosstanovit-udalennye-zakazy-tovary-moysklad/',
  },
  {
    category: 'BI-аналитика',
    title: 'Что такое BI-аналитика и зачем она бизнесу',
    description: 'Как объединить продажи, склад и другие источники в понятную систему показателей.',
    hrefPath: 'bi-analitika-chto-eto-prostymi-slovami/',
  },
  {
    category: 'Решение',
    title: 'BI-аналитика для торговли',
    description: 'Дашборды по продажам, остаткам и маржинальности на реальных данных бизнеса.',
    hrefPath: 'bi-analitika/',
  },
  {
    category: 'Продукты',
    title: 'Решения для процессов и данных',
    description: 'Инструменты для автоматизации учёта, контроля и управленческой аналитики.',
    hrefPath: 'products/',
  },
];

export const biRelatedArticles: LinkedArticleSummary[] = [
  {
    category: 'Решение',
    title: 'BI-аналитика для торговли',
    description: 'Дашборды по продажам, остаткам и маржинальности на реальных данных бизнеса.',
    hrefPath: 'bi-analitika/',
  },
  {
    category: 'МойСклад',
    title: 'Как снять все резервы в МоемСкладе и почему они зависают',
    description: 'Как найти заказ, который удерживает товар, и безопасно освободить остаток.',
    hrefPath: 'kak-snyat-rezervy-moysklad/',
  },
  {
    category: 'МойСклад',
    title: 'Как восстановить удаленные заказы и товары',
    description: 'Что можно вернуть из корзины или архива и когда понадобится резервная копия.',
    hrefPath: 'kak-vosstanovit-udalennye-zakazy-tovary-moysklad/',
  },
  {
    category: 'Продукты',
    title: 'Решения для процессов и данных',
    description: 'Инструменты для автоматизации учёта, контроля и управленческой аналитики.',
    hrefPath: 'products/',
  },
];

export const backupRelatedArticles: LinkedArticleSummary[] = [
  {
    category: 'МойСклад',
    title: 'Как снять все резервы в МоемСкладе',
    description: 'Как найти заказ, который удерживает товар, и безопасно освободить остаток.',
    hrefPath: 'kak-snyat-rezervy-moysklad/',
  },
  {
    category: 'BI-аналитика',
    title: 'Что такое BI-аналитика и зачем она бизнесу',
    description: 'Как объединить продажи, склад и другие источники в понятную систему показателей.',
    hrefPath: 'bi-analitika-chto-eto-prostymi-slovami/',
  },
  {
    category: 'Решение',
    title: 'BI-аналитика для торговли',
    description: 'Дашборды по продажам, остаткам и маржинальности на реальных данных бизнеса.',
    hrefPath: 'bi-analitika/',
  },
  {
    category: 'Продукты',
    title: 'Решения для процессов и данных',
    description: 'Инструменты для автоматизации учёта, контроля и управленческой аналитики.',
    hrefPath: 'products/',
  },
];
