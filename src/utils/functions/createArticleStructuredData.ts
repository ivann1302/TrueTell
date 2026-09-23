import { companyInfo } from '../../config/company';

export const DEFAULT_ARTICLE_AUTHOR = companyInfo.editorial.defaultAuthor;

interface ArticleBreadcrumbItem {
  name: string;
  item: string;
}

interface ArticleFaqItem {
  question: string;
  answer: string;
}

interface ArticleStructuredDataOptions {
  title: string;
  description: string;
  articleUrl: string;
  publishedDate: string;
  modifiedDate?: string;
  publisherUrl: string;
  breadcrumbs: ArticleBreadcrumbItem[];
  faqItems?: ArticleFaqItem[];
  author?: string;
  image?: string;
  articleSection?: string;
}

export function createArticleStructuredData({
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
}: ArticleStructuredDataOptions): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BlogPosting',
      headline: title,
      description,
      url: articleUrl,
      mainEntityOfPage: articleUrl,
      datePublished: publishedDate,
      dateModified: modifiedDate,
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

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
