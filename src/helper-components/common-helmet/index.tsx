import { DOMAIN, SITE_NAME } from 'constant';
import { DEFAULT_HEAD_TAGS } from 'constant/head-tags';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function CommonHelmet(props: Props): JSX.Element {
  const title = props.title ?? DEFAULT_HEAD_TAGS.title;
  const description = props.description ?? DEFAULT_HEAD_TAGS.description;
  const ogType = props.ogType ?? DEFAULT_HEAD_TAGS.ogType;
  const imageUrl = props.imageUrl ?? DEFAULT_HEAD_TAGS.imageUrl;

  const location = useLocation();

  if (props.noindex) {
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content="トリビアマップ" />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={`${DOMAIN}${location.pathname}`} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={DEFAULT_HEAD_TAGS.ogLocale} />
      <meta name="twitter:card" content={DEFAULT_HEAD_TAGS.twitterCard} />
      <meta name="twitter:site" content={DEFAULT_HEAD_TAGS.twitterSite} />
    </Helmet>
  );
}

export type Props = {
  title?: string;
  description?: string;
  ogType?: 'website' | 'article';
  imageUrl?: string;
  noindex?: boolean;
};
