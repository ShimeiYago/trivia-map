import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from 'store';
import { autoLogin } from 'store/auths/actions';

export const UseAutoLogin = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(autoLogin(cookies, setCookie, removeCookie));
  }, []);
};
