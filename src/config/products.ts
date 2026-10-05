export const cleanerProductPath = '/bitrix24-cleaner/';

export const productRatingPath = '/bitrix24-product-rating/';

export const productRating = {
  name: 'product_rating',
  heading: 'Рейтинг товаров и клиентов в Битрикс24',
  description:
    'product_rating — приложение для анализа товаров и клиентов по сделкам Битрикс24. Рейтинги, динамика продаж, ABC-анализ, детализация и Excel. Продукт готовится к запуску.',
  catalogDescription:
    'Рейтинги товаров и клиентов, динамика продаж и расшифровка до сделок. Приложение готовится к запуску.',
  connectionActionLabel: 'Обсудить подключение',
} as const;

export const moyskladOperationsProductPath = '/moysklad-mass-operations/';

export const moyskladOperationsProduct = {
  name: 'Массовые операции и удаление в МойСклад',
  description:
    'Массовое изменение товаров, цен и документов в МойСклад. Загрузка из файлов, удаление и очистка с проверкой плана и отчётом по каждому объекту.',
  catalogDescription:
    'Изменение товаров, цен и документов, загрузка из файлов и очистка данных. Проверка плана перед запуском и отчёт по результатам.',
  connectionActionLabel: 'Узнать о подключении',
} as const;

export const cleanerProduct = {
  name: 'Массовое удаление лидов и сделок в Битрикс24',
  description:
    'Удаляйте ненужные лиды и сделки в Битрикс24 по фильтрам. Проверка списка, исключения, пауза и CSV-отчёт. До 3 000 записей за операцию.',
  catalogDescription:
    'Очистка CRM в Битрикс24 по фильтрам: проверка списка, исключения и отчёт по каждому ID.',
  articleDescription:
    'Отберите ненужные лиды и сделки в Битрикс24 по фильтрам, проверьте список и исключите важные карточки. На странице приложения — возможности, порядок работы и информация о подключении.',
  articleActionLabel: 'Посмотреть приложение',
  connectionActionLabel: 'Узнать о подключении',
} as const;
