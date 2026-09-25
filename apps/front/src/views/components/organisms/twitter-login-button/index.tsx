import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { throwError } from 'store/global-error/slice';
import { User } from 'types/user';
import { loginSuccess } from 'store/auths/actions';
import { useCookies } from 'react-cookie';
import { COOKIE_NAME } from 'constant';
import { selectUser } from 'store/auths/selector';

export function TwitterLoginButton(ownProps: OwnProps) {
  const dispatch = useAppDispatch();
  const [, setCookie] = useCookies();

  const props: Props = {
    userInfo: useAppSelector(selectUser),
    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
    setAccessTokenExpiration: (expirationDate: Date) =>
      setCookie(COOKIE_NAME.hasAccessToken, 'true', { expires: expirationDate, path: '/' }),
    setRefreshTokenExpiration: (expirationDate: Date) =>
      setCookie(COOKIE_NAME.hasRefreshToken, 'true', { expires: expirationDate, path: '/' }),
    onLoginSucceed: ownProps.onLoginSucceed,
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  onLoginSucceed?: () => void;
};
