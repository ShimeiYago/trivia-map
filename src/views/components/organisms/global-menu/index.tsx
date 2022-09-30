import { Props, Renderer } from './renderer';
import { useAppSelector, useAppDispatch } from 'store';
import { autoLogin, logout, toggleFormModal } from 'store/auths/actions';
import { selectLoggedOutSuccessfully, selectOpenFormModal, selectUser } from 'store/auths/selector';
import { isMobile } from 'react-device-detect';

export function GlobalMenu(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

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

    autoLogin: () => dispatch(autoLogin()),
    toggleAuthFormModal: (open: boolean) => dispatch(toggleFormModal(open)),
    logout: () => dispatch(logout()),
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
