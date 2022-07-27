import { selectAutoLoggingInState } from './../selector/index';
import { authsSlice } from '../slice';
import { AppThunk } from 'store';
import { getUserInfo } from 'api/auths-api/get-user-info';
import { refreshToken } from 'api/auths-api/refresh-token';
import { selectUser } from '../selector';

// basic actions
export const {
  autoLoginStart,
  loginSuccess,
  autoLoginFailure,
  toggleFormModal,
} = authsSlice.actions;

// autoLogin action
export const autoLogin = (): AppThunk => async (dispatch, getState) => {
  if (
    selectUser(getState()) ||
    selectAutoLoggingInState(getState()) === 'loading'
  ) {
    return;
  }

  dispatch(autoLoginStart());

  try {
    // try with access token
    const res = await getUserInfo();
    dispatch(loginSuccess(res));
  } catch (error) {
    // try with refresh token
    dispatch(refreshTokenAndGetUserInfo());
  }
};

// refreshTokenAndGetUserInfo action
export const refreshTokenAndGetUserInfo = (): AppThunk => async (dispatch) => {
  try {
    await refreshToken();
    const res = await getUserInfo();
    dispatch(loginSuccess(res));
    return;
  } catch (error) {
    dispatch(autoLoginFailure());
  }
};
