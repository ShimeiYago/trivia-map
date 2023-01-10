import { PAGE_NAMES } from 'constant/page-names';
import { CommonHelmet } from 'helper-components/common-helmet';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer } from './renderer';

export function LikedArticles() {
  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.myArticles)} noindex />

      <Renderer />
    </>
  );
}
