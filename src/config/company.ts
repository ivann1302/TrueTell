const phoneDigits = '79932806441';
const telegramUrl = 'https://t.me/m/S5CgvcfdMjAy';

export const companyInfo = {
  brandName: 'TrueTell',
  legal: {
    name: 'ИП Романов Р.М.',
    fullName: 'Индивидуальный предприниматель Романов Роман Михайлович',
    postalAddress: '416501, Россия, Астраханская область, Ахтубинский район, г. Ахтубинск, ул. Черно-Иванова, д. 1, кв. 3',
    inn: '300103420414',
    registrationType: 'ОГРНИП',
    registrationNumber: '318302500015221',
  },
  editorial: {
    defaultAuthor: 'Нарчук Иван Валериевич',
  },
  contacts: {
    email: 'truetell@bk.ru',
    phone: {
      display: '+7 (993) 280-64-41',
      e164: `+${phoneDigits}`,
      href: `tel:+${phoneDigits}`,
    },
    telegram: {
      url: telegramUrl,
    },
    whatsapp: {
      url: `https://api.whatsapp.com/send/?phone=${phoneDigits}&text&type=phone_number&app_absent=0`,
    },
    consultationUrl: '#contact-request',
  },
} as const;
