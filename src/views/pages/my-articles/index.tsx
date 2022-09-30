import { PAGE_NAMES } from 'constant/page-names';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer } from './renderer';

export function MyArticles() {
  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.myArticles)}</title>
      </Helmet>

      <Renderer />
    </>
  );
}
