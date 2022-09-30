import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export const PrivacyPolicyPage = () => {
  usePageTracking();
  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.policy)}</title>
      </Helmet>

      <Renderer />
    </>
  );
};
