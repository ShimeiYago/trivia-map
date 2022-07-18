import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectLogginingInState } from 'store/auths/selector';
import { authsSlice } from 'store/auths/slice';
import { User } from 'types/user';

const { loginSuccess } = authsSlice.actions;

export function AuthForms() {
  const dispatch = useAppDispatch();

  const props: Props = {
    logginingInState: useAppSelector(selectLogginingInState),

    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
  };

  return <Renderer {...props} />;
}
