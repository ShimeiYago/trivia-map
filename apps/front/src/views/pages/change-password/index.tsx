import { PAGE_NAMES } from 'constant/page-names';
import { CommonHelmet } from 'helper-components/common-helmet';
import { useAppDispatch, useAppSelector } from 'store';
import { updateUser } from 'store/auths/actions';
import { selectUser } from 'store/auths/selector';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer, Props } from './renderer';

export function ChangePassword() {
  const dispatch = useAppDispatch();

  const props: Props = {
    user: useAppSelector(selectUser),
    refreshUser: () => dispatch(updateUser(undefined)),
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.passwordChange)} noindex />

      <Renderer {...props} />
    </>
  );
}
