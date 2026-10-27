import { FAQ, FEATURES, SITE, URLS } from './site';
import snapshot from './release-snapshot.json';

export interface Breadcrumb { label: string; href: string }
export const absolute = (path: string) => new URL(path, `${SITE.url}/`).href;

export function pageSchema(path: string, title: string, description: string, breadcrumbs: Breadcrumb[], type = 'WebPage') {
  return [
    {
      '@context': 'https://schema.org', '@type': type, '@id': absolute(`${path}#page`),
      url: absolute(path), name: title, description, inLanguage: 'en',
      isPartOf: { '@id': absolute('/#website') },
      about: { '@id': absolute('/#software') },
      ...(type === 'TechArticle' ? { headline: title, mainEntityOfPage: absolute(path), author: { '@type': 'Organization', name: SITE.name, url: absolute('/about/') } } : {}),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.label, item: absolute(crumb.href) })),
    },
  ];
}

export const softwareSchema = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', '@id': absolute('/#software'),
  name: SITE.name, applicationCategory: 'DeveloperApplication', applicationSubCategory: 'Version Control',
  operatingSystem: 'Linux, macOS, Windows', softwareRequirements: 'System Git',
  url: absolute('/'), downloadUrl: absolute('/download/'), license: URLS.license,
  description: SITE.description, screenshot: absolute(URLS.socialImage),
  featureList: FEATURES.map((feature) => feature.title),
  ...(snapshot.tag ? { softwareVersion: snapshot.tag } : {}),
  author: { '@type': 'Person', name: SITE.author.name, url: SITE.author.url },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  sameAs: [URLS.repository, URLS.releases],
};

export const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
};
