import { companyInfo } from './company';

export const cleanerProductPath = '/bitrix24-cleaner/';

export const productRatingPath = '/bitrix24-product-rating/';

export const productRating = {
  name: 'ABC анализ товаров и клиентов',
  heading: 'ABC анализ товаров и клиентов в Битрикс24',
  description:
    '«ABC анализ товаров и клиентов» для Битрикс24: группы A, B и C по вкладу в продажи, динамика, повторные покупки и проверка по исходным сделкам.',
  catalogDescription:
    'ABC-анализ товаров и клиентов, динамика продаж и повторные покупки.',
  marketplaceUrl: 'https://www.bitrix24.ru/apps/app/truetell.reyting_prodazh/',
  connectionActionLabel: 'Открыть в Маркете',
} as const;

export const moyskladOperationsProductPath = '/moysklad-mass-operations/';

export const moyskladOperationsProduct = {
  name: 'Массовые операции и удаление в МойСклад',
  description:
    'Массовое изменение товаров, цен и документов в МойСклад. Загрузка из файлов, удаление и очистка с проверкой плана и отчётом по каждому объекту.',
  catalogDescription:
    'Массовые изменения товаров, цен и документов. Загрузка и очистка.',
  connectionActionLabel: 'Узнать о подключении',
} as const;

export const cleanerProduct = {
  name: 'Массовое удаление лидов и сделок в Битрикс24',
  description:
    'Удаляйте ненужные лиды и сделки в Битрикс24 по фильтрам. Проверка списка, исключения, пауза и CSV-отчёт. До 3 000 записей за операцию.',
  catalogDescription:
    'Лиды и сделки: фильтры, проверка списка, подтверждение и CSV-отчёт.',
  articleDescription:
    'Отберите ненужные лиды и сделки в Битрикс24 по фильтрам, проверьте список и исключите важные карточки. На странице приложения — возможности, порядок работы и информация о подключении.',
  articleActionLabel: 'Посмотреть приложение',
  marketplaceArticleDescription:
    'Откройте приложение «Массовое удаление лидов и сделок» в Маркете Битрикс24. Перед очисткой сохраните нужные данные, проверьте выборку и исключите важные карточки.',
  marketplaceUrl: 'https://www.bitrix24.ru/apps/app/truetell.massovoe_udalenie_lidov_i_sdelok/',
  connectionActionLabel: 'Открыть в Маркете',
} as const;

export const fieldDirectoryProductPath = '/bitrix24-field-directory/';

export const fieldDirectoryProduct = {
  name: 'Поля CRM — поиск кодов и экспорт',
  heading: 'Поиск кодов полей CRM в Битрикс24',
  description:
    'Найдите код и свойства поля CRM Битрикс24, выгрузите отфильтрованный список в CSV или сравните два JSON-снимка. Сделки, лиды, контакты и компании.',
  catalogDescription:
    'Коды и свойства полей CRM: поиск, CSV и сравнение JSON-снимков.',
  marketplaceUrl: 'https://www.bitrix24.ru/apps/app/truetell.crm_fields/',
  connectionActionLabel: 'Открыть в Маркете',
} as const;

// Owner decision 23.10.2026: use our contact flow until the actual product page exists.
export const mcpProduct = {
  name: 'MCP TrueTell для Битрикс24',
  // Owner 25.10.2026: replace this temporary contact destination when the real product page is ready.
  productPageHref: null,
  articleHrefIsTemporary: true,
  articleDescription:
    'Разрабатываем подключение внешнего ИИ к Битрикс24. Опишите вашу задачу, AI-клиент и нужные данные — обсудим сценарий и оставшиеся проверки. Открытая установка пока не заявлена.',
  articleActionLabel: 'Обсудить MCP TrueTell',
  articleHref: companyInfo.contacts.consultationUrl,
} as const;
