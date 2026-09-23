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
    "title": "Удалённые лиды в Битрикс24: где искать и как восстановить",
    "description": "Где найти удалённый лид, как восстановить его из корзины и проверить данные перед продолжением работы с клиентом.",
    "category": "Битрикс24",
    "hrefPath": "udalennye-lidy-bitrix24/"
  },
  {
    "title": "Почему не удаляется лид в Битрикс24: что проверить",
    "description": "Что проверить, если нет кнопки удаления, приложение возвращает ошибку или после очистки появляется похожий лид.",
    "category": "Битрикс24",
    "hrefPath": "ne-udalyaetsya-lid-bitrix24/"
  },
  {
    "title": "Как удалить проигранные сделки в Битрикс24 и сохранить нужные",
    "description": "Как отобрать сделки по текущей стадии, согласовать исключения и удалить ненужные записи, сохранив историю переговоров.",
    "category": "Битрикс24",
    "hrefPath": "udalenie-proigrannyh-sdelok-bitrix24/"
  },
  {
    title: 'Как удалить старые лиды в Битрикс24 за выбранный период',
    description:
      'Как отобрать лиды по дате и текущей стадии, проверить выборку и выполнить массовое удаление с учётом корзины CRM.',
    category: 'Битрикс24',
    hrefPath: 'bitrix24-udalenie-lidov-za-period/',
  },
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
