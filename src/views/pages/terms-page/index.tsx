import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';
import { CommonHelmet } from 'helper-components/common-helmet';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export const TermsPage = () => {
  usePageTracking();
  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.terms)} />

      <Renderer />
    </>
  );
};
