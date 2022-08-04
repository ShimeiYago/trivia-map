import { Props, Renderer } from './renderer';
import { useAppSelector, useAppDispatch } from 'store';
import { autoLogin, logout, toggleFormModal } from 'store/auths/actions';
import {
  selectLoggedOutSuccessfully,
  selectOpenFormModal,
  selectUser,
} from 'store/auths/selector';

export function GlobalMenu(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    topBarPosition: ownProps.topBarPosition,
    children: ownProps.children,
    permanentLeftNavi: ownProps.permanentLeftNavi,
    userInfo: useAppSelector(selectUser),
    openAuthFormModal: useAppSelector(selectOpenFormModal),
    loggedOutSuccessfully: useAppSelector(selectLoggedOutSuccessfully),

    autoLogin: () => dispatch(autoLogin()),
    toggleAuthFormModal: (open: boolean) => dispatch(toggleFormModal(open)),
    logout: () => dispatch(logout()),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  topBarPosition: 'static' | 'fixed';
  children: React.ReactNode;
  permanentLeftNavi?: boolean;
};
