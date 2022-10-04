import { AuthFormMode, Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectAutoLoggingInState, selectUser } from 'store/auths/selector';
import { authsSlice } from 'store/auths/slice';
import { User } from 'types/user';

const { loginSuccess } = authsSlice.actions;

export function AuthForms(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    autoLoggingInState: useAppSelector(selectAutoLoggingInState),
    initialMode: ownProps.initialMode,
    userInfo: useAppSelector(selectUser),

    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
    onLoginSucceed: ownProps.onLoginSucceed,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  initialMode: AuthFormMode;
  onLoginSucceed?: () => void;
};
