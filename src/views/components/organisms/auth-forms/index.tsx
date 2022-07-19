import { AuthFormMode, Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectLogginingInState } from 'store/auths/selector';
import { authsSlice } from 'store/auths/slice';
import { User } from 'types/user';

const { loginSuccess } = authsSlice.actions;

export function AuthForms(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    logginingInState: useAppSelector(selectLogginingInState),
    initialMode: ownProps.initialMode,

    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  initialMode: AuthFormMode;
};
