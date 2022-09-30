import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { updateUser } from 'store/auths/actions';
import { User } from 'types/user';
import { throwError } from 'store/global-error/slice';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export function ProfileEdit() {
  const dispatch = useAppDispatch();

  const props: Props = {
    user: useAppSelector(selectUser),

    updateUser: (user: User) => dispatch(updateUser(user)),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.profileEdit)}</title>
      </Helmet>

      <Renderer {...props} />
    </>
  );
}
