import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';

export const TermsPage = () => {
  usePageTracking();
  return (
    <>
      <CommonHelmet title={PAGE_NAMES.terms} />

      <Renderer />
    </>
  );
};
