import { Props, Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';

export function Admin() {
  const props: Props = {
    user: useAppSelector(selectUser),
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.admin)} />
      <Renderer {...props} />
    </>
  );
}
