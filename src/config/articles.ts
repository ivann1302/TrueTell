export interface ArticleSummary {
  title: string;
  description: string;
  category?: string;
  hrefPath?: string;
}

export interface LinkedArticleSummary extends ArticleSummary {
  hrefPath: string;
}

export interface CatalogArticle extends LinkedArticleSummary {
  type: 'knowledge' | 'blog';
  category: string;
  topic: string;
  status: 'published' | 'draft';
  indexable: boolean;
  relatedProduct: string | null;
  summaryDescription?: string;
  seoTitle?: string;
  publishedAt?: string;
  updatedAt?: string;
  canonical?: string;
  relatedArticles?: string[];
}

// This is the article metadata source. Routes and bodies stay in src/pages.
export const allArticles: CatalogArticle[] = [
  {
    "title": "Платёжный календарь в CRM и финансовый календарь компании: в чём разница",
    "seoTitle": "Платёжный календарь в Битрикс24: CRM и финансы компании",
    "description": "Чем календарь поступлений по сделкам отличается от финансового плана компании: сроки, выплаты, доступные деньги и расчёт остатка на каждый день.",
    "summaryDescription": "Как выбрать охват календаря: действия менеджера, ожидаемые оплаты клиентов или полный денежный план с поступлениями и выплатами.",
    "hrefPath": "platezhnyy-kalendar-bitrix24/",
    "type": "blog",
    "category": "Битрикс24",
    "topic": "Планирование оплат",
    "status": "published",
    "indexable": true,
    "relatedProduct": null,
    "relatedArticles": [
      "debitorskaya-zadolzhennost-bitrix24/",
      "chastichnaya-oplata-bitrix24/",
      "dashbord-rukovoditelya-bitrix24/"
    ],
    "publishedAt": "2026-10-13T11:32:56+03:00",
    "updatedAt": "2026-10-13T11:32:56+03:00"
  },
  {
    title: 'Дебиторская задолженность в Битрикс24: что контролировать руководителю',
    seoTitle: 'Дебиторская задолженность в Битрикс24 — контроль оплат',
    description: 'Как контролировать задолженность клиентов в Битрикс24: проверить остатки и сроки, отделить просрочку, назначить ответственных и сверить оплаты.',
    summaryDescription: 'Рабочий реестр обязательств клиентов: подтверждённые остатки, сроки и поручения менеджерам. Учебный пример расчёта просрочки.',
    hrefPath: 'debitorskaya-zadolzhennost-bitrix24/',
    type: 'blog',
    category: 'Битрикс24',
    topic: 'Оплаты',
    status: 'published',
    indexable: true,
    relatedProduct: null,
    relatedArticles: ["platezhnyy-kalendar-bitrix24/", 'chastichnaya-oplata-bitrix24/', 'dashbord-rukovoditelya-bitrix24/', 'otchety-po-prodazham-bitrix24/'],
    publishedAt: '2026-10-13T11:32:56+03:00',
    updatedAt: '2026-10-13T11:32:56+03:00',
  },
  {
    title: 'Частичная оплата в Битрикс24: поступления и остаток к оплате',
    seoTitle: 'Частичная оплата в Битрикс24 — учёт и остаток к оплате',
    description: 'Как учитывать частичные поступления по сделке в Битрикс24: проверить оплаты, вести журнал, настроить ручные итоги и рассчитать остаток с учётом возвратов.',
    summaryDescription: 'Проверка поступлений по одной сделке, ручной журнал и денежные поля CRM: как посчитать получено и остаток к оплате.',
    hrefPath: 'chastichnaya-oplata-bitrix24/',
    type: 'knowledge',
    category: 'Битрикс24',
    topic: 'Оплаты',
    status: 'published',
    indexable: true,
    relatedProduct: null,
    relatedArticles: ['debitorskaya-zadolzhennost-bitrix24/', 'otchety-po-prodazham-bitrix24/', 'bi-analitika-bitrix24-pervyy-otchet/', 'dashbord-rukovoditelya-bitrix24/'],
    publishedAt: '2026-10-13T11:32:56+03:00',
    updatedAt: '2026-10-13T11:32:56+03:00',
  },
  {
    title: 'Как экспортировать лиды и сделки из Битрикс24 перед массовым удалением',
    seoTitle: 'Экспорт лидов и сделок из Битрикс24 перед удалением — Excel и CSV',
    description: 'Как выгрузить лиды и сделки из Битрикс24 в Excel или CSV перед удалением: выбрать поля, проверить уникальные ID и учесть ограничения экспорта.',
    summaryDescription: 'Как сохранить лиды и сделки в Excel или CSV, сверить уникальные ID и проверить файл перед очисткой CRM.',
    hrefPath: 'eksport-lidov-sdelok-bitrix24-pered-udaleniem/',
    type: 'knowledge',
    category: 'Битрикс24',
    topic: 'Экспорт и сохранение данных',
    status: 'published',
    indexable: true,
    relatedProduct: '/bitrix24-cleaner/',
    relatedArticles: ['massovoe-udalenie-lidov-bitrix24/', 'bitrix24-udalenie-lidov-za-period/', 'udalenie-proigrannyh-sdelok-bitrix24/'],
    publishedAt: "2026-10-12T15:35:42+03:00",
    updatedAt: "2026-10-12T15:35:42+03:00",
  },
  {
    title: 'Как массово удалить лиды в Битрикс24: все сразу или по фильтру',
    seoTitle: 'Как массово удалить лиды в Битрикс24 — все или по фильтру',
    description: 'Как массово удалить лиды в Битрикс24: выбрать все записи по фильтру, проверить права, сохранить данные и восстановить удалённые лиды из корзины.',
    summaryDescription: 'Как удалить отдельные лиды или всю выборку по фильтру, проверить права и сохранить нужные данные перед очисткой.',
    hrefPath: 'massovoe-udalenie-lidov-bitrix24/',
    type: 'knowledge',
    category: 'Битрикс24',
    topic: 'Лиды',
    status: 'published',
    indexable: true,
    relatedProduct: '/bitrix24-cleaner/',
    relatedArticles: ['bitrix24-udalenie-lidov-za-period/', 'udalennye-lidy-bitrix24/', 'ne-udalyaetsya-lid-bitrix24/'],
    publishedAt: "2026-10-12T15:35:42+03:00",
    updatedAt: "2026-10-12T15:35:42+03:00",
  },
  {
    "title": "Удалённые лиды в Битрикс24: где найти и как восстановить",
    "description": "Где находятся удалённые лиды в Битрикс24, сколько они хранятся в корзине, как восстановить лид и что делать, если его уже нет в корзине.",
    "summaryDescription": "Где находится Корзина CRM, сколько хранятся удалённые лиды и как восстановить запись, пока она ещё доступна.",
    "hrefPath": "udalennye-lidy-bitrix24/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Лиды",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bitrix24-cleaner/",
    "publishedAt": "2026-09-23T00:00:00+03:00",
    "seoTitle": "Удалённые лиды в Битрикс24: где корзина и как восстановить",
    "updatedAt": "2026-10-12T12:34:46+03:00"
  },
  {
    "title": "Почему не удаляется лид в Битрикс24: что проверить",
    "description": "Не удаляется лид в Битрикс24 или нет кнопки «Удалить»? Разбираем проверку прав, ошибки приложения и повторное появление записей. Что делать перед массовой очисткой.",
    "summaryDescription": "Что проверить, если нет кнопки удаления, приложение возвращает ошибку или после очистки появляется похожий лид.",
    "hrefPath": "ne-udalyaetsya-lid-bitrix24/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Решение ошибок",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bitrix24-cleaner/",
    "publishedAt": "2026-09-23T00:00:00+03:00",
    "seoTitle": "Не удаляется лид в Битрикс24: причины и что проверить"
  },
  {
    "title": "Как удалить проигранные сделки в Битрикс24 и сохранить нужные",
    "description": "Как удалить проигранные сделки в Битрикс24 по стадии и периоду: настроить фильтры, проверить выборку и сохранить записи, нужные для работы и аналитики.",
    "summaryDescription": "Как отобрать сделки по текущей стадии, согласовать исключения и удалить ненужные записи, сохранив историю переговоров.",
    "hrefPath": "udalenie-proigrannyh-sdelok-bitrix24/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Сделки",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bitrix24-cleaner/",
    "publishedAt": "2026-09-23T00:00:00+03:00",
    updatedAt: "2026-10-12T12:34:46+03:00",
  },
  {
    "title": "Как удалить старые лиды в Битрикс24 за выбранный период",
    "description": "Как удалить старые лиды в Битрикс24 по дате создания: настроить период и стадии, проверить выборку, выполнить массовое удаление и разобраться с корзиной CRM.",
    "summaryDescription": "Как отобрать лиды по дате и текущей стадии, проверить выборку и выполнить массовое удаление с учётом корзины CRM.",
    "hrefPath": "bitrix24-udalenie-lidov-za-period/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Лиды",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bitrix24-cleaner/",
    "publishedAt": "2026-09-22T00:00:00+03:00",
    "updatedAt": "2026-10-12T12:34:46+03:00"
  },
  {
    "title": "Как снять все резервы в МоемСкладе и почему они зависают",
    "description": "Как снять резерв в МоемСкладе, найти зависшие заказы и настроить автоматическое снятие резервов после отмены, отгрузки или истечения срока.",
    "summaryDescription": "Как найти заказы, которые удерживают товар, снять резерв вручную и настроить безопасную автоматическую очистку.",
    "hrefPath": "kak-snyat-rezervy-moysklad/",
    "type": "knowledge",
    "category": "МойСклад",
    "topic": "Операции",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/upravlenie-rezervami-moysklad/",
    "publishedAt": "2026-09-08T00:00:00+03:00",
    "updatedAt": "2026-10-10T00:00:00+03:00"
  },
  {
    "title": "BI-аналитика: что это простыми словами и зачем бизнесу",
    "description": "BI-аналитика простыми словами: как данные из CRM, продаж, склада и рекламы превращаются в понятные дашборды и помогают принимать решения.",
    "summaryDescription": "Как данные из CRM, продаж, склада и рекламы превращаются в понятные дашборды и помогают принимать решения.",
    "hrefPath": "bi-analitika-chto-eto-prostymi-slovami/",
    "type": "blog",
    "category": "BI-аналитика",
    "topic": "Аналитика продаж",
    "relatedArticles": [
        "bi-analitika-bitrix24-pervyy-otchet/",
        "kak-snyat-rezervy-moysklad/",
        "kak-vosstanovit-udalennye-zakazy-tovary-moysklad/",
        "otchety-po-prodazham-bitrix24/"
    ],
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "publishedAt": "2026-09-08T00:00:00+03:00",
    "updatedAt": "2026-10-12T01:23:45+03:00"
},
  {
    "title": "Как восстановить удаленные заказы и товары в МоемСкладе",
    "description": "Как восстановить заказ или товар в МоемСкладе, где найти архив товаров, сколько хранятся удаленные документы и когда данные уже не вернуть.",
    "summaryDescription": "Где искать заказ после удаления, как вернуть товар из архива и чем внешняя резервная копия отличается от Excel-выгрузки.",
    "hrefPath": "kak-vosstanovit-udalennye-zakazy-tovary-moysklad/",
    "type": "knowledge",
    "category": "МойСклад",
    "topic": "Восстановление данных",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/backup-moysklad/",
    "publishedAt": "2026-09-08T00:00:00+03:00",
    "updatedAt": "2026-09-22T00:00:00+03:00"
  },
  {
    "title": "Отчёты по продажам в Битрикс24: как проверить результаты отдела",
    "seoTitle": "Отчёты по продажам в Битрикс24 — менеджеры, план и проверка",
    "description": "Как проверить продажи в Битрикс24: выбрать отчёт по менеджерам, настроить период, сравнить план и факт, сверить сделки и разобраться в расхождениях цифр.",
    "summaryDescription": "Штатные отчёты по менеджерам, выбор периода, план и факт: как проверить результаты отдела и объяснить расхождения в цифрах.",
    "hrefPath": "otchety-po-prodazham-bitrix24/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Аналитика продаж",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bitrix24-product-rating/",
    "relatedArticles": [
        "chastichnaya-oplata-bitrix24/",
        "skvoznaya-analitika-bitrix24/",
        "bi-analitika-chto-eto-prostymi-slovami/"
    ],
    "publishedAt": "2026-10-09T00:00:00+03:00",
    "updatedAt": "2026-10-13T11:32:56+03:00"
},
  {
    "title": "Остатки в МойСклад: контроль запасов и поиск неликвида",
    "seoTitle": "Остатки в МойСклад: как контролировать запас и найти неликвид",
    "description": "Как посмотреть остатки в МойСклад, проверить резервы и ожидания, сопоставить запас с продажами и найти кандидатов в неликвид без ошибок в учёте.",
    "summaryDescription": "Как проверить складские показатели, сопоставить запас с продажами и выбрать действие для залежавшихся товаров.",
    "hrefPath": "ostatki-moysklad/",
    "type": "knowledge",
    "category": "МойСклад",
    "topic": "Остатки и запасы",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "relatedArticles": [
        "moysklad-dlya-marketpleysov/",
        "kak-snyat-rezervy-moysklad/",
        "bi-analitika-chto-eto-prostymi-slovami/"
    ],
    "publishedAt": "2026-10-10T00:00:00+03:00",
    "updatedAt": "2026-10-12T13:18:00+03:00"
},
  {
    "title": "Дашборд руководителя в Битрикс24: какие показатели и графики выбрать",
    "seoTitle": "Дашборд руководителя в Битрикс24 — показатели и графики",
    "description": "Какие показатели включить в дашборд руководителя в Битрикс24, как выбрать графики, проверить расчёты и определить, достаточно ли штатных отчётов.",
    "summaryDescription": "Как выбрать показатели и графики для руководителя продаж, проверить расчёты и определить подходящий способ реализации дашборда.",
    "hrefPath": "dashbord-rukovoditelya-bitrix24/",
    "type": "blog",
    "category": "Битрикс24",
    "topic": "Аналитика продаж",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "relatedArticles": ["platezhnyy-kalendar-bitrix24/", 'debitorskaya-zadolzhennost-bitrix24/',
        "bi-analitika-bitrix24-pervyy-otchet/",
        "skvoznaya-analitika-bitrix24/",
        "otchety-po-prodazham-bitrix24/",
        "bi-analitika-chto-eto-prostymi-slovami/"
    ],
    "publishedAt": "2026-10-10T00:00:00+03:00",
    "updatedAt": '2026-10-13T11:32:56+03:00'
},
  {
    "title": "Сквозная аналитика в Битрикс24: от рекламы до продаж",
    "seoTitle": "Сквозная аналитика в Битрикс24: настройка и проверка",
    "description": "Как настроить сквозную аналитику в Битрикс24: связать рекламу со сделками, учесть расходы, проверить источники и сравнить каналы по результатам продаж.",
    "summaryDescription": "Как связать рекламный источник с обращением и сделкой, проверить расходы и даты, затем сравнить каналы по результату.",
    "hrefPath": "skvoznaya-analitika-bitrix24/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Аналитика продаж",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "relatedArticles": ["bi-analitika-bitrix24-pervyy-otchet/",
      "otchety-po-prodazham-bitrix24/",
      "dashbord-rukovoditelya-bitrix24/",
      "bi-analitika-chto-eto-prostymi-slovami/"
    ],
    "publishedAt": "2026-10-11T00:00:00+03:00",
    "updatedAt": "2026-10-11T22:29:57+03:00"
  },
{
    "title": "BI-аналитика Битрикс24: первый отчёт из CRM",
    "seoTitle": "BI-аналитика Битрикс24: как создать первый отчёт из CRM",
    "description": "Как создать первый отчёт в BI Конструкторе Битрикс24: выбрать crm_deal, настроить подсчёт сделок и период, затем сверить результат с CRM.",
    "summaryDescription": "Пошаговая настройка отчёта по созданным сделкам: набор crm_deal, текущие ответственные, период и проверка исходных записей.",
    "hrefPath": "bi-analitika-bitrix24-pervyy-otchet/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "BI Конструктор",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "relatedArticles": [
        "chastichnaya-oplata-bitrix24/",
        "bi-analitika-chto-eto-prostymi-slovami/",
        "dashbord-rukovoditelya-bitrix24/",
        "otchety-po-prodazham-bitrix24/"
    ],
    "publishedAt": "2026-10-11T22:22:36+03:00",
    "updatedAt": "2026-10-13T11:32:56+03:00"
},
{
    "title": "Отчёты в МойСклад: продажи, прибыль и магазины",
    "seoTitle": "Отчёты в МойСклад: продажи, прибыль, сравнение магазинов",
    "description": "Как выбрать отчёт в МойСклад, проверить продажи, возвраты и себестоимость, увидеть прибыль с расходами и сравнить магазины на одинаковых условиях.",
    "summaryDescription": "Как выбрать штатный отчёт, проверить результат продаж и сравнить розничные точки с учётом возвратов и расходов.",
    "hrefPath": "otchety-moysklad/",
    "type": "knowledge",
    "category": "МойСклад",
    "topic": "Аналитика",
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "relatedArticles": [
        "moysklad-dlya-marketpleysov/",
        "ostatki-moysklad/",
        "bi-analitika-chto-eto-prostymi-slovami/",
        "kak-snyat-rezervy-moysklad/"
    ],
    "publishedAt": "2026-10-11T23:25:07+03:00",
    "updatedAt": "2026-10-12T13:18:00+03:00"
},
{
    "title": "Воронка продаж в Битрикс24: как найти проблемные этапы",
    "seoTitle": "Воронка продаж в Битрикс24: потери, этапы и зависшие сделки",
    "description": "Как проверить воронку продаж Битрикс24: выбрать вид отчёта и период, найти пропуски и потери, разобрать задержки по истории сделок и определить действие.",
    "summaryDescription": "Как отличить пропущенный этап от потери или задержки, проверить сделки и выбрать действие для отдела продаж.",
    "hrefPath": "voronka-prodazh-bitrix24/",
    "type": "knowledge",
    "category": "Битрикс24",
    "topic": "Аналитика продаж",
    "status": "published",
    "indexable": true,
    "relatedProduct": null,
    "relatedArticles": [
        "otchety-po-prodazham-bitrix24/",
        "dashbord-rukovoditelya-bitrix24/",
        "bi-analitika-bitrix24-pervyy-otchet/"
    ],
    "publishedAt": "2026-10-12T00:21:13+03:00"
},
{
    "title": "Битрикс24 и МойСклад: как связать данные CRM и склада",
    "seoTitle": "Интеграция Битрикс24 и МойСклад: данные, остатки и заказы",
    "description": "Как выбрать схему интеграции Битрикс24 и МойСклад: согласовать товары, остатки, заказы и оплаты, проверить повторные события и подготовить данные для BI.",
    "summaryDescription": "Какие данные связывать между CRM и складом, как согласовать остатки и проверить обмен до запуска.",
    "hrefPath": "bitrix24-moysklad-integraciya/",
    "type": "blog",
    "category": "Битрикс24 и МойСклад",
    "topic": "Интеграции",
    "status": "published",
    "indexable": true,
    "relatedProduct": null,
    "relatedArticles": [
        "moysklad-dlya-marketpleysov/",
        "ostatki-moysklad/",
        "otchety-moysklad/",
        "bi-analitika-chto-eto-prostymi-slovami/"
    ],
    "publishedAt": "2026-10-12T01:23:45+03:00",
    "updatedAt": "2026-10-12T13:18:00+03:00"
},
{
    title: 'МойСклад для маркетплейсов: заказы, остатки и цены',
    seoTitle: 'МойСклад для маркетплейсов: заказы, остатки и цены',
    description: 'Как проверить обмен МоегоСклада с Ozon, Wildberries и Яндекс Маркетом: сопоставить товары и склады, учесть резерв, проверить цены, заказы и возвраты.',
    summaryDescription: 'Что передавать на площадку и как проверить товары, склады, свободное количество, цены и обработку заказов.',
    hrefPath: 'moysklad-dlya-marketpleysov/',
    type: 'blog',
    category: 'МойСклад',
    topic: 'Маркетплейсы',
    status: 'published',
    indexable: true,
    relatedProduct: '/moysklad-mass-operations/',
    relatedArticles: ['ostatki-moysklad/', 'otchety-moysklad/', 'bitrix24-moysklad-integraciya/'],
    publishedAt: "2026-10-12T15:35:42+03:00",
    updatedAt: "2026-10-12T15:35:42+03:00",
}
];

export function getArticle(path: string): CatalogArticle {
  const article = allArticles.find(({ hrefPath }) => hrefPath === path.replace(/^\//, ''));
  if (!article) throw new Error(`Article metadata not found: ${path}`);
  return article;
}

export function isPublicArticle(article: CatalogArticle): boolean {
  return article.status === 'published' && article.indexable &&
    (!article.canonical || article.canonical === `/${article.hrefPath}`);
}

export function getCatalogArticles(type: CatalogArticle['type'], articles = allArticles): CatalogArticle[] {
  return articles.filter(article => article.type === type && isPublicArticle(article));
}

export function groupKnowledgeArticles(articles = getCatalogArticles('knowledge')) {
  const groups: { id: string; title: string; topics: { title: string; items: CatalogArticle[] }[] }[] = [];
  for (const article of articles) {
    let group = groups.find(group => group.title === article.category);
    if (!group) {
      const id = article.category === 'Битрикс24' ? 'bitrix24' : article.category === 'МойСклад' ? 'moysklad' : `platform-${groups.length + 1}`;
      group = { id, title: article.category, topics: [] };
      groups.push(group);
    }
    let topic = group.topics.find(topic => topic.title === article.topic);
    if (!topic) {
      topic = { title: article.topic, items: [] };
      group.topics.push(topic);
    }
    topic.items.push(article);
  }
  return groups;
}

export function getRelatedArticles(path: string): CatalogArticle[] {
  const source = getArticle(path);
  return allArticles.filter(article => article.hrefPath !== source.hrefPath && isPublicArticle(article) &&
    (source.relatedArticles ? source.relatedArticles.includes(article.hrefPath) : article.category === source.category));
}

export function getProductArticles(productPath: string): CatalogArticle[] {
  return allArticles.filter(article => article.relatedProduct === productPath && isPublicArticle(article));
}

export const blogArticles = getCatalogArticles('blog');
export const knowledgeBaseArticles = getCatalogArticles('knowledge');
