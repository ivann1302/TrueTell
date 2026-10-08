import { companyInfo } from '../../config/company';
import { createOrganizationLogo } from './createOrganizationLogo';

export const DEFAULT_ARTICLE_AUTHOR = companyInfo.editorial.defaultAuthor;

interface ArticleBreadcrumbItem {
  name: string;
  item: string;
}

interface ArticleFaqItem {
  question: string;
  answer: string;
}

interface ArticleHowTo {
  id: string;
  name: string;
  description?: string;
  steps: { name: string; text: string; anchor: string }[];
}

interface ArticleStructuredDataOptions {
  articleType?: 'Article' | 'BlogPosting';
  title: string;
  description: string;
  articleUrl: string;
  publishedDate?: string;
  modifiedDate?: string;
  publisherUrl: string;
  breadcrumbs: ArticleBreadcrumbItem[];
  faqItems?: ArticleFaqItem[];
  author?: string;
  image?: string;
  articleSection?: string;
  howTos?: ArticleHowTo[];
}

export function createArticleStructuredData({
  articleType = 'BlogPosting',
  title,
  description,
  articleUrl,
  publishedDate,
  modifiedDate = publishedDate,
  publisherUrl,
  breadcrumbs,
  faqItems = [],
  author = DEFAULT_ARTICLE_AUTHOR,
  image,
  articleSection,
  howTos = [],
}: ArticleStructuredDataOptions): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [
    {
      '@type': articleType,
      headline: title,
      description,
      url: articleUrl,
      mainEntityOfPage: articleUrl,
      ...(publishedDate ? { datePublished: publishedDate } : {}),
      ...(modifiedDate ? { dateModified: modifiedDate } : {}),
      inLanguage: 'ru-RU',
      ...(image ? { image } : {}),
      ...(articleSection ? { articleSection } : {}),
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: companyInfo.brandName,
        url: publisherUrl,
        logo: createOrganizationLogo(publisherUrl),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        ...breadcrumb,
      })),
    },
  ];

  if (faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  for (const instruction of howTos) {
    graph.push({
      '@type': 'HowTo',
      '@id': `${articleUrl}#${instruction.id}`,
      name: instruction.name,
      ...(instruction.description ? { description: instruction.description } : {}),
      inLanguage: 'ru-RU',
      isPartOf: { '@id': articleUrl },
      step: instruction.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${articleUrl}#${step.anchor}`,
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
