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
    "updatedAt": "2026-10-07T00:00:00+03:00"
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
    "publishedAt": "2026-09-23T00:00:00+03:00"
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
    "publishedAt": "2026-09-22T00:00:00+03:00"
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
    "updatedAt": "2026-09-22T00:00:00+03:00"
  },
  {
    "title": "BI-аналитика: что это простыми словами и зачем бизнесу",
    "description": "BI-аналитика простыми словами: как данные из CRM, продаж, склада и рекламы превращаются в понятные дашборды и помогают принимать решения.",
    "summaryDescription": "Как данные из CRM, продаж, склада и рекламы превращаются в понятные дашборды и помогают принимать решения.",
    "hrefPath": "bi-analitika-chto-eto-prostymi-slovami/",
    "type": "blog",
    "category": "BI-аналитика",
    "topic": "Аналитика продаж",
    "relatedArticles": ["kak-snyat-rezervy-moysklad/", "kak-vosstanovit-udalennye-zakazy-tovary-moysklad/"],
    "status": "published",
    "indexable": true,
    "relatedProduct": "/bi-analitika/",
    "publishedAt": "2026-09-08T00:00:00+03:00",
    "updatedAt": "2026-09-22T00:00:00+03:00"
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
