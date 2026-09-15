import { companyInfo } from '../../config/company';

export type Product = {
  id: string;
  problem: string;
  title: string;
  description: string;
  action: string;
  href: string;
};

export const products: Product[] = [
  {
    id: 'bi',
    problem: 'Понять, где бизнес теряет деньги',
    title: 'BI-аналитика для торговли',
    description: 'Продажи, остатки и маржинальность в одном управленческом контуре.',
    action: 'Посмотреть BI-решение',
    href: '/bi-analitika/',
  },
  {
    id: 'crm',
    problem: 'Связать CRM, данные и ИИ',
    title: 'Решения для CRM и бизнес-систем',
    description: 'Приложения для CRM и других рабочих систем компании.',
    action: 'Обсудить CRM-задачу',
    href: companyInfo.contacts.consultationUrl,
  },
  {
    id: 'marketplaces',
    problem: 'Убрать ручную работу с маркетплейсами',
    title: 'Интеграция МойСклад с маркетплейсами',
    description: 'Единый обмен заказами, остатками и ценами между учётной системой и каналами продаж.',
    action: 'Обсудить интеграцию',
    href: companyInfo.contacts.consultationUrl,
  },
  {
    id: 'ideas',
    problem: 'Проверить идею до вложений',
    title: 'Сервис проверки бизнес-идей',
    description: 'Структурированная проверка идеи до инвестиций в разработку и продвижение.',
    action: 'Узнать о запуске',
    href: companyInfo.contacts.consultationUrl,
  },
];
