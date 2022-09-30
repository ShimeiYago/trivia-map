import { PAGE_NAMES } from 'constant/page-names';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer } from './renderer';

export function ChangePassword() {
  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.passwordChange)}</title>
      </Helmet>

      <Renderer />
    </>
  );
}
