import { Props, Renderer } from './renderer';
import { useAppSelector, useAppDispatch } from 'store';
import { logout, toggleFormModal } from 'store/auths/actions';
import { selectLoggedOutSuccessfully, selectOpenFormModal, selectUser } from 'store/auths/selector';
import { isMobile } from 'react-device-detect';
import { useCookies } from 'react-cookie';
import { UseAutoLogin } from 'helper-components/use-auto-login';
import { useLocation } from 'react-router-dom';

export function GlobalMenu(ownProps: OwnProps) {
  const dispatch = useAppDispatch();
  const [, , removeCookie] = useCookies();
  const location = useLocation();

  UseAutoLogin();

  const props: Props = {
    topBarPosition: ownProps.topBarPosition,
    children: ownProps.children,
    permanentLeftNavi: ownProps.permanentLeftNavi,
    userInfo: useAppSelector(selectUser),
    openAuthFormModal: useAppSelector(selectOpenFormModal),
    loggedOutSuccessfully: useAppSelector(selectLoggedOutSuccessfully),
    isMobile: isMobile,
    mapPage: ownProps.mapPage,
    localBackNavi: ownProps.localBackNavi,
    pathName: location.pathname,

    toggleAuthFormModal: (open: boolean) => dispatch(toggleFormModal(open)),
    logout: () => dispatch(logout(removeCookie)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  topBarPosition: 'static' | 'fixed';
  mapPage?: boolean;
  children: React.ReactNode;
  permanentLeftNavi?: boolean;
  localBackNavi?: {
    text: string;
    link: string;
  };
};
