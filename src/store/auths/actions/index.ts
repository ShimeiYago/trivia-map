import { COOKIE_NAME } from './../../../constant/index';
import { throwError } from 'store/global-error/slice';
import { selectAutoLoggingInState } from './../selector/index';
import { authsSlice } from '../slice';
import { AppThunk } from 'store';
import { getUserInfo } from 'api/auths-api/get-user-info';
import { refreshToken } from 'api/auths-api/refresh-token';
import { logout as logoutApi } from 'api/auths-api/logout';
import { selectUser } from '../selector';
import { sleep } from 'utils/sleep';

// basic actions
export const {
  autoLoginStart,
  loginSuccess,
  autoLoginFailure,
  toggleFormModal,
  updateUser,
  logoutStart,
  logoutSuccess,
} = authsSlice.actions;

// autoLogin action
export const autoLogin =
  (cookie: Cookie, setCookie: SetCookie, removeCookie: RemoveCookie): AppThunk =>
  async (dispatch, getState) => {
    if (selectUser(getState()) || selectAutoLoggingInState(getState()) === 'loading') {
      return;
    }

    dispatch(autoLoginStart());

    // try with access token
    if (cookie[COOKIE_NAME.hasAccessToken]) {
      try {
        const res = await getUserInfo();
        dispatch(loginSuccess(res));
      } catch (error) {
        dispatch(autoLoginFailure());
        removeCookie(COOKIE_NAME.hasAccessToken);
      }
      return;
    }

    // try refresh token
    if (cookie[COOKIE_NAME.hasRefreshToken]) {
      try {
        const refreshResponse = await refreshToken();
        const userResponse = await getUserInfo();
        dispatch(loginSuccess(userResponse));
        setCookie(COOKIE_NAME.hasAccessToken, 'true', {
          expires: new Date(refreshResponse.access_token_expiration),
        });
        return;
      } catch (error) {
        dispatch(autoLoginFailure());
        removeCookie(COOKIE_NAME.hasRefreshToken);
      }
    }

    dispatch(autoLoginFailure());
  };

//logout
export const logout =
  (removeCookie: RemoveCookie): AppThunk =>
  async (dispatch) => {
    dispatch(logoutStart());
    try {
      await logoutApi();

      removeCookie(COOKIE_NAME.hasAccessToken);
      removeCookie(COOKIE_NAME.hasRefreshToken);

      dispatch(logoutSuccess());

      // In order to set loggedOutSuccessfully false
      await sleep(3000);
      dispatch(logoutStart());
    } catch (error) {
      dispatch(throwError(500));
    }
  };

type Cookie = {
  [x: string]: string;
};
type SetCookie = (name: string, value: string, options?: { path?: string; expires?: Date }) => void;
type RemoveCookie = (name: string) => void;
