import { Renderer, Conditions } from './renderer';
import { useLocation } from 'react-router-dom';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS, SUB_SITE_IMAGES } from 'constant/head-tags';
import { ARTICLE_LIST_ORDERS, PARKS } from 'constant';
import { PreviewListOrder } from 'api/articles-api/get-articles-previews';
import { getDomain } from 'utils/get-domain.ts';

export function ArticleList() {
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const parkParam = query.get('park');

  const conditions: Conditions = {
    category: query.get('category') ? Number(query.get('category')) : undefined,
    park: parkParam === PARKS.land || parkParam === PARKS.sea ? parkParam : undefined,
    keywords: query.get('keywords')?.split(','),
  };

  let order: PreviewListOrder;
  switch (query.get('order')) {
    case ARTICLE_LIST_ORDERS.latest:
      order = ARTICLE_LIST_ORDERS.latest;
      break;
    case ARTICLE_LIST_ORDERS.oldest:
      order = ARTICLE_LIST_ORDERS.oldest;
      break;
    case ARTICLE_LIST_ORDERS.popular:
      order = ARTICLE_LIST_ORDERS.popular;
      break;
    default:
      order = ARTICLE_LIST_ORDERS.latest;
  }

  const domain = getDomain(window);

  return (
    <>
      <CommonHelmet
        title={PAGE_NAMES.articles}
        description={PAGE_DESCRIPTIONS.articles}
        imageUrl={`${domain}/${SUB_SITE_IMAGES.articles}`}
      />

      <Renderer initialSearchConditions={conditions} initialOrder={order} />
    </>
  );
}
