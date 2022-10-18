import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { throwError } from 'store/global-error/slice';
import { CommonHelmet } from 'helper-components/common-helmet';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';
import { useCookies } from 'react-cookie';

export function DeactivateAccount() {
  const dispatch = useAppDispatch();
  const [, , removeCookie] = useCookies();

  const props: Props = {
    user: useAppSelector(selectUser),

    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
    removeCookie: (name: string) => removeCookie(name),
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.deactivateAccount)} noindex />

      <Renderer {...props} />
    </>
  );
}
