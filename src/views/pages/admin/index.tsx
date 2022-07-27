import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { isMobile } from 'react-device-detect';
import { selectAutoLoggingInState, selectUser } from 'store/auths/selector';
import { autoLogin } from 'store/auths/actions';

export function Admin() {
  const dispatch = useAppDispatch();

  const props: Props = {
    user: useAppSelector(selectUser),
    autoLoggingInState: useAppSelector(selectAutoLoggingInState),
    isMobile: isMobile,

    autoLogin: () => dispatch(autoLogin()),
  };

  return <Renderer {...props} />;
}
