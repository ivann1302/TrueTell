import { companyInfo } from '../../config/company';
import { moyskladMcpProduct, moyskladMcpProductPath } from '../../config/products';

export type Product = {
  id: string;
  problem: string;
  title: string;
  description: string;
  action: string;
  href: string;
};

export const products: Product[] = [
  ...(moyskladMcpProduct.published ? [{
    id: 'moysklad-mcp',
    problem: 'Задавать ИИ вопросы о товарах и продажах',
    title: moyskladMcpProduct.name,
    description: moyskladMcpProduct.catalogDescription,
    action: 'Посмотреть МойСклад MCP',
    href: moyskladMcpProductPath,
  }] : []),
  {
    id: 'bi',
    problem: 'Понять, где бизнес теряет деньги',
    title: 'BI-аналитика для торговли',
    description: 'Продажи, остатки и маржинальность.',
    action: 'Посмотреть BI-решение',
    href: '/bi-analitika/',
  },
  {
    id: 'crm',
    problem: 'Связать CRM, данные и ИИ',
    title: 'Решения для CRM и бизнес-систем',
    description: 'Связываем CRM с рабочими системами компании.',
    action: 'Обсудить CRM-задачу',
    href: companyInfo.contacts.consultationUrl,
  },
  {
    id: 'marketplaces',
    problem: 'Убрать ручную работу с маркетплейсами',
    title: 'Интеграция МойСклад с маркетплейсами',
    description: 'Обмен заказами, остатками и ценами.',
    action: 'Обсудить интеграцию',
    href: companyInfo.contacts.consultationUrl,
  },
];
