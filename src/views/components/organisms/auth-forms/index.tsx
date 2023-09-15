import { AuthFormMode, Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectAutoLoggingInState, selectUser } from 'store/auths/selector';
import { authsSlice } from 'store/auths/slice';
import { User } from 'types/user';
import { useCookies } from 'react-cookie';
import { COOKIE_NAME } from 'constant';

const { loginSuccess } = authsSlice.actions;

export function AuthForms(ownProps: OwnProps) {
  const [, setCookie] = useCookies();
  const dispatch = useAppDispatch();

  const props: Props = {
    autoLoggingInState: useAppSelector(selectAutoLoggingInState),
    initialMode: ownProps.initialMode,
    userInfo: useAppSelector(selectUser),

    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
    setAccessTokenExpiration: (expirationDate: Date) =>
      setCookie(COOKIE_NAME.hasAccessToken, 'true', { expires: expirationDate, path: '/' }),
    setRefreshTokenExpiration: (expirationDate: Date) =>
      setCookie(COOKIE_NAME.hasRefreshToken, 'true', { expires: expirationDate, path: '/' }),
    onLoginSucceed: ownProps.onLoginSucceed,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  initialMode: AuthFormMode;
  onLoginSucceed?: () => void;
};
