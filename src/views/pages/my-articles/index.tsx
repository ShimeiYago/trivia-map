import { PAGE_NAMES } from 'constant/page-names';
import { CommonHelmet } from 'helper-components/common-helmet';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Props, Renderer } from './renderer';

export function MyArticles() {
  const props: Props = {
    user: useAppSelector(selectUser),
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.myArticles)} noindex />

      <Renderer {...props} />
    </>
  );
}
