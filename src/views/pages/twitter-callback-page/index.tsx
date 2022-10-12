import { Renderer, Props } from './renderer';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { User } from 'types/user';
import { useCookies } from 'react-cookie';
import { COOKIE_NAME } from 'constant';
import { loginSuccess } from 'store/auths/actions';

export function TwitterCallbackPage() {
  const dispatch = useAppDispatch();
  const [, setCookie] = useCookies();

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const oauthToken = query.get('oauth_token');
  const oauthVerifier = query.get('oauth_verifier');

  if (!oauthToken || !oauthVerifier) {
    dispatch(throwError(500));
    return null;
  }

  const props: Props = {
    oauthToken: oauthToken,
    oauthVerifier: oauthVerifier,
    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
    throwError: (status: number) => dispatch(throwError(status)),
    setAccessTokenExpiration: (expirationDate: Date) =>
      setCookie(COOKIE_NAME.hasAccessToken, 'true', { expires: expirationDate }),
    setRefreshTokenExpiration: (expirationDate: Date) =>
      setCookie(COOKIE_NAME.hasRefreshToken, 'true', { expires: expirationDate }),
  };

  return <Renderer {...props} />;
}
