import { Props, Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Helmet } from 'react-helmet-async';
import { PAGE_NAMES } from 'constant/page-names';

export function Admin() {
  const props: Props = {
    user: useAppSelector(selectUser),
  };

  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.admin)}</title>
      </Helmet>
      <Renderer {...props} />
    </>
  );
}
