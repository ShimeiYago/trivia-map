import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';

export const TermsPage = () => {
  return (
    <>
      <CommonHelmet title={PAGE_NAMES.terms} />

      <Renderer />
    </>
  );
};
