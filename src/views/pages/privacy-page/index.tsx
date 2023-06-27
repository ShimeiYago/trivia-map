import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';

export const PrivacyPage = () => {
  return (
    <>
      <CommonHelmet title={PAGE_NAMES.privacy} />

      <Renderer />
    </>
  );
};
