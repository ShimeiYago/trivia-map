import { Renderer, Conditions } from './renderer';
import { useLocation } from 'react-router-dom';
import usePageTracking from 'helper-components/tracker';
import { CommonHelmet } from 'helper-components/common-helmet';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export function ArticleList() {
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  usePageTracking();

  const parkParam = query.get('park');

  const conditions: Conditions = {
    category: query.get('category') ? Number(query.get('category')) : undefined,
    park: parkParam === 'L' || parkParam === 'S' ? parkParam : undefined,
    keywords: query.get('keywords')?.split(','),
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.articles)} />

      <Renderer initialSearchConditions={conditions} />
    </>
  );
}
