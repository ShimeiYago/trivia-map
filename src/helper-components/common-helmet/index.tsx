import { NO_INDEX, SITE_NAME } from 'constant';
import { DEFAULT_HEAD_TAGS } from 'constant/head-tags';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getDomain } from 'utils/get-domain.ts';

export function CommonHelmet(props: Props): JSX.Element {
  const domain = getDomain(window);
  const location = useLocation();

  const description = props.description ?? DEFAULT_HEAD_TAGS.description;
  const ogType = props.ogType ?? DEFAULT_HEAD_TAGS.ogType;
  const imageUrl = props.imageUrl ?? `${domain}/${DEFAULT_HEAD_TAGS.imageName}`;
  const currentUrl = `${domain}${location.pathname}`;
  const canonicalUrl = props.canonicalUrlPath ? `${domain}${props.canonicalUrlPath}` : currentUrl;

  if (props.noindex || NO_INDEX) {
    return (
      <Helmet>
        <title>{props.title}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{props.title}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={description} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={DEFAULT_HEAD_TAGS.ogLocale} />
      <meta name="twitter:card" content={DEFAULT_HEAD_TAGS.twitterCard} />
      <meta name="twitter:site" content={DEFAULT_HEAD_TAGS.twitterSite} />
    </Helmet>
  );
}

export type Props = {
  title: string;
  description?: string;
  ogType?: 'website' | 'article';
  imageUrl?: string;
  noindex?: boolean;
  canonicalUrlPath?: string;
};
