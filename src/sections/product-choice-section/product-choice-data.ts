export type Product = {
  id: string;
  problem: string;
  shortName: string;
  title: string;
  description: string;
  detailLabel: string;
  details: string[];
  action: string;
  href: string;
};

export const products: Product[] = [
  {
    id: 'bi',
    problem: 'Понять, где бизнес теряет деньги',
    shortName: 'BI-аналитика',
    title: 'BI-аналитика для торговли',
    description:
      'Управленческие дашборды объединяют данные о продажах, остатках и маржинальности, чтобы решения принимались по фактам, а не на глаз.',
    detailLabel: 'Что можно контролировать',
    details: ['Продажи и маржинальность', 'Остатки и неликвид', 'Показатели по торговым точкам'],
    action: 'Посмотреть BI-решение',
    href: '/bi-analitika/',
  },
  {
    id: 'crm',
    problem: 'Связать CRM, данные и ИИ',
    shortName: 'Решения для CRM',
    title: 'Решения для CRM и бизнес-систем',
    description:
      'Разрабатываем MCP-серверы, собственные приложения и интеграции, которые расширяют возможности рабочих систем компании.',
    detailLabel: 'Платформы',
    details: [
      'Битрикс24 — в разработке',
      'МойСклад — в разработке',
      'amoCRM — следующий этап',
      'RetailCRM — следующий этап',
    ],
    action: 'Обсудить CRM-задачу',
    href: 'https://t.me/m/S5CgvcfdMjAy',
  },
  {
    id: 'marketplaces',
    problem: 'Убрать ручную работу с маркетплейсами',
    shortName: 'МойСклад + маркетплейсы',
    title: 'Интеграция МойСклад с маркетплейсами',
    description:
      'Планируем единый контур обмена данными между учётной системой и основными каналами продаж.',
    detailLabel: 'Планируемый контур',
    details: ['Wildberries', 'Ozon', 'Яндекс Маркет', 'Заказы, остатки и цены'],
    action: 'Обсудить интеграцию',
    href: 'https://t.me/m/S5CgvcfdMjAy',
  },
  {
    id: 'ideas',
    problem: 'Проверить идею до вложений',
    shortName: 'Отдельный сервис',
    title: 'Сервис проверки бизнес-идей',
    description:
      'Инструмент для структурированной первичной проверки идеи перед инвестициями в разработку и продвижение.',
    detailLabel: 'Что поможет сделать',
    details: ['Сформулировать гипотезу', 'Проверить исходные допущения', 'Определить следующий шаг'],
    action: 'Узнать о запуске',
    href: 'https://t.me/m/S5CgvcfdMjAy',
  },
];
