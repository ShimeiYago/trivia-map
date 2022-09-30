import { PAGE_NAMES } from 'constant/page-names';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer } from './renderer';

export function AccountSettings() {
  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.accountSettings)}</title>
      </Helmet>
      <Renderer />;
    </>
  );
}
